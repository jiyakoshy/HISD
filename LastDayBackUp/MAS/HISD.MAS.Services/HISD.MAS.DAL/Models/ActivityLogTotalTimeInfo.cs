using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models
{
    public partial class ActivityLogTotalTimeInfo
    {
        [Key]
        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }
        [StringLength(75)]
        public string NameOfInstitution { get; set; }

        // CSO
        public string CSOEmployeeID { get; set; }
        public string CSOFirstName { get; set; }
        public string CSOLastSurname { get; set; }
        public string CSOMiddleName { get; set; }
        public string CSOLoginID { get; set; }
        public string CSOElectronicMailAddress { get; set; }
        public string CSOJobCodeDescription { get; set; }
        public Nullable<System.DateTime> CSOLatestHireDate { get; set; }
        
        
        //time
        public int TotalDuration { get; set; }
        
        
    }
}
