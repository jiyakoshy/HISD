using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HisdAPI.Entities
{
    [Table("EXT.SchoolGradeLevelAssociation")]
    public partial class SchoolGradeLevelAssociation
    {
        [Key]
        [StringLength(100)]
        public string SchoolGradeLevelAssociationNaturalKey { get; set; }
        [StringLength(100)]
        public string SchoolYearNaturalKey { get; set; }
        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }
        [StringLength(100)]
        public string GradeLvlTypeNaturalKey { get; set; }
    }
}
