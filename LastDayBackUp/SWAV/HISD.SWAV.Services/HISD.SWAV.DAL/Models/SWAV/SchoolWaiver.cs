namespace HISD.SWAV.DAL.Models.SWAV
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;
    using System.Web.OData;
    using System.Web.OData.Builder;

    public partial class SchoolWaiver
    {
        //[Contained]
        public int SchoolWaiverID { get; set; }

        [StringLength(100)]
        public string CampusNumber { get; set; }

        [ForeignKey("Waivers")]
        public int? WaiverID { get; set; }
        public virtual Waiver Waivers { get; set; }

        public bool? Elementary { get; set; }

        public bool? Middle { get; set; }

        public bool? High { get; set; }

        public int? WaiverStatusID { get; set; }

        public int? CustomApprovalStatus { get; set; }

        public bool? SchoolWaiverDeleted { get; set; }

        public int? SchoolStartYear { get; set; }

        public int? SchoolEndYear { get; set; }

        public int? EmailMessageID { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        //public virtual ICollection<Waiver> Waivers { get; set; }

    }
    public class SchoolWaiversArray
    {
        [Key]
        public int duplicateArrayID { get; set; }
        public List<SchoolWaiver> SchoolWaivers { get; set; }
    }
}
