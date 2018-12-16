using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HisdAPI.Entities
{
    [Table("EXT.BoardDistrict")]
    public partial class BoardDistrict
    {
        [Key]
        [StringLength(100)]
        public string BoardDistrictNaturalKey { get; set; }
        [StringLength(100)]
        public string BoardDistrictName { get; set; }
        public int BoardDistrictNumber { get; set; }
        [StringLength(60)]
        public string BoardMemberLoginId { get; set; }
        [StringLength(75)]
        public string BoardMemberFirstName { get; set; }
        [StringLength(75)]
        public string BoardMemberLastSurName { get; set; }
    }
}
