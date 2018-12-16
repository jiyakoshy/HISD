namespace HisdAPI.Entities
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("EXT.SchoolYearType")]
    public partial class SchoolYearType
    {
        [Key]        
        [StringLength(100)]
        public string SchoolYearTypeNaturalKey { get; set; }

        [StringLength(50)]
        public string Description { get; set; }

        [StringLength(10)]
        public string ShortDescription { get; set; }

        public DateTime? SchoolYearBeginDate { get; set; }

        public DateTime? SchoolYearEndDate { get; set; }
        
        public bool CurrentSchoolYear { get; set; }
    }
}
