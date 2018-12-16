namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.YearsInUSSchoolsType")]
    public partial class YearsInUSSchoolsType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string YearsInUSSchoolsTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(100)]
        public string YearsInUSSchoolsTypeDescription { get; set; }
    }
}
