using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Query;
using System.Web.OData.Routing;
using HISD.MAS.DAL.Models;
using System.Threading.Tasks;
using System.Web.ModelBinding;
using Microsoft.OData.UriParser;
using System.Reflection;
using System.Web;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;
using HISD.MAS.DAL.Models.Mapping;
using HISD.MAS.DAL.Models.EDW;
using HISD.MAS.DAL.Models.EDWMapping;
using HISD.MAS.Web.Helpers;

namespace HISD.MAS.Web.Controllers
{

    public class MenteeInfoController : ODataController
    {

        private MASContext db = new MASContext();
        private EDWMASContext edwdb = new EDWMASContext();

        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetMentees")]
        public IQueryable<MenteeInfo> GetMentees()
        {

            var allMentees =
                (from ST in edwdb.Staffs
                 join STM in edwdb.StaffElectronicEmails
                 on ST.StaffNaturalKey equals STM.StaffNaturalKey into StaffEmail
                 from se in StaffEmail.DefaultIfEmpty()
                 join ED in edwdb.EducationOrganizations
                 on ST.EducationOrgNaturalKey equals ED.EducationOrgNaturalKey into StaffOrganization
                 from e in StaffOrganization.DefaultIfEmpty()
                     //adding ACP
                 join SA in edwdb.StaffAccomplishments.Where(x => x.HighestLevelDegreeIndicator == 1)
                 on ST.StaffNaturalKey equals SA.StaffNaturalKey into StaffNAccomplishment
                 from SAH in StaffNAccomplishment.DefaultIfEmpty()
                 join SAT in edwdb.AccomplishmentTypes
                 on SAH.AccomplishmentTypeNaturalKey equals SAT.AccomplishmentTypeNaturalKey into StaffAccomplishmentDegree
                 from SAHD in StaffAccomplishmentDegree.DefaultIfEmpty()
                 join JC in edwdb.JobCodes
                 on ST.JobCodeNaturalKey equals JC.JobCodeNaturalKey into StaffJobCode
                 from m in StaffJobCode.DefaultIfEmpty()
                 join JF in edwdb.JobFamilies
                 on m.JobFamilyNaturalKey equals JF.JobFamilyNaturalKey into StaffJobFamily
                 from n in StaffJobFamily.DefaultIfEmpty()
                 join JFC in edwdb.JobFunctions
                 on m.JobFunctionNaturalKey equals JFC.JobFunctionNaturalKey into StaffJobFunction
                 from o in StaffJobFunction.DefaultIfEmpty()
                 join EST in edwdb.EmployeeStatusTypes
                 on ST.EmployeeStatusTypeNaturalKey equals EST.EmployeeStatusTypeNaturalKey into StaffEmployeeStatus
                 from p in StaffEmployeeStatus.DefaultIfEmpty()
                 join EHST in edwdb.EmployeeHISDStatusTypes
                 on ST.EmployeeHISDStatusTypeNaturalKey equals EHST.EmployeeHISDStatusTypeNaturalKey into StaffEmployeeHISDStatus
                 from r in StaffEmployeeHISDStatus.DefaultIfEmpty()
                     // Certification Related
                 join SQA in edwdb.StaffQualificationAssociations
                 on ST.StaffNaturalKey equals SQA.StaffNaturalKey into staffStaffQualificationAssociation
                 from s in staffStaffQualificationAssociation.DefaultIfEmpty()

                 join QT in edwdb.QualificationTypes
                 on s.QualificationTypeNaturalKey equals QT.QualificationTypeNaturalKey into S_StaffQualificationAssociation
                 from t in S_StaffQualificationAssociation.DefaultIfEmpty()

                 join QGA in edwdb.QualificationGroupAssociations
                 on t.QualificationTypeNaturalKey equals QGA.QualificationTypeNaturalKey into StaffQualificationGroupAssociation
                 from u in
                 (from QGA in StaffQualificationGroupAssociation
                  where QGA.QualificationGroupTypeNaturalKey == "65000000"
                  select QGA).DefaultIfEmpty()
                     // salaryPlan related
                 join SPT in edwdb.SalaryPlanTypes
                 on ST.SalaryPlanTypeNaturalKey equals SPT.SalaryPlanTypeNaturalKey into StaffSalaryPlan
                 from v in StaffSalaryPlan.DefaultIfEmpty()
                 where (
                        (ST.StaffActiveIndicator == true || r.EmployeeHISDStatusTypeNaturalKey == "C")
                        && (
                             v.SalaryPlanTypeNaturalKey.StartsWith("RT") || v.SalaryPlanTypeNaturalKey.StartsWith("VT") || v.SalaryPlanTypeNaturalKey.StartsWith("RO")
                             || v.SalaryPlanTypeNaturalKey.StartsWith("SH") || v.SalaryPlanTypeNaturalKey.StartsWith("SE") || v.SalaryPlanTypeNaturalKey.StartsWith("SM")
                             || v.SalaryPlanTypeNaturalKey.Equals("H10") && o.JobfunctionCode.Equals("PRINCIPAL")
                             || v.SalaryPlanTypeNaturalKey.Equals("AX5") && o.JobfunctionCode.Equals("PRINCIPAL")
                             || (new string[] { "PE5", "PH5", "PM5", "PS5", "SA5" }).Contains(v.SalaryPlanTypeNaturalKey)
                             || (new string[] { "ACADEMICS", "BIL", "COUNSELOR", "MULTGR" }).Contains(n.JobFamilyNaturalKey)
                             || (new string[] { "TCH", "CSL", "ACAD TRNG" }).Contains(o.JobFunctionNaturalKey)
                          )
                 )
                 select new
                 {
                     ST.StaffNaturalKey,
                     ST.FirstName,
                     ST.LastSurname,
                     ST.MiddleName,
                     ST.LoginId,
                     u.QualificationGroupTypeNaturalKey,
                     m.JobCodeDescription,
                     SAHD.AccomplishmentTypeDescription,
                     e.EducationOrgNaturalKey,
                     e.NameOfInstitution,
                     se.ElectronicMailAddress,
                     ST.LatestHireDate

                 } into g
                 select g).GroupBy(x => x.StaffNaturalKey)
                 .Select(x => new
                 {
                     StaffNaturalKey = x.Key,
                     FirstName = x.Max(z => z.FirstName),
                     LastSurname = x.Max(z => z.LastSurname),
                     MiddleName = x.Max(z => z.MiddleName),
                     LoginId = x.Max(z => z.LoginId),
                     JobCodeDescription = x.Max(z => z.JobCodeDescription),
                     MentorAccomplishmentStatus = x.Max(z => z.QualificationGroupTypeNaturalKey == null ? "N" : "Y"),
                     EducationOrgNaturalKey = x.Max(z => z.EducationOrgNaturalKey),
                     NameOfInstitution = x.Max(z => z.NameOfInstitution),
                     ElectronicMailAddress = x.Max(z => z.ElectronicMailAddress),
                     AccomplishmentTypeDescription = x.Max(z => z.AccomplishmentTypeDescription),
                     LatestHireDate = x.Max(z => z.LatestHireDate)

                 }).AsEnumerable().Select(a => new MenteeInfo
                 {

                     StaffNaturalKey = a.StaffNaturalKey,
                     FirstName = a.FirstName,
                     LastSurname = a.LastSurname,
                     MiddleName = a.MiddleName,
                     LoginId = a.LoginId,
                     JobCodeDescription = a.JobCodeDescription,
                     EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                     NameOfInstitution = a.NameOfInstitution,
                     CertificationStatus = a.MentorAccomplishmentStatus,
                     ACP = a.AccomplishmentTypeDescription,
                     ElectronicMailAddress = a.ElectronicMailAddress,
                     MenteeEndDate = default(DateTime),
                     LatestHireDate = a.LatestHireDate
                 }).AsEnumerable().ToList();

            return allMentees.AsQueryable<MenteeInfo>();
            
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetMenteesByCampusID(CampusID={campusID})")]
        public IQueryable<MenteeInfo> GetMenteesByCampusID([FromODataUri] string campusID)
        {
            var allMenteesInCampus =
               (from ST in edwdb.Staffs
                join STM in edwdb.StaffElectronicEmails
                on ST.StaffNaturalKey equals STM.StaffNaturalKey into StaffEmail
                from se in StaffEmail.DefaultIfEmpty()
                join ED in edwdb.EducationOrganizations
                on ST.EducationOrgNaturalKey equals ED.EducationOrgNaturalKey into StaffOrganization
                from e in StaffOrganization.DefaultIfEmpty()
                    //adding ACP
                 join SA in edwdb.StaffAccomplishments.Where(x => x.HighestLevelDegreeIndicator == 1)
                on ST.StaffNaturalKey equals SA.StaffNaturalKey into StaffNAccomplishment
                from SAH in StaffNAccomplishment.DefaultIfEmpty()
                join SAT in edwdb.AccomplishmentTypes
                on SAH.AccomplishmentTypeNaturalKey equals SAT.AccomplishmentTypeNaturalKey into StaffAccomplishmentDegree
                from SAHD in StaffAccomplishmentDegree.DefaultIfEmpty()
                join JC in edwdb.JobCodes
                on ST.JobCodeNaturalKey equals JC.JobCodeNaturalKey into StaffJobCode
                from m in StaffJobCode.DefaultIfEmpty()
                join JF in edwdb.JobFamilies
                on m.JobFamilyNaturalKey equals JF.JobFamilyNaturalKey into StaffJobFamily
                from n in StaffJobFamily.DefaultIfEmpty()
                join JFC in edwdb.JobFunctions
                on m.JobFunctionNaturalKey equals JFC.JobFunctionNaturalKey into StaffJobFunction
                from o in StaffJobFunction.DefaultIfEmpty()
                join EST in edwdb.EmployeeStatusTypes
                on ST.EmployeeStatusTypeNaturalKey equals EST.EmployeeStatusTypeNaturalKey into StaffEmployeeStatus
                from p in StaffEmployeeStatus.DefaultIfEmpty()
                join EHST in edwdb.EmployeeHISDStatusTypes
                on ST.EmployeeHISDStatusTypeNaturalKey equals EHST.EmployeeHISDStatusTypeNaturalKey into StaffEmployeeHISDStatus
                from r in StaffEmployeeHISDStatus.DefaultIfEmpty()
                join SQA in edwdb.StaffQualificationAssociations
                on ST.StaffNaturalKey equals SQA.StaffNaturalKey into staffStaffQualificationAssociation
                from s in staffStaffQualificationAssociation.DefaultIfEmpty()
                join QT in edwdb.QualificationTypes
                on s.QualificationTypeNaturalKey equals QT.QualificationTypeNaturalKey into S_StaffQualificationAssociation
                from t in S_StaffQualificationAssociation.DefaultIfEmpty()

                join QGA in edwdb.QualificationGroupAssociations
                on t.QualificationTypeNaturalKey equals QGA.QualificationTypeNaturalKey into StaffQualificationGroupAssociation

                from u in
                (from QGA in StaffQualificationGroupAssociation
                 where QGA.QualificationGroupTypeNaturalKey == "65000000"
                 select QGA).DefaultIfEmpty()

                join SPT in edwdb.SalaryPlanTypes
                on ST.SalaryPlanTypeNaturalKey equals SPT.SalaryPlanTypeNaturalKey into StaffSalaryPlan
                from v in StaffSalaryPlan.DefaultIfEmpty()
                where (
                    (ST.StaffActiveIndicator == true || r.EmployeeHISDStatusTypeNaturalKey == "C")
                    && (
                    v.SalaryPlanTypeNaturalKey.StartsWith("RT") || v.SalaryPlanTypeNaturalKey.StartsWith("VT") || v.SalaryPlanTypeNaturalKey.StartsWith("RO")
                    || v.SalaryPlanTypeNaturalKey.StartsWith("SH") || v.SalaryPlanTypeNaturalKey.StartsWith("SE") || v.SalaryPlanTypeNaturalKey.StartsWith("SM")
                    || v.SalaryPlanTypeNaturalKey.Equals("H10") && o.JobfunctionCode.Equals("PRINCIPAL")
                    || v.SalaryPlanTypeNaturalKey.Equals("AX5") && o.JobfunctionCode.Equals("PRINCIPAL")
                    || (new string[] { "PE5", "PH5", "PM5", "PS5", "SA5" }).Contains(v.SalaryPlanTypeNaturalKey)
                    || (new string[] { "ACADEMICS", "BIL", "COUNSELOR", "MULTGR" }).Contains(n.JobFamilyNaturalKey)
                    || (new string[] { "TCH", "CSL", "ACAD TRNG" }).Contains(o.JobFunctionNaturalKey)
                    )
                    && (e.EducationOrgNaturalKey == campusID)
                )
                select new
                {
                    ST.StaffNaturalKey,
                    ST.FirstName,
                    ST.LastSurname,
                    ST.MiddleName,
                    ST.LoginId,
                    u.QualificationGroupTypeNaturalKey,
                    m.JobCodeDescription,
                    SAHD.AccomplishmentTypeDescription,
                    e.EducationOrgNaturalKey,
                    e.NameOfInstitution,
                    se.ElectronicMailAddress,
                    ST.LatestHireDate

                } into g
                select g).OrderByDescending(x => x.LastSurname).GroupBy(x => x.StaffNaturalKey)
                 .Select(x => new
                 {
                     StaffNaturalKey = x.Key,
                     FirstName = x.Max(z => z.FirstName),
                     LastSurname = x.Max(z => z.LastSurname),
                     MiddleName = x.Max(z => z.MiddleName),
                     LoginId = x.Max(z => z.LoginId),
                     JobCodeDescription = x.Max(z => z.JobCodeDescription),
                     AccomplishmentTypeDescription = x.Max(z => z.AccomplishmentTypeDescription),
                     MentorAccomplishmentStatus = x.Max(z => z.QualificationGroupTypeNaturalKey == null ? "N" : "Y"),
                     EducationOrgNaturalKey = x.Max(z => z.EducationOrgNaturalKey),
                     NameOfInstitution = x.Max(z => z.NameOfInstitution),
                     ElectronicMailAddress = x.Max(z => z.ElectronicMailAddress),
                     LatestHireDate = x.Max(z => z.LatestHireDate)

                 }).AsEnumerable().Select(a => new MenteeInfo
                {
                    StaffNaturalKey = a.StaffNaturalKey,
                    FirstName = a.FirstName,
                    LastSurname = a.LastSurname,
                    MiddleName = a.MiddleName,
                    LoginId = a.LoginId,
                    JobCodeDescription = a.JobCodeDescription,
                    EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                    NameOfInstitution = a.NameOfInstitution,
                    CertificationStatus = a.MentorAccomplishmentStatus,
                    ACP = a.AccomplishmentTypeDescription,
                    ElectronicMailAddress = a.ElectronicMailAddress,
                    MenteeEndDate = default(DateTime),
                    LatestHireDate = a.LatestHireDate
                }).AsEnumerable();

            return allMenteesInCampus.AsQueryable<MenteeInfo>();
        }


        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetMenteeInfoByEmployeeID(EmployeeID={employeeID})")]
        public IQueryable<MenteeInfo> GetMenteeInfoByEmployeeID([FromODataUri] string employeeID)
        {
            // Get Details of this selected employee as Mentee
            var aMentee =
                 (from ST in edwdb.Staffs
                  join STM in edwdb.StaffElectronicEmails
                  on ST.StaffNaturalKey equals STM.StaffNaturalKey into StaffEmail
                  from se in StaffEmail.DefaultIfEmpty()
                  join ED in edwdb.EducationOrganizations
                  on ST.EducationOrgNaturalKey equals ED.EducationOrgNaturalKey into StaffOrganization
                  from e in StaffOrganization.DefaultIfEmpty()
                      //adding ACP
                  join SA in edwdb.StaffAccomplishments.Where(x => x.HighestLevelDegreeIndicator == 1)
                  on ST.StaffNaturalKey equals SA.StaffNaturalKey into StaffNAccomplishment
                  from SAH in StaffNAccomplishment.DefaultIfEmpty()
                  join SAT in edwdb.AccomplishmentTypes
                  on SAH.AccomplishmentTypeNaturalKey equals SAT.AccomplishmentTypeNaturalKey into StaffAccomplishmentDegree
                  from SAHD in StaffAccomplishmentDegree.DefaultIfEmpty()
                  join JC in edwdb.JobCodes
                  on ST.JobCodeNaturalKey equals JC.JobCodeNaturalKey into StaffJobCode
                 from m in StaffJobCode.DefaultIfEmpty()
                 join JF in edwdb.JobFamilies
                 on m.JobFamilyNaturalKey equals JF.JobFamilyNaturalKey into StaffJobFamily
                 from n in StaffJobFamily.DefaultIfEmpty()
                 join JFC in edwdb.JobFunctions
                 on m.JobFunctionNaturalKey equals JFC.JobFunctionNaturalKey into StaffJobFunction
                 from o in StaffJobFunction.DefaultIfEmpty()
                 join EST in edwdb.EmployeeStatusTypes
                 on ST.EmployeeStatusTypeNaturalKey equals EST.EmployeeStatusTypeNaturalKey into StaffEmployeeStatus
                 from p in StaffEmployeeStatus.DefaultIfEmpty()
                 join EHST in edwdb.EmployeeHISDStatusTypes
                 on ST.EmployeeHISDStatusTypeNaturalKey equals EHST.EmployeeHISDStatusTypeNaturalKey into StaffEmployeeHISDStatus
                 from r in StaffEmployeeHISDStatus.DefaultIfEmpty()
                 join SQA in edwdb.StaffQualificationAssociations
                 on ST.StaffNaturalKey equals SQA.StaffNaturalKey into staffStaffQualificationAssociation
                 from s in staffStaffQualificationAssociation.DefaultIfEmpty()
                 join QT in edwdb.QualificationTypes
                 on s.QualificationTypeNaturalKey equals QT.QualificationTypeNaturalKey into S_StaffQualificationAssociation
                 from t in S_StaffQualificationAssociation.DefaultIfEmpty()
                 join QGA in edwdb.QualificationGroupAssociations
                 on t.QualificationTypeNaturalKey equals QGA.QualificationTypeNaturalKey into StaffQualificationGroupAssociation
                 from u in
                 (from QGA in StaffQualificationGroupAssociation
                  where QGA.QualificationGroupTypeNaturalKey == "65000000"
                  select QGA).DefaultIfEmpty()

                 join SPT in edwdb.SalaryPlanTypes
                 on ST.SalaryPlanTypeNaturalKey equals SPT.SalaryPlanTypeNaturalKey into StaffSalaryPlan
                 from v in StaffSalaryPlan.DefaultIfEmpty()
                 where (
                        (ST.StaffActiveIndicator == true || r.EmployeeHISDStatusTypeNaturalKey == "C")
                        && (
                             v.SalaryPlanTypeNaturalKey.StartsWith("RT") || v.SalaryPlanTypeNaturalKey.StartsWith("VT") || v.SalaryPlanTypeNaturalKey.StartsWith("RO")
                             || v.SalaryPlanTypeNaturalKey.StartsWith("SH") || v.SalaryPlanTypeNaturalKey.StartsWith("SE") || v.SalaryPlanTypeNaturalKey.StartsWith("SM")
                             || v.SalaryPlanTypeNaturalKey.Equals("H10") && o.JobfunctionCode.Equals("PRINCIPAL")
                             || v.SalaryPlanTypeNaturalKey.Equals("AX5") && o.JobfunctionCode.Equals("PRINCIPAL")
                             || (new string[] { "PE5", "PH5", "PM5", "PS5", "SA5" }).Contains(v.SalaryPlanTypeNaturalKey)
                             || (new string[] { "ACADEMICS", "BIL", "COUNSELOR", "MULTGR" }).Contains(n.JobFamilyNaturalKey)
                             || (new string[] { "TCH", "CSL", "ACAD TRNG" }).Contains(o.JobFunctionNaturalKey)
                          )
                          && ST.StaffNaturalKey.Equals(employeeID)
                 )
                 select new
                 {
                     ST.StaffNaturalKey,
                     ST.FirstName,
                     ST.LastSurname,
                     ST.MiddleName,
                     ST.LoginId,
                     u.QualificationGroupTypeNaturalKey,
                     m.JobCodeDescription,
                     SAHD.AccomplishmentTypeDescription,
                     e.EducationOrgNaturalKey,
                     e.NameOfInstitution,
                     se.ElectronicMailAddress,
                     ST.LatestHireDate

                 } into g
                 select g).GroupBy(x => x.StaffNaturalKey)
                 .Select(x => new
                 {
                     StaffNaturalKey = x.Key,
                     FirstName = x.Max(z => z.FirstName),
                     LastSurname = x.Max(z => z.LastSurname),
                     MiddleName = x.Max(z => z.MiddleName),
                     LoginId = x.Max(z => z.LoginId),
                     JobCodeDescription = x.Max(z => z.JobCodeDescription),
                     AccomplishmentTypeDescription = x.Max(z => z.AccomplishmentTypeDescription),
                     MentorAccomplishmentStatus = x.Max(z => z.QualificationGroupTypeNaturalKey == null ? "N" : "Y"),
                     EducationOrgNaturalKey = x.Max(z => z.EducationOrgNaturalKey),
                     NameOfInstitution = x.Max(z => z.NameOfInstitution),
                     ElectronicMailAddress = x.Max(z => z.ElectronicMailAddress),
                     LatestHireDate = x.Max(z => z.LatestHireDate)

                 }).AsEnumerable().Select(a => new MenteeInfo
                 {

                     StaffNaturalKey = a.StaffNaturalKey,
                     FirstName = a.FirstName,
                     LastSurname = a.LastSurname,
                     MiddleName = a.MiddleName,
                     LoginId = a.LoginId,
                     JobCodeDescription = a.JobCodeDescription,
                     EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                     NameOfInstitution = a.NameOfInstitution,
                     CertificationStatus = a.MentorAccomplishmentStatus,
                     ACP = a.AccomplishmentTypeDescription,
                     ElectronicMailAddress = a.ElectronicMailAddress,
                     MenteeEndDate = default(DateTime),
                     LatestHireDate = a.LatestHireDate
                 }).AsEnumerable();
            return aMentee.AsQueryable<MenteeInfo>();
            
        }

        /* GET Mentee Relationship Profile Details by EmployeeID(MenteeEmployeeID): getMenteeRelationshipProfileByEmployeeID
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetMenteeRelationshipProfileByEmployeeID(EmployeeID={employeeID})")]
        public IQueryable<MenteeInfo> GetMenteeRelationshipProfileByEmployeeID([FromODataUri] string employeeID)
        {
            // get Relationship Details for this selected Emplyee
            var MASMentorMenteeRelationshipsInfo =
                db.MentorMenteeRelationships.Where(x => x.MentorEmployeeID == employeeID).AsEnumerable().ToList();

            // retrieve Mentor Information from Mentor-Mentee Relationship for this Mentee
            String[] MentorEmployeeIDs = MASMentorMenteeRelationshipsInfo.Select(me => me.MenteeEmployeeID).Distinct().ToArray();

            // Pull Up Menotr Name Info
            var relatedMentorInfo =
               (from ST in edwdb.Staffs
                join STM in edwdb.StaffElectronicEmails
                on ST.StaffNaturalKey equals STM.StaffNaturalKey into StaffEmail
                from se in StaffEmail.DefaultIfEmpty()
                join ED in edwdb.EducationOrganizations
                on ST.EducationOrgNaturalKey equals ED.EducationOrgNaturalKey into StaffOrganization
                from e in StaffOrganization.DefaultIfEmpty()
                join JC in edwdb.JobCodes
                on ST.JobCodeNaturalKey equals JC.JobCodeNaturalKey into StaffJobCode
                from m in StaffJobCode.DefaultIfEmpty()
                where (
                       (MentorEmployeeIDs.Contains(ST.StaffNaturalKey))
                )
                select new
                {
                    ST.StaffNaturalKey,
                    ST.FirstName,
                    ST.LastSurname,
                    ST.MiddleName,
                    ST.LoginId,
                    m.JobCodeDescription,
                    e.EducationOrgNaturalKey,
                    e.NameOfInstitution,
                    se.ElectronicMailAddress,
                    ST.LatestHireDate

                } into g
                select g).AsEnumerable().Select(a => new EmployeeInfo
                {
                    StaffNaturalKey = a.StaffNaturalKey,
                    FirstName = a.FirstName,
                    LastSurname = a.LastSurname,
                    MiddleName = a.MiddleName,
                    LoginId = a.LoginId,
                    JobCodeDescription = a.JobCodeDescription,
                    EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                    NameOfInstitution = a.NameOfInstitution,
                    ElectronicMailAddress = a.ElectronicMailAddress,
                    LatestHireDate = a.LatestHireDate
                }).AsEnumerable().ToList();

                // Comprehensive(MentorInfo + MentorAgreeMent) Info into Relationship 
                var allMASMentorMenteeRelationshipInfo = (from masAME in MASMentorMenteeRelationshipsInfo
                                                          join edwMenteeEMPLOYEES in relatedMentorInfo
                                                          on masAME.MentorEmployeeID equals edwMenteeEMPLOYEES.StaffNaturalKey into EmpMenteesinMMR
                                                          from menteeInMMR in EmpMenteesinMMR.DefaultIfEmpty()
                                                          select new MenteeInActiveRelationshipInfo
                                                          {

                                                               //MENTEE INFO
                                                               StaffNaturalKey = menteeInMMR.StaffNaturalKey,
                                                               FirstName = menteeInMMR.FirstName,
                                                               LastSurname = menteeInMMR.LastSurname,
                                                               MiddleName = menteeInMMR.MiddleName,
                                                               LoginId = menteeInMMR.LoginId,
                                                               ElectronicMailAddress = menteeInMMR.ElectronicMailAddress,
                                                               JobCodeDescription = menteeInMMR.JobCodeDescription,
                                                               LatestHireDate = menteeInMMR.LatestHireDate,
                                                               // CAMPUS INFO
                                                               EducationOrgNaturalKey = menteeInMMR.EducationOrgNaturalKey,
                                                               NameOfInstitution = menteeInMMR.NameOfInstitution,
                                                               //RELATION STATUS INFO
                                                               TimeConfigurationID = masAME.TimeConfigurationID

                                                           }).AsEnumerable();


            // Get Details of this selected employee as Mentee
            var aMentee =
                 (from ST in edwdb.Staffs
                  join STM in edwdb.StaffElectronicEmails
                  on ST.StaffNaturalKey equals STM.StaffNaturalKey into StaffEmail
                  from se in StaffEmail.DefaultIfEmpty()
                  join ED in edwdb.EducationOrganizations
                  on ST.EducationOrgNaturalKey equals ED.EducationOrgNaturalKey into StaffOrganization
                  from e in StaffOrganization.DefaultIfEmpty()
                      //adding ACP
                  join SA in edwdb.StaffAccomplishments.Where(x => x.HighestLevelDegreeIndicator == 1)
                  on ST.StaffNaturalKey equals SA.StaffNaturalKey into StaffNAccomplishment
                  from SAH in StaffNAccomplishment.DefaultIfEmpty()
                  join SAT in edwdb.AccomplishmentTypes
                  on SAH.AccomplishmentTypeNaturalKey equals SAT.AccomplishmentTypeNaturalKey into StaffAccomplishmentDegree
                  from SAHD in StaffAccomplishmentDegree.DefaultIfEmpty()
                  join JC in edwdb.JobCodes
                  on ST.JobCodeNaturalKey equals JC.JobCodeNaturalKey into StaffJobCode
                  from m in StaffJobCode.DefaultIfEmpty()
                  join JF in edwdb.JobFamilies
                  on m.JobFamilyNaturalKey equals JF.JobFamilyNaturalKey into StaffJobFamily
                  from n in StaffJobFamily.DefaultIfEmpty()
                  join JFC in edwdb.JobFunctions
                  on m.JobFunctionNaturalKey equals JFC.JobFunctionNaturalKey into StaffJobFunction
                  from o in StaffJobFunction.DefaultIfEmpty()
                  join EST in edwdb.EmployeeStatusTypes
                  on ST.EmployeeStatusTypeNaturalKey equals EST.EmployeeStatusTypeNaturalKey into StaffEmployeeStatus
                  from p in StaffEmployeeStatus.DefaultIfEmpty()
                  join EHST in edwdb.EmployeeHISDStatusTypes
                  on ST.EmployeeHISDStatusTypeNaturalKey equals EHST.EmployeeHISDStatusTypeNaturalKey into StaffEmployeeHISDStatus
                  from r in StaffEmployeeHISDStatus.DefaultIfEmpty()
                  join SQA in edwdb.StaffQualificationAssociations
                  on ST.StaffNaturalKey equals SQA.StaffNaturalKey into staffStaffQualificationAssociation
                  from s in staffStaffQualificationAssociation.DefaultIfEmpty()
                  join QT in edwdb.QualificationTypes
                  on s.QualificationTypeNaturalKey equals QT.QualificationTypeNaturalKey into S_StaffQualificationAssociation
                  from t in S_StaffQualificationAssociation.DefaultIfEmpty()
                  join QGA in edwdb.QualificationGroupAssociations
                  on t.QualificationTypeNaturalKey equals QGA.QualificationTypeNaturalKey into StaffQualificationGroupAssociation
                  from u in
                  (from QGA in StaffQualificationGroupAssociation
                   where QGA.QualificationGroupTypeNaturalKey == "65000000"
                   select QGA).DefaultIfEmpty()

                  join SPT in edwdb.SalaryPlanTypes
                  on ST.SalaryPlanTypeNaturalKey equals SPT.SalaryPlanTypeNaturalKey into StaffSalaryPlan
                  from v in StaffSalaryPlan.DefaultIfEmpty()
                  where (
                         (ST.StaffActiveIndicator == true || r.EmployeeHISDStatusTypeNaturalKey == "C")
                         && (
                              v.SalaryPlanTypeNaturalKey.StartsWith("RT") || v.SalaryPlanTypeNaturalKey.StartsWith("VT") || v.SalaryPlanTypeNaturalKey.StartsWith("RO")
                              || v.SalaryPlanTypeNaturalKey.StartsWith("SH") || v.SalaryPlanTypeNaturalKey.StartsWith("SE") || v.SalaryPlanTypeNaturalKey.StartsWith("SM")
                              || v.SalaryPlanTypeNaturalKey.Equals("H10") && o.JobfunctionCode.Equals("PRINCIPAL")
                              || v.SalaryPlanTypeNaturalKey.Equals("AX5") && o.JobfunctionCode.Equals("PRINCIPAL")
                              || (new string[] { "PE5", "PH5", "PM5", "PS5", "SA5" }).Contains(v.SalaryPlanTypeNaturalKey)
                              || (new string[] { "ACADEMICS", "BIL", "COUNSELOR", "MULTGR" }).Contains(n.JobFamilyNaturalKey)
                              || (new string[] { "TCH", "CSL", "ACAD TRNG" }).Contains(o.JobFunctionNaturalKey)
                           )
                           && ST.StaffNaturalKey.Equals(employeeID)
                  )
                  select new
                  {
                      ST.StaffNaturalKey,
                      ST.FirstName,
                      ST.LastSurname,
                      ST.MiddleName,
                      ST.LoginId,
                      u.QualificationGroupTypeNaturalKey,
                      m.JobCodeDescription,
                      SAHD.AccomplishmentTypeDescription,
                      e.EducationOrgNaturalKey,
                      e.NameOfInstitution,
                      se.ElectronicMailAddress,
                      ST.LatestHireDate

                  } into g
                  select g).GroupBy(x => x.StaffNaturalKey)
                 .Select(x => new
                 {
                     StaffNaturalKey = x.Key,
                     FirstName = x.Max(z => z.FirstName),
                     LastSurname = x.Max(z => z.LastSurname),
                     MiddleName = x.Max(z => z.MiddleName),
                     LoginId = x.Max(z => z.LoginId),
                     JobCodeDescription = x.Max(z => z.JobCodeDescription),
                     AccomplishmentTypeDescription = x.Max(z => z.AccomplishmentTypeDescription),
                     MentorAccomplishmentStatus = x.Max(z => z.QualificationGroupTypeNaturalKey == null ? "N" : "Y"),
                     EducationOrgNaturalKey = x.Max(z => z.EducationOrgNaturalKey),
                     NameOfInstitution = x.Max(z => z.NameOfInstitution),
                     ElectronicMailAddress = x.Max(z => z.ElectronicMailAddress),
                     LatestHireDate = x.Max(z => z.LatestHireDate)

                 }).AsEnumerable().Select(a => new MenteeInfo
                 {

                     StaffNaturalKey = a.StaffNaturalKey,
                     FirstName = a.FirstName,
                     LastSurname = a.LastSurname,
                     MiddleName = a.MiddleName,
                     LoginId = a.LoginId,
                     JobCodeDescription = a.JobCodeDescription,
                     EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                     NameOfInstitution = a.NameOfInstitution,
                     CertificationStatus = a.MentorAccomplishmentStatus,
                     ACP = a.AccomplishmentTypeDescription,
                     ElectronicMailAddress = a.ElectronicMailAddress,
                     MenteeEndDate = default(DateTime),
                     LatestHireDate = a.LatestHireDate
                 }).AsEnumerable();
            return aMentee.AsQueryable<MenteeInfo>();

        }*/

    }
}

