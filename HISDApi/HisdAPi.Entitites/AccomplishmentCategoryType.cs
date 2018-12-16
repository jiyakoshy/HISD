namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.AccomplishmentCategoryType")]
    public partial class AccomplishmentCategoryType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string AccomplishmentCategoryTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(50)]
        public string AccomplishmentCategoryTypeCode { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(100)]
        public string AccomplishmentCategoryTypeDescription { get; set; }
    }
}
