using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HisdAPI.Entities
{
    [Table("EXT.AddressZonedSchoolAssociation")]
    public partial class AddressZonedSchoolAssociation
    {
        [Key]
        [Column(Order = 0)]
        public string AddressNaturalKey { get; set; }
        [Key]
        [Column(Order = 1)]
        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }
        [Key]
        [Column(Order = 2)]
        public DateTime BeginDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
