namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StudentPSATAssessment")]
    public partial class StudentPSATAssessment
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string StuPSATAssetNaturalKey { get; set; }

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

        [StringLength(50)]
        public string CollegeBoardSchoolCode { get; set; }

        [Key]
        [Column(Order = 4)]
        [StringLength(100)]
        public string AssessmentTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 5)]
        [StringLength(100)]
        public string AssessmentSubjectTypeNaturalKey { get; set; }

        public int? ScoreRaw { get; set; }

        public int? ScoreScale { get; set; }

        public int? NationalPercentileRank { get; set; }

        public int? StatePercentileRank { get; set; }

        public int? AnswersCorrect_Cnt { get; set; }

        public int? AnswersIncorrect_Cnt { get; set; }

        public int? AnswersOmitted_Cnt { get; set; }

        public bool? LatestScoreIndicator { get; set; }

        public DateTime? LatestModifiedTimeStamp { get; set; }
    }
}
