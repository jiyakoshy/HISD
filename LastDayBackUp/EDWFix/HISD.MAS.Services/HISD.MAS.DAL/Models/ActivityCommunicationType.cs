using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityCommunicationType
    {
        [Key]
        public int ActivityCommunicationTypeID { get; set; }
        public string ActivityCommunicationTypeName { get; set; }
        public Nullable<bool> Status { get; set; }
    }
}
