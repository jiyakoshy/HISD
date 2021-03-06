﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class StaffQualificationAssociation
    {
        [Key]
        [StringLength(100)]
        public string StaffQualificationNaturalKey { get; set; }

        [StringLength(100)]
        public string StaffNaturalKey { get; set; }

        [StringLength(100)]
        public string QualificationTypeNaturalKey { get; set; }

        public DateTime? BeginDate { get; set; }

        public DateTime? EndDate { get; set; } 
            
    }
}
