using HisdAPI.Entities;
using System.Data.Entity.ModelConfiguration;

namespace HisdAPI.DAL.EntityConfiguration
{
    public class StaffMap: EntityTypeConfiguration<Staff>
    {
        public StaffMap()
        {
            HasKey(s => s.StaffNaturalKey);

            ToTable("EXT.Staff");
        }
    }
}