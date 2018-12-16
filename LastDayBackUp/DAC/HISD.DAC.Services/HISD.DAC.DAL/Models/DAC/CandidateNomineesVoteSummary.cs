using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace HISD.DAC.DAL.Models.DAC
{
   

    
    public partial class CandidateNomineeVoteSummary
    {
        [Key]
        public int CandidateNomineeVoteSummaryID { get; set; }
        public int CandidateNomineeID { get; set; }
        public int VoteCount { get; set; }       
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }        
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
