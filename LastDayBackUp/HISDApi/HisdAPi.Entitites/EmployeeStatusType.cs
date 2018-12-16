namespace HisdAPI.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("EXT.EmployeeStatusType")]
    public partial class EmployeeStatusType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string EmployeeStatusTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(50)]
        public string EmployeeStatusCode { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(100)]
        public string EmployeeStatusTypeDescription { get; set; }
    }
}
