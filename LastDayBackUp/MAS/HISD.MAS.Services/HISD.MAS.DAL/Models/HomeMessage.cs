using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class HomeMessage
    {
        [Key]
        public int HomeMessageID { get; set; }
        public string HomeMessageRole { get; set; }
        public System.DateTime StartDate { get; set; }
        public System.DateTime EndDate { get; set; }
        public string HomeMessageContent { get; set; }
    }
}
