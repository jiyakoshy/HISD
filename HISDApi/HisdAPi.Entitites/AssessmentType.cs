namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.AssessmentType")]
    public partial class AssessmentType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string AssessmentTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(100)]
        public string AssessmentTypeDescription { get; set; }
    }
}
