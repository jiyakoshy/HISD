using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace HISD.DAC.DAL.Models.DAC
{


    
    public partial class CandidateNominee
    {
        [Key]
        public int CandidateNomineeID { get; set; }
        public string EmployeeID { get; set; }

        [ForeignKey("CandidateType")]
        public int? CandidateTypeID { get; set; }

        public virtual CandidateType CandidateType { get; set; }

        public int? DepartmentID { get; set; }

        [ForeignKey("Location")]
        public int? LocationID { get; set; }

        public virtual Location Location { get; set; }

        [ForeignKey("VotingSetting")]
        public int? VotingSettingID { get; set; }

        public virtual VotingSetting VotingSetting { get; set; }

        public string CampusID { get; set; }
        public string CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }
        public string UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }

    public class CandidateNomineeArray
    {
        [Key]
        public int CandidateNomineeArrayID { get; set; }

        public ICollection<CandidateNominee> CandidateNominee { get; set; }

        public string Location { get; set; }

        public string CandidateType { get; set; }
    }



}
