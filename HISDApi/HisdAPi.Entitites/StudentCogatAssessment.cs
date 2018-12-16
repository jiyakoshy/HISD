namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StudentCogatAssessment")]
    public partial class StudentCogatAssessment
    {
        [StringLength(50)]
        public string SourceTestGuid { get; set; }

        [Key]
        [Column(Order = 0)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int SchoolYearId { get; set; }

        [Key]
        [Column(Order = 1)]
        public DateTime DateTested { get; set; }

        [StringLength(7)]
        public string LocalStudentId { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(60)]
        public string SchoolCode { get; set; }

        [Key]
        [Column(Order = 3)]
        [StringLength(100)]
        public string AssessmentTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 4)]
        [StringLength(100)]
        public string AssessmentSubjectTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 5)]
        [StringLength(100)]
        public string AssessmentTermTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 6)]
        [StringLength(20)]
        public string GradeLevelTestedCode { get; set; }

        [Key]
        [Column(Order = 7)]
        [StringLength(100)]
        public string AssessmentBatteryTypeNaturalKey { get; set; }

        public int? MetCompletionCriteriaIndicator { get; set; }

        public int? NumberAttempted { get; set; }

        public int? ScoreRaw { get; set; }

        public int? ScoreScale { get; set; }

        public int? StandardAgeScore { get; set; }

        public int? GradePercentileRank { get; set; }

        public int? AgePercentileRank { get; set; }

        public DateTime? LatestModifiedTimeStamp { get; set; }
    }
}
