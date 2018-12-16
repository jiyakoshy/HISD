using System.Data.Entity.ModelConfiguration;

namespace Mshp.Service
{
    public class OrganizationGroupMapper : EntityTypeConfiguration<OrganizationGroup> 
    {
        public OrganizationGroupMapper()
        {
            // Primary Key
            this.HasKey(p => p.OrganizationGroupId);

            // Table & Column Mappings
            this.ToTable("OrganizationGroup");
            this.Property(p => p.OrganizationGroupId).HasColumnName("OrganizationGroupID");

            this.Property(p => p.CalendarId).HasColumnName("CalendarID");
            this.Property(p => p.SchoolYear).HasColumnName("SchoolYear");
            this.Property(p => p.ShortDescription).HasColumnName("ShortDescription");
            this.Property(p => p.Description).HasColumnName("Description");
            this.Property(p => p.IsOrganizationGroup).HasColumnName("IsOrganizationGroup");
            this.Property(p => p.DisplayOrder).HasColumnName("DisplayOrder");

            // Relationships for one-to-many on Calendar.
            this.HasRequired(e => e.Calendar)
                .WithMany(d => d.OrganizationGroups)
                .HasForeignKey(e => e.CalendarId);
        }
    }
}

