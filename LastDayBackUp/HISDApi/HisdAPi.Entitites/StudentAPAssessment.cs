namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StudentAPAssessment")]
    public partial class StudentAPAssessment
    {
        [Key]
        [Column(Order = 0)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int SchoolYearId { get; set; }

        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int DistrictCalendarDateId { get; set; }

        [StringLength(7)]
        public string LocalStudentId { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(60)]
        public string SchoolCode { get; set; }

        [Key]
        [Column(Order = 3)]
        [StringLength(100)]
        public string AssessmentSubjectTypeNaturalKey { get; set; }

        public int? Score { get; set; }
    }
}
