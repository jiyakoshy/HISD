using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class QualificationType
    {
        [Key]
        [StringLength(100)]
        public string QualificationTypeNaturalKey { get; set; }

        [StringLength(20)]
        public string CodeValue { get; set; }

        [StringLength(200)]
        public string Description { get; set; }
        
    }
}
