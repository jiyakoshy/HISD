namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.AssessmentSubjectType")]
    public partial class AssessmentSubjectType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string AssessmentSubjectTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(100)]
        public string AssessmentSubjectTypeDescription { get; set; }

        [StringLength(2000)]
        public string AssessmentSubjectTypeAdditionalInfo { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(100)]
        public string AssessmentTypeNaturalKey { get; set; }
    }
}
