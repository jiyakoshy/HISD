using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class ErrorMessage
    {
        [Key]
        public int ErrorMessageID { get; set; }
        public string ErrorMessageCode { get; set; }
        public string ErrorMessageContent { get; set; }
    }
}
