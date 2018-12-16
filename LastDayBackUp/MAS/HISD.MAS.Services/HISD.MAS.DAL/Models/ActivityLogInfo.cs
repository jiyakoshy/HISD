using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityLogInfo
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

        //MENTEEs
        public int ActivityLogMenteeID { get; set; }
        [Column(Order = 8)]
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
        public string MenteeJobCodeDescription { get; set; }
        public Nullable<System.DateTime> MenteeLatestHireDate { get; set; }
        public String MenteeVerificationStatus { get; set; }
        public int MultiChoiceListItemID { get; set; }
        public string MultiChoiceListItemCode { get; set; }
        public string MultiChoiceListItemDescription { get; set; }
        public string MenteeComments { get; set; }

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
        public int ActivityLogActivityStandardItemID { get; set; }
        public int ActivityStandardItemID { get; set; }
        public string ActivityStandardItemName { get; set; }
        public Nullable<System.DateTime> ALStandardItem_CreateDate { get; set; }
        public string ALStandardItem_CreatedBy { get; set; }
        public Nullable<System.DateTime> ALStandardItem_UpdateDate { get; set; }
        public string ALStandardItem_UpdatedBy { get; set; }

        // Activity Tool Items 
        public int ActivityLogActivityToolItemID { get; set; }
        public int ActivityToolItemID { get; set; }
        public string ActivityToolItemName { get;  set;}
        public Nullable<System.DateTime> ALToolItem_CreateDate { get; set; }
        public string ALToolItem_CreatedBy { get; set; }
        public Nullable<System.DateTime> ALToolItem_UpdateDate { get; set; }
        public string ALToolItem_UpdatedBy { get; set; }

        //time Configuration ID
        public string MentorComments { get; set; }
        public int TimeConfigurationID { get; set; }
        public Nullable<System.DateTime> ALMentee_CreateDate { get; set; }
        public string ALMentee_CreatedBy { get; set; }
        public Nullable<System.DateTime> ALMentee_UpdateDate { get; set; }
        public string ALMentee_UpdatedBy { get; set; }


    }
}
