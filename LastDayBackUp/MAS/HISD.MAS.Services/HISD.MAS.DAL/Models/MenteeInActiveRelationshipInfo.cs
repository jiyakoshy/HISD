using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class MenteeInActiveRelationshipInfo
    {
        //[Key]
        //public int MenteeEndDateID { get; set; }
        [Key]
        [StringLength(100)]
        public string StaffNaturalKey { get; set; }

        [Column(Order = 0)]
        [StringLength(75)]
        public string FirstName { get; set; }

       
        [Column(Order = 1)]
        [StringLength(75)]
        public string LastSurname { get; set; }

        [StringLength(75)]
        public string MiddleName { get; set; }

        
        [StringLength(60)]
        public string LoginId { get; set; }

        [StringLength(200)]
        public string JobCodeDescription { get; set; }

        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }

        [StringLength(75)]
        public string NameOfInstitution { get; set; }

        [StringLength(100)]
        public string CertificationStatus { get; set; }

        [StringLength(100)]
        public string ACP { get; set; }

        [StringLength(60)]
        public string ElectronicMailAddress { get; set; }

        [StringLength(20)]
        public string MentorAgreement { get; set; }

        public Nullable<System.DateTime> MenteeEndDate { get; set; }

        public DateTime? LatestHireDate { get; set; }

        public int TimeConfigurationID { get; set; }

    }
}
