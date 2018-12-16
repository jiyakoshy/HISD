using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace HISD.SWAV.DAL.Models.SWAV
{
    public partial class SchoolStatus
    {
        [Key]
        public int SchoolWaiverID { get; set; }

        [StringLength(100)]
        public string CampusNumber { get; set; }

        //public int? WaiverID { get; set; }
        //public string WaiverName { get; set; }

        //public string WaiverDescription { get; set; }
        public int? WaiverStatusID { get; set; }

        //public bool? CustomApprovalStatus { get; set; }

        //public bool? SchoolWaiverDeleted { get; set; }

        public int? SchoolStartYear { get; set; }

        public int? SchoolEndYear { get; set; }
    }
}
