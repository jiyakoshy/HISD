using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class StaffElectronicEmail
    {
        [Key]
        [ForeignKey("Staff")]
        [StringLength(100)]
        public string StaffNaturalKey { get; set; }

        [StringLength(100)]
        public string ElectronicMailTypeNaturalKey { get; set; }

        [StringLength(60)]
        public string ElectronicMailAddress { get; set; }

        public virtual Staff Staff { get; set; }
    
    }
}
