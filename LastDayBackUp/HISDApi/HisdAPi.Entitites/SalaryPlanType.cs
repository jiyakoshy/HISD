namespace HisdAPI.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("EXT.SalaryPlanType")]
    public partial class SalaryPlanType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string SalaryPlanTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(50)]
        public string SalaryPlanCode { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(100)]
        public string SalaryPlanTypeDescription { get; set; }
    }
}
