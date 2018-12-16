namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.EducationOrganizationHierarchy")]
    public partial class EducationOrganizationHierarchy
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }

        public int? LevelUp { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(100)]
        public string ParentEducationOrgNaturalKey { get; set; }
    }
}
