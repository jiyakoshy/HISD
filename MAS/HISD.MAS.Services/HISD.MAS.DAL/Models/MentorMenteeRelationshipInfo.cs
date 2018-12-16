using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models
{
    public partial class MentorMenteeRelationshipInfo
    {
        [Key]
        public int MentorMenteeRelationshipID { get; set; }

        // Campus
        [StringLength(75)]
        public string NameOfInstitution { get; set; }
        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }
        [StringLength(10)]
        public string LocalOrganizationCode { get; set; }

        public string RelationshipStatus { get; set; }
        public string PrincipalApproval { get; set; }
        public string MentorAgreement { get; set; }
        public Nullable<System.DateTime> ApprovalDate { get; set; }
        public int TimeConfigurationID { get; set; }
        
        //MENTOR
        public string MentorEmployeeID { get; set; }
        [Column(Order = 2)]
        [StringLength(75)]
        public string MentorFirstName { get; set; }
        [Column(Order = 1)]
        [StringLength(75)]
        public string MentorLastSurname { get; set; }
        [Column(Order = 0)]
        [StringLength(75)]
        public string MentorMiddleName { get; set; }
        [Column(Order = 3)]
        [StringLength(60)]
        public string MentorElectronicMailAddress { get; set; }
        [Column(Order = 4)]
        [StringLength(200)]
        public string MentorJobCodeDescription { get; set; }
        public DateTime? MentorLatestHireDate { get; set; }

        //MENTEE
        [Column(Order = 5)]
        public string MenteeEmployeeID { get; set; }
        [Column(Order = 6)]
        [StringLength(75)]
        public string MenteeFirstName { get; set; }
        [Column(Order = 7)]
        [StringLength(75)]
        public string MenteeLastSurname { get; set; }
        [Column(Order = 8)]
        [StringLength(75)]
        public string MenteeMiddleName { get; set; }
        [Column(Order = 9)]
        [StringLength(60)]
        public string MenteeElectronicMailAddress { get; set; }
        [Column(Order = 10)]
        [StringLength(200)]
        public string MenteeJobCodeDescription { get; set; }
        public DateTime? MenteeLatestHireDate { get; set; }
        [StringLength(100)]
        public string MenteeCertificationStatus { get; set; }
        [StringLength(100)]
        public string MenteeACP { get; set; }
        public Nullable<System.DateTime> MenteeEndDateInRelationship { get; set; }
        
        // Relationship
        public Nullable<System.DateTime> CreateDate { get; set; }
        // CIC/ Principal: who creates the Relationship 
        public string CreatedBy { get; set; }
        public string CreatedByEmployeeID { get; set; }
        public string CreatedByFirstName { get; set; }
        public string CreatedByMiddleName { get; set; }
        public string CreatedByLastSurName { get; set; }
        public string CreatedByElectronicMailAddress { get; set; }

        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdatedBy { get; set; }

        public Nullable<System.DateTime> RelationshipStartDate { get; set; }
        public Nullable<System.DateTime> RelationshipEndDate { get; set; }
    }
}
