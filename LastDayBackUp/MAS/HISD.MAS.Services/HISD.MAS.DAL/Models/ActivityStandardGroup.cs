using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityStandardGroup
    {
        [Key]
        public int ActivityStandardGroupID { get; set; }
        public string ActivityStandardGroupName { get; set; }
        public Nullable<bool> Status { get; set; }

        // define the navigation property [Activity Standard Group --> Group Items: 1 to many]
        public virtual ICollection<ActivityStandardItem> ActivityStandardItems { get; set; }

        
    }
}
