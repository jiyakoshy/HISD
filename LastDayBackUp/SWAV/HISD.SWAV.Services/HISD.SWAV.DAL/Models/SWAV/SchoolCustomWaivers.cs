using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace HISD.SWAV.DAL.Models.SWAV
{
    public partial class SchoolCustomWaivers
    {
        [Key]
        public int SchoolWaiverID { get; set; }

        [StringLength(100)]
        public string CampusNumber { get; set; }
        public int? WaiverID { get; set; }

        [StringLength(255)]
        public string WaiverName { get; set; }
        public string WaiverDescription { get; set; }
        public int? WaiverTypeID { get; set; }
        public string WaiverType1 { get; set; }
        public int? WaiverStatusID { get; set; }
        public int WaiverAdministrationID { get; set; }
        public Nullable<bool> Elementary { get; set; }
        public Nullable<bool> Middle { get; set; }
        public Nullable<bool> High { get; set; }
        public int? ReportTypeID { get; set; }
        public string ReportType { get; set; }
        public int? CustomApprovalStatus { get; set; }
        public bool? SchoolWaiverDeleted { get; set; }
        public bool? Deleted { get; set; }
        public int? SchoolStartYear { get; set; }
        public int? SchoolEndYear { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime WaiverAdminCreatedDate { get; set; }
        public DateTime WaiverCreatedDate { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
