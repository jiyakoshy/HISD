namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StudentIOWAYearRoundAssessment")]
    public partial class StudentIOWAYearRoundAssessment
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string StuIOWAYRAssetNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int SchoolYearId { get; set; }

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
        [StringLength(100)]
        public string AssessmentTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 5)]
        [StringLength(20)]
        public string GradeLevelTestedTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 6)]
        [StringLength(100)]
        public string AssessmentSubjectTypeNaturalKey { get; set; }

        public int? ScoreRaw { get; set; }

        public int? ScoreScale { get; set; }

        [StringLength(20)]
        public string GradeEquivalent { get; set; }

        public int? NationalPercentileRank { get; set; }

        public int? ValidNationalPercentileRankIndicator { get; set; }

        public int? LocalPercentileRank { get; set; }

        public int? NationalNormalCurveEquivalent { get; set; }

        public int? NationalStanine { get; set; }

        public int? LocalStanine { get; set; }

        [StringLength(20)]
        public string LexileQuantileLowRange { get; set; }

        [StringLength(20)]
        public string LexileQuantileHighRange { get; set; }

        public int? CollegeReadyIndicator { get; set; }

        public int? NumberAttempted { get; set; }

        public int? MetCompletionCriteriaIndicator { get; set; }

        public DateTime? LatestModifiedTimeStamp { get; set; }
    }
}
