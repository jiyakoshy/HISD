using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class QualificationGroupAssociation
    {
        [Key]
        [StringLength(100)]
        public string QualificationGroupAssociationNaturalKey { get; set; }

        [StringLength(100)]
        public string QualificationGroupTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string QualificationTypeNaturalKey { get; set; }

        public DateTime? BeginDate { get; set; }

        public DateTime? EndDate { get; set; }


    }
}
