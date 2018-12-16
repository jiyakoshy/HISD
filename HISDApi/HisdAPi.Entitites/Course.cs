namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.Course")]
    public partial class Course
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string CourseNaturalKey { get; set; }

        [StringLength(100)]
        public string HISDCourseCode { get; set; }

        [StringLength(100)]
        public string CourseTitle { get; set; }

        [StringLength(2000)]
        public string CourseDescription { get; set; }

        public int? IsActiveCourseIndicator { get; set; }

        [Column(Order = 1)]
        [StringLength(100)]
        public string CoreSubjectAreaTypeNaturalKey { get; set; }

        public decimal? MaximumAvailableCredit { get; set; }

        public int? APIndicator { get; set; }

        public int? PAPIndicator { get; set; }

        public int? IBIndicator { get; set; }

        public int? PIBIndicator { get; set; }

        public int? CTEIndicator { get; set; }

        public int? DualCreditIndicator { get; set; }

        public int? StateCourseIndicator { get; set; }

        public int? CollectGradesIndicator { get; set; }

        public int? CollectAttendanceIndicator { get; set; }

        [StringLength(100)]
        public string StateCourseCode { get; set; }

        [StringLength(100)]
        public string PopulationServedTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string CourseTypeNaturalKey { get; set; }
    }
}
