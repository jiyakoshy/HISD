using System.Data;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using HisdAPI.Entities;
using HisdAPI.DAL;

namespace HisdAPI.Controllers
{
    public class StaffCertificationsController : ODataController
    {
        private EDWDataModel db = new EDWDataModel();

        // GET: odata/StaffCertifications
        [EnableQuery]
        public IQueryable<StaffCertification> GetStaffCertifications()
        {
            var staffCertificationQuery = @"with data as (
                    select StaffNaturalKey, SA.AccomplishmentTypeNaturalKey, AT.AccomplishmentTypeDescription
                    ,row_number() over (partition by staffnaturalkey order by HighestLevelDegreeIndicator desc, begindate desc) as rank_highestleveldegree 
                    from EDB.EXT.StaffAccomplishments SA with (nolock)
                    inner join EDB.EXT.AccomplishmentType AT with (nolock) on AT.AccomplishmentTypeNaturalKey=SA.AccomplishmentTypeNaturalKey
                    where SA.AccomplishmentCategoryTypeNaturalKey='Certification'
                    )
                    , data2 as (
                    SELECT ST.StaffNaturalKey
                    , MAX(CASE WHEN QGA.QualificationGroupTypeNaturalKey is null THEN 'N' ELSE 'Y' END) AS CertificationStatusIndicator
                    from EXT.Staff ST with (nolock)
                    LEFT JOIN EXT.JobCode JC  with (nolock) ON ST.JobCodeNaturalKey=JC.JobCodeNaturalKey
                    LEFT JOIN EXT.JobFamily JF with (nolock) ON JC.JobFamilyNaturalKey=JF.JobFamilyNaturalKey
                    LEFT JOIN EXT.JobFunction JFC with (nolock) ON JC.JobFunctionNaturalKey = JFC.JobFunctionNaturalKey
                    LEFT JOIN EXT.EmployeeStatusType EST with (nolock) ON ST.EmployeeStatusTypeNaturalKey=EST.EmployeeStatusTypeNaturalKey
                    LEFT JOIN EXT.EmployeeHISDStatusType EHST with (nolock) ON ST.EmployeeHISDStatusTypeNaturalKey=EHST.EmployeeHISDStatusTypeNaturalKey
                    LEFT JOIN EXT.StaffQualificationAssociation SQA with (nolock) ON ST.StaffNaturalKey=SQA.StaffNaturalKey
                    LEFT JOIN EXT.QualificationType QT with (nolock) ON SQA.QualificationTypeNaturalKey=QT.QualificationTypeNaturalKey
                    LEFT JOIN EXT.QualificationGroupAssociation QGA with (nolock) ON QT.QualificationTypeNaturalKey=QGA.QualificationTypeNaturalKey AND QGA.QualificationGroupTypeNaturalKey='65000000'
                    LEFT JOIN EXT.SalaryPlanType SPT with (nolock) ON ST.SalaryPlanTypeNaturalKey = SPT.SalaryPlanTypeNaturalKey 
                    WHERE (ST.StaffActiveIndicator=1 OR EHST.EmployeeHISDStatusTypeNaturalKey='C')  --Fetches Active & Unpaid Leave Employees and Exclude prehires
                    AND (SPT.SalaryPlanTypeNaturalKey like 'RT%' OR SPT.SalaryPlanTypeNaturalKey like 'VT%' OR SPT.SalaryPlanTypeNaturalKey like 'RO%' --Filter on Salary Plan as Per The Original Specs
                    OR SPT.SalaryPlanTypeNaturalKey like 'SH%' OR SPT.SalaryPlanTypeNaturalKey like 'SE%' OR SPT.SalaryPlanTypeNaturalKey like 'SM%'  --Filter on Salary Plan as Per The Original Specs
                    OR (SPT.SalaryPlanTypeNaturalKey ='H10' AND JFC.JobFunctionCode='PRINCIPAL') --Filter on Salary Plan & Job Function as Per The Original Specs
                    OR (SPT.SalaryPlanTypeNaturalKey ='AX5' AND JFC.JobFunctionCode='PRINCIPAL') OR SPT.SalaryPlanTypeNaturalKey In('PE5','PH5','PM5','PS5','SA5') --Filter on Salary Plan & Job Function  as Per The Original Specs
                    OR JF.JobFamilyNaturalKey In('ACADEMICS','BIL','COUNSELOR','MULTGR') --Filter on Job Family  as Per The Original Specs
                    OR JFC.JobFunctionNaturalKey in('TCH','CSL','ACAD TRNG')  --Filter on Job Function  as Per The Original Specs
                    )
                    GROUP BY ST.StaffNaturalKey
                    )
                    select d2.StaffNaturalKey,d2.CertificationStatusIndicator,d.AccomplishmentTypeDescription--, S.[FirstName]
                    --,S.[LastSurname],S.[MiddleName],S.[MaidenName],S.[LoginId],S.[SexTypeNaturalKey],S.[PositionNumber],S.[PositionNaturalKey],S.[JobCodeNaturalKey]
                    --,S.[ActionDate],S.[JobFamilyNaturalKey],S.[EducationOrgNaturalKey],S.[FullTimeEquivalent],S.[SalaryPlanTypeNaturalKey],S.[EmployeeStatusTypeNaturalKey]
                    --,S.[EmployeeHISDStatusTypeNaturalKey],S.[StaffActiveIndicator],S.[JobIndicatorTypeNaturalKey],S.[JobFunctionNaturalKey],S.[TxUniqueID]
                    --,S.[StaffERPGroupTypeNaturalKey],S.[StaffContractTypeNaturalKey],S.[LatestHireDate],S.[TerminationDate]
                    from data2 d2
                    left join data d on d.StaffNaturalKey=d2.StaffNaturalKey and d.rank_highestleveldegree=1
                    --inner join EXT.staff S with (nolock) ON S.StaffNaturalKey = d2.StaffNaturalKey
                    order by d2.StaffNaturalKey";
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<StaffCertification>(staffCertificationQuery);
            //var lasync = results.ToListAsync();

