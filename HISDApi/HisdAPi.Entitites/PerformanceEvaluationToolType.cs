namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.PerformanceEvaluationToolType")]
    public partial class PerformanceEvaluationToolType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string PerformanceEvaluationToolTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(200)]
        public string PerformanceEvaluationToolTypeDescription { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(50)]
        public string PerformanceEvaluationToolTypeCode { get; set; }
    }
}
