namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StaffProvisioning")]
    public partial class StaffProvisioning
    {
        [StringLength(10)]
        public string EID { get; set; }

        [StringLength(20)]
        public string SSN { get; set; }

        [StringLength(10)]
        public string Role { get; set; }

        [StringLength(20)]
        public string ID { get; set; }

        [Key]
        [Column(Order = 0)]
        [StringLength(1)]
        public string Prfx { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(75)]
        public string LastName { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(75)]
        public string FirstName { get; set; }

        [StringLength(1)]
        public string I { get; set; }

        [Key]
        [Column(Order = 3)]
        [StringLength(1)]
        public string Suffix { get; set; }

        [StringLength(100)]
        public string Dpt { get; set; }

        [StringLength(75)]
        public string DepartmentName { get; set; }

        [StringLength(100)]
        public string JobCodeDescription { get; set; }

        [StringLength(60)]
        public string EmailAddress { get; set; }

        [StringLength(20)]
        public string S { get; set; }

        [StringLength(20)]
        public string Status { get; set; }

        public DateTime? EffDate { get; set; }

        public DateTime? ActionDate { get; set; }

        [Key]
        [Column(Order = 4)]
        [StringLength(1)]
        public string Cert { get; set; }

        [Key]
        [Column(Order = 5)]
        [StringLength(1)]
        public string SS { get; set; }

        [StringLength(12)]
        public string TxUniqueId { get; set; }

        public DateTime? DOB { get; set; }
    }
}
