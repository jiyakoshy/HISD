using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web.OData;
using System.Web.OData.Builder;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityLog
    {
        //public ActivityLog()
        //{
          //  this.ActivityLog_Mentees = new List<ActivityLog_Mentees>();
        //}
        [Key]
        //[ForeignKey("ActivityLog_ActivityToolItems")]
        public int ActivityLogID { get; set; }
        public string MentorEmployeeID { get; set; }
        public int ActivityCodeID { get; set; }
        //public int ActivityStandardItemID { get; set; }
        public Nullable<System.DateTime> ActivityStartTime { get; set; }
        //public Nullable<System.DateTime> ActivityEndTime { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdatedBy { get; set; }
        //public string SchoolYear { get; set; }
        //public int ActivityCommunicationTypeID { get; set; }
        public string MentorComments { get; set; }

        [ForeignKey("TimeConfiguration")]
        public int TimeConfigurationID { get; set; }
        public virtual TimeConfiguration TimeConfiguration { get; set; }

        public string CampusID { get; set; }

        public int Duration { get; set; }

        // define relations 
        [Contained]
        public virtual ICollection<ActivityLog_ActivityToolItems> ActivityLog_ActivityToolItems { get; set; }
        [Contained]
        public virtual ICollection<ActivityLog_Mentees> ActivityLog_Mentees { get; set; }
        [Contained]
        public virtual ICollection<ActivityLog_ActivityStandardItems> ActivityLog_ActivityStandardItems { get; set; }

    }

    public class TotalNumberofActivitiesByMentees
    {
        [Key]
        public string CampusID { get; set; }
        public string MentorEmployeeID { get; set; }
        public string MenteeEmployeeID { get; set; }
        public int CompletedActivitiesCount { get; set; }
        public int TotalActivitiesCount { get; set; }
    }
}
