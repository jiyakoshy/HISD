namespace HisdAPI.Entities
{
    using HisdAPI.Entities;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StaffSectionAssociation")]
    public partial class StaffSectionAssociation
    {
        [Key]
        [StringLength(100)]
        public string StaffSectionAssociationNaturalKey { get; set; }

        [ForeignKey("Staff")]
        [StringLength(100)]
        public string StaffNaturalKey { get; set; }

        [ForeignKey("Section")]
        [StringLength(100)]
        public string SectionNaturalKey { get; set; }

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


        [Column(TypeName = "date")]
        public DateTime BeginDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? EndDate { get; set; }

        [ForeignKey("TermType")]
        [StringLength(100)]
        public string TermTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string ClassroomPositionTypeNaturalKey { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int TeacherOfRecordIndicator { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int FinalTeacherIndicator { get; set; }
        public virtual Staff Staff { get; set; }
        public virtual Section Section { get; set; }
        public virtual EducationOrganization EducationOrganization {get; set; }
        public virtual Course Course { get; set; }
        public virtual Session Session { get; set; }
        public virtual TermType TermType { get; set; }

    }
}
