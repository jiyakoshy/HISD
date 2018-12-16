namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.ElectronicEMailType")]
    public partial class ElectronicEMailType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string ElectronicEMailTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(50)]
        public string ElectronicEmailTypeCode { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(100)]
        public string ElectronicEMailTypeDescription { get; set; }
    }
}
