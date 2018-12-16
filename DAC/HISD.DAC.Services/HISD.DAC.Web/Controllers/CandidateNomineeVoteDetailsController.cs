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
using Medallion.Threading.Sql;


namespace HISD.DAC.Web.Controllers
{
    public class CandidateNomineeVoteDetailsController : ODataController
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
        [HttpPost]
        [ODataRoute("CastVote")]
        public IHttpActionResult CastVote(CandidateNomineeVoteDetail candidateNomineeVoteDetail)
        {
            var castVoteLock = new SqlDistributedLock("castVoteLock", connectionStringDAC);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (candidateNomineeVoteDetail == null)
            {
                return NotFound();
            }
            using (castVoteLock.Acquire())
            {
                candidateNomineeVoteDetail.CreatedDate = DateTime.Now;
                candidateNomineeVoteDetail.UpdatedDate = DateTime.Now;
                candidateNomineeVoteDetail.VoteCastTimestamp = DateTime.Now;
                candidateNomineeVoteDetail.VoteCast = true;
                db.CandidateNomineeVoteDetails.Add(candidateNomineeVoteDetail);
                db.SaveChanges();
                var resCandidateNomineesVoteSummary = db.CandidateNomineeVoteSummaries.Where(cnvs => cnvs.CandidateNomineeID == candidateNomineeVoteDetail.CandidateNomineeID).FirstOrDefault();
                if (resCandidateNomineesVoteSummary == null)
                {
                    CandidateNomineeVoteSummary candidateNomineesVoteSummary = new CandidateNomineeVoteSummary();
                    candidateNomineesVoteSummary.CandidateNomineeID = candidateNomineeVoteDetail.CandidateNomineeID;
                    candidateNomineesVoteSummary.VoteCount = 1;
                    candidateNomineesVoteSummary.CreatedDate = DateTime.Now;
                    candidateNomineesVoteSummary.UpdatedDate = DateTime.Now;
                    candidateNomineesVoteSummary.CreatedBy = candidateNomineeVoteDetail.CreatedBy;
                    candidateNomineesVoteSummary.UpdatedBy = candidateNomineeVoteDetail.CreatedBy;
                    db.CandidateNomineeVoteSummaries.Add(candidateNomineesVoteSummary);
                    db.SaveChanges();
                }
                else
                {
                    int voteCount = resCandidateNomineesVoteSummary.VoteCount;
                    if (voteCount == 0)
                        voteCount = 1;
                    else
                        voteCount = voteCount + 1;
                    resCandidateNomineesVoteSummary.VoteCount = voteCount;
                    resCandidateNomineesVoteSummary.UpdatedDate = DateTime.Now;
                    resCandidateNomineesVoteSummary.UpdatedBy = candidateNomineeVoteDetail.UpdatedBy;
                    db.SaveChanges();

                }
            }

            return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, candidateNomineeVoteDetail));
        }
     }
}