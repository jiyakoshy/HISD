namespace HisdAPI.Entities
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("EXT.StaffQualificationAssociation")]
    public partial class StaffQualificationAssociation
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string StaffQualificationNaturalKey { get; set; }

        [StringLength(100)]
        public string StaffNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(100)]
        public string QualificationTypeNaturalKey { get; set; }

        [Column(TypeName = "date")]
        public DateTime? BeginDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? EndDate { get; set; }
    }
}
