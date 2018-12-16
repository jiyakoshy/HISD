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
using HISD.MAS.DAL.Models.EDW;
using System.Threading.Tasks;
using System.Web.ModelBinding;
using Medallion.Threading.Sql;


namespace HISD.MAS.Web.Controllers
{
    public class MentorMenteeRelationshipsController : ODataController
    {
        private MASContext db = new MASContext();
        private EDWMASContext edwdb = new EDWMASContext();
        private string connectionStringMAS = System.Configuration.ConfigurationManager.ConnectionStrings["MASContext"].ConnectionString;

        public Nullable<System.DateTime> DateTimeNull { get; set; }
        // GET: odata/ MentorMenteeRelationships
        [EnableQuery]
        public IQueryable<MentorMenteeRelationship> Get()
        {

            return db.MentorMenteeRelationships;
        }
        //Get Schools Status for Current School Year.........
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetMentorMenteeRelationshipsMentees")]
        public IQueryable<MentorMenteeRelationship> GetMentorMenteeRelationshipsMentees()
        {
            return db.MentorMenteeRelationships
                 .GroupBy(test => test.MenteeEmployeeID).Select(g => g.FirstOrDefault())
                  .ToList()
                 .Select(w => new MentorMenteeRelationship
                 {
                     MentorMenteeRelationshipID = w.MentorMenteeRelationshipID,
                     MentorEmployeeID = w.MentorEmployeeID,
                     MenteeEmployeeID = w.MenteeEmployeeID,
                     RelationshipStatus = w.RelationshipStatus,
                     PrincipalApproval = w.PrincipalApproval,
                     MentorAgreement = w.MentorAgreement,
                     ApprovalDate = w.ApprovalDate,
                     CampusID = w.CampusID,
                     TimeConfigurationID = w.TimeConfigurationID,
                     CreateDate = w.CreateDate,
                     CreatedBy = w.CreatedBy,
                     UpdateDate = w.UpdateDate,
                     UpdatedBy = w.UpdatedBy,
                     RelationshipStartDate = w.RelationshipStartDate,
                     RelationshipEndDate = w.RelationshipEndDate
                     //SchoolWaiverID = w.SchoolWaiverID,
                     //CampusNumber = (Convert.ToDecimal(w.CampusNumber).ToString("000")),
                     //WaiverStatusID = w.WaiverStatusID,
                     //SchoolStartYear = w.SchoolStartYear,
                     //SchoolEndYear = w.SchoolEndYear
                 })
                 .AsQueryable();
        }

