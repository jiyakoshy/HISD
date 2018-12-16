namespace HISD.DAC.DAL.Models.DAC
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class JobCode
    {
        [Key]
        public int JobCodeID { get; set; }
        public string JobCodeNaturalKey { get; set; }
        public string JobFamilyNaturalKey { get; set; }
        public string JobFunctionNaturalKey { get; set; }

        [ForeignKey("CandidateType")]
        public int? CandidateTypeID { get; set; }

        public virtual CandidateType CandidateType { get; set; }
        public string CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
