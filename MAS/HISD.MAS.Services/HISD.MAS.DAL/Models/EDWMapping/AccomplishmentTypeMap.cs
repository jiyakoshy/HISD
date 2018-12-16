using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class AccomplishmentTypeMap : EntityTypeConfiguration<AccomplishmentType>
    {
        public AccomplishmentTypeMap()
        {
            // Primary Key
            this.HasKey(t => t.AccomplishmentTypeNaturalKey);
            // Properties
            this.Property(t => t.AccomplishmentTypeNaturalKey)
                .HasMaxLength(100);
                
            this.Property(t => t.AccomplishmentTypeCode)
                .HasMaxLength(20);
            this.Property(t => t.AccomplishmentTypeDescription)
                .HasMaxLength(200);
            this.Property(t => t.AccomplishmentCategoryTypeNaturalKey)
                .HasMaxLength(100);
            
            // Table & Column Mappings
            this.ToTable("EXT.AccomplishmentType");
            this.Property(t => t.AccomplishmentTypeNaturalKey).HasColumnName("AccomplishmentTypeNaturalKey");
            this.Property(t => t.AccomplishmentTypeCode).HasColumnName("AccomplishmentTypeCode");
            this.Property(t => t.AccomplishmentTypeDescription).HasColumnName("AccomplishmentTypeDescription");
            this.Property(t => t.AccomplishmentCategoryTypeNaturalKey).HasColumnName("AccomplishmentCategoryTypeNaturalKey");
            
        }

        
    }
}
