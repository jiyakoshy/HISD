using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HisdAPI.Entities
{
    [Table("EXT.App_FAS_KPIType")]
    public partial class App_FAS_KPIType
    {
        [Key]
        [StringLength(100)]
        public string KPITypeNaturalKey { get; set; }
        [StringLength(19)]
        public string KPISourceType { get; set; }
        [StringLength(200)]
        public string Description { get; set; }
        [StringLength(500)]
        public string AltDescription { get; set; }
        [StringLength(200)]
        public string KPIDataType { get; set; }
    }
}
