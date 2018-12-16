using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class MultiChoiceListItem
    {
        [Key]
        public int MultiChoiceListItemID { get; set; }
        public string MultiChoiceListItemCode { get; set; }
        public string MultiChoiceListItemDescription { get; set; }
        public int MultiChoiceListID { get; set; }
        public Nullable<bool> Status { get; set; }

        public virtual MultiChoiceList MultiChoiceLists { get; set; }
            
    }
}
