#!/usr/bin/env python3
"""PILOTO-REG-04: correct an unactivated referee's email and safely reissue invitation.
No data is changed during Docker build; only backend code is patched.
"""
from pathlib import Path
import sys

root = Path(sys.argv[1] if len(sys.argv)>1 else "/app")

def replace_once(relative, old, new):
    path = root / relative
    text = path.read_text(encoding="utf-8-sig")
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"REG-04 unexpected source in {relative}: {count} occurrences; stop build.")
    path.write_text(text.replace(old, new, 1), encoding="utf-8", newline="\n")

replace_once("src/users/users.dto.ts",
    "import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';",
    "import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';")
replace_once("src/users/users.dto.ts",
    "export class UserStatusReasonDto {",
    """export class CorrectRefereeRegistrationEmailDto {
  @IsEmail() @MaxLength(254) newEmail!: string;
}

export class UserStatusReasonDto {""")
replace_once("src/users/users.controller.ts",
    "import { ChangeUserRoleDto, InviteUserDto, UserStatusReasonDto } from './users.dto';",
    "import { ChangeUserRoleDto, CorrectRefereeRegistrationEmailDto, InviteUserDto, UserStatusReasonDto } from './users.dto';")
replace_once("src/users/users.controller.ts",
    "  @Post(':id/invite/resend')",
    """  @Patch('referees/:refereeId/correct-invite-email')
  @Roles(UserRole.ARBITRATION_ADMIN, UserRole.NATIONAL_COUNCIL, UserRole.FPV_ADMIN, UserRole.ADMIN)
  correctRefereeInviteEmail(@AuthUser() u: any, @Param('refereeId') refereeId: string,
    @Body() d: CorrectRefereeRegistrationEmailDto, @Req() r: any) {
    return this.s.correctRefereeInviteEmail(u, refereeId, d.newEmail, requestMeta(r));
  }

  @Post(':id/invite/resend')""")
replace_once("src/users/users.service.ts",
    "import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';",
    "import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';")
replace_once("src/users/users.service.ts",
    "  async resendInvite(actor: any, id: string, meta: any) {",
    """  /**
   * Correct only an initial, not-yet-activated referee invitation.
   * Keep both official referee and linked user emails consistent.
   * An old invitation URL is invalidated BEFORE a replacement is sent.
   */
  async correctRefereeInviteEmail(actor: any, refereeId: string, rawEmail: string, meta: any) {
    if (![UserRole.ARBITRATION_ADMIN, UserRole.NATIONAL_COUNCIL, UserRole.FPV_ADMIN, UserRole.ADMIN].includes(actor.role))
      throw new ForbiddenException('Apenas a Administração FPV pode corrigir e-mails de convites iniciais.');
    const email = String(rawEmail || '').trim().toLowerCase();
    if (!email || email.length > 254) throw new BadRequestException('Indique um e-mail válido.');

    const referee = await this.p.referee.findUnique({
      where: { id: refereeId },
      include: { user: { select: { id: true, email: true, role: true, status: true,
        passwordChangedAt: true, lastLoginAt: true } } },
    });
    if (!referee) throw new NotFoundException('Árbitro não encontrado.');
    if (referee.email.toLowerCase().trim() === email)
      throw new BadRequestException('O novo e-mail é igual ao que está registado.');

    const linked = referee.user;
    if (linked) {
      if (linked.role !== UserRole.REFEREE)
        throw new BadRequestException('A conta associada não é de árbitro; correção manual necessária.');
      const pending = linked.status === UserStatus.INVITED;
      const canceledBeforeActivation =
        linked.status === UserStatus.DISABLED &&
        !linked.passwordChangedAt && !linked.lastLoginAt &&
        (await this.p.userToken.count({ where: { userId: linked.id, type: UserTokenType.INVITE } })) > 0;
      if (!pending && !canceledBeforeActivation)
        throw new BadRequestException('A conta já foi ativada ou não tem um convite inicial elegível. Não é possível alterar o email desta forma.');
      if (linked.email.toLowerCase().trim() !== referee.email.toLowerCase().trim())
        throw new ConflictException('Os e-mails da ficha e da conta não coincidem. É necessária revisão administrativa.');
    }

    const [duplicateReferee, duplicateUser] = await Promise.all([
      this.p.referee.findUnique({ where: { email }, select: { id: true } }),
      this.p.user.findUnique({ where: { email }, select: { id: true } }),
    ]);
    if (duplicateReferee || duplicateUser)
      throw new ConflictException('O novo e-mail já está associado a outro árbitro ou utilizador.');

    await this.p.$transaction(async tx => {
      const current = await tx.referee.findUnique({
        where: { id: refereeId },
        include: { user: { select: { id: true, email: true, role: true, status: true,
          passwordChangedAt: true, lastLoginAt: true } } },
      });
      if (!current || current.email !== referee.email || current.user?.id !== linked?.id ||
          (linked && (current.user?.status !== linked.status || current.user?.email !== linked.email)))
        throw new ConflictException('A ficha ou o convite mudaram durante a operação. Atualize e volte a tentar.');
      await tx.referee.update({ where: { id: refereeId }, data: { email } });
      if (linked) {
        await tx.userToken.updateMany({
          where: { userId: linked.id, type: UserTokenType.INVITE, usedAt: null },
          data: { usedAt: new Date() },
        });
        await tx.user.update({ where: { id: linked.id }, data: { email, status: UserStatus.INVITED } });
      }
    });

    let emailSent: boolean | null = null;
    if (linked) {
      const invite = await this.sendInvite({ id: linked.id, email });
      emailSent = invite.emailSent;
    }
    await this.audit.log({
      actorUserId: actor.id, actorRole: actor.role, action: AuditAction.SECURITY,
      entityType: 'Referee', entityId: refereeId,
      previousValue: { email: referee.email, linkedUserEmail: linked?.email || null },
      newValue: { email, linkedUserEmail: linked ? email : null, emailSent },
      reason: 'Correção de e-mail antes da ativação; convites anteriores invalidados',
      ...meta,
    });
    return { id: refereeId, email, inviteCreated: Boolean(linked), emailSent };
  }

  async resendInvite(actor: any, id: string, meta: any) {""")
print("REG-04 applied: email correction, token revocation and re-invite for unactivated accounts")
