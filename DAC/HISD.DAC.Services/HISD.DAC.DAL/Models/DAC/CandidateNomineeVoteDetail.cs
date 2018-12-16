namespace HISD.DAC.DAL.Models.DAC
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

   public partial class CandidateNomineeVoteDetail
    {
        [Key]
        public int CandidateNomineeVoteDetailID { get; set; }

        public int CandidateNomineeID { get; set; }

        public bool VoteCast { get; set; }

        public DateTime VoteCastTimestamp { get; set; }
        public string CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
