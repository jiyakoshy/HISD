namespace HISD.SWAV.DAL.Models.SWAV
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("SDMC")]
    public partial class SDMC
    {
        public int SDMCID { get; set; }

        public string CampusNumber { get; set; }

        public string SDMCName { get; set; }

        public string SDMCEmailAddress { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
