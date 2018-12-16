using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace HISD.SWAV.DAL.Models.SWAV
{
    public partial class WaiverRequestDetailAll
    {
        [Key]
        public int WaiverRequestDetailID { get; set; }

        [StringLength(100)]
        public string SourceOfData { get; set; }

        [StringLength(250)]
        public string EvidenceOfCompliance { get; set; }
        public int SchoolWaiverID { get; set; }
        public string CampusNumber { get; set; }
        public Nullable<int> WaiverID { get; set; }
        public Nullable<int> WaiverStatusID { get; set; }
        public string WaiverName { get; set; }
        public string WaiverDescription { get; set; }
        public Nullable<int> SchoolStartYear { get; set; }
        public Nullable<int> SchoolEndYear { get; set; }
    }
}
