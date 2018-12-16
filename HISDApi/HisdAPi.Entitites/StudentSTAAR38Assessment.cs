namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StudentSTAAR38Assessment")]
    public partial class StudentSTAAR38Assessment
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string StustaarAssetNaturalKey { get; set; }

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

        [StringLength(20)]
        public string SchoolCode { get; set; }

        [Key]
        [Column(Order = 3)]
        [StringLength(4)]
        public string AdminMMYY { get; set; }

        [StringLength(20)]
        public string DocumentNumber { get; set; }

        [Key]
        [Column(Order = 4)]
        [StringLength(100)]
        public string AssessmentAdministratorTypeNaturalKey { get; set; }

        [StringLength(200)]
        public string AssessmentAdministratorTypeDescription { get; set; }

        [Key]
        [Column(Order = 5)]
        [StringLength(100)]
        public string AssessmentTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 6)]
        [StringLength(100)]
        public string AssessmentVersionTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 7)]
        [StringLength(100)]
        public string AssessmentSubjectTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 8)]
        [StringLength(100)]
        public string AssessmentScoreCodeTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 9)]
        [StringLength(100)]
        public string GradeLevelTestedTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 10)]
        [StringLength(100)]
        public string LanguageTypeNaturalKey { get; set; }

        public bool? TestedAboveGradeLevelIndicator { get; set; }

        public int? ScoreRaw { get; set; }

        public int? ScoreRawMax { get; set; }

        public int? ScoreScale { get; set; }

        public int? STAARProgressMeasure { get; set; }

        public int? ELLProgressMeasure { get; set; }

        public bool? MetLevel2StandardIndicator { get; set; }

        public bool? MetLevel3StandardIndicator { get; set; }

        public bool? InitialStandLevel1Indicator { get; set; }

        public bool? InitialStandLevel2Indicator { get; set; }

        public bool? InitialStand2Level2Indicator { get; set; }

        public bool? FinalStandLevel1Indicator { get; set; }

        public bool? FinalStandLevel2Indicator { get; set; }

        public bool? Level3Indicator { get; set; }

        public bool? StudentStandLevel2Indicator { get; set; }

        public DateTime? LatestModifiedTimeStamp { get; set; }
    }
}
