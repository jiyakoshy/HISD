using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class StaffAccomplishmentMap : EntityTypeConfiguration<StaffAccomplishment>
    {
        public StaffAccomplishmentMap()
        {
            // Primary Key
            this.HasKey(t => t.StaffNaturalKey);
            // Properties
            this.Property(t => t.StaffNaturalKey)
                .HasMaxLength(100);
            this.Property(t => t.AccomplishmentTypeNaturalKey)
                 .HasMaxLength(100);
            this.Property(t => t.AccomplishmentCategoryTypeNaturalKey)
                .HasMaxLength(100);
            this.Property(t => t.BeginDate);
            this.Property(t => t.EndDate);
            this.Property(t => t.HighestLevelDegreeIndicator);
              
            // Table & Column Mappings
            this.ToTable("EXT.StaffAccomplishments");
            this.Property(t => t.StaffNaturalKey).HasColumnName("StaffNaturalKey");
            this.Property(t => t.AccomplishmentTypeNaturalKey).HasColumnName("AccomplishmentTypeNaturalKey");
            this.Property(t => t.BeginDate).HasColumnName("BeginDate");
            this.Property(t => t.EndDate).HasColumnName("EndDate");
            this.Property(t => t.HighestLevelDegreeIndicator).HasColumnName("HighestLevelDegreeIndicator");
            
        }

        
    }
}
