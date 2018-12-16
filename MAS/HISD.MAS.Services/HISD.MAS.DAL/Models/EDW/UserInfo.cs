using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class UserInfo
    {
        [Key]
        [StringLength(100)]
        public string StaffNaturalKey { get; set; }

        [StringLength(10)]
        public string EmployeeNumber { get; set; }
        
        [Column(Order = 0)]
        [StringLength(75)]
        public string FirstName { get; set; }

       
        [Column(Order = 1)]
        [StringLength(75)]
        public string LastSurname { get; set; }

        [StringLength(75)]
        public string MiddleName { get; set; }

        [Key]
        [StringLength(60)]
        public string LoginId { get; set; }

        
        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }

        [StringLength(75)]
        public string NameOfInstitution { get; set; }



    }
}
