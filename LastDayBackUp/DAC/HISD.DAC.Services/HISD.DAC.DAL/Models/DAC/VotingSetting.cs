namespace HISD.DAC.DAL.Models.DAC
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class VotingSetting
    {
        [Key]
        public int VotingSettingID { get; set; }
        [Column(TypeName = "date")]
        public DateTime VotingStartDate { get; set; }

        [DisplayFormat(DataFormatString = "{0:hh\\:mm}", ApplyFormatInEditMode = true)]
        public TimeSpan VotingStartTime { get; set; }

        [Column(TypeName = "date")]
        public DateTime VotingEndDate { get; set; }

        [DisplayFormat(DataFormatString = "{0:hh\\:mm}", ApplyFormatInEditMode = true)]
        public TimeSpan VotingEndTime { get; set; }

        [Column(TypeName = "date")]
        public DateTime? CandidateNomineeSettingsStartDate { get; set; }

        [DisplayFormat(DataFormatString = "{0:hh\\:mm}", ApplyFormatInEditMode = true)]
        public TimeSpan? CandidateNomineeSettingsStartTime { get; set; }

        [Column(TypeName = "date")]
        public DateTime? CandidateNomineeSettingsEndDate { get; set; }

        [DisplayFormat(DataFormatString = "{0:hh\\:mm}", ApplyFormatInEditMode = true)]
        public TimeSpan? CandidateNomineeSettingsEndTime { get; set; }

        [Column(TypeName = "date")]
        public DateTime? ResultsAvailableStartDate { get; set; }

        [DisplayFormat(DataFormatString = "{0:hh\\:mm}", ApplyFormatInEditMode = true)]
        public TimeSpan? ResultsAvailableStartTime { get; set; }

        public bool IsActive { get; set; }

        public string SchoolYear { get; set; }
        public string CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public virtual ICollection<CandidateNominee> CandidateNominee { get; set; }
    }
}
