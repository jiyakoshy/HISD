using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HisdAPI.Entities
{
    [Table("EXT.Address")]
    public partial class AddressEntity
    {
        [Key]
        public string AddressNaturalKey { get; set; }        
        public string StreetNumber { get; set; }
        [StringLength(200)]
        public string StreetName { get; set; }
        public string StreetTag { get; set; }
        [StringLength(200)]
        public string StreetDir { get; set; }
        public string ApartmentNumber { get; set; }
        public string BuildingNumber { get; set; }
        [StringLength(30)]
        public string City { get; set; }
        [StringLength(100)]
        public string State { get; set; }
        [StringLength(17)]
        public string PostalCode { get; set; }
    }
}
