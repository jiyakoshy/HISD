using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityLogMenteeInfoByTimeConfig
    {
        [Key]
        public int ActivityLogMenteeID { get; set; }
        public int ActivityLogID { get; set; }

        // campus
        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }

        //MENTEE Info
        public string StaffNaturalKey { get; set; }
        public String VerificationStatus { get; set; }
        public int VerficationCommentItemID { get; set; }
        public string VerificationCommentDescription { get; set; }
        public string VerificationCommentCode { get; set; }
        public string MenteeComments { get; set; }
        // time
        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdatedBy { get; set; }
    }
}
