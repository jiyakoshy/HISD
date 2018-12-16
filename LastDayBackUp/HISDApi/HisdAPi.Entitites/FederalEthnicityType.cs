namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.FederalEthnicityType")]
    public partial class FederalEthnicityType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string FederalEthnicityTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(200)]
        public string Description { get; set; }
    }
}
