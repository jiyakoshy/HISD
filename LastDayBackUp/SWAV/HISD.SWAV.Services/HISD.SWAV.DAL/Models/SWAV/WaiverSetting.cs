namespace HISD.SWAV.DAL.Models.SWAV
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class WaiverSetting
    {
        public int WaiverSettingID { get; set; }

        public int SchoolStartYear { get; set; }

        public int SchoolEndYear { get; set; }

        [Column(TypeName = "date")]
        public DateTime EnrollmentStartDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime EnrollmentEndDate { get; set; }

        public TimeSpan? EnrollmentStartTime { get; set; }

        public TimeSpan? EnrollmentEndTime { get; set; }
        public bool? IsActive { get; set; }
        public bool? SchoolWaiverCopyStatus { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
