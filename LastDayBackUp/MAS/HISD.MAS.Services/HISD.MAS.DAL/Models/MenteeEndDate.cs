using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class MenteeEndDate
    {
        [Key]
        public int MenteeEndDateID { get; set; }
        public string MenteeEmployeeID { get; set; }
        public string CampusID { get; set; }
        public Nullable<System.DateTime> MenteeEndDateTime { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdatedBy { get; set; }


    }
}
