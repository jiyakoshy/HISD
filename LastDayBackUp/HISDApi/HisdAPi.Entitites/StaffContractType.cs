namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StaffContractType")]
    public partial class StaffContractType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string StaffContractTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(20)]
        public string StaffContractTypeCode { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(200)]
        public string StaffContractTypeDescription { get; set; }
    }
}
