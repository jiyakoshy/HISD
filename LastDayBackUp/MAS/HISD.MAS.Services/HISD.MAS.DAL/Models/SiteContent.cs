using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class SiteContent
    {
        [Key]
        public int SiteContentID { get; set; }
        public string SiteContentCode { get; set; }
        public string SiteContentDescription { get; set; }
    }
}
