using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityLogWithComplexTypeInfo
    {
        [Key]
        public int ActivityLogID { get; set; }
        
        [StringLength(75)]
        public string NameOfInstitution { get; set; }

        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }

        // CSO
        public string CSOEmployeeID { get; set; }
        public string CSOFirstName { get; set; }
        public string CSOLastSurname { get; set; }
        public string CSOMiddleName { get; set; }
        public string CSOLoginID { get; set; }
        public string CSOElectronicMailAddress { get; set; }
        public string CSOJobCodeDescription { get; set; }
        public Nullable<System.DateTime> CSOLatestHireDate { get; set; }


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

        [Column(Order = 7)]
        [StringLength(200)]
        public string MentorJobCodeDescription { get; set; }
        public Nullable<System.DateTime> MentorLatestHireDate { get; set; }
        public string MentorComments { get; set; }
        // for grid display purpose 
        public string MentorName { get; set; }


        //MENTEES
        //public IDictionary<string, List<string>> Mentees { get; set; }
        public List<ActivityLogMenteeInfo> Mentees { get; set; }

        // Activity Code
        public int ActivityCodeID { get; set; }
        public string ActivityCodeName { get; set; }
        public string ActivityCodeDescription { get; set; }

        //time
        public Nullable<System.DateTime> ActivityStartTime { get; set; }
        //public Nullable<System.DateTime> ActivityEndTime { get; set; }

        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdatedBy { get; set; }
        public int Duration { get; set; }

        // Activity Standard Items
        //public IDictionary<string, List<string>> ActivityStandardItems { get; set; }
        public List<ActivityLogStandardItemInfo> ActivityStandardItems { get; set; }
        
        // Activity Tool Items 
        //public IDictionary<string, List<string>> ActivityToolItems { get; set; }
        public List<ActivityLogToolItemInfo> ActivityToolItems { get; set; }
        
        //time Configuration ID
        public int TimeConfigurationID { get; set; }

        
    }
}
