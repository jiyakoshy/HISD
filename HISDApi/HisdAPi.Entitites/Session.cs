namespace HisdAPI.Entities
{
    using HisdAPI.Entities;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.Session")]
    public partial class Session
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string SessionNaturalKey { get; set; }

        [ForeignKey("EducationOrganization")]
        [Column(Order = 1)]
        [StringLength(100)]
        public string EducationOrganizationNaturalKey { get; set; }

        [ForeignKey("TermType")]
        [Column(Order = 2)]
        [StringLength(100)]
        public string TermTypeNaturalKey { get; set; }

        [ForeignKey("TermSpanType")]
        [Column(Order = 3)]
        [StringLength(100)]
        public string TermSpanTypeNaturalKey { get; set; }

        [Column(Order = 4)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int SchoolYear { get; set; }

        public int? CurrentSchoolYearIndicator { get; set; }

        public DateTime? BeginDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int? TotalInstructionalDays { get; set; }
        public virtual EducationOrganization EducationOrganization { get; set; }
        public virtual TermType TermType { get; set; }
        public virtual TermSpanType TermSpanType { get; set; }
    }
}
