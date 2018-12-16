using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class MentorMenteeRelationshipMap : EntityTypeConfiguration<MentorMenteeRelationship>
    {
        public MentorMenteeRelationshipMap()
        {
            // Primary Key
            this.HasKey(t => t.MentorMenteeRelationshipID);

            // Properties
            this.Property(t => t.MentorEmployeeID)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.MenteeEmployeeID)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.RelationshipStatus)
                .HasMaxLength(20);

            this.Property(t => t.PrincipalApproval)
                .HasMaxLength(20);

            this.Property(t => t.MentorAgreement)
                .HasMaxLength(20);

            this.Property(t => t.CampusID)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.TimeConfigurationID)
                .IsRequired();


            // Table & Column Mappings
            this.ToTable("MentorMenteeRelationships");
            this.Property(t => t.MentorMenteeRelationshipID).HasColumnName("MentorMenteeRelationshipID");
            this.Property(t => t.MentorEmployeeID).HasColumnName("MentorEmployeeID");
            this.Property(t => t.MenteeEmployeeID).HasColumnName("MenteeEmployeeID");
            this.Property(t => t.RelationshipStatus).HasColumnName("RelationshipStatus");
            this.Property(t => t.PrincipalApproval).HasColumnName("PrincipalApproval");
            this.Property(t => t.MentorAgreement).HasColumnName("MentorAgreement");
            this.Property(t => t.ApprovalDate).HasColumnName("ApprovalDate");
            this.Property(t => t.CampusID).HasColumnName("CampusID");
            this.Property(t => t.TimeConfigurationID).HasColumnName("TimeConfigurationID");
            this.Property(t => t.CreateDate).HasColumnName("CreateDate");
            this.Property(t => t.CreatedBy).HasColumnName("CreatedBy");
            this.Property(t => t.UpdateDate).HasColumnName("UpdateDate");
            this.Property(t => t.UpdatedBy).HasColumnName("UpdatedBy");
            this.Property(t => t.RelationshipStartDate).HasColumnName("RelationshipStartDate");
            this.Property(t => t.RelationshipEndDate).HasColumnName("RelationshipEndDate");
        }
    }
}
