namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StudentSATAssessment")]
    public partial class StudentSATAssessment
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string StuSATAssetNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int SchoolYearId { get; set; }

        [Key]
        [Column(Order = 2)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ReportedSchoolYearId { get; set; }

        [Key]
        [Column(Order = 3)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int DistrictCalendarDateId { get; set; }

        [StringLength(7)]
        public string LocalStudentId { get; set; }

        [Key]
        [Column(Order = 4)]
        [StringLength(60)]
        public string SchoolCode { get; set; }

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
        [StringLength(100)]
        public string AssessmentAdministratorTypeNaturalKey { get; set; }

        [StringLength(200)]
        public string AssessmentAdministratorTypeDescription { get; set; }

        [StringLength(50)]
        public string CollegeBoardSchoolCode { get; set; }

        public int? Score { get; set; }

        public int? NationalPercentileRank { get; set; }

        public int? StatePercentileRank { get; set; }

        public bool? LatestScoreIndicator { get; set; }

        public DateTime? LatestModifiedTimeStamp { get; set; }
    }
}
