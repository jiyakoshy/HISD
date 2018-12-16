using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HisdAPI.Entities
{
    [Table("EXT.StaffPayGradeAssociation")]
    public partial class StaffPayGradeAssociation
    {
        [Key]
        [StringLength(100)]
        public string StaffNaturalKey { get; set; }

        public string PayGradeLevel { get; set; }
        public DateTime BeginDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
