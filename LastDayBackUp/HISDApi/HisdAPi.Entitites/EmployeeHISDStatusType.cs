namespace HisdAPI.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("EXT.EmployeeHISDStatusType")]
    public partial class EmployeeHISDStatusType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string EmployeeHISDStatusTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(20)]
        public string EmployeeHISDStatusTypeCode { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(200)]
        public string EmployeeHISDStatusTypeDescription { get; set; }
    }
}
