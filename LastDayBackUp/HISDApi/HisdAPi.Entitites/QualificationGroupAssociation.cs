namespace HisdAPI.Entities
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("EXT.QualificationGroupAssociation")]
    public partial class QualificationGroupAssociation
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string QualificationGroupAssociationNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(100)]
        public string QualificationGroupTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(100)]
        public string QualificationTypeNaturalKey { get; set; }

        public DateTime? BeginDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
