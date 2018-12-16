using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class CampusAdminSetupEmailHistory
    {
        [Key]
        public int SetupID { get; set; }
        public string CampusID { get; set; }
        public System.DateTime SetupDate { get; set; }
        public string EmailMessageContent { get; set; }
    }
}
