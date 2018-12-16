using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class TimeConfiguration
    {
        [Key]
        public int TimeConfigurationID { get; set; }
        public System.DateTime LogStartDate { get; set; }
        public System.DateTime LogEndDate { get; set; }
        public System.DateTime SchoolStartDate { get; set; }
        public System.DateTime SchoolEndDate { get; set; }
        public string SchoolYear { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdatedBy { get; set; }

        public virtual ICollection<MentorMenteeRelationship> MentorMenteeRelationships { get; set; }
    }
}
