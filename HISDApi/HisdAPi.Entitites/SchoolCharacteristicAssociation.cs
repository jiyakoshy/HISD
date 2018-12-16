using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HisdAPI.Entities
{
    [Table("EXT.SchoolCharacteristicAssociation")]
    public partial class SchoolCharacteristicAssociation
    {
        [Key]
        [StringLength(103)]
        public string SchCharecAssocNaturalKey { get; set; }
        public int SchoolYearId { get; set; }
        [StringLength(2)]
        public string SourceSystemTypeNaturalKey { get; set; }
        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }
        [StringLength(100)]
        public string SchoolCharacteristicTypeNaturalKey { get; set; }
    }
}
