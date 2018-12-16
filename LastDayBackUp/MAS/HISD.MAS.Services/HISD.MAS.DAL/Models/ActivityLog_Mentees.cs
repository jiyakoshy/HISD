using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityLog_Mentees
    {
        [Key]
        public int ActivityLogMenteeID { get; set; }
        public int ActivityLogID { get; set; }
        public string MenteeEmployeeID { get; set; }
        public string MenteeVerificationStatus { get; set; }
        public int MultiChoiceListItemID { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdatedBy { get; set; }
        public int MentorMenteeRelationshipID { get; set; }
        public string MenteeComments { get; set; }

        // relation 
        public virtual ActivityLog ActivityLog { get; set; }
    }
}
