namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.PopulationServedType")]
    public partial class PopulationServedType
    {
        [Key]
        [StringLength(100)]
        public string PopulationServedTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string CodeValue { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }
    }
}
