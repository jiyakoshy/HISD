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
using Medallion.Threading.Sql;

namespace HISD.MAS.Web.Controllers
{
    public class MenteeEndDatesController : ODataController
    {
        private MASContext db = new MASContext();
        private EDWMASContext edwdb = new EDWMASContext();
        private string connectionStringMAS = System.Configuration.ConfigurationManager.ConnectionStrings["MASContext"].ConnectionString;

        // GET: odata/ MenteeEndDates
        [EnableQuery]
        public IQueryable<MenteeEndDate> Get()
        {
            return db.MenteeEndDates;
        }

        // GET: odata/ MenteeEndDates(5)
        [EnableQuery]
        public SingleResult<MenteeEndDate> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.MenteeEndDates.Where(med => med.MenteeEndDateID == key));
        }
        // GET: odata/GetAllMenteeEndDates: Returns all existing Menteeswith Mentee End Dates Details
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetAllMenteeEndDates")]
        public IQueryable<MenteeEndDateInfo> GetAllMenteeEndDates()
        {
            // get all existing campus contatcs under HISD
            var allMASMenteeEndDatesInfo = 
                db.MenteeEndDates.AsEnumerable();

            String[] MenteeEmployeeIDs = allMASMenteeEndDatesInfo.Select(me => me.MenteeEmployeeID).Distinct().ToArray();

            var allEDWMenteeInfos =
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
                         && (MenteeEmployeeIDs.Contains(ST.StaffNaturalKey))
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
                    e.EducationOrgNaturalKey,
                    e.NameOfInstitution,
                    se.ElectronicMailAddress

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
                     ElectronicMailAddress = x.Max(z => z.ElectronicMailAddress)

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
                     ACP = "",
                     ElectronicMailAddress = a.ElectronicMailAddress
                 }).ToList();

            //List<MenteeEndDateInfo> 
            var combinedMenteeInfos = (from masMED in allMASMenteeEndDatesInfo
                                       join edwMentee in allEDWMenteeInfos
                                                    on masMED.MenteeEmployeeID equals edwMentee.StaffNaturalKey
                                       select new MenteeEndDateInfo
                                       {
                                           MenteeEndDateID = masMED.MenteeEndDateID,
                                           StaffNaturalKey = edwMentee.StaffNaturalKey,
                                           FirstName = edwMentee.FirstName,
                                           LastSurname = edwMentee.LastSurname,
                                           MiddleName = edwMentee.MiddleName,
                                           LoginId = edwMentee.LoginId,
                                           JobCodeDescription = edwMentee.JobCodeDescription,
                                           EducationOrgNaturalKey = edwMentee.EducationOrgNaturalKey,
                                           NameOfInstitution = edwMentee.NameOfInstitution,
                                           CertificationStatus = edwMentee.CertificationStatus,
                                           ACP = "",
                                           ElectronicMailAddress = edwMentee.ElectronicMailAddress,
                                           MenteeEndDate = masMED.MenteeEndDateTime,
                                           CreateDate = masMED.CreateDate,
                                           CreatedBy = masMED.CreatedBy,
                                           UpdateDate = masMED.UpdateDate,
                                           UpdatedBy = masMED.UpdatedBy

                                       }).AsEnumerable();

            return combinedMenteeInfos.AsQueryable<MenteeEndDateInfo>();
        }

        // GET: odata/GetAllMenteeEndDates: Returns all existing Menteeswith Mentee End Dates Details within a Campus
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetMenteeEndDatesByCampusID(CampusID={campusID})")]
        public IQueryable<MenteeEndDateInfo> GetMenteeEndDatesByCampusID([FromODataUri] string campusID)
        {
            // get all existing campus contatcs under HISD
            var allMASMenteeEndDatesInfo =
                db.MenteeEndDates.Where(med => med.CampusID == campusID).AsEnumerable();
            String[] MenteeEmployeeIDs = allMASMenteeEndDatesInfo.Select(me => me.MenteeEmployeeID).Distinct().ToArray();

            var allEDWMenteeInfos =
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
                         && (MenteeEmployeeIDs.Contains(ST.StaffNaturalKey))
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
                    e.EducationOrgNaturalKey,
                    e.NameOfInstitution,
                    se.ElectronicMailAddress

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
                     ElectronicMailAddress = x.Max(z => z.ElectronicMailAddress)

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
                     ACP = "",
                     ElectronicMailAddress = a.ElectronicMailAddress
                 }).ToList();            //List<MenteeEndDateInfo> 
            var combinedMenteeInfos = (from masMED in allMASMenteeEndDatesInfo
                                       join edwMentee in allEDWMenteeInfos
                                       on masMED.MenteeEmployeeID equals edwMentee.StaffNaturalKey
                                       select new MenteeEndDateInfo
                                       {
                                           MenteeEndDateID = masMED.MenteeEndDateID,
                                           StaffNaturalKey = edwMentee.StaffNaturalKey,
                                           FirstName = edwMentee.FirstName,
                                           LastSurname = edwMentee.LastSurname,
                                           MiddleName = edwMentee.MiddleName,
                                           LoginId = edwMentee.LoginId,
                                           JobCodeDescription = edwMentee.JobCodeDescription,
                                           EducationOrgNaturalKey = edwMentee.EducationOrgNaturalKey,
                                           NameOfInstitution = edwMentee.NameOfInstitution,
                                           CertificationStatus = edwMentee.CertificationStatus,
                                           ACP = "",
                                           ElectronicMailAddress = edwMentee.ElectronicMailAddress,
                                           MenteeEndDate = masMED.MenteeEndDateTime,
                                           CreateDate = masMED.CreateDate,
                                           CreatedBy = masMED.CreatedBy,
                                           UpdateDate = masMED.UpdateDate,
                                           UpdatedBy = masMED.UpdatedBy

                                       }).AsEnumerable();
            
            return combinedMenteeInfos.AsQueryable<MenteeEndDateInfo>();
        }

        // GET: odata/GetMenteeEndDate: Returns Info for a specific Mentee End Date 
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetMenteeEndDateByEmployeeID(EmployeeID={employeeID})")]
        public IQueryable<MenteeEndDateInfo> GetMenteeEndDateByEmployeeID([FromODataUri] string employeeID)
        {
            // get Mentee EndDate Details for this selected Emploee 
            var aMASMenteeEndDateInfo =
                db.MenteeEndDates.Where(med => med.MenteeEmployeeID == employeeID).AsEnumerable();
            
            var aEDWMenteeInfo =
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
                    e.EducationOrgNaturalKey,
                    e.NameOfInstitution,
                    se.ElectronicMailAddress

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
                     ElectronicMailAddress = x.Max(z => z.ElectronicMailAddress)

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
                     ACP = "",
                     ElectronicMailAddress = a.ElectronicMailAddress
                 }).ToList();

            //List<MenteeEndDateInfo> 
            var combinedMenteeInfos = (from masMED in aMASMenteeEndDateInfo
                                       join edwMentee in aEDWMenteeInfo
                                       on masMED.MenteeEmployeeID equals edwMentee.StaffNaturalKey
                                       select new MenteeEndDateInfo
                                       {
                                           MenteeEndDateID = masMED.MenteeEndDateID,
                                           StaffNaturalKey = edwMentee.StaffNaturalKey,
                                           FirstName = edwMentee.FirstName,
                                           LastSurname = edwMentee.LastSurname,
                                           MiddleName = edwMentee.MiddleName,
                                           LoginId = edwMentee.LoginId,
                                           JobCodeDescription = edwMentee.JobCodeDescription,
                                           EducationOrgNaturalKey = edwMentee.EducationOrgNaturalKey,
                                           NameOfInstitution = edwMentee.NameOfInstitution,
                                           CertificationStatus = edwMentee.CertificationStatus,
                                           ACP = "",
                                           ElectronicMailAddress = edwMentee.ElectronicMailAddress,
                                           MenteeEndDate = masMED.MenteeEndDateTime,
                                           CreateDate = masMED.CreateDate,
                                           CreatedBy = masMED.CreatedBy,
                                           UpdateDate = masMED.UpdateDate,
                                           UpdatedBy = masMED.UpdatedBy
                                       }).AsEnumerable();
            
            return combinedMenteeInfos.AsQueryable<MenteeEndDateInfo>();
        }


        /*------  DB Update operations ------- */

        //POST: odata/create a New  MenteeEndDate
        public IHttpActionResult Post(MenteeEndDate menteeenddate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                // checking duplicates 
                var currentMenteeEndDate = db.MenteeEndDates.FirstOrDefault(med => med.MenteeEmployeeID == menteeenddate.MenteeEmployeeID);

                if (currentMenteeEndDate != null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.Conflict));
                }

                db.MenteeEndDates.Add(menteeenddate);
                db.SaveChanges();

            }
            catch (ArgumentNullException)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            catch (Exception ex)
            {
                // CUSTOM Exception Filters to generate Http Error Response 
                //throw new HttpResponseException(HttpStatusCode.NotAcceptable);
                throw ex;
            }


            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, menteeenddate));
            //return Created(sitecontent);
        }

        // PUT: odata/Complete update a MenteeEndDate
        public IHttpActionResult Put([FromODataUri] int key, MenteeEndDate menteeenddate)
        {

            // Locking the DB transaction
            var putMenteeEndDateLock = new SqlDistributedLock("putMenteeEndDateLock", connectionStringMAS);

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentMenteeEndDate = db.MenteeEndDates.FirstOrDefault(med => med.MenteeEndDateID == key);

                if (currentMenteeEndDate == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (putMenteeEndDateLock.Acquire())
                {
                    menteeenddate.MenteeEndDateID = currentMenteeEndDate.MenteeEndDateID;
                    db.Entry(currentMenteeEndDate).CurrentValues.SetValues(menteeenddate);
                    db.SaveChanges();
                }

            }

            catch (ArgumentNullException)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            catch (Exception ex)
            {
                // CUSTOM Exception Filters to generate Http Error Response 
                //throw new HttpResponseException(HttpStatusCode.NotAcceptable);
                throw ex;
            }
            
            return StatusCode(HttpStatusCode.NoContent);
        }

        // PATCH: odata/Partial update an existing  MenteeEndDate
        public IHttpActionResult Patch([FromODataUri] int key, Delta<MenteeEndDate> patch)
        {

            // Locking the DB transaction
            var patchMenteeEndDateLock = new SqlDistributedLock("patchMenteeEndDateLock", connectionStringMAS);
            try
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentMenteeEndDate = db.MenteeEndDates.FirstOrDefault(med => med.MenteeEndDateID == key);
                if (currentMenteeEndDate == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (patchMenteeEndDateLock.Acquire())
                {
                    patch.Patch(currentMenteeEndDate);
                    db.SaveChanges();
                }
            }
            catch (ArgumentNullException)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            catch (Exception ex)
            {
                // CUSTOM Exception Filters to generate Http Error Response 
                //throw new HttpResponseException(HttpStatusCode.NotAcceptable);
                throw ex;
            }
            return StatusCode(HttpStatusCode.NoContent);
        }

        // DELETE: odata/ MenteeEndDates(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentMenteeEndDate = db.MenteeEndDates.FirstOrDefault(med => med.MenteeEndDateID == key);

            if (currentMenteeEndDate == null)
            {
                return NotFound();
            }

            db.MenteeEndDates.Remove(currentMenteeEndDate);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        private bool MenteeEndDatesExists(int key)
        {
            return db.MenteeEndDates.Count(med => med.MenteeEndDateID == key) > 0;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
