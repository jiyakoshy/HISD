namespace HisdAPI.Entities
{
    using HisdAPI.Entities;
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public class StaffCertification
    {
        [Key]
        [ForeignKey("Staff")]
        [StringLength(100)]
        public string StaffNaturalKey { get; set; }

        [StringLength(100)]
        public string CertificationStatusIndicator { get; set; }

        [StringLength(100)]
        public string AccomplishmentTypeDescription { get; set; }
    }
}
