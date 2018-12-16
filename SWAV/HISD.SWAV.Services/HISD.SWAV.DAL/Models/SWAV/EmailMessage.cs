namespace HISD.SWAV.DAL.Models.SWAV
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class EmailMessage
    {
        public int EmailMessageID { get; set; }

        [Required]
        [StringLength(100)]
        public string EmailMessageCode { get; set; }

        [Required]
        public string EmailMessageContent { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        [StringLength(50)]
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
