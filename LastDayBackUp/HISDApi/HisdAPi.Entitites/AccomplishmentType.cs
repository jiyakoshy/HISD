namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.AccomplishmentType")]
    public partial class AccomplishmentType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string AccomplishmentTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(20)]
        public string AccomplishmentTypeCode { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(200)]
        public string AccomplishmentTypeDescription { get; set; }

        [StringLength(100)]
        public string AccomplishmentCategoryTypeNaturalKey { get; set; }
    }
}
