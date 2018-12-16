using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HisdAPI.Entities
{
    [Table("EXT.EducationOrganizationURL")]
    public partial class EducationOrganizationURL
    {
        [Key]
        public string EducationOrganizationURLNaturalKey { get; set; }
        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }
        [StringLength(200)]
        public string EducationOrganizationURLType { get; set; }
        [StringLength(8000)]
        public string BaseURL { get; set; }
        [StringLength(8000)]
        public string ExtensionURL { get; set; }
        [StringLength(8000)]
        public string FullURL { get; set; }
    }
}
