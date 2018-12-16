using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class MentorActivityLogCompletionInfo
    {
        [Key]
        public int MentorActivityLogCompletionID { get; set; }

        public int ActivityLogMenteeID { get; set; }
        public int ActivityLogID { get; set; }

        // campus
        [StringLength(75)]
        public string NameOfInstitution { get; set; }
        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }

        //MENTEE Info
        public string StaffNaturalKey { get; set; }
        [Column(Order = 5)]
        [StringLength(75)]
        public string FirstName { get; set; }
        [Column(Order = 6)]
        [StringLength(75)]
        public string LastSurname { get; set; }
        [Column(Order = 7)]
        [StringLength(75)]
        public string MiddleName { get; set; }
        [Column(Order = 8)]
        [StringLength(60)]
        public string ElectronicMailAddress { get; set; }
        [Column(Order = 9)]
        [StringLength(200)]
        public string JobCodeDescription { get; set; }
        public Nullable<System.DateTime> LatestHireDate { get; set; }
        public String VerificationStatus { get; set; }
        public int VerficationCommentItemID { get; set; }
        public string VerificationCommentDescription { get; set; }
        public string VerificationCommentCode { get; set; }
        // time
        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdatedBy { get; set; }
    }
}
