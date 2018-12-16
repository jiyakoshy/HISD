namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.AssessmentTermType")]
    public partial class AssessmentTermType
    {
        [Key]
        [StringLength(100)]
        public string AssessmentTermTypeNaturalKey { get; set; }

        [StringLength(200)]
        public string AssessmentTermTypeDescription { get; set; }
    }
}
