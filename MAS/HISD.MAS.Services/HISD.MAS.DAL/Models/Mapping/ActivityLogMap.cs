using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class ActivityLogMap : EntityTypeConfiguration<ActivityLog>
    {
        public ActivityLogMap()
        {
            // Primary Key
            this.HasKey(t => t.ActivityLogID);
            
            // Properties
            this.Property(t => t.MentorEmployeeID)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.CreatedBy)
                .HasMaxLength(100);

            this.Property(t => t.UpdatedBy)
                .HasMaxLength(100);

           this.Property(t => t.ActivityCodeID)
                .IsRequired();

            this.Property(t => t.MentorComments);

            this.Property(t => t.TimeConfigurationID)
                .IsRequired();

            this.Property(t => t.CampusID)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.Duration)
                .IsRequired();
                

            // Table & Column Mappings
            this.ToTable("ActivityLogs");
            this.Property(t => t.ActivityLogID).HasColumnName("ActivityLogID");
            this.Property(t => t.MentorEmployeeID).HasColumnName("MentorEmployeeID");
            this.Property(t => t.ActivityCodeID).HasColumnName("ActivityCodeID");
            this.Property(t => t.ActivityStartTime).HasColumnName("ActivityStartTime");
            //this.Property(t => t.ActivityEndTime).HasColumnName("ActivityEndTime");
            this.Property(t => t.CreateDate).HasColumnName("CreateDate");
            this.Property(t => t.CreatedBy).HasColumnName("CreatedBy");
            this.Property(t => t.UpdateDate).HasColumnName("UpdateDate");
            this.Property(t => t.UpdatedBy).HasColumnName("UpdatedBy");
            this.Property(t => t.MentorComments).HasColumnName("MentorComments");
            this.Property(t => t.TimeConfigurationID).HasColumnName("TimeConfigurationID");
            this.Property(t => t.CampusID).HasColumnName("CampusID");
            this.Property(t => t.Duration).HasColumnName("Duration");

            // relation 
            
        }
    }
}
