using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityStandardItem
    {
        [Key]
        public int ActivityStandardItemID { get; set; }
        public string ActivityStandardItemName { get; set; }
        [ForeignKey("ActivityStandardGroup")]
        public int ActivityStandardGroupID { get; set; }
        public Nullable<System.DateTime> EffectiveStartDate { get; set; }
        public Nullable<System.DateTime> EffectiveEndDate { get; set; }
        public Nullable<bool> Status { get; set; }

        // define the navigation property [Activity Items  --> Group: 1 to 1]
        public virtual ActivityStandardGroup ActivityStandardGroup { get; set; }
        //public virtual ActivityLog_ActivityStandardItems ActivityLog_ActivityStandardItem { get; set; } 
    }
}
