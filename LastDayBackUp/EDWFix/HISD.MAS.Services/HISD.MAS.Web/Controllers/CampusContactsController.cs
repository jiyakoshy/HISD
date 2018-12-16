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
    public class CampusContactsController : ODataController
    {
        private MASContext db = new MASContext();
        private EDWMASContext edwdb = new EDWMASContext();
        private string connectionStringMAS = System.Configuration.ConfigurationManager.ConnectionStrings["MASContext"].ConnectionString;

        // GET: odata/CampusContacts
        [EnableQuery]
        public IQueryable<CampusContact> Get()
        {
            return db.CampusContacts;
        }

        // GET: odata/CampusContacts(5)
        [EnableQuery]
        public SingleResult<CampusContact> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CampusContacts.Where(cc => cc.CampusContactID == key));
        }
        //Old Menthod was removed by MPR.
        //MPR New Service without EDW Call.
        // Collection of all existing CAMPUS CONTATCS INFO: for Admin Role 
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetAllCampusContacts(TimeConfigurationID={timeConfigID})")]
        public IQueryable<CampusContact> GetAllCampusContacts([FromODataUri] int timeConfigID)
        {
            return db.CampusContacts.Where(x => x.TimeConfigurationID == timeConfigID).AsQueryable();
        }

        //Old Menthod was removed by MPR.
        //MPR New Service without EDW Call.
        // Collection of CAMPUS CONTATCS INFO UNDER A CAMPUS 
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetCampusContactsByCampusID(TimeConfigurationID={timeConfigID},CampusID={campusID})")]
        public IQueryable<CampusContact> GetCampusContactsByCampusID([FromODataUri] int timeConfigID, [FromODataUri] string campusID)
        {
            return db.CampusContacts
                 .Where(a => a.TimeConfigurationID == timeConfigID && a.CampusID == campusID)
                 .GroupBy(pr => pr.CICEmployeeID).Select(g => g.FirstOrDefault()).ToList()
                 .Select(x => new CampusContact
                 {
                     CampusContactID = x.CampusContactID,
                     CICEmployeeID = x.CICEmployeeID,
                     TimeConfigurationID = x.TimeConfigurationID,
                     CampusID = x.CampusID,
                     CreatedBy = x.CreatedBy,
                     CreateDate = x.CreateDate,
                     UpdatedBy = x.UpdatedBy,
                     UpdateDate = x.UpdateDate,
                  }).AsQueryable();
        }

        //This method is not using please ignore......
        // Collection of properties for a selected CAMPUS CONTACT EMPLOYEE 
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetCampusContactByEmployeeID(EmployeeID={employeeID})")]
        public IQueryable<CampusContactInfo> GetCampusContactsByEmployeeID([FromODataUri] string employeeID)
        {
            // get MAS entity details for the selected CIC Employee
            var aMASCICInfo =
                db.CampusContacts.Where(cc => cc.CICEmployeeID == employeeID).AsEnumerable();
            
            var aEDWCICInfo =
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
                where ( ST.StaffNaturalKey.Equals(employeeID) )
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
                    se.ElectronicMailAddress

                } into g
                select g).AsEnumerable().Select(a => new CampusContactInfo
                {
                    StaffNaturalKey = a.StaffNaturalKey,
                    FirstName = a.FirstName,
                    LastSurname = a.LastSurname,
                    MiddleName = a.MiddleName,
                    LoginId = a.LoginId,
                    JobCodeDescription = a.JobCodeDescription,
                    EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                    NameOfInstitution = a.NameOfInstitution,
                    ElectronicMailAddress = a.ElectronicMailAddress
                }).AsEnumerable();
            var combinedCampusContactInfos = (from masCC in aMASCICInfo
                                                                 join edwCC in aEDWCICInfo
                                                                 on masCC.CICEmployeeID equals edwCC.StaffNaturalKey
                                                                 select new CampusContactInfo
                                                                 {
                                                                      CampusContactID = masCC.CampusContactID,
                                                                      StaffNaturalKey = edwCC.StaffNaturalKey,
                                                                      FirstName = edwCC.FirstName,
                                                                      LastSurname = edwCC.LastSurname,
                                                                      MiddleName = edwCC.MiddleName,
                                                                      LoginId = edwCC.LoginId,
                                                                      JobCodeDescription = edwCC.JobCodeDescription,
                                                                      EducationOrgNaturalKey = edwCC.EducationOrgNaturalKey,
                                                                      NameOfInstitution = edwCC.NameOfInstitution,
                                                                      ElectronicMailAddress = edwCC.ElectronicMailAddress,
                                                                      TimeConfigurationID = masCC.TimeConfigurationID,
                                                                      CreateDate = masCC.CreateDate,
                                                                      CreatedBy = masCC.CreatedBy,
                                                                      UpdateDate = masCC.UpdateDate,
                                                                      UpdatedBy = masCC.UpdatedBy
                                                                  }).AsEnumerable();

            return combinedCampusContactInfos.AsQueryable<CampusContactInfo>();
        }
        /*------  DB Update operations ------- */

        //POST: odata/create a New CampusContacts
        public IHttpActionResult Post(CampusContact campuscontact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.CampusContacts.Add(campuscontact);
            db.SaveChanges();
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, campuscontact));
            //return Created(campuscontact);
        }

        // PUT: odata/Complete update an existing CampusContacts 
        public IHttpActionResult Put([FromODataUri] int key, CampusContact campuscontact)
        {
            // Locking the DB transaction
            var putCampusContactLock = new SqlDistributedLock("putCampusContactLock", connectionStringMAS);

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentCamupsContact = db.CampusContacts.FirstOrDefault(cc => cc.CampusContactID == key);

                if (currentCamupsContact == null)
                {
                    return NotFound();
                }
                // this block of code is protected by the lock!
                using (putCampusContactLock.Acquire())
                {
                    campuscontact.CampusContactID = currentCamupsContact.CampusContactID;
                    db.Entry(currentCamupsContact).CurrentValues.SetValues(campuscontact);
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

        // PATCH: odata/Partial update an existing CampusContacts
        public IHttpActionResult Patch([FromODataUri] int key, Delta<CampusContact> patch)
        {
            // Locking the DB transaction
            var patchCampusContactLock = new SqlDistributedLock("patchCampusContactLock", connectionStringMAS);

            try
            {

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentCamupsContact = db.CampusContacts.FirstOrDefault(cc => cc.CampusContactID == key);
                if (currentCamupsContact == null)
                {
                    return NotFound();
                }

                // this block of code is protected by the lock!
                using (patchCampusContactLock.Acquire())
                {
                    patch.Patch(currentCamupsContact);
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

        // DELETE: odata/CampusContacts(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentCamupsContact = db.CampusContacts.FirstOrDefault(cc => cc.CampusContactID == key);

            if (currentCamupsContact == null)
            {
                return NotFound();
            }

            db.CampusContacts.Remove(currentCamupsContact);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        private bool CampusContactsExists(int key)
        {
            return db.CampusContacts.Count(cc => cc.CampusContactID == key) > 0;
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
