using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace HisdAPI.Entities
{
    [Table("EXT.JobFamily")]
    public class JobFamily
    {
        [Key]
        [MaxLength(100)]
        public string JobFamilyNaturalKey { get; set; }

        [MaxLength(10)]
        public string JobFamilyCode { get; set; }

        [MaxLength(10)]
        public string JobFamilyDescription { get; set; }

        [MaxLength(100)]
        public string JobFamilyShortDescription { get; set; }

    }
}