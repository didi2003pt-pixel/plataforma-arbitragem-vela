#!/usr/bin/env python3
"""Apply FPV PILOTO-REG-01 to the fetched RC1 backend during Docker build.
Fail closed on unknown source layout; never touch a database.
"""
from pathlib import Path
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else "/app")

def replace(rel, old, new):
    path = root / rel
    text = path.read_text(encoding="utf-8-sig")
    old = old.replace("\\`", "`").replace("\\${", "${")
    new = new.replace("\\`", "`").replace("\\${", "${")
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"REG-01: expected one matching section in {rel}; found {n}. Stop build.")
    path.write_text(text.replace(old, new, 1), encoding="utf-8", newline="\n")

controller = "src/referees/referees.controller.ts"
dto = "src/referees/referees.dto.ts"
service = "src/referees/referees.service.ts"
users = "src/users/users.service.ts"

replace(controller,
    "import { CreateRefereeCaRecordDto, UpdateMeDto, UpdateRefereeDto } from './referees.dto';",
    "import { CreateRefereeCaRecordDto, CreateRefereeDto, UpdateMeDto, UpdateRefereeDto } from './referees.dto';")
replace(controller,
    "  list(@AuthUser() u: any, @Query() q: any) { return this.service.list(u, q); }",
    """  list(@AuthUser() u: any, @Query() q: any) { return this.service.list(u, q); }
  @Get('registration-options') @Roles(UserRole.ARBITRATION_ADMIN, UserRole.NATIONAL_COUNCIL, UserRole.FPV_ADMIN, UserRole.ADMIN)
  registrationOptions() { return this.service.registrationOptions(); }
  @Post() @Roles(UserRole.ARBITRATION_ADMIN, UserRole.NATIONAL_COUNCIL, UserRole.FPV_ADMIN, UserRole.ADMIN)
  create(@AuthUser() u: any, @Body() d: CreateRefereeDto, @Req() r: any) { return this.service.create(u, d, requestMeta(r)); }""")
replace(dto,
    "export class UpdateRefereeDto {",
    """/** Registo administrativo inicial: não valida licença nem graduação. */
export class CreateRefereeDto {
  @IsString() @MinLength(3) @MaxLength(160) name!: string;
  @IsEmail() @MaxLength(254) email!: string;
  @IsUUID() regionId!: string;
  @IsOptional() @IsString() @MaxLength(50) phone?: string;
  @IsOptional() @IsString() @MaxLength(60) licenseNumber?: string;
}

export class UpdateRefereeDto {""")
replace(service,
    "import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';",
    "import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';")
replace(service,
    "import { AuditService } from '../audit/audit.service';",
    "import { AuditService } from '../audit/audit.service';\nimport { randomUUID } from 'crypto';")
replace(service,
    "  constructor(private prisma: PrismaService, private audit: AuditService) {}",
    """  constructor(private prisma: PrismaService, private audit: AuditService) {}

  registrationOptions() {
    return this.prisma.region.findMany({
      where: { active: true }, select: { id: true, code: true, name: true }, orderBy: { name: 'asc' },
    });
  }

  async create(actor: any, dto: any, meta: any) {
    const name = String(dto.name || '').trim();
    const email = String(dto.email || '').trim().toLowerCase();
    const phone = String(dto.phone || '').trim() || null;
    const licenseNumber = String(dto.licenseNumber || '').trim() || null;
    if (name.length < 3) throw new BadRequestException('Indique o nome completo do árbitro.');

    const region = await this.prisma.region.findFirst({ where: { id: dto.regionId, active: true }, select: { id: true } });
    if (!region) throw new BadRequestException('Selecione uma região existente e ativa.');

    const [duplicateReferee, duplicateAccount, duplicateLicense] = await Promise.all([
      this.prisma.referee.findUnique({ where: { email }, select: { id: true } }),
      this.prisma.user.findUnique({ where: { email }, select: { id: true } }),
      licenseNumber ? this.prisma.referee.findFirst({ where: { licenseNumber }, select: { id: true } }) : Promise.resolve(null),
    ]);
    if (duplicateReferee) throw new ConflictException('Já existe um árbitro com este e-mail. Procure-o na lista e utilize Convidar árbitro.');
    if (duplicateAccount) throw new ConflictException('Já existe uma conta de utilizador associada a este e-mail. Confirme os dados antes de registar o árbitro.');
    if (duplicateLicense) throw new ConflictException('O número de licença desportiva já está associado a outro árbitro.');

    const code = 'ARB-' + randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase();
    const created = await this.prisma.referee.create({ data: {
      code, name, email, regionId: region.id, phone, licenseNumber,
      licenseStatus: LicenseStatus.PENDING,
      operationalStatus: OperationalStatus.CONDITIONED,
    } });
    await this.audit.log({
      actorUserId: actor.id, actorRole: actor.role, action: AuditAction.CREATE,
      entityType: 'Referee', entityId: created.id,
      newValue: { code: created.code, name: created.name, email: created.email, regionId: created.regionId,
        licenseStatus: created.licenseStatus, operationalStatus: created.operationalStatus },
      reason: 'Registo administrativo inicial de árbitro; sem validação de licença ou qualificação', ...meta,
    });
    return this.one(actor, created.id);
  }""")
replace(users,
    """    await this.mail.send(user.email, 'Convite — FPV Arbitragem', \`Foi criada uma conta na FPV Arbitragem. Ative-a através deste endereço: \${link}\`);
    return raw;""",
    """    const emailSent = await this.mail.send(user.email, 'Convite — FPV Arbitragem', \`Foi criada uma conta na FPV Arbitragem. Ative-a através deste endereço: \${link}\`);
    return { raw, emailSent };""")
replace(users,
    "    const raw = await this.sendInvite(user);",
    "    const { raw, emailSent } = await this.sendInvite(user);")
replace(users,
    "newValue: { email: user.email, role: user.role, status: user.status }, reason: 'Convite de utilizador'",
    "newValue: { email: user.email, role: user.role, status: user.status, emailSent }, reason: 'Convite de utilizador'")
replace(users,
    "    return { id: user.id, email: user.email, role: user.role, status: user.status, ...(process.env.NODE_ENV !== 'production' ? { activationToken: raw } : {}) };",
    "    return { id: user.id, email: user.email, role: user.role, status: user.status, emailSent, ...(process.env.NODE_ENV !== 'production' ? { activationToken: raw } : {}) };")
replace(users,
    "    const raw = await this.sendInvite(target);",
    "    const { raw, emailSent } = await this.sendInvite(target);")
replace(users,
    "    return { ok: true, ...(process.env.NODE_ENV !== 'production' ? { activationToken: raw } : {}) };",
    "    return { ok: true, emailSent, ...(process.env.NODE_ENV !== 'production' ? { activationToken: raw } : {}) };")
print("REG-01 backend patch applied (no DB migration)")
