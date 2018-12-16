namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.Position")]
    public partial class Position
    {
        [Key]
        [StringLength(100)]
        public string PositionNumber { get; set; }

        [StringLength(10)]
        public string ReportsToPositionNumber { get; set; }
    }
}
