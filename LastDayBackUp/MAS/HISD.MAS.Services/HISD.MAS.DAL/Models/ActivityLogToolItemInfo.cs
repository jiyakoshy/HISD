using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityLogToolItemInfo
    {
        [Key]
        public int ActivityLogActivityToolItemID { get; set; }
        public int ActivityLogID { get; set; }
        public int ActivityToolItemID { get; set; }
        public string ActivityToolItemName { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdatedBy { get; set; }
    }
}
