namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.EmploymentActionReasonType")]
    public partial class EmploymentActionReasonType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string EmploymentActionReasonTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(200)]
        public string EmploymentActionReasonTypeDescription { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(20)]
        public string EmploymentActionReasonTypeCode { get; set; }
    }
}
