namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StaffSupervisorType")]
    public partial class StaffSupervisorType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string StaffSupervisorTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(200)]
        public string StaffSupervisorTypeDescription { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(20)]
        public string StaffSupervisorTypeCode { get; set; }
    }
}
