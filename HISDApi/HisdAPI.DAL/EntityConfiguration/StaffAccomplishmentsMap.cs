using HisdAPI.Entities;
using System.Data.Entity.ModelConfiguration;

namespace HisdAPI.DAL.EntityConfiguration
{

    public class StaffAccomplishmentsMap : EntityTypeConfiguration<StaffAccomplishments>
    {
        public StaffAccomplishmentsMap()
        {
            HasKey(sm => sm.StaffNaturalKey);
            ToTable("EXT.StaffAccomplishments");
        }
    }
}
