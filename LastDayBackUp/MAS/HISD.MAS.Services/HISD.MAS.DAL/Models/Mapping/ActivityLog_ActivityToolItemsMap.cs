using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class ActivityLog_ActivityToolItemsMap : EntityTypeConfiguration<ActivityLog_ActivityToolItems>
    {
        public ActivityLog_ActivityToolItemsMap()
        {
            // Primary Key
            this.HasKey(t => t.ActivityLogActivityToolItemID);
            //this.HasKey(t => t.ActivityLogID);

           

            // Properties
            this.Property(t => t.ActivityLogID)
                .IsRequired();
            this.Property(t => t.ActivityToolItemID)
                .IsRequired();
            
            // Table & Column Mappings
            this.ToTable("ActivityLog_ActivityToolItems"); 
            this.Property(t => t.ActivityLogActivityToolItemID).HasColumnName("ActivityLogActivityToolItemID");
            this.Property(t => t.ActivityLogID).HasColumnName("ActivityLogID");
            this.Property(t => t.ActivityToolItemID).HasColumnName("ActivityToolItemID");
            this.Property(t => t.CreateDate).HasColumnName("CreateDate");
            this.Property(t => t.CreatedBy).HasColumnName("CreatedBy");
            this.Property(t => t.UpdateDate).HasColumnName("UpdateDate");
            this.Property(t => t.UpdatedBy).HasColumnName("UpdatedBy");

            // Relationships

        }
    }
}
