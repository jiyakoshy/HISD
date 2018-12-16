using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class EducationOrganization
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }

        [StringLength(10)]
        public string OrganizationCode { get; set; }

        [StringLength(10)]
        public string LocalOrganizationCode { get; set; }

        [Column(Order = 1)]
        [StringLength(75)]
        public string NameOfInstitution { get; set; }

        [Column(Order = 2)]
        [StringLength(60)]
        public string StateOrganizationId { get; set; }

        [StringLength(60)]
        public string ShortNameOfInstitution { get; set; }

        [StringLength(50)]
        public string ManagerPositionNumber { get; set; }

        [StringLength(150)]
        public string StreetNumberName { get; set; }

        [StringLength(20)]
        public string ApartmentRoomSuiteNumber { get; set; }

        [StringLength(20)]
        public string BuildingSiteNumber { get; set; }

        [StringLength(30)]
        public string City { get; set; }

        [StringLength(30)]
        public string NameOfCounty { get; set; }

        [StringLength(20)]
        public string State { get; set; }

        [StringLength(17)]
        public string PostalCode { get; set; }

        [StringLength(15)]
        public string TelephoneNumber { get; set; }

        [StringLength(15)]
        public string FaxNumber { get; set; }

        [Column(Order = 3)]
        [StringLength(100)]
        public string OperationalStatusNaturalKey { get; set; }

        [Column(Order = 4)]
        [StringLength(100)]
        public string OrgGrpNaturalKey { get; set; }

        [StringLength(10)]
        public string ERPOrganizationCode { get; set; }

        public virtual ICollection<Staff> Staffs { get; set; }
        public virtual SchoolManager SchoolManagers { get; set;}
        
    }
}
