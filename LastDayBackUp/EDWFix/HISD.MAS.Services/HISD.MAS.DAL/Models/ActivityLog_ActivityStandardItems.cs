using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityLog_ActivityStandardItems
    {
        [Key]
        public int ActivityLogActivityStandardItemID { get; set; }
        public int ActivityLogID { get; set; }
        //[ForeignKey("ActivityStandardItems")]
        public int ActivityStandardItemID { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdatedBy { get; set; }

        // relation 
        public virtual ActivityLog ActivityLog { get; set; }
        
    }
}
