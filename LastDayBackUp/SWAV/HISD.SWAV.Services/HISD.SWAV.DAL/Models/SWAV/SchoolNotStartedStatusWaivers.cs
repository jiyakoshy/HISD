using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace HISD.SWAV.DAL.Models.SWAV
{
    public partial class SchoolNotStartedStatusWaivers
    {
        [Key]
        public int WaiverAdministrationID { get; set; }
        public Nullable<bool> Elementary { get; set; }
        public Nullable<bool> Middle { get; set; }
        public Nullable<bool> High { get; set; }
        public int SchoolStartYear { get; set; }
        public int SchoolEndYear { get; set; }
        public Nullable<int> WaiverID { get; set; }
        public string WaiverName { get; set; }
        public string WaiverDescription { get; set; }
        public bool? WaiverRequestDetailStatus { get; set; }
        public Nullable<int> WaiverTypeID { get; set; }
        public string WaiverType1 { get; set; }
        public Nullable<bool> Deleted { get; set; }
        public Nullable<int> ReportTypeID { get; set; }
        public string ReportType { get; set; }
        public bool CheckBox { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        [StringLength(50)]
        public string WaiverCreatedBy { get; set; }
        public DateTime WaiverCreatedDate { get; set; }

        [StringLength(50)]
        public string WaiverUpdatedBy { get; set; }
        public DateTime? WaiverUpdatedDate { get; set; }
    }
}
