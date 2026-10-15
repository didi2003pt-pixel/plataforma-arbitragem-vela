#!/usr/bin/env python3
"""PILOTO-REG-03 — permitir registo de árbitro sem região.
Modificação controlada: coluna Referee.regionId passa a aceitar NULL.
Não executar seeds nem modificar árbitros existentes.
"""
from pathlib import Path
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else "/app")

def replace_once(relative, before, after):
    path = root / relative
    value = path.read_text(encoding="utf-8-sig")
    matches = value.count(before)
    if matches != 1:
        raise SystemExit(f"REG-03: expected exactly one anchor in {relative}; got {matches}. Build halted.")
    path.write_text(value.replace(before, after, 1), encoding="utf-8", newline="\n")

schema_path = root / "prisma/schema.prisma"
schema = schema_path.read_text(encoding="utf-8-sig")
header = "model Referee {\n"
if schema.count(header) != 1:
    raise SystemExit("REG-03: Referee model missing or duplicated")
head, rest = schema.split(header, 1)
if "\n}\n" not in rest:
    raise SystemExit("REG-03: could not locate end of Referee model")
model, tail = rest.split("\n}\n", 1)
fields = (
    ("  regionId          String\n", "  regionId          String?\n"),
    ("  region            Region            @relation(fields: [regionId], references: [id])\n",
     "  region            Region?           @relation(fields: [regionId], references: [id])\n"),
)
model += "\n"
for before, after in fields:
    if model.count(before) != 1:
        raise SystemExit("REG-03: Prisma schema does not match expected RC1 Referee model")
    model = model.replace(before, after, 1)
model = model[:-1]
schema_path.write_text(head + header + model + "\n}\n" + tail, encoding="utf-8", newline="\n")

replace_once(
    "src/referees/referees.dto.ts",
    "  @IsUUID() regionId!: string;",
    "  @IsOptional() @IsUUID() regionId?: string;",
)

replace_once(
    "src/referees/referees.service.ts",
    """    const region = await this.prisma.region.findFirst({ where: { id: dto.regionId, active: true }, select: { id: true } });
    if (!region) throw new BadRequestException('Selecione uma região existente e ativa.');""",
    """    // Região é facultativa no registo inicial. Se fornecida, tem de ser válida.
    const region = dto.regionId
      ? await this.prisma.region.findFirst({ where: { id: dto.regionId, active: true }, select: { id: true } })
      : null;
    if (dto.regionId && !region) throw new BadRequestException('A região indicada não existe ou está inativa.');""",
)
replace_once(
    "src/referees/referees.service.ts",
    "      code, name, email, regionId: region.id, phone, licenseNumber,",
    "      code, name, email, regionId: region?.id ?? null, phone, licenseNumber,",
)
replace_once(
    "src/events/events.service.ts",
    "      if (q?.grade === RefereeGrade.NATIONAL && a.referee.region.creditBonusForNationals) credits += a.referee.region.creditBonusForNationals;",
    "      if (q?.grade === RefereeGrade.NATIONAL) credits += a.referee.region?.creditBonusForNationals || 0;",
)

print("REG-03 applied: region optional in schema and initial referee registration")
