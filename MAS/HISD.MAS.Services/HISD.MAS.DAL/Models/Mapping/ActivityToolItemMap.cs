using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class ActivityToolItemMap : EntityTypeConfiguration<ActivityToolItem>
    {
        public ActivityToolItemMap()
        {
            // Primary Key
            this.HasKey(t => t.ActivityToolItemID);

            // Properties
            this.Property(t => t.ActivityToolItemName)
                .IsRequired()
                .HasMaxLength(255);

            // Table & Column Mappings
            this.ToTable("ActivityToolItems");
            this.Property(t => t.ActivityToolItemID).HasColumnName("ActivityToolItemID");
            this.Property(t => t.ActivityToolItemName).HasColumnName("ActivityToolItemName");
            this.Property(t => t.EffectiveStartDate).HasColumnName("EffectiveStartDate");
            this.Property(t => t.EffectiveEndDate).HasColumnName("EffectiveEndDate");
            this.Property(t => t.Status).HasColumnName("Status");
        }
    }
}
