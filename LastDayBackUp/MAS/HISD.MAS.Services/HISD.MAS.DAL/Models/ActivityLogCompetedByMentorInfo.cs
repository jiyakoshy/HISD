using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityLogCompetedByMentorInfo
    {
        [Key]
        public int MentorMenteeRelationshipID { get; set; }
        
        [StringLength(75)]
        public string NameOfInstitution { get; set; }

        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }

        // CSO
        public string PrincipalOrCICEmployeeID { get; set; }
        public string PrincipalOrCICFirstName { get; set; }
        public string PrincipalOrCICLastSurname { get; set; }
        public string PrincipalOrCICMiddleName { get; set; }
        public string PrincipalOrCICLoginID { get; set; }
        public string PrincipalOrCICElectronicMailAddress { get; set; }
        //public string PrincipalOrCICJobCodeDescription { get; set; }
        

        //MENTOR
        public string MentorEmployeeID { get; set; }
        [Column(Order = 3)]
        [StringLength(75)]
        public string MentorFirstName { get; set; }
        [Column(Order = 4)]
        [StringLength(75)]
        public string MentorLastSurname { get; set; }
        [Column(Order = 5)]
        [StringLength(75)]
        public string MentorMiddleName { get; set; }

        [Column(Order = 6)]
        [StringLength(60)]
        public string MentorElectronicMailAddress { get; set; }

        //[Column(Order = 7)]
        //[StringLength(200)]
        //public string MentorJobCodeDescription { get; set; }
        //public Nullable<System.DateTime> MentorLatestHireDate { get; set; }

        //public string MentorComments { get; set; }
        
        //MENTEEs
        //public int ActivityLogMenteeID { get; set; }
        [Column(Order = 7)]
        public string MenteeEmployeeID { get; set; }
        [Column(Order = 9)]
        [StringLength(75)]
        public string MenteeFirstName { get; set; }
        [Column(Order = 10)]
        [StringLength(75)]
        public string MenteeLastSurname { get; set; }
        [Column(Order = 11)]
        [StringLength(75)]
        public string MenteeMiddleName { get; set; }
        [Column(Order = 12)]
        [StringLength(60)]
        public string MenteeElectronicMailAddress { get; set; }
        [Column(Order = 13)]
        [StringLength(200)]
        //public string MenteeJobCodeDescription { get; set; }
        //public Nullable<System.DateTime> MenteeLatestHireDate { get; set; }
        //public String MenteeVerificationStatus { get; set; }
        //public int MultiChoiceListItemID { get; set; }
        //public string MultiChoiceListItemCode { get; set; }
        //public string MultiChoiceListItemDescription { get; set; }
        //public string MenteeComments { get; set; }
        
        /*time
        public Nullable<System.DateTime> ActivityStartTime { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdatedBy { get; set; }*/
        
        //time Configuration ID
        
        public int TimeConfigurationID { get; set; }

        // Derived Fields 
        public string Month { get; set; }
        public int ActivityLogsRequiredCount { get; set; }
        public int ActivityLogsEntryCount { get; set; }
        public string MetRequirement { get; set; }

    }
}
