namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StudentLoginAssociation_VIEW")]
    public partial class StudentLoginAssociation_VIEW
    {
        [StringLength(7)]
        public string LocalStudentId { get; set; }

        [Key]
        [Column(Order = 0)]
        [StringLength(75)]
        public string FirstName { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(75)]
        public string LastSurname { get; set; }

        [StringLength(75)]
        public string MiddleName { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(60)]
        public string LoginId { get; set; }
    }
}
