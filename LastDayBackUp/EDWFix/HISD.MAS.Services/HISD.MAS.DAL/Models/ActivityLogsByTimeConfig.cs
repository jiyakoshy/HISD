using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityLogsByTimeConfig
    {
        [Key]
        public int ActivityLogID { get; set; }

        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }

        //MENTOR
        public string MentorEmployeeID { get; set; }
        
        public string MentorComments { get; set; }
        // for grid display purpose 


        //MENTEES
        public List<ActivityLogMenteeInfoByTimeConfig> Mentees { get; set; }

        // Activity Code
        public int ActivityCodeID { get; set; }
        public string ActivityCodeName { get; set; }
        public string ActivityCodeDescription { get; set; }

        //time
        public Nullable<System.DateTime> ActivityStartTime { get; set; }

        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdatedBy { get; set; }
        public int Duration { get; set; }

        // Activity Standard Items
        public List<ActivityLogStandardItemInfo> ActivityStandardItems { get; set; }

        // Activity Tool Items 
        public List<ActivityLogToolItemInfo> ActivityToolItems { get; set; }

        //time Configuration ID
        public int TimeConfigurationID { get; set; }


    }
}
