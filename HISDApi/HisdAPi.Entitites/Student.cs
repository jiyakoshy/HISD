namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.Student")]
    public partial class Student
    {
        [Key]
        [StringLength(100)]
        public string StudentNaturalKey { get; set; }

        [StringLength(75)]
        public string FirstName { get; set; }

        [StringLength(75)]
        public string MiddleName { get; set; }

        [StringLength(75)]
        public string LastName { get; set; }

        [StringLength(100)]
        public string Current_GradeLvlTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string LatestEnrolled_EducationOrgNaturalKey { get; set; }

        [StringLength(100)]
        public string Latest_EnrollmentStatusTypeNaturalKey { get; set; }

        public int? StudentActiveIndicator { get; set; }

        [StringLength(100)]
        public string GenerationCodeTypeNaturalKey { get; set; }

        [StringLength(60)]
        public string Login { get; set; }

        [StringLength(20)]
        public string StudentStateId { get; set; }
    }
}
