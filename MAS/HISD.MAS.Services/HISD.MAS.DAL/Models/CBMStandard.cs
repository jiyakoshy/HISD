using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class CBMStandard
    {
        [Key]
        public int CBMStandardID { get; set; }
        public int NoOfLogs { get; set; }
        public int Month { get; set; }
        public string Year { get; set; }
        public int MonthOrder { get; set; }

        public int? NoOfDaysRemainingReminder { get; set; }
    }
}
