#!/usr/bin/env python3
"""PILOTO-REG-02 — configurar primeira região real, sem executar seeds ou modificar dados existentes."""
from pathlib import Path
import sys

root = Path(sys.argv[1] if len(sys.argv)>1 else "/app")

def once(rel,needle,replacement):
    path=root/rel
    content=path.read_text(encoding="utf-8-sig")
    if content.count(needle)!=1:
        raise SystemExit(f"REG-02: unexpected {rel}; refusing build")
    path.write_text(content.replace(needle,replacement,1),encoding="utf-8",newline="\n")

once("src/referees/referees.dto.ts",
     "export class CreateRefereeDto {",
     """export class CreateInitialRegionDto {
  @IsString() @MinLength(3) @MaxLength(120) name!: string;
  @IsString() @Matches(/^[A-Za-z0-9_-]{2,24}$/, { message: 'O código deve conter 2 a 24 letras, números, hífenes ou underscores.' })
  code!: string;
}

export class CreateRefereeDto {""")

once("src/referees/referees.controller.ts",
     "CreateRefereeCaRecordDto, CreateRefereeDto, UpdateMeDto",
     "CreateRefereeCaRecordDto, CreateRefereeDto, CreateInitialRegionDto, UpdateMeDto")
once("src/referees/referees.controller.ts",
     "  registrationOptions() { return this.service.registrationOptions(); }",
     """  registrationOptions() { return this.service.registrationOptions(); }
  @Post('registration-region') @Roles(UserRole.FPV_ADMIN, UserRole.ADMIN)
  registerInitialRegion(@AuthUser() u: any, @Body() d: CreateInitialRegionDto, @Req() r: any) {
    return this.service.registerInitialRegion(u, d, requestMeta(r));
  }""")
once("src/referees/referees.service.ts",
     "  async create(actor: any, dto: any, meta: any) {",
     """  /** One-time setup, only with FPV-confirmed region data; never creates fictitious regions. */
  async registerInitialRegion(actor: any, dto: any, meta: any) {
    const activeCount = await this.prisma.region.count({ where: { active: true } });
    if (activeCount > 0) throw new ConflictException('Já existem regiões ativas. Atualize a página.');
    const code = String(dto.code || '').trim().toUpperCase();
    const name = String(dto.name || '').trim();
    if (!/^[A-Z0-9_-]{2,24}$/.test(code) || name.length < 3 || name.length > 120)
      throw new BadRequestException('Indique uma região oficial com nome e código válidos.');
    const existing = await this.prisma.region.findUnique({ where: { code }, select: { id: true } });
    if (existing) throw new ConflictException('Já existe uma região com este código. Contacte a Administração FPV.');
    const region = await this.prisma.region.create({ data: { code, name, active: true } });
    await this.audit.log({
      actorUserId: actor.id, actorRole: actor.role, action: AuditAction.CREATE,
      entityType: 'Region', entityId: region.id,
      newValue: { code: region.code, name: region.name, active: region.active },
      reason: 'Configuração administrativa da primeira região para o piloto', ...meta,
    });
    return { id: region.id, code: region.code, name: region.name };
  }

  async create(actor: any, dto: any, meta: any) {""")
print("REG-02 first-region setup patch applied; no database seed or migration")
