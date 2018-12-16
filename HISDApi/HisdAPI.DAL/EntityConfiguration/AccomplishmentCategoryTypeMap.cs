using HisdAPI.Entities;
using System.Data.Entity.ModelConfiguration;

namespace HisdAPI.DAL.EntityConfiguration
{
    public class AccomplishmentCategoryTypeMap: EntityTypeConfiguration<AccomplishmentCategoryType>
    {
        public AccomplishmentCategoryTypeMap()
        {
            HasKey(act => act.AccomplishmentCategoryTypeNaturalKey);

            Property(act => act.AccomplishmentCategoryTypeCode).IsRequired().HasMaxLength(50);
            Property(act => act.AccomplishmentCategoryTypeDescription).IsRequired().HasMaxLength(100);

            ToTable("EXT.AccomplishmentCategoryType");
        }
    }
}