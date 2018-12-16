using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HisdAPI.Entities
{
    [Table("EXT.SchoolCharacteristicType")]
    public partial class SchoolCharacteristicType
    {
        [Key]
        [StringLength(100)]
        public string SchoolCharacteristicTypeNaturalKey { get; set; }
        [StringLength(200)]
        public string Description { get; set; }
    }
}
