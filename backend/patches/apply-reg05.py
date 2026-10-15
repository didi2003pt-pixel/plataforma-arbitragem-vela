#!/usr/bin/env python3
"""PILOTO-REG-05 — admin corrections to referee name/contact; not an official credential decision."""
from pathlib import Path
import sys
root=Path(sys.argv[1] if len(sys.argv)>1 else "/app")
def once(relative,old,new):
    path=root/relative
    text=path.read_text(encoding="utf-8-sig")
    found=text.count(old)
    if found!=1: raise SystemExit(f"REG-05: expected one anchor in {relative}; found {found}. Stop build.")
    path.write_text(text.replace(old,new,1),encoding="utf-8",newline="\n")

once("src/referees/referees.dto.ts",
    "export class UpdateRefereeDto {",
    """export class CorrectRefereeIdentityDto {
  @IsOptional() @IsString() @MinLength(3) @MaxLength(160) name?: string;
  @IsOptional() @IsString() @MaxLength(50) phone?: string;
}

export class UpdateRefereeDto {""")
once("src/referees/referees.controller.ts",
    "CreateInitialRegionDto, UpdateMeDto",
    "CreateInitialRegionDto, CorrectRefereeIdentityDto, UpdateMeDto")
once("src/referees/referees.controller.ts",
    "  @Patch(':id') @Roles(UserRole.ARBITRATION_ADMIN, UserRole.NATIONAL_COUNCIL, UserRole.REGIONAL_COUNCIL)",
    """  @Patch(':id/identity') @Roles(UserRole.ARBITRATION_ADMIN, UserRole.NATIONAL_COUNCIL, UserRole.FPV_ADMIN, UserRole.ADMIN)
  correctIdentity(@AuthUser() u: any, @Param('id') id: string, @Body() d: CorrectRefereeIdentityDto, @Req() r: any) {
    return this.service.correctIdentity(u, id, d, requestMeta(r));
  }
  @Patch(':id') @Roles(UserRole.ARBITRATION_ADMIN, UserRole.NATIONAL_COUNCIL, UserRole.REGIONAL_COUNCIL)""")
once("src/referees/referees.service.ts",
    "  async update(user: any, id: string, dto: any, meta: any) {",
    """  /** Correct an identity typo without changing licences, qualifications, or official-validation dates. */
  async correctIdentity(user: any, id: string, dto: any, meta: any) {
    await this.one(user, id);
    const before = await this.prisma.referee.findUniqueOrThrow({ where: { id } });
    const changes: { name?: string; phone?: string | null } = {};
    if (dto.name !== undefined) {
      const name = String(dto.name).trim();
      if (name.length < 3 || name.length > 160)
        throw new BadRequestException('O nome deve ter entre 3 e 160 caracteres.');
      if (name !== before.name) changes.name = name;
    }
    if (dto.phone !== undefined) {
      const phone = String(dto.phone).trim() || null;
      if (phone !== before.phone) changes.phone = phone;
    }
    if (!Object.keys(changes).length)
      throw new BadRequestException('Não existem alterações a guardar.');

    const updated = await this.prisma.referee.update({ where: { id }, data: changes });
    await this.audit.log({
      actorUserId: user.id, actorRole: user.role, action: AuditAction.UPDATE,
      entityType: 'Referee', entityId: id,
      previousValue: { name: before.name, phone: before.phone },
      newValue: { name: updated.name, phone: updated.phone },
      reason: 'Correção administrativa de identificação/contacto sem alterar credenciação',
      ...meta,
    });
    return this.one(user, id);
  }

  async update(user: any, id: string, dto: any, meta: any) {""")
print("REG-05: minimal audited identity correction route ready")
