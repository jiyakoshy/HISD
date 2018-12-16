namespace HISD.DAC.DAL.Models.DAC
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class SalaryPlanType
    {
        [Key]
        public int SalaryPlanTypeID { get; set; }

       
        public string SalaryPlanTypeNaturalKey { get; set; }

        [ForeignKey("CandidateType")]
        public int? CandidateTypeID { get; set; }
        public virtual CandidateType CandidateType { get; set; }
        public string CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        //public virtual PayGradeLevel PayGradeLevel { get; set; }
    }
}
