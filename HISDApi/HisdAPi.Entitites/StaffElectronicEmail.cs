namespace HisdAPI.Entities
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using HisdAPI.Entities;

    [Table("EXT.StaffElectronicEmail")]
    public class StaffElectronicEmail
    {
        [Key]
        [ForeignKey("Staff")]
        [MaxLength(100)]
        public string StaffNaturalKey { get; set; }

        [MaxLength(100)]
        public string ElectronicMailTypeNaturalKey { get; set; }

        [MaxLength(60)]
        public string ElectronicMailAddress { get; set; }
        public virtual Staff Staff { get; set; }
    }
}