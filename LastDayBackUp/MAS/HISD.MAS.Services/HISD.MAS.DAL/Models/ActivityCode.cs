using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityCode
    {
        [Key]
        public int ActivityCodeID { get; set; }
        public string ActivityCodeName { get; set; }
        public string ActivityCodeDescription { get; set; }
        public bool Status { get; set; }
        
    }
}
