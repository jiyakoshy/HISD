namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.OrganizationalGroup")]
    public partial class OrganizationalGroup
    {
        [Key]
        [StringLength(100)]
        public string OrgGrpNaturalKey { get; set; }

        [StringLength(100)]
        public string OrgGrpDescription { get; set; }
    }
}
