using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class JobCode
    {
        [Key]
        [StringLength(100)]
        public string JobCodeNaturalKey { get; set; }

        [StringLength(10)]
        public string JobCodeno { get; set; }

        [StringLength(100)]
        public string JobCodeDescription { get; set; }

        [StringLength(20)]
        public string JobCodeShortDescription { get; set; }

        [StringLength(100)]
        public string JobFamilyNaturalKey { get; set; }

        [StringLength(100)]
        public string JobFunctionNaturalKey { get; set; }

        
    }
}
