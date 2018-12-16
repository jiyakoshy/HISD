
namespace HisdAPI.Entities
{
    using HisdAPI.Entities;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.SchoolManagers")]
    public class SchoolManagers
    {
        [Key]
        [ForeignKey("EducationOrganization")]
        public string EducationOrgNaturalKey { get; set; }   
        
        [StringLength(100)]
        public string CILSchoolManagerStaffNaturalKey { get; set; }        
        [StringLength(100)]
        public string ERPSchoolManagerStaffNaturalKey { get; set; }
        [StringLength(100)]
        public string Up1ManagerStaffNaturalKey { get; set; }
        [StringLength(100)]
        public string Up1EducationOrgNaturalKey { get; set; }
        [StringLength(100)]
        public string Up2ManagerStaffNaturalKey { get; set; }
        [StringLength(100)]
        public string Up2EducationOrgNaturalKey { get; set; }
        public string BoardDistrictNaturalKey { get; set; }                
        public virtual EducationOrganization EducationOrganization { get; set; }
        public virtual Staff CILSchoolManager { get; set; }
        public virtual Staff Up1Manager { get; set; }
        public virtual Staff Up2Manager { get; set; }
        public virtual BoardDistrict BoardDistrict { get; set; }
    }
}