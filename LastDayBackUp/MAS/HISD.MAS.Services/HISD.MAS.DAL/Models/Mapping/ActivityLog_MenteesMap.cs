using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class ActivityLog_MenteesMap : EntityTypeConfiguration<ActivityLog_Mentees>
    {
        public ActivityLog_MenteesMap()
        {
            // Primary Key
            this.HasKey(t => t.ActivityLogMenteeID);

            // Properties
            this.Property(t => t.ActivityLogID)
                .IsRequired();

            this.Property(t => t.MenteeEmployeeID)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.MenteeVerificationStatus)
                .IsOptional()
                .HasMaxLength(20);

            this.Property(t => t.MultiChoiceListItemID)
                .IsOptional();
            this.Property(t => t.MentorMenteeRelationshipID);
            this.Property(t => t.MenteeComments);

            // Table & Column Mappings
            this.ToTable("ActivityLog_Mentees");
            this.Property(t => t.ActivityLogMenteeID).HasColumnName("ActivityLogMenteeID");
            this.Property(t => t.ActivityLogID).HasColumnName("ActivityLogID");
            this.Property(t => t.MenteeEmployeeID).HasColumnName("MenteeEmployeeID");
            this.Property(t => t.MenteeVerificationStatus).HasColumnName("MenteeVerificationStatus");
            this.Property(t => t.MultiChoiceListItemID).HasColumnName("MultiChoiceListItemID");
            this.Property(t => t.CreateDate).HasColumnName("CreateDate");
            this.Property(t => t.CreatedBy).HasColumnName("CreatedBy");
            this.Property(t => t.UpdateDate).HasColumnName("UpdateDate");
            this.Property(t => t.UpdatedBy).HasColumnName("UpdatedBy");
            this.Property(t => t.MentorMenteeRelationshipID).HasColumnName("MentorMenteeRelationshipID");
            this.Property(t => t.MenteeComments).HasColumnName("MenteeComments");

            // Relationships
            //this.HasRequired(t => t.ActivityLog)
            //.WithMany(t => t.ActivityLog_Mentees)
            //.HasForeignKey(d => d.ActivityLogID);

        }
    }
}
