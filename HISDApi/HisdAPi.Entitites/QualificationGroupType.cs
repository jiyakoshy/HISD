namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.QualificationGroupType")]
    public partial class QualificationGroupType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string QualificationGroupTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(20)]
        public string CodeValue { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(200)]
        public string Description { get; set; }
    }
}
