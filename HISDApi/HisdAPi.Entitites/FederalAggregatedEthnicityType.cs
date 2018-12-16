namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.FederalAggregatedEthnicityType")]
    public partial class FederalAggregatedEthnicityType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string FederalAggregatedEthnicityTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(200)]
        public string Description { get; set; }
    }
}
