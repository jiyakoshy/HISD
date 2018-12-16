namespace HISD.SWAV.DAL.Models.SWAV
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Waiver
    {
        //[ForeignKey("SchoolWaivers")]
        public int WaiverID { get; set; }
        //public virtual SchoolWaiver SchoolWaivers { get; set; }


        [StringLength(255)]
        public string WaiverName { get; set; }

        public string WaiverDescription { get; set; }

        public int? WaiverTypeID { get; set; }

        public bool? WaiverRequestDetailStatus { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
        public virtual ICollection<WaiverAdministration> WaiverAdministrations { get; set; }
        public virtual ICollection<SchoolWaiver> SchoolWaivers { get; set; }
    }
    public class GeneralWaiversArray
    {
        [Key]
        public int duplicateArrayID { get; set; }
        public List<Waiver> GeneralWaivers { get; set; }
      //  public List<WaiverAdministration> WaiverAdministrations { get; set; }
    }
}
