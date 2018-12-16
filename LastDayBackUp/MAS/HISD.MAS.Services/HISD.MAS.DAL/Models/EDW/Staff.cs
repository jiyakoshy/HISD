using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class Staff
    {
        [Key]
        [StringLength(100)]
        public string StaffNaturalKey { get; set; }
        
        [StringLength(10)]
        public string EmployeeNumber { get; set; }

        [StringLength(10)]
        public string ERPEmployeeNumber { get; set; }

       
        [Column(Order = 0)]
        [StringLength(75)]
        public string FirstName { get; set; }

       
        [Column(Order = 1)]
        [StringLength(75)]
        public string LastSurname { get; set; }

        [StringLength(75)]
        public string MiddleName { get; set; }

        [StringLength(35)]
        public string MaidenName { get; set; }

        [StringLength(60)]
        public string LoginId { get; set; }

        [StringLength(100)]
        public string SexTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string PositionNumber { get; set; }

        [StringLength(100)]
        public string PositionNaturalKey { get; set; }

        [StringLength(100)]
        public string JobCodeNaturalKey { get; set; }

        public DateTime? ActionDate { get; set; }

        [StringLength(100)]
        public string JobFamilyNaturalKey { get; set; }

        //[StringLength(100)]
        //public string EducationOrgNaturalKey { get; set; }

        public decimal? FullTimeEquivalent { get; set; }

        [StringLength(100)]
        public string SalaryPlanTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string EmployeeStatusTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string EmployeeHISDStatusTypeNaturalKey { get; set; }

        public bool? StaffActiveIndicator { get; set; }

        [StringLength(100)]
        public string JobIndicatorTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string JobFunctionNaturalKey { get; set; }

        [StringLength(12)]
        public string TxUniqueID { get; set; }

        [StringLength(100)]
        public string StaffERPGroupTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string StaffContractTypeNaturalKey { get; set; }

        public DateTime? LatestHireDate { get; set; }

        public DateTime? TerminationDate { get; set; }

        // Staff to EducationalOrg
        // (2). set FK referential constraint on Navigation Key property
        [ForeignKey("EducationOrganization")]
        public string EducationOrgNaturalKey { get; set; }
        public virtual EducationOrganization EducationOrganization { get; set; }
        
        public virtual StaffElectronicEmail StaffElectronicEmail { get; set; }

        public ICollection<SchoolManager> SchoolManagers { get; set; }
        
    }
}
