using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class MultiChoiceList
    {
        [Key]
        public int MultiChoiceListID { get; set; }
        public string MultiChoiceListCode { get; set; }
        public string MultiChoiceListDescription { get; set; }
        public Nullable<bool> Status { get; set; }

        public virtual ICollection<MultiChoiceListItem> MultiChoiceListItems { get; set; }
            
    }
}
