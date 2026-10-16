#!/usr/bin/env python3
"""PILOTO-QUAL-01: audited correction of official qualification. No schema changes."""
from pathlib import Path
import sys
base=Path(sys.argv[1] if len(sys.argv)>1 else '/app')
def once(relative,old,new):
 p=base/relative
 s=p.read_text(encoding='utf-8-sig')
 n=s.count(old)
 if n!=1:raise SystemExit(f'QUAL-01 patch refused: {relative}: {n} anchors')
 p.write_text(s.replace(old,new,1),encoding='utf-8',newline='\n')

once('src/credentials/credentials.dto.ts',
 "import { IsBoolean, IsDateString, IsEnum, IsIn, IsOptional, IsString, MinLength } from 'class-validator';",
 "import { IsBoolean, IsDateString, IsEnum, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';")
once('src/credentials/credentials.dto.ts',
 'export class SeasonCredentialDecisionDto {',
 """export class UpdateQualificationDto {
  @IsOptional() @IsEnum(RefereeCategory) category?: RefereeCategory;
  @IsOptional() @IsEnum(RefereeGrade) grade?: RefereeGrade;
  @IsOptional() @IsEnum(QualificationStatus) status?: QualificationStatus;
  @IsOptional() @IsDateString() validFrom?: string;
  @IsOptional() @IsDateString() validUntil?: string | null;
  @IsOptional() @IsString() @MaxLength(1500) notes?: string;
  @IsString() @MinLength(4) @MaxLength(500) reason!: string;
}
export class SeasonCredentialDecisionDto {""")
once('src/credentials/credentials.controller.ts',
 'QualificationDto, RespondSubmissionDto',
 'QualificationDto, UpdateQualificationDto, RespondSubmissionDto')
once('src/credentials/credentials.controller.ts',
 "  @Post('referees/:refereeId/seasons/:seasonId') @Roles(UserRole.ARBITRATION_ADMIN, UserRole.NATIONAL_COUNCIL)",
 """  @Patch('referees/:refereeId/qualifications/:qualificationId') @Roles(UserRole.ARBITRATION_ADMIN, UserRole.NATIONAL_COUNCIL)
  updateQualification(@AuthUser() u: any, @Param('refereeId') refereeId: string,
    @Param('qualificationId') qualificationId: string, @Body() d: UpdateQualificationDto, @Req() r: any) {
    return this.s.updateQualification(u, refereeId, qualificationId, d, requestMeta(r));
  }
  @Post('referees/:refereeId/seasons/:seasonId') @Roles(UserRole.ARBITRATION_ADMIN, UserRole.NATIONAL_COUNCIL)""")
once('src/credentials/credentials.service.ts',
 ' async decideSeason(u:any,refereeId:string,seasonId:string,d:any,m:any){',
 """ async updateQualification(u:any,refereeId:string,qualificationId:string,d:any,m:any){
   const existing=await this.p.refereeQualification.findFirst({where:{id:qualificationId,refereeId}});
   if(!existing)throw new NotFoundException('Qualificação não encontrada na ficha deste árbitro.');
   const reason=String(d.reason||'').trim();
   if(reason.length<4)throw new BadRequestException('Indique a fundamentação da correção.');
   const data:any={};
   for(const field of ['category','grade','status','notes']){
     if(d[field]!==undefined && d[field]!==existing[field])data[field]=d[field];
   }
   const from=d.validFrom?new Date(d.validFrom):existing.validFrom;
   const until=d.validUntil===null?null:d.validUntil?new Date(d.validUntil):existing.validUntil;
   if(Number.isNaN(from.getTime())||(until&&Number.isNaN(until.getTime()))||(until&&until<from))
     throw new BadRequestException('As datas de validade da qualificação são incoerentes.');
   if(d.validFrom!==undefined&&from.getTime()!==existing.validFrom.getTime())data.validFrom=from;
   if(d.validUntil!==undefined&&((until?.getTime()??null)!==(existing.validUntil?.getTime()??null)))data.validUntil=until;
   if(!Object.keys(data).length)throw new BadRequestException('Não existem alterações à qualificação.');
   const after=await this.p.refereeQualification.update({where:{id:qualificationId},data:{...data,validatedByUserId:u.id,validatedAt:new Date()}});
   await this.p.referee.update({where:{id:refereeId},data:{officialValidatedAt:new Date(),officialValidatedBy:u.email}});
   await this.a.log({actorUserId:u.id,actorRole:u.role,action:AuditAction.UPDATE,
     entityType:'RefereeQualification',entityId:qualificationId,previousValue:existing,newValue:after,
     reason:'Correção de qualificação oficial: '+reason,...m});
   return after;
 }
 async decideSeason(u:any,refereeId:string,seasonId:string,d:any,m:any){""")
print('QUAL-01 audited qualification correction route applied')
