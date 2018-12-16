using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class StaffAccomplishment
    {
        [Key]
        [StringLength(100)]
        public string StaffNaturalKey { get; set; }

        [StringLength(100)]
        public string AccomplishmentTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string AccomplishmentCategoryTypeNaturalKey { get; set; }

        public System.DateTime BeginDate { get; set; }
        public System.DateTime EndDate { get; set; }
        public int HighestLevelDegreeIndicator { get; set; }
        public virtual Staff Staff { get; set; }
    
    }
}
