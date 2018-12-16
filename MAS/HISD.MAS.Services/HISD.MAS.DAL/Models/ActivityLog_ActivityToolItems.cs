using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityLog_ActivityToolItems
    {
        [Key]
        [Column(Order = 0)]
        public int ActivityLogActivityToolItemID { get; set; }
        [Column(Order = 1)]
        public int ActivityLogID { get; set; }
        public int ActivityToolItemID { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdatedBy { get; set; }

        //relation 
        public virtual ActivityLog ActivityLog { get; set; }
    }
}
