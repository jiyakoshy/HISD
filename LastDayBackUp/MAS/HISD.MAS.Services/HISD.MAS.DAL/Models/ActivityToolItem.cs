using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityToolItem
    {
        [Key]
        public int ActivityToolItemID { get; set; }
        public string ActivityToolItemName { get; set; }
        public Nullable<System.DateTime> EffectiveStartDate { get; set; }
        public Nullable<System.DateTime> EffectiveEndDate { get; set; }
        public Nullable<bool> Status { get; set; }
    }
}
