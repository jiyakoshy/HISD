namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.JobIndicatorType")]
    public partial class JobIndicatorType
    {
        [Key]        
        [StringLength(100)]
        public string JobIndicatorTypeNaturalKey { get; set; }
        
        [StringLength(50)]
        public string JobIndictorTypeCode { get; set; }
        
        [StringLength(100)]
        public string JobIndicatorTypeDescription { get; set; }
    }
}
