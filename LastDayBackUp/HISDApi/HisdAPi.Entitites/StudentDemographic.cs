namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StudentDemographics")]
    public partial class StudentDemographic
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(100)]
        public string StudentDemographicsNaturalKey { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(100)]
        public string StudentNaturalKey { get; set; }

        [StringLength(30)]
        public string CityOfBirth { get; set; }

        [StringLength(100)]
        public string StateOfBirth_StateAbbreviationTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string CountryOfBirth { get; set; }

        [StringLength(100)]
        public string FederalEthnicityTypeNaturalKey { get; set; }

        [StringLength(100)]
        public string FederalAggregatedEthnicityTypeNaturalKey { get; set; }

        public short? YearEntered9thGrade { get; set; }

        [StringLength(100)]
        public string CountryOfCitzenship { get; set; }

        [StringLength(100)]
        public string CitizenshipStatus { get; set; }

        [StringLength(100)]
        public string AdaEligibilityTypeNaturalKey { get; set; }

        public int? StudentActiveIndicator { get; set; }

        public int? OverageByYears { get; set; }

        public int? OverageIndicator { get; set; }
    }
}
