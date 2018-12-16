namespace HisdAPI.Entities
{
    using HisdAPI.Entities;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.Section")]
    public partial class Section
    {
        [Key]
        [StringLength(100)]
        public string SectionNaturalKey { get; set; }

        [StringLength(100)]
        public string SectionName { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int SchoolYear { get; set; }

        public int? CurrentSchoolYearIndicator { get; set; }

        [ForeignKey("Course")]
        [StringLength(100)]
        public string CourseNaturalKey { get; set; }

        [ForeignKey("EducationOrganization")]
        [StringLength(100)]
        public string EducationOrganizationNaturalKey { get; set; }

        [ForeignKey("TermType")]
        [StringLength(100)]
        public string TermTypeNaturalKey { get; set; }

        [ForeignKey("Session")]
        [StringLength(100)]
        public string SessionNaturalKey { get; set; }

        [StringLength(100)]
        public string RoomNaturalKey { get; set; }

        [ForeignKey("SectionSchedulingType")]
        [StringLength(100)]
        public string SectionSchedulingTypeNaturalKey { get; set; }

        public virtual Course Course { get; set; }
        public virtual EducationOrganization EducationOrganization { get; set; }
        public virtual TermType TermType { get; set; }
        public virtual Session Session { get; set; }
        public virtual SectionSchedulingType SectionSchedulingType { get; set; }
    }
}
