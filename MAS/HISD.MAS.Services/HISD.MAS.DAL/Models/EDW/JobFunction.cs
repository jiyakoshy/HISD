using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class JobFunction
    {
        [Key]
        [StringLength(100)]
        public string JobFunctionNaturalKey { get; set; }

        [StringLength(10)]
        public string JobfunctionCode { get; set; }

        [StringLength(100)]
        public string JobFunctionDescription { get; set; }

        [StringLength(100)]
        public string JobFunctionShortDescription { get; set; }

        
    }
}
