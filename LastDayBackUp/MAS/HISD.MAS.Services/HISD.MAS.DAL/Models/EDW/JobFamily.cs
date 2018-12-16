using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class JobFamily
    {
        [Key]
        [StringLength(100)]
        public string JobFamilyNaturalKey { get; set; }

        [StringLength(10)]
        public string JobFamilyCode { get; set; }

        [StringLength(100)]
        public string JobFamilyDescription { get; set; }

        [StringLength(20)]
        public string JobFamilyShortDescription { get; set; }

        
    }
}
