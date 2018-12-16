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
using HISD.DAC.DAL.Models;
using HISD.DAC.DAL.Models.DAC;
using System.Threading.Tasks;
using System.Web.ModelBinding;
using Newtonsoft.Json;
using HISD.DAC.Web.Models;

namespace HISD.DAC.Web.Controllers
{
    public class CandidateNomineesController : ODataController
    {
        private DACContext db = new DACContext();
        private string connectionStringDAC = System.Configuration.ConfigurationManager.ConnectionStrings["DACContext"].ConnectionString;

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        // GET: odata/CandidateNominees
        [EnableQuery]
        public IQueryable<CandidateNominee> Get()
        {
            return db.CandidateNominees;
        }

        // DELETE: odata/CandidateNominees(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentCandidateNominee = db.CandidateNominees.FirstOrDefault(ac => ac.CandidateNomineeID == key);

            if (currentCandidateNominee == null)
            {
                return NotFound();
            }

            db.CandidateNominees.Remove(currentCandidateNominee);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        //POST: odata/create a New CandidateNominees
        //public IHttpActionResult Post(CandidateNominee candidatenominee)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }
        //    candidatenominee.CreatedDate = DateTime.Now;
        //    candidatenominee.UpdatedDate = DateTime.Now;
        //    db.CandidateNominees.Add(candidatenominee);
        //    db.SaveChanges();
        //    return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, candidatenominee));
        //    //return Created(votingsetting);
        //}

        // PATCH: odata/Partial update an existing  CandidateNominees
        //public IHttpActionResult Patch([FromODataUri] int key, Delta<CandidateNominee> patch)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var currentCandidateNominee = db.CandidateNominees.FirstOrDefault(al => al.CandidateNomineeID == key);
        //    if (currentCandidateNominee == null)
        //    {
        //        return NotFound();
        //    }
        //    currentCandidateNominee.UpdatedDate = DateTime.Now;
        //    patch.Patch(currentCandidateNominee);
        //    db.SaveChanges();

        //    return StatusCode(HttpStatusCode.NoContent);

        //}

        [HttpPost]
        [ODataRoute("AddCandidateNominee")]
        public IHttpActionResult AddCandidateNominee(CandidateNominee candidateNominee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (candidateNominee == null)
            {
                return NotFound();
            }
            
             var location=   db.Locations.Where(ls => ls.Description == candidateNominee.Location.Description).FirstOrDefault();
             var candidateType = db.CandidateTypes.Where(ls => ls.Description == candidateNominee.CandidateType.Description).FirstOrDefault();
            var votingSetting = db.VotingSettings.Where(vt => vt.IsActive == true).FirstOrDefault();
            if(location == null)
            {
                return NotFound();
            }
            if (candidateType == null)
            {
                return NotFound();
            }
            if (votingSetting == null)
            {
                return NotFound();
            }
            // foreach (CandidateNominee c in candidateNomineeArray.CandidateNominee)
            // {
            CandidateNominee candidateNomineeToDB = new CandidateNominee();

            candidateNomineeToDB.EmployeeID = candidateNominee.EmployeeID;
            candidateNomineeToDB.DepartmentID = candidateNominee.DepartmentID;
            candidateNomineeToDB.CampusID =(candidateNominee.CampusID).ToString();
            candidateNomineeToDB.VotingSettingID = votingSetting.VotingSettingID;
            candidateNomineeToDB.CreatedDate = DateTime.Now;
            candidateNomineeToDB.UpdatedDate = DateTime.Now;
            candidateNomineeToDB.CreatedBy = candidateNominee.CreatedBy;
            candidateNomineeToDB.UpdatedBy = candidateNominee.UpdatedBy;
            candidateNomineeToDB.CandidateTypeID = candidateType.CandidateTypeID;
            candidateNomineeToDB.LocationID = location.LocationID;
            db.CandidateNominees.Add(candidateNomineeToDB);
               // }
                db.SaveChanges();
           

            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, candidateNomineeToDB));
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetUserVoted(VotingSettingID={votingSettingID},CreatedBy={createdBy})")]      //,TimeConfigurationID={timeConfigID}
        public IQueryable<CandidateNominee> GetUserVoted([FromODataUri] int votingSettingID, [FromODataUri] string createdBy)
        {
          var resCandidateNominees = (from CNVD in db.CandidateNomineeVoteDetails
                                        join
                                         CN in db.CandidateNominees
                                         on CNVD.CandidateNomineeID equals CN.CandidateNomineeID
                                        where CNVD.CreatedBy == createdBy && CN.VotingSettingID == votingSettingID
                                        select new
                                        {
                                            CNVD.CreatedBy,
                                            CN.VotingSettingID,
                                            CN.CandidateNomineeID,
                                            CN.CandidateTypeID,
                                            CN.CandidateType,
                                            CN.LocationID,
                                            CN.Location,
                                            CN.CampusID
                                        }).ToList().Select(c => new CandidateNominee
                                        {
                                            CandidateNomineeID = c.CandidateNomineeID,
                                            CreatedBy = c.CreatedBy,  
                                            CampusID = c.CampusID,
                                            VotingSettingID = c.VotingSettingID,
                                            CandidateTypeID = c.CandidateTypeID,
                                            CandidateType = c.CandidateType ,
                                            LocationID = c.LocationID,
                                            Location = c.Location

                                        }).AsQueryable();



            return resCandidateNominees;


        }


        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetCandidateNomineesForCampusFromSchoolYear(VotingSettingID={votingSettingID})")]      
        public IQueryable<CandidateNominee> GetCandidateNomineesForCampusFromSchoolYear([FromODataUri] int votingSettingID)
        {
           
          //  List<int?> IdsToFind = new List<int?>() { 1, 2 };
           // return db.CandidateNominees.Where(cn => cn.VotingSettingID == votingSettingID && IdsToFind.Contains(cn.CandidateTypeID));

            var resCandidateNominees = (from CN in db.CandidateNominees
                                        join
                                         CT in db.CandidateTypes
                                         on CN.CandidateTypeID equals CT.CandidateTypeID
                                        where CN.VotingSettingID == votingSettingID &&
                                        (CT.Description == "Classroom Teacher" || CT.Description == "Campus Based Professional")
                                        select new
                                        {
                                            CN.CandidateNomineeID,
                                            CN.EmployeeID,
                                            CN.CandidateTypeID,
                                            CN.CandidateType,
                                            CN.DepartmentID,
                                            CN.LocationID,
                                            CN.VotingSettingID,
                                            CN.CampusID
                                        }).ToList().Select(c => new CandidateNominee
                                        {
                                            CandidateNomineeID = c.CandidateNomineeID,
                                            EmployeeID = c.EmployeeID,
                                            CandidateTypeID = c.CandidateTypeID,
                                            CandidateType = c.CandidateType,
                                            DepartmentID = c.DepartmentID,
                                            LocationID = c.LocationID,
                                            VotingSettingID = c.VotingSettingID,
                                            CampusID = c.CampusID

                                        }).AsQueryable();



            return resCandidateNominees;

        }




    }
    }