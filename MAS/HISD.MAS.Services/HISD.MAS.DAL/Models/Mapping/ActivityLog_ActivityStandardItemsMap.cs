using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class ActivityLog_ActivityStandardItemsMap : EntityTypeConfiguration<ActivityLog_ActivityStandardItems>
    {
        public ActivityLog_ActivityStandardItemsMap()
        {
            // Primary Key
            this.HasKey(t => t.ActivityLogActivityStandardItemID);

            // Properties
            this.Property(t => t.ActivityLogID)
                .IsRequired();
            this.Property(t => t.ActivityStandardItemID)
                .IsRequired();

            // Table & Column Mappings
            this.ToTable("ActivityLog_ActivityStandardItems");
            this.Property(t => t.ActivityLogActivityStandardItemID).HasColumnName("ActivityLogActivityStandardItemID");
            this.Property(t => t.ActivityLogID).HasColumnName("ActivityLogID");
            this.Property(t => t.ActivityStandardItemID).HasColumnName("ActivityStandardItemID");
            this.Property(t => t.CreateDate).HasColumnName("CreateDate");
            this.Property(t => t.CreatedBy).HasColumnName("CreatedBy");
            this.Property(t => t.UpdateDate).HasColumnName("UpdateDate");
            this.Property(t => t.UpdatedBy).HasColumnName("UpdatedBy");


        }
    }
}
