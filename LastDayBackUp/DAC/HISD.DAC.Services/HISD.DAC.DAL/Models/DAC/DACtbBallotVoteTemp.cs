namespace HISD.DAC.DAL.Models.DAC
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("DACtbBallotVoteTemp")]
    public partial class DACtbBallotVoteTemp
    {
        [Key]
        [Column(Order = 0)]
        [StringLength(50)]
        public string EmployeeID { get; set; }

        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int VoteCast { get; set; }

        [Key]
        [Column(Order = 2)]
        public DateTime VoteCastTimestamp { get; set; }

        [Key]
        [Column(Order = 3)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int DACtbBallotID { get; set; }

        [Column(TypeName = "date")]
        public DateTime? StartDate { get; set; }

        public int? VoteSettingID { get; set; }
    }
}
