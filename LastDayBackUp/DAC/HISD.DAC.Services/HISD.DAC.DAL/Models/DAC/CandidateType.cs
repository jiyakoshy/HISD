namespace HISD.DAC.DAL.Models.DAC
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    
    public partial class CandidateType
    {
        [Key]
        public int CandidateTypeID { get; set; }

       
        public string Description { get; set; }

       
        public string CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

       
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public virtual ICollection<CandidateNominee> CandidateNominee { get; set; }
        public virtual ICollection<SalaryPlanType> SalaryPlanType { get; set; }
        public virtual ICollection<JobCode> JobCode { get; set; }
    }
}
