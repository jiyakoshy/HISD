namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StudentDOB")]
    public partial class StudentDOB
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string StudentDOBNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(100)]
        public string StudentNaturalKey { get; set; }

        public DateTime? BirthDate { get; set; }
    }
}
