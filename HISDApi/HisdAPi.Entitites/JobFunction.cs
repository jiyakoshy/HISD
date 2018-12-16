using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace HisdAPI.Entities
{
    [Table("EXT.JobFunction")]
    public class JobFunction
    {
        [Key]
        [MaxLength(100)]
        public string JobFunctionNaturalKey { get; set; }

        [MaxLength(10)]
        public string JobfunctionCode { get; set; }

        [MaxLength(100)]
        public string JobFunctionDescription { get; set; }

        [MaxLength(20)]
        public string JobFunctionShortDescription { get; set; }
    }
}