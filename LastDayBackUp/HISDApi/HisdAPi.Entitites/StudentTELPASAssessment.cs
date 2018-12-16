namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StudentTELPASAssessment")]
    public partial class StudentTELPASAssessment
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string StuTELPASAssetPDNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int SchoolYearId { get; set; }

        public int? CalendarYearId { get; set; }

        [Key]
        [Column(Order = 2)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int DistrictCalendarDateId { get; set; }

        [StringLength(7)]
        public string LocalStudentId { get; set; }

        [Key]
        [Column(Order = 3)]
        [StringLength(60)]
        public string SchoolCode { get; set; }

        [Key]
        [Column(Order = 4)]
        [StringLength(4)]
        public string AdminMMYY { get; set; }

        [StringLength(20)]
        public string DocumentNumber { get; set; }

        [Key]
        [Column(Order = 5)]
        [StringLength(20)]
        public string GradeLevelEnrolledTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 6)]
        [StringLength(100)]
        public string AssessmentAdministratorTypeNaturalKey { get; set; }

        [StringLength(200)]
        public string AssessmentAdministratorTypeDescription { get; set; }

        [Key]
        [Column(Order = 7)]
        [StringLength(100)]
        public string AssessmentTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 8)]
        [StringLength(100)]
        public string AssessmentSubjectTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string AssessmentScoreCodeTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string AssessmentProficiencyRatingTypeNaturalKey { get; set; }

        public int? TELPASYearlyProgress { get; set; }

        [StringLength(100)]
        public string YearsInUSSchoolsTypeNaturalKey { get; set; }

        public int? ScoreRaw { get; set; }

        public int? ScoreScale { get; set; }

        public DateTime? LatestModifiedTimeStamp { get; set; }
    }
}
