namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.PersonalIdentificationType")]
    public partial class PersonalIdentificationType
    {
        [StringLength(100)]
        public string PersonalIdentificationTypeNaturalKey { get; set; }

        [Key]
        [Column(Order = 0)]
        [StringLength(35)]
        public string PersonalIdentificationTypeCode { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(200)]
        public string PersonalIdentificationTypeDescription { get; set; }
    }
}
