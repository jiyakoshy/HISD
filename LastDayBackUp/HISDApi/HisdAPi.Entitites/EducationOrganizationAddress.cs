using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HisdAPI.Entities
{
    [Table("EXT.EducationOrganizationAddress")]
    public partial class EducationOrganizationAddress
    {
        [Key]
        public string EducationOrganizationAddressNaturalKey { get; set; }
        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }
        public string AddressType { get; set; }
        [StringLength(100)]
        public string StreetNumberName { get; set; }
        [StringLength(30)]
        public string City { get; set; }
        [StringLength(10)]
        public string State { get; set; }
        [StringLength(17)]
        public string PostalCode { get; set; }
        [StringLength(30)]
        public string NameOfCounty { get; set; }
        public double GeographicalLatitude { get; set; }
        public double GeographicalLongitude { get; set; }
        [StringLength(15)]
        public string TelephoneNumber { get; set; }
        [StringLength(15)]
        public string FaxNumber { get; set; }
    }
}
