using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models
{
    public partial class CampusContact
    {
        [Key]
        public int CampusContactID { get; set; }
        public string CICEmployeeID { get; set; }
        public string CampusID { get; set; }
        public int TimeConfigurationID { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdatedBy { get; set; }


    }

    public partial class CampusContactArray
    {
        [Key]
        public int CampusContactArrayID { get; set; }
        public string ElectronicMailAddress { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string To { get; set; }

        public virtual ICollection<CampusContact> CampusContact { get; set; }
    }
}
