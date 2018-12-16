using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models
{
    public partial class MentorMenteeRelationship
    {
        [Key]
        public int MentorMenteeRelationshipID { get; set; }

        public string MentorEmployeeID { get; set; }
        
        public string MenteeEmployeeID { get; set; }

        public string RelationshipStatus { get; set; }
        public string PrincipalApproval { get; set; }
        public string MentorAgreement { get; set; }
        //public System.DateTime ApprovalDate { get; set; }
        public Nullable<System.DateTime> ApprovalDate { get; set; }

        public string CampusID { get; set; }
        
        [ForeignKey("TimeConfiguration")]
        public int TimeConfigurationID { get; set; }
        public virtual TimeConfiguration TimeConfiguration { get; set; }

        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdatedBy { get; set; }

        public Nullable<System.DateTime> RelationshipStartDate { get; set; }
        public Nullable<System.DateTime> RelationshipEndDate { get; set; }
        
    }
    public class NumberofRelationShipsByStatus
    {
        [Key]
        public string Campus { get; set; }
        public int ActiveRelationships { get; set; }
        public int InactivRelationships { get; set; }
        public int PendingRelationships { get; set; }
        public int TotalRelationshipsCount { get; set; }
    }

    public class TopCampusesOnRelationShip
    {
        [Key]
        public string Campus { get; set; }
        public int RelationShipCount { get; set; }
    }

    public class MentorsCountWithoutAgreementsCount
    {
        [Key]
        public int MentorsAgreementAcceptedCount { get; set; }
        public int MentorsAgreementPendingCount { get; set; }
    }
}
