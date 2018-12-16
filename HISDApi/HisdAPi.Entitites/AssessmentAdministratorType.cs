namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.AssessmentAdministratorType")]
    public partial class AssessmentAdministratorType
    {
        [Key]
        [StringLength(100)]
        public string AssessmentAdministratorTypeNaturalKey { get; set; }

        [Column("AssessmentAdministratorType")]
        [StringLength(200)]
        public string AssessmentAdministratorType1 { get; set; }
    }
}
