using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class SalaryPlanType
    {
        [Key]
        [StringLength(100)]
        public string SalaryPlanTypeNaturalKey { get; set; }

        [StringLength(50)]
        public string SalaryPlanCode { get; set; }

        [StringLength(100)]
        public string SalaryPlanTypeDescription { get; set; }
        
    }
}
