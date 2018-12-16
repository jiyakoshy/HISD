using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class EmployeeStatusType
    {
        [Key]
        [StringLength(100)]
        public string EmployeeStatusTypeNaturalKey { get; set; }

        [StringLength(50)]
        public string EmployeeStatusTypeCode { get; set; }

        [StringLength(100)]
        public string EmployeeStatusTypeDescription { get; set; }

        
    }
}
