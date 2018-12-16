namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.OperationalStatusType")]
    public partial class OperationalStatusType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string OperationalStatusTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(50)]
        public string OperationalStatusCode { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(200)]
        public string OperationalStatusTypeDescription { get; set; }
    }
}
