using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class ActivityStandardItemMap : EntityTypeConfiguration<ActivityStandardItem>
    {
        public ActivityStandardItemMap()
        {
            // Primary Key
            this.HasKey(t => t.ActivityStandardItemID);

            // Properties
            this.Property(t => t.ActivityStandardItemName)
                .IsRequired()
                .HasMaxLength(255);

            // Table & Column Mappings
            this.ToTable("ActivityStandardItems");
            this.Property(t => t.ActivityStandardItemID).HasColumnName("ActivityStandardItemID");
            this.Property(t => t.ActivityStandardItemName).HasColumnName("ActivityStandardItemName");
            this.Property(t => t.ActivityStandardGroupID).HasColumnName("ActivityStandardGroupID");
            this.Property(t => t.EffectiveStartDate).HasColumnName("EffectiveStartDate");
            this.Property(t => t.EffectiveEndDate).HasColumnName("EffectiveEndDate");
            this.Property(t => t.Status).HasColumnName("Status");

            // Relationships 
            this.HasRequired(ag => ag.ActivityStandardGroup)
                .WithMany(ag => ag.ActivityStandardItems)
                .HasForeignKey(d => d.ActivityStandardGroupID);
            
        }
    }
}
