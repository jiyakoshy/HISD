using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HisdAPI.Entities
{
    [Table("EXT.SchoolFeederDestinationAssociation")]
    public class SchoolFeederDestinationAssociation
    {
        [Key]
        [Column(Order = 0)]
        public int SchoolYearId { get; set; }
        [Key]
        [Column(Order = 1)]
        [StringLength(100)]
        public string FeederEducationOrgNaturalKey { get; set; }
        [Key]
        [Column(Order =2)]
        [StringLength(100)]
        public string DestinationEducationOrgNaturalKey { get; set; }
    }
}
