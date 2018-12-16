namespace HisdAPI.Entities
{
    using HisdAPI.Entities;
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StaffAccomplishments")]
    public partial class StaffAccomplishments
    {
        [Key]
        [ForeignKey("Staff")]
        [StringLength(100)]
        public string StaffNaturalKey { get; set; }

        //[Key]
        //[ForeignKey("AccomplishmentType")]
        [StringLength(100)]
        public string AccomplishmentTypeNaturalKey { get; set; }

        //[ForeignKey("AccomplishmentCategoryType")]
        [StringLength(100)]
        public string AccomplishmentCategoryTypeNaturalKey { get; set; }

        public DateTime? BeginDate { get; set; }

        public DateTime? EndDate { get; set; }

        public Int32 HighestLevelDegreeIndicator { get; set; }
        
        public virtual Staff Staff { get; set; }
        //public virtual ICollection<AccomplishmentType> AccomplishmentTypes { get; set; }
        //public virtual JobCodeEntity JobCode { get; set; }
        //public virtual JobFamily JobFamily { get; set; }
        //public virtual JobFunction JobFunction { get; set; }
        //public virtual EmployeeStatusType EmployeeStatusType { get; set; }
        //public virtual EmployeeHISDStatusType EmployeeHISDStatusType { get; set; }
        //public virtual StaffQualificationAssociation StaffQualificationAssociation { get; set; }
        //public virtual QualificationType QualificationType { get; set; }
        //public virtual QualificationGroupAssociation QualificationGroupAssociation { get; set; }
        //public virtual SalaryPlanType SalaryPlanType { get; set; }

    }
}
