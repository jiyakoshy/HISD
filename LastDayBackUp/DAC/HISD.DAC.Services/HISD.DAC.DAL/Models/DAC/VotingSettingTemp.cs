namespace HISD.DAC.DAL.Models.DAC
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("VotingSettingTemp")]
    public partial class VotingSettingTemp
    {
        [Key]
        public int VotingSettingID { get; set; }

        [Column(TypeName = "date")]
        public DateTime? StartDate { get; set; }

        public TimeSpan? StartTime { get; set; }

        [Column(TypeName = "date")]
        public DateTime? EndDate { get; set; }

        public TimeSpan? EndTime { get; set; }

        [Required]
        [StringLength(25)]
        public string SchoolYear { get; set; }

        public int DACtbBallotID { get; set; }
    }
}
