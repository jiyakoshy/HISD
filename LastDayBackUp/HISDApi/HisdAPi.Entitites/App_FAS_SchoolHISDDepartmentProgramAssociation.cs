using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HisdAPI.Entities
{
    [Table("EXT.App_FAS_SchoolHISDDepartmentProgramAssociation")]
    public partial class App_FAS_SchoolHISDDepartmentProgramAssociation
    {
        [Key]
        [StringLength(14)]
        public string SchoolHISDDepartmentProgramAssocNaturalKey { get; set; }
        [StringLength(3)]
        public string EducationOrgNaturalKey { get; set; }
        [StringLength(5)]
        public string HISDDepartmentProgramTypeNaturalKey { get; set; }
        [StringLength(41)]
        public string HISDDepartmentProgramDesc { get; set; }
        [StringLength(41)]
        public string HISDDepartmentProgramAltDesc { get; set; }
    }
}
