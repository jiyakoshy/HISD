namespace HisdAPI.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("EXT.QualificationType")]
    public partial class QualificationType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string QualificationTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(20)]
        public string CodeValue { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(200)]
        public string Description { get; set; }
    }
}
