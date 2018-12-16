namespace HisdAPI.Entities
{
    using HisdAPI.Entities;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StudentSectionAssociation")]
    public partial class StudentSectionAssociation
    {
        [Key]
        [StringLength(100)]
        public string StudentSectionAssociationNaturalKey { get; set; }

        [ForeignKey("Section")]
        [StringLength(100)]
        public string SectionNaturalKey { get; set; }

        [ForeignKey("Student")]
        [StringLength(100)]
        public string StudentNaturalKey { get; set; }

        [ForeignKey("EducationOrganization")]
        [StringLength(100)]
        public string EducationOrganizationNaturalKey { get; set; }

        [ForeignKey("Course")]
        [StringLength(100)]
        public string CourseNaturalKey { get; set; }

        [ForeignKey("Session")]
        [StringLength(100)]
        public string SessionNaturalKey { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int SchoolYear { get; set; }

        public int? CurrentSchoolYearIndicator { get; set; }

        public DateTime BeginDate { get; set; }

        public DateTime? EndDate { get; set; }

        [ForeignKey("TermType")]
        [StringLength(100)]
        public string TermTypeNaturalKey { get; set; }

        public virtual Section Section { get; set; }
        public virtual Student Student { get; set; }
        public virtual EducationOrganization EducationOrganization { get; set; }
        public virtual Course Course { get; set; }
        public virtual Session Session { get; set; }
        public virtual TermType TermType { get; set; }
    }
}
