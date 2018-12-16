using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HisdAPI.Entities
{
    [Table("EXT.VendorCROSE")]
    public class VendorCROSE
    {
        [StringLength(15)]
        public string VendorNumber { get; set; }
        [StringLength(50)]
        public string Name { get; set; }
        [Key]
        [StringLength(50)]
        public string CheckNumber { get; set; }
        public DateTime CheckDate  { get; set; }
        public Decimal Amount { get; set; }
    }
}