            return results.AsQueryable();
        }

        // GET: odata/StaffCertification(5)
        [EnableQuery]
        public SingleResult<StaffCertification> GetStaffCertification([FromODataUri] string key)
        {
            var staffCertificationQuery = @"with data as (
                    select StaffNaturalKey, SA.AccomplishmentTypeNaturalKey, AT.AccomplishmentTypeDescription
                    ,row_number() over (partition by staffnaturalkey order by HighestLevelDegreeIndicator desc, begindate desc) as rank_highestleveldegree 
                    from EDB.EXT.StaffAccomplishments SA with (nolock)
                    inner join EDB.EXT.AccomplishmentType AT with (nolock) on AT.AccomplishmentTypeNaturalKey=SA.AccomplishmentTypeNaturalKey
                    where SA.AccomplishmentCategoryTypeNaturalKey='Certification'
                    )
                    , data2 as (
                    SELECT ST.StaffNaturalKey
                    , MAX(CASE WHEN QGA.QualificationGroupTypeNaturalKey is null THEN 'N' ELSE 'Y' END) AS CertificationStatusIndicator
                    from EXT.Staff ST with (nolock)
                    LEFT JOIN EXT.JobCode JC  with (nolock) ON ST.JobCodeNaturalKey = JC.JobCodeNaturalKey
                    LEFT JOIN EXT.JobFamily JF with (nolock) ON JC.JobFamilyNaturalKey = JF.JobFamilyNaturalKey
                    LEFT JOIN EXT.JobFunction JFC with (nolock) ON JC.JobFunctionNaturalKey = JFC.JobFunctionNaturalKey
                    LEFT JOIN EXT.EmployeeStatusType EST with (nolock) ON ST.EmployeeStatusTypeNaturalKey = EST.EmployeeStatusTypeNaturalKey
                    LEFT JOIN EXT.EmployeeHISDStatusType EHST with (nolock) ON ST.EmployeeHISDStatusTypeNaturalKey = EHST.EmployeeHISDStatusTypeNaturalKey
                    LEFT JOIN EXT.StaffQualificationAssociation SQA with (nolock) ON ST.StaffNaturalKey = SQA.StaffNaturalKey
                    LEFT JOIN EXT.QualificationType QT with (nolock) ON SQA.QualificationTypeNaturalKey = QT.QualificationTypeNaturalKey
                    LEFT JOIN EXT.QualificationGroupAssociation QGA with (nolock) ON QT.QualificationTypeNaturalKey=QGA.QualificationTypeNaturalKey AND QGA.QualificationGroupTypeNaturalKey='65000000'
                    LEFT JOIN EXT.SalaryPlanType SPT with (nolock) ON ST.SalaryPlanTypeNaturalKey = SPT.SalaryPlanTypeNaturalKey 
                    WHERE (ST.StaffActiveIndicator=1 OR EHST.EmployeeHISDStatusTypeNaturalKey ='C')  --Fetches Active & Unpaid Leave Employees and Exclude prehires
                    AND (SPT.SalaryPlanTypeNaturalKey like 'RT%' OR SPT.SalaryPlanTypeNaturalKey like 'VT%' OR SPT.SalaryPlanTypeNaturalKey like 'RO%' --Filter on Salary Plan as Per The Original Specs
                    OR SPT.SalaryPlanTypeNaturalKey like 'SH%' OR SPT.SalaryPlanTypeNaturalKey like 'SE%' OR SPT.SalaryPlanTypeNaturalKey like 'SM%'  --Filter on Salary Plan as Per The Original Specs
                    OR (SPT.SalaryPlanTypeNaturalKey ='H10' AND JFC.JobFunctionCode ='PRINCIPAL') --Filter on Salary Plan & Job Function as Per The Original Specs
                    OR (SPT.SalaryPlanTypeNaturalKey ='AX5' AND JFC.JobFunctionCode ='PRINCIPAL') OR SPT.SalaryPlanTypeNaturalKey In('PE5','PH5','PM5','PS5','SA5') --Filter on Salary Plan & Job Function  as Per The Original Specs
                    OR JF.JobFamilyNaturalKey In('ACADEMICS','BIL','COUNSELOR','MULTGR') --Filter on Job Family  as Per The Original Specs
                    OR JFC.JobFunctionNaturalKey in('TCH','CSL','ACAD TRNG')  --Filter on Job Function  as Per The Original Specs
                    )
                    GROUP BY ST.StaffNaturalKey
                    )
                    select d2.StaffNaturalKey,d2.CertificationStatusIndicator,d.AccomplishmentTypeDescription
                    from data2 d2
                    left join data d on d.StaffNaturalKey = d2.StaffNaturalKey and d.rank_highestleveldegree = 1";

            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<StaffCertification>(staffCertificationQuery);

