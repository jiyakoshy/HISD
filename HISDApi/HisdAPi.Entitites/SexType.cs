namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.SexType")]
    public partial class SexType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string SexTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(20)]
        public string SexTypeCode { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(200)]
        public string SexTypeDescription { get; set; }
    }
}
