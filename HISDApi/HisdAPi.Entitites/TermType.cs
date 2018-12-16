namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.TermType")]
    public partial class TermType
    {
        [Key]
        [StringLength(100)]
        public string TermTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string CodeValue { get; set; }

        [StringLength(200)]
        public string Description { get; set; }

        public int? SortOrder { get; set; }

        [StringLength(100)]
        public string TermSpanTypeNaturalKey { get; set; }
    }
}
