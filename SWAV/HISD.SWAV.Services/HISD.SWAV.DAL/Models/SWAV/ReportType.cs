namespace HISD.SWAV.DAL.Models.SWAV
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ReportType
    {
        public int ReportTypeID { get; set; }

        [Column("ReportType")]
        [StringLength(20)]
        public string ReportType1 { get; set; }

        [StringLength(500)]
        public string ReportText { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }

        public DateTime UpdatedDate { get; set; }
    }
}
