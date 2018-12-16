using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace HISD.SWAV.DAL.Models.SWAV
{
    public partial class SchoolSatusWaivers
    {
        [Key]
        public int SchoolWaiverID { get; set; }
        public string CampusNumber { get; set; }
        public bool? Elementary { get; set; }
        public bool? Middle { get; set; }
        public bool? High { get; set; }
        public Nullable<int> WaiverID { get; set; }
        public Nullable<int> WaiverStatusID { get; set; }
        public string WaiverName { get; set; }
        public string WaiverDescription { get; set; }
        public Nullable<int> WaiverTypeID { get; set; }
        public string WaiverType1 { get; set; }
        public bool? WaiverRequestDetailStatus { get; set; }
        public Nullable<int> CustomApprovalStatus { get; set; }
        public bool? SchoolWaiverDeleted { get; set; }
        public int? EmailMessageID { get; set; }
        public Nullable<int> SchoolStartYear { get; set; }
        public Nullable<int> SchoolEndYear { get; set; }
        public bool CheckBox { get; set; }
        [StringLength(50)]
        public string CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
