namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StateAbbreviationType")]
    public partial class StateAbbreviationType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string StateAbbreviationTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(200)]
        public string Description { get; set; }
    }
}
