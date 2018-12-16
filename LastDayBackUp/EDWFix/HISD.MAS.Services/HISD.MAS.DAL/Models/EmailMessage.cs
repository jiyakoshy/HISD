using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class EmailMessage
    {
        [Key]
        public int EmailMessageID { get; set; }
        public string EmailMessageCode { get; set; }
        public string EmailMessageContent { get; set; }
    }
}
