using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HisdAPI.Entities
{
    [Table("EXT.App_FAS_KPI")]
    public class App_FAS_KPI
    {
        [Key]
        [Column(Order = 0)]
        public int SchoolYearId { get; set; }
        [Key]
        [Column(Order = 1)]
        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }
        [Key]
        [Column(Order = 2)]
        [StringLength(100)]
        public string KPITypeNaturalKey { get; set; }
        [Key]
        [Column(Order = 3)]
        [StringLength(100)]
        public string StudentGroupTypeNaturalKey { get; set; }
        public Decimal? KPIDataValue { get; set; }
    }
}
