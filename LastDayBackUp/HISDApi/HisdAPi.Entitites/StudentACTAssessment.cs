namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StudentACTAssessment")]
    public partial class StudentACTAssessment
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string StuACTAssetNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int SchoolYearId { get; set; }

        public int? ReportedSchoolYearId { get; set; }

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

        [StringLength(20)]
        public string CollegeBoardSchoolCode { get; set; }

        [Key]
        [Column(Order = 4)]
        [StringLength(4)]
        public string AdminMMYY { get; set; }

        [Key]
        [Column(Order = 5)]
        [StringLength(100)]
        public string AssessmentTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 6)]
        [StringLength(100)]
        public string AssessmentSubjectTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 7)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ScoreScale { get; set; }

        public int? NationalPercentileRank { get; set; }

        public int? LocalPercentileRank { get; set; }

        public bool? LatestScoreIndicator { get; set; }

        public DateTime? LatestModifiedTimeStamp { get; set; }
    }
}
