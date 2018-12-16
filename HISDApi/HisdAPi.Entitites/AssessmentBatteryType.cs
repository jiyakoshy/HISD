namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.AssessmentBatteryType")]
    public partial class AssessmentBatteryType
    {
        [Key]
        [StringLength(100)]
        public string AssessmentBatteryTypeNaturalKey { get; set; }

        [StringLength(200)]
        public string AssessmentBatteryTypeTypeDescription { get; set; }
    }
}
