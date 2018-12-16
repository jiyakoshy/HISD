namespace HISD.DAC.DAL.Models.DAC
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class PayGradeLevel
    {
        [Key]
        public int PayGradeLevelID { get; set; }
        public string PayGradeLevelNaturalKey { get; set; }

        public int? CandidateTypeID { get; set; }
        public string CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

       // public virtual SalaryPlanType SalaryPlanType { get; set; }
    }
}
