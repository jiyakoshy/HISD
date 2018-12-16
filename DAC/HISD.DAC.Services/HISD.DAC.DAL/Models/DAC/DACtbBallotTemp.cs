namespace HISD.DAC.DAL.Models.DAC
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    
    public partial class DACtbBallotTemp
    {
        [Key]
        public int DACtbBallotID { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime VotingStartDate { get; set; }

        public TimeSpan? StartTime { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime VotingEndDate { get; set; }

        public TimeSpan? EndTime { get; set; }
        public int BeginSchoolYear { get; set; }
        public int EndSchoolYear { get; set; }
        public string SchoolYear { get; set; }
    }
}