        // GET: odata/ MentorMenteeRelationships(5)
        [EnableQuery]
        public SingleResult<MentorMenteeRelationship> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.MentorMenteeRelationships.Where(mmr => mmr.MentorMenteeRelationshipID == key));
        }

        // GET: odata/GetAllMenteeEndDates: Returns all existing MentorMenteeRelationships Details
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetAllMentorMenteeRelationships")]
        public IQueryable<MentorMenteeRelationshipInfo> GetAllMentorMenteeRelationships()
        {
            // get all existing Mentor Mentee Relationships under HISD
            var allMASMentorMenteeRelationshipsInfo = db.MentorMenteeRelationships.Where(x=>x.TimeConfigurationID==1 ).AsEnumerable().ToList();

            // retrieve the CIC/Principal as stored CreatedBy in Relationship table 
            string[] CICorPrincipalLoginIDs = allMASMentorMenteeRelationshipsInfo.Select(cp => cp.CreatedBy).Distinct().ToArray();
            
            String[] MentorEmployeeIDs =  allMASMentorMenteeRelationshipsInfo.Select(me => me.MentorEmployeeID).Distinct().ToArray();
            String[] MenteeEmployeeIDs = allMASMentorMenteeRelationshipsInfo.Select(me => me.MenteeEmployeeID).Distinct().ToArray();
            //String[] EmployeeIDs = CICorPrincipalEmployeeIDs.Concat(MentorEmployeeIDs.Concat(MenteeEmployeeIDs)).ToArray();
            //String[] EmployeeIDs = MentorEmployeeIDs.Concat(MenteeEmployeeIDs).ToArray();

            var EDWMentorNCICEmployeesInfo =
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
                    // Job Code
                join JC in edwdb.JobCodes
                on ST.JobCodeNaturalKey equals JC.JobCodeNaturalKey into StaffJobCode
                from m in StaffJobCode.DefaultIfEmpty()
                where (
                       (MentorEmployeeIDs.Contains(ST.StaffNaturalKey)) || (CICorPrincipalLoginIDs.Contains(ST.LoginId))
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
                    e.LocalOrganizationCode,
                    se.ElectronicMailAddress,
                    ST.LatestHireDate,
                    SAHD.AccomplishmentTypeDescription

                } into g
                select g).AsEnumerable().Select(a => new MenteeInfo // Mentee is considered as the superset of all employees affiliated here
                {
                    StaffNaturalKey = a.StaffNaturalKey,
                    FirstName = a.FirstName,
                    LastSurname = a.LastSurname,
                    MiddleName = a.MiddleName,
                    LoginId = a.LoginId,
                    JobCodeDescription = a.JobCodeDescription,
                    EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                    NameOfInstitution = a.NameOfInstitution,
                    LocalOrganizationCode = a.LocalOrganizationCode,
                    ElectronicMailAddress = a.ElectronicMailAddress,
                    LatestHireDate = a.LatestHireDate,
                    ACP = a.AccomplishmentTypeDescription

                }).AsEnumerable().ToList();

            var EDWMenteeEmployeesInfo =
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
                        //(
                        //    (ST.StaffActiveIndicator == true || r.EmployeeHISDStatusTypeNaturalKey == "C")
                        //    && (
                        //         v.SalaryPlanTypeNaturalKey.StartsWith("RT") || v.SalaryPlanTypeNaturalKey.StartsWith("VT") || v.SalaryPlanTypeNaturalKey.StartsWith("RO")
                        //         || v.SalaryPlanTypeNaturalKey.StartsWith("SH") || v.SalaryPlanTypeNaturalKey.StartsWith("SE") || v.SalaryPlanTypeNaturalKey.StartsWith("SM")
                        //         || v.SalaryPlanTypeNaturalKey.Equals("H10") && o.JobfunctionCode.Equals("PRINCIPAL")
                        //         || v.SalaryPlanTypeNaturalKey.Equals("AX5") && o.JobfunctionCode.Equals("PRINCIPAL")
                        //         || (new string[] { "PE5", "PH5", "PM5", "PS5", "SA5" }).Contains(v.SalaryPlanTypeNaturalKey)
                        //         || (new string[] { "ACADEMICS", "BIL", "COUNSELOR", "MULTGR" }).Contains(n.JobFamilyNaturalKey)
                        //         || (new string[] { "TCH", "CSL", "ACAD TRNG" }).Contains(o.JobFunctionNaturalKey)
                        //      )
                        //)
                      //  // filter the listed Mentees
                       // &&
                        (MenteeEmployeeIDs.Contains(ST.StaffNaturalKey)) //(ST.StaffNaturalKey.Equals("110563"))
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
            
            // Get Mentee End Dates from MAS application configuration 
            var allMASMenteeEndDatesInfo = db.MenteeEndDates.AsEnumerable().ToList();
            
            // combile all information together 
            var combinedMentorMenteeRelationshipInfos = (from masMMR in allMASMentorMenteeRelationshipsInfo
                                                      join edwMentorEMPLOYEES in EDWMentorNCICEmployeesInfo
                                                      on masMMR.MentorEmployeeID equals edwMentorEMPLOYEES.StaffNaturalKey into EmpMentorsinMMR
                                                      from mentorInMMR in EmpMentorsinMMR.DefaultIfEmpty(new MenteeInfo
                                                      {
                                                          FirstName = "Not Available",
                                                          LastSurname = "Not Available",
                                                          MiddleName = "Not Available"

                                                      })
                                                      join edwMenteeEMPLOYEES in EDWMenteeEmployeesInfo
                                                      on masMMR.MenteeEmployeeID equals edwMenteeEMPLOYEES.StaffNaturalKey into EmpMenteesinMMR
                                                      from menteeInMMR in EmpMenteesinMMR.DefaultIfEmpty(new MenteeInfo
                                                      {
                                                          FirstName = "Not Available",
                                                          LastSurname = "Not Available",
                                                          MiddleName = "Not Available"

                                                      })
                                                      // adding MenteeEndDate field 
                                                      join menteeEndDates in allMASMenteeEndDatesInfo
                                                      on masMMR.MenteeEmployeeID equals menteeEndDates.MenteeEmployeeID into MenteeEndDateinMMR
                                                      from menteeEDInMMR in MenteeEndDateinMMR.DefaultIfEmpty()
                                                      //cicORprincipal
                                                      join edwCICorPrincipalEMPLOYEES in EDWMentorNCICEmployeesInfo
                                                      on masMMR.CreatedBy equals edwCICorPrincipalEMPLOYEES.LoginId into EmpCICorPrincipalinMMR
                                                      from cicORprincipalinMMR in EmpCICorPrincipalinMMR.DefaultIfEmpty(new MenteeInfo
                                                      {
                                                          FirstName = "Not Available",
                                                          LastSurname = "Not Available",
                                                          MiddleName = "Not Available"

                                                      })
                                                      select new MentorMenteeRelationshipInfo
                                                      {
                                                          MentorMenteeRelationshipID = masMMR.MentorMenteeRelationshipID,

                                                          //MENTOR INFO
                                                          MentorEmployeeID = masMMR.MentorEmployeeID,
                                                          MentorFirstName = mentorInMMR.FirstName,
                                                          MentorLastSurname = mentorInMMR.LastSurname,
                                                          MentorMiddleName = mentorInMMR.MiddleName,
                                                          MentorElectronicMailAddress = mentorInMMR.ElectronicMailAddress,
                                                          MentorJobCodeDescription = mentorInMMR.JobCodeDescription,
                                                          MentorLatestHireDate = mentorInMMR.LatestHireDate,

                                                          //MENTEE INFO
                                                          MenteeEmployeeID = masMMR.MenteeEmployeeID,
                                                          MenteeFirstName = menteeInMMR.FirstName,
                                                          MenteeLastSurname = menteeInMMR.LastSurname,
                                                          MenteeMiddleName = menteeInMMR.MiddleName,
                                                          MenteeElectronicMailAddress = menteeInMMR.ElectronicMailAddress,
                                                          MenteeJobCodeDescription = menteeInMMR.JobCodeDescription,
                                                          MenteeLatestHireDate = menteeInMMR.LatestHireDate,
                                                          MenteeACP = menteeInMMR.ACP,
                                                          MenteeCertificationStatus = menteeInMMR.CertificationStatus,
                                                          //MenteeEndDateInRelationship = menteeEDInMMR.MenteeEndDateTime,
                                                          MenteeEndDateInRelationship = menteeEDInMMR == null ? default(DateTime) : menteeEDInMMR.MenteeEndDateTime,
                                                          // CAMPUS INFO
                                                          EducationOrgNaturalKey = menteeInMMR.EducationOrgNaturalKey,
                                                          NameOfInstitution = menteeInMMR.NameOfInstitution,
                                                          LocalOrganizationCode = mentorInMMR.LocalOrganizationCode,

                                                          //RELATION STATUS INFO
                                                          RelationshipStatus = masMMR.RelationshipStatus,
                                                          PrincipalApproval = masMMR.PrincipalApproval,
                                                          MentorAgreement = masMMR.MentorAgreement,
                                                          ApprovalDate = masMMR.ApprovalDate,
                                                          TimeConfigurationID = masMMR.TimeConfigurationID,
                                                          CreateDate = masMMR.CreateDate,
                                                          UpdateDate = masMMR.UpdateDate,
                                                          UpdatedBy = masMMR.UpdatedBy,

                                                          // CIC/Principal
                                                          CreatedBy = masMMR.CreatedBy,
                                                          CreatedByEmployeeID = masMMR.CreatedBy,
                                                          CreatedByFirstName = cicORprincipalinMMR.FirstName,
                                                          CreatedByMiddleName = cicORprincipalinMMR.MiddleName,
                                                          CreatedByLastSurName = cicORprincipalinMMR.LastSurname,
                                                          CreatedByElectronicMailAddress = cicORprincipalinMMR.ElectronicMailAddress,
                                                          // Relationship
                                                          RelationshipStartDate = masMMR.RelationshipStartDate,
                                                          RelationshipEndDate = masMMR.RelationshipEndDate

                                                         }).AsEnumerable().ToList();
            return combinedMentorMenteeRelationshipInfos.AsQueryable<MentorMenteeRelationshipInfo>();
        }
        //odata/GetRalationshipCountsByStatus(TimeConfigurationID=1,CampusID='104')
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetRalationshipCountsByStatus(TimeConfigurationID={timeconfigID},CampusID={campus})")]
        public IQueryable<NumberofRelationShipsByStatus> GetRalationshipCountsByStatus([FromODataUri] int timeconfigID, [FromODataUri]string campus)
        {
            if (campus == "All")
            {
                var activeRelatioships = db.MentorMenteeRelationships.Where(x => x.RelationshipStatus == "Active" && x.TimeConfigurationID == timeconfigID).Count();
                var inactiveRelatioships = db.MentorMenteeRelationships.Where(x => x.RelationshipStatus == "Inactive" && x.TimeConfigurationID == timeconfigID).Count();
                var pendingRelatioships = db.MentorMenteeRelationships.Where(x => x.RelationshipStatus == "Pending" && x.TimeConfigurationID == timeconfigID).Count();
                var numberOfRelationships = (from x in db.MentorMenteeRelationships.ToList().GroupBy(x => x.TimeConfigurationID).Select(x => x.FirstOrDefault())
                                             select new NumberofRelationShipsByStatus
                                             {
                                                 Campus = "All Campuses",
                                                 ActiveRelationships = activeRelatioships,
                                                 InactivRelationships = inactiveRelatioships,
                                                 PendingRelationships = pendingRelatioships,
                                                 TotalRelationshipsCount = activeRelatioships + inactiveRelatioships + pendingRelatioships
                                             }).AsEnumerable().ToList();

                return numberOfRelationships.AsQueryable<NumberofRelationShipsByStatus>();
            }
            else
            {
                var activeRelatioships = db.MentorMenteeRelationships.Where(x => x.RelationshipStatus == "Active" && x.TimeConfigurationID == timeconfigID && x.CampusID == campus).Count();
                var inactiveRelatioships = db.MentorMenteeRelationships.Where(x => x.RelationshipStatus == "Inactive" && x.TimeConfigurationID == timeconfigID && x.CampusID == campus).Count();
                var pendingRelatioships = db.MentorMenteeRelationships.Where(x => x.RelationshipStatus == "Pending" && x.TimeConfigurationID == timeconfigID && x.CampusID == campus).Count();
                var numberOfRelationships = (from x in db.MentorMenteeRelationships.ToList().GroupBy(x => x.TimeConfigurationID).Select(x => x.FirstOrDefault())
                                             select new NumberofRelationShipsByStatus
                                             {
                                                 Campus = campus,
                                                 ActiveRelationships = activeRelatioships,
                                                 InactivRelationships = inactiveRelatioships,
                                                 PendingRelationships = pendingRelatioships,
                                                 TotalRelationshipsCount = activeRelatioships + inactiveRelatioships + pendingRelatioships
                                             }).AsEnumerable().ToList();

                return numberOfRelationships.AsQueryable<NumberofRelationShipsByStatus>();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetTopCampusesOnRelationShipFromTimeConfiguration(TimeConfigurationID={timeconfigID})")]
        public IQueryable<TopCampusesOnRelationShip> GetTopCampusesOnRelationShipFromTimeConfiguration([FromODataUri] int timeconfigID)
        {
            
                var activeRelatioships = (db.MentorMenteeRelationships.
                                Where(x => (x.RelationshipStatus == "Active" || x.RelationshipStatus == "Pending")
                                    && x.TimeConfigurationID == timeconfigID)
                                    .GroupBy(y => y.CampusID)
                                   .Select(g => new TopCampusesOnRelationShip { Campus= g.Key,RelationShipCount = g.Count() })
                                   .AsEnumerable().ToList()).OrderByDescending(z => z.RelationShipCount)
                                    .Take(3); 

            return activeRelatioships.AsQueryable<TopCampusesOnRelationShip>();
            
            
        }
        //odata/GetMentorsCountWithoutAgreementAccepted(TimeConfigurationID=1)
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetMentorsCountWithoutAgreementAccepted(TimeConfigurationID ={timeconfigID})")]
        public IQueryable<MentorsCountWithoutAgreementsCount> GetMentorsCountWithoutAgreementAccepted([FromODataUri] int timeconfigID)
        {
            var mentorsCountPending = db.MentorMenteeRelationships
                .Where(x => x.TimeConfigurationID == timeconfigID && x.MentorAgreement == "Pending")
                .GroupBy(x => x.MentorEmployeeID).Count();
            var mentorsCountAccepted = db.MentorMenteeRelationships
                .Where(x => x.TimeConfigurationID == timeconfigID && x.MentorAgreement == "Accepted")
                .GroupBy(x => x.MentorEmployeeID).Count();
            var mentorsCount = (db.MentorMenteeRelationships.GroupBy(x => x.TimeConfigurationID)
                .Select(x => new MentorsCountWithoutAgreementsCount
                {
                    MentorsAgreementAcceptedCount = mentorsCountAccepted,
                    MentorsAgreementPendingCount = mentorsCountPending
                })).AsEnumerable().ToList();
            return mentorsCount.AsQueryable<MentorsCountWithoutAgreementsCount>();
        }







        /*------  DB Update operations ------- */
        //POST: odata/create a New  MentorMenteeRelationship
        public IHttpActionResult Post(MentorMenteeRelationship mentormenteerelationship)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            // set the createdate as current system time
            mentormenteerelationship.CreateDate = System.DateTime.Now;
            mentormenteerelationship.RelationshipStartDate = System.DateTime.Now;
            mentormenteerelationship.CreatedBy = mentormenteerelationship.CreatedBy.ToUpper();



            db.MentorMenteeRelationships.Add(mentormenteerelationship);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, mentormenteerelationship));
            //return Created(mentormenteerelationship);
        }

        // PUT: odata/Complete update a MentorMenteeRelationships
        public IHttpActionResult Put([FromODataUri] int key, MentorMenteeRelationship mentormenteerelationship)
        {
            // Locking the DB transaction
            var putMentorMenteeRelationshipLock = new SqlDistributedLock("putMentorMenteeRelationshipLock", connectionStringMAS);
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentMentorMenteeRelationship = db.MentorMenteeRelationships.FirstOrDefault(mmr => mmr.MentorMenteeRelationshipID == key);

                if (currentMentorMenteeRelationship == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (putMentorMenteeRelationshipLock.Acquire())
                {
                    mentormenteerelationship.MentorMenteeRelationshipID = currentMentorMenteeRelationship.MentorMenteeRelationshipID;
                    mentormenteerelationship.UpdateDate = System.DateTime.Now;
                    db.Entry(currentMentorMenteeRelationship).CurrentValues.SetValues(mentormenteerelationship);
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

        // PATCH: odata/Partial update an existing MentorMenteeRelationships
        public IHttpActionResult Patch([FromODataUri] int key, Delta<MentorMenteeRelationship> patch)
        {
            // Locking the DB transaction
            var patchMentorMenteeRelationshipLock = new SqlDistributedLock("patchMentorMenteeRelationshipLock", connectionStringMAS);
            try
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentMentorMenteeRelationship = db.MentorMenteeRelationships.FirstOrDefault(mmr => mmr.MentorMenteeRelationshipID == key);
                if (currentMentorMenteeRelationship == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (patchMentorMenteeRelationshipLock.Acquire())
                {
                    patch.Patch(currentMentorMenteeRelationship);
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

        // DELETE: odata/ HomeMessages(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentMentorMenteeRelationship = db.MentorMenteeRelationships.FirstOrDefault(mmr => mmr.MentorMenteeRelationshipID == key);

            if (currentMentorMenteeRelationship == null)
            {
                return NotFound();
            }

            db.MentorMenteeRelationships.Remove(currentMentorMenteeRelationship);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        private bool MentorMenteeRelationshipsExists(int key)
        {
            return db.MentorMenteeRelationships.Count(mmr => mmr.MentorMenteeRelationshipID == key) > 0;
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
