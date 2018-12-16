namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.AssessmentScoreCodeType")]
    public partial class AssessmentScoreCodeType
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string AssessmentScoreCodeTypeNaturalKey { get; set; }

        [StringLength(200)]
        public string AssessmentAdministratorType { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(100)]
        public string AssessmentTypeNaturalKey { get; set; }
    }
}
