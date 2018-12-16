namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.AssessmentVersionType")]
    public partial class AssessmentVersionType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string AssessmentVersionTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(100)]
        public string AssessmentVersionTypeDescription { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(100)]
        public string AssessmentTypeNaturalKey { get; set; }
    }
}
