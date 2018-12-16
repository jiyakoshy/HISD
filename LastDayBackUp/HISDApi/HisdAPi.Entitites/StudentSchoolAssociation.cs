namespace HisdAPI.Entities
{
    using HisdAPI.Entities;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StudentSchoolAssociation")]
    public partial class StudentSchoolAssociation
    {
        [Key]
        [StringLength(100)]
        public string StudentSchoolAssociationNaturalKey { get; set; }

        [ForeignKey("Student")]
        [StringLength(100)]
        public string StudentNaturalKey { get; set; }

        //[ForeignKey("EducationOrganization")]
        [StringLength(100)]
        public string EducationOrgNaturalKey { get; set; }

        public DateTime EntryDate { get; set; }

        public DateTime ExitDate { get; set; }

        [StringLength(100)]
        public string EntryEnrollmentStatusTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string ExitEnrollmentStatusTypeNaturalKey { get; set; }
        public virtual Student Student { get; set; }
        //public virtual EducationOrganization GetEducationOrganization { get; set; }
    }
}
