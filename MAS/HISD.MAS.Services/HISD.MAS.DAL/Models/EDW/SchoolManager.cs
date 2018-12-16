using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class SchoolManager
    {
        [Key]
        //[ForeignKey("EducationOrganization")]
        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }

        //[Key]
        //[ForeignKey("Staffs")]
        [StringLength(100)]
        public string CILSchoolManagerStaffNaturalKey { get; set; }

        [StringLength(100)]
        public string ERPSchoolManagerStaffNaturalKey { get; set; }

        [StringLength(100)]
        public string Up1ManagerStaffNaturalKey { get; set; }
        //[ForeignKey("Up1ManagerStaffNaturalKey")]
        //public virtual Staff SSO { get; set; }
        

        [StringLength(100)]
        public string Up1EducationOrgNaturalKey { get; set; }

        [StringLength(100)]
        public string Up2ManagerStaffNaturalKey { get; set; }
        //[ForeignKey("Up2ManagerStaffNaturalKey")]
        //public virtual Staff CSO { get; set; }
        
        [StringLength(100)]
        public string Up2EducationOrgNaturalKey { get; set; }

        [StringLength(100)]
        public string BoardDistrictNaturalKey { get; set; }
        
        //public virtual EducationOrganization EducationOrganization { get; set; }
        //public virtual ICollection<EducationOrganization> EducationOrganizations { get; set; }
        
        
        //[Required]
        //public virtual ICollection<Up1Manager> Up1Manager { get; set; }
        
    }
}
