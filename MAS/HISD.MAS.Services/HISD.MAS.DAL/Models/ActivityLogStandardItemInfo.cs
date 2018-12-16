using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityLogStandardItemInfo
    {
        [Key]
        public int ActivityLogActivityStandardItemID { get; set; }
        public int ActivityLogID { get; set; }
        public int ActivityStandardItemID { get; set; }
        public string ActivityStandardItemName { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdatedBy { get; set; }
    }
}