            return SingleResult.Create(results.AsQueryable().Where(scs => scs.StaffNaturalKey == key));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StaffCerificationExists(string key)
        {
            var staffCertificationQuery = @"with data as (
                    select StaffNaturalKey, SA.AccomplishmentTypeNaturalKey, AT.AccomplishmentTypeDescription
                    ,row_number() over (partition by staffnaturalkey order by HighestLevelDegreeIndicator desc, begindate desc) as rank_highestleveldegree 
                    from EDB.EXT.StaffAccomplishments SA with (nolock)
                    inner join EDB.EXT.AccomplishmentType AT with (nolock) on AT.AccomplishmentTypeNaturalKey=SA.AccomplishmentTypeNaturalKey
                    where SA.AccomplishmentCategoryTypeNaturalKey='Certification'
                    )
                    , data2 as (
                    SELECT ST.StaffNaturalKey
                    , MAX(CASE WHEN QGA.QualificationGroupTypeNaturalKey is null THEN 'N' ELSE 'Y' END) AS CertificationStatusIndicator
                    from EXT.Staff ST with (nolock)
                    LEFT JOIN EXT.JobCode JC  with (nolock) ON ST.JobCodeNaturalKey = JC.JobCodeNaturalKey
                    LEFT JOIN EXT.JobFamily JF with (nolock) ON JC.JobFamilyNaturalKey = JF.JobFamilyNaturalKey
                    LEFT JOIN EXT.JobFunction JFC with (nolock) ON JC.JobFunctionNaturalKey = JFC.JobFunctionNaturalKey
                    LEFT JOIN EXT.EmployeeStatusType EST with (nolock) ON ST.EmployeeStatusTypeNaturalKey = EST.EmployeeStatusTypeNaturalKey
                    LEFT JOIN EXT.EmployeeHISDStatusType EHST with (nolock) ON ST.EmployeeHISDStatusTypeNaturalKey = EHST.EmployeeHISDStatusTypeNaturalKey
                    LEFT JOIN EXT.StaffQualificationAssociation SQA with (nolock) ON ST.StaffNaturalKey = SQA.StaffNaturalKey
                    LEFT JOIN EXT.QualificationType QT with (nolock) ON SQA.QualificationTypeNaturalKey = QT.QualificationTypeNaturalKey
                    LEFT JOIN EXT.QualificationGroupAssociation QGA with (nolock) ON QT.QualificationTypeNaturalKey=QGA.QualificationTypeNaturalKey AND QGA.QualificationGroupTypeNaturalKey='65000000'
                    LEFT JOIN EXT.SalaryPlanType SPT with (nolock) ON ST.SalaryPlanTypeNaturalKey = SPT.SalaryPlanTypeNaturalKey 
                    WHERE (ST.StaffActiveIndicator=1 OR EHST.EmployeeHISDStatusTypeNaturalKey ='C')  --Fetches Active & Unpaid Leave Employees and Exclude prehires
                    AND (SPT.SalaryPlanTypeNaturalKey like 'RT%' OR SPT.SalaryPlanTypeNaturalKey like 'VT%' OR SPT.SalaryPlanTypeNaturalKey like 'RO%' --Filter on Salary Plan as Per The Original Specs
                    OR SPT.SalaryPlanTypeNaturalKey like 'SH%' OR SPT.SalaryPlanTypeNaturalKey like 'SE%' OR SPT.SalaryPlanTypeNaturalKey like 'SM%'  --Filter on Salary Plan as Per The Original Specs
                    OR (SPT.SalaryPlanTypeNaturalKey ='H10' AND JFC.JobFunctionCode ='PRINCIPAL') --Filter on Salary Plan & Job Function as Per The Original Specs
                    OR (SPT.SalaryPlanTypeNaturalKey ='AX5' AND JFC.JobFunctionCode ='PRINCIPAL') OR SPT.SalaryPlanTypeNaturalKey In('PE5','PH5','PM5','PS5','SA5') --Filter on Salary Plan & Job Function  as Per The Original Specs
                    OR JF.JobFamilyNaturalKey In('ACADEMICS','BIL','COUNSELOR','MULTGR') --Filter on Job Family  as Per The Original Specs
                    OR JFC.JobFunctionNaturalKey in('TCH','CSL','ACAD TRNG')  --Filter on Job Function  as Per The Original Specs
                    )
                    GROUP BY ST.StaffNaturalKey
                    )
                    select d2.StaffNaturalKey,d2.CertificationStatusIndicator,d.AccomplishmentTypeDescription
                    from data2 d2
                    left join data d on d.StaffNaturalKey = d2.StaffNaturalKey and d.rank_highestleveldegree = 1";

            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<StaffCertification>(staffCertificationQuery);

            return (results.AsQueryable().Where(scs => scs.StaffNaturalKey == key).Count()) > 0;
        }

    }
}