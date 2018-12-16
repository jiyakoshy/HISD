namespace HISD.SWAV.DAL.Models.SWAV
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class WaiverStatus
    {
        [Key]
        [Column(Order = 0)]
        public int WaiverStatusID { get; set; }

        [StringLength(50)]
        public string WaiverStatus_changed { get; set; }

        [StringLength(100)]
        public string WaiverStatusDescription { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        [Key]
        [Column(Order = 1)]
        public DateTime CreatedDate { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }

        [Key]
        [Column(Order = 2)]
        public DateTime UpdatedDate { get; set; }
    }
}
