namespace HISD.DAC.DAL.Models.DAC
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class HomeMessage
    {
        [Key]
        public int HomeMessageID { get; set; }

        public string HomeMessageHeader { get; set; }

        public string HomeMessageBody { get; set; }

        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

       
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
