#!/usr/bin/env python3
"""PILOTO-CRED-01 — audited CA correction of an existing official qualification.
No schema changes, resets, seeds or data mutations occur at build time.
"""
from pathlib import Path
import sys
root=Path(sys.argv[1] if len(sys.argv)>1 else "/app")
def once(relative,old,new):
    p=root/relative
    s=p.read_text(encoding="utf-8-sig")
    count=s.count(old)
    if count!=1: raise SystemExit(f"CRED-01 source mismatch in {relative}: {count} occurrences; stop build")
    p.write_text(s.replace(old,new,1),encoding="utf-8",newline="\n")

once("src/credentials/credentials.dto.ts",
    "export class SeasonCredentialDecisionDto {",
    """// Editing is distinct from adding. Require an explicit reason for audit.
export class UpdateQualificationDto {
  @IsEnum(RefereeCategory) category: RefereeCategory;
  @IsEnum(RefereeGrade) grade: RefereeGrade;
  @IsEnum(QualificationStatus) status: QualificationStatus;
  @IsDateString() validFrom: string;
  @IsOptional() @IsDateString() validUntil?: string | null;
  @IsOptional() @IsString() notes?: string;
  @IsString() @MinLength(5) reason: string;
}
export class SeasonCredentialDecisionDto {""")
once("src/credentials/credentials.controller.ts",
    "ReviewSubmissionDto, SeasonCredentialDecisionDto,",
    "ReviewSubmissionDto, SeasonCredentialDecisionDto, UpdateQualificationDto,")
once("src/credentials/credentials.controller.ts",
    "  @Post('referees/:refereeId/seasons/:seasonId')",
    """  @Patch('referees/:refereeId/qualifications/:qualificationId')
  @Roles(UserRole.ARBITRATION_ADMIN, UserRole.NATIONAL_COUNCIL)
  editQualification(@AuthUser() u: any, @Param('refereeId') refereeId: string,
    @Param('qualificationId') qualificationId: string,
    @Body() d: UpdateQualificationDto, @Req() r: any) {
    return this.s.editQualification(u, refereeId, qualificationId, d, requestMeta(r));
  }
  @Post('referees/:refereeId/seasons/:seasonId')""")
once("src/credentials/credentials.service.ts",
    " async decideSeason(u:any,refereeId:string,seasonId:string,d:any,m:any){",
    """ async editQualification(u:any,refereeId:string,qualificationId:string,d:any,m:any){
   const previous=await this.p.refereeQualification.findFirst({
     where:{id:qualificationId,refereeId}
   });
   if(!previous)throw new NotFoundException('Qualificação não encontrada para este árbitro.');
   const reason=String(d.reason||'').trim();
   if(reason.length<5)throw new BadRequestException('Indique o motivo da correção (mínimo 5 caracteres).');
   const validFrom=new Date(d.validFrom);
   const validUntil=d.validUntil?new Date(d.validUntil):null;
   if(!Number.isFinite(validFrom.getTime())||(validUntil&&!Number.isFinite(validUntil.getTime())))
     throw new BadRequestException('Datas de validade inválidas.');
   if(validUntil&&validUntil<validFrom)
     throw new BadRequestException('A validade final não pode ser anterior à data inicial.');
   const updateData={
     category:d.category,grade:d.grade,status:d.status,
     validFrom,validUntil,notes:d.notes===undefined?previous.notes:(String(d.notes).trim()||null),
     validatedByUserId:u.id,validatedAt:new Date()
   };
   // Preserve the qualification identity and related credit history.
   const updated=await this.p.refereeQualification.update({
     where:{id:qualificationId},data:updateData
   });
   await this.a.log({actorUserId:u.id,actorRole:u.role,action:AuditAction.UPDATE,
     entityType:'RefereeQualification',entityId:qualificationId,
     previousValue:previous,newValue:updated,
     reason:'Correção de qualificação oficial: '+reason,...m});
   return updated;
 }
 async decideSeason(u:any,refereeId:string,seasonId:string,d:any,m:any){""")
print("PILOTO-CRED-01: audited qualification correction route installed")
