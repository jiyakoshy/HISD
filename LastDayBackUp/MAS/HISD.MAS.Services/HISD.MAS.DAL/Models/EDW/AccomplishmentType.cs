using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class AccomplishmentType
    {

        [Key]
        [StringLength(100)]
        public string AccomplishmentTypeNaturalKey { get; set; }
        [StringLength(20)]
        public string AccomplishmentTypeCode { get; set; }
        [StringLength(200)]
        public string AccomplishmentTypeDescription { get; set; }
        [StringLength(100)]
        public string AccomplishmentCategoryTypeNaturalKey { get; set; }
        
    }
}
