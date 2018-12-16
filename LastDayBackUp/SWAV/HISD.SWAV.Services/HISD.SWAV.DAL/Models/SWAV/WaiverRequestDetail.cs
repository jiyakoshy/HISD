using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace HISD.SWAV.DAL.Models.SWAV
{
    [Table("WaiverRequestDetails")]
    public partial class WaiverRequestDetail
    {
        public int WaiverRequestDetailID { get; set; }

        [StringLength(100)]
        public string SourceOfData { get; set; }

        [StringLength(250)]
        public string EvidenceOfCompliance { get; set; }

        public int SchoolWaiverID { get; set; }
    }

    public class WaiverRequestDetailsFormSchools
    {
        [Key]
        public int duplicateArrayID { get; set; }
        public List<WaiverRequestDetail> WaiverRequestDetails { get; set; }
    }
}
