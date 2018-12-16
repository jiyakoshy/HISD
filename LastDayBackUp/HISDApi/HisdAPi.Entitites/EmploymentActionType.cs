namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.EmploymentActionType")]
    public partial class EmploymentActionType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string EmploymentActionTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(200)]
        public string EmploymentActionTypeDescription { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(20)]
        public string EmploymentActionCode { get; set; }
    }
}
