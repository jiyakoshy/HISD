namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StaffERPGroupType")]
    public partial class StaffERPGroupType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(20)]
        public string StaffERPGroupTypeCode { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(200)]
        public string StaffERPGroupTypeDescription { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(100)]
        public string StaffERPGroupTypeNaturalKey { get; set; }
    }
}
