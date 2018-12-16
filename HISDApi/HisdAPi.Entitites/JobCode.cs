using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace HisdAPI.Entities
{
    [Table("EXT.JobCode")]
    public class JobCodeEntity
    {
        [Key]
        [MaxLength(100)]
        public string JobCodeNaturalKey { get; set; }

        [MaxLength(10)]
        public string JobCode { get; set; }

        [MaxLength(100)]
        public string JobCodeDescription { get; set; }

        [MaxLength(20)]
        public string JobCodeShortDescription { get; set; }

        [MaxLength(100)]
        public string JobFamilyNaturalKey { get; set; }

        [MaxLength(100)]
        public string JobFunctionNaturalKey { get; set; }
    }
}