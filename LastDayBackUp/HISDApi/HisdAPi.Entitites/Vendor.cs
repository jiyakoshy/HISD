using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HisdAPI.Entities
{
    [Table("EXT.Vendor")]
    public class Vendor
    {
        [Key]
        [StringLength(15)]
        public string VendorNumber { get; set; }
        [StringLength(50)]
        public string Name { get; set; }
    }
}
