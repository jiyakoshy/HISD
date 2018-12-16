namespace HISD.SWAV.DAL.Models.SWAV
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("WaiverAdministration")]
    public partial class WaiverAdministration
    {
        public int WaiverAdministrationID { get; set; }

        public bool? Elementary { get; set; }

        public bool? Middle { get; set; }

        public bool? High { get; set; }

        public int SchoolStartYear { get; set; }

        public int SchoolEndYear { get; set; }

        [ForeignKey("Waivers")]
        public int? WaiverID { get; set; }
        public virtual Waiver Waivers { get; set; }

        public bool? Deleted { get; set; }

        public int? ReportTypeID { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
