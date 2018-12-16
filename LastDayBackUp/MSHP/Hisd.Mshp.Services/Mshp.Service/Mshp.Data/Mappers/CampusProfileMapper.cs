using System.Data.Entity.ModelConfiguration;

namespace Mshp.Service
{
    public class CampusProfileMapper : EntityTypeConfiguration<CampusProfile> 
    {
        public CampusProfileMapper()
        {
            // Primary Key.
            this.HasKey(p => p.Id);

            // Table & Column Mappings
            this.ToTable("CampusProfile");
            this.Property(p => p.CalendarId).HasColumnName("CalendarID");
            this.Property(p => p.Id).HasColumnName("CampusProfileID");
            this.Property(p => p.OrganizationGroupId).HasColumnName("OrganizationGroupID");

            this.Property(p => p.CampusNumber).HasColumnName("CampusNumber");
            this.Property(p => p.Capacity).HasColumnName("Capacity");
            this.Property(p => p.Projection).HasColumnName("Projection");
            this.Property(p => p.Snapshot).HasColumnName("Snapshot");
            this.Property(p => p.CreatedBy).HasColumnName("CreatedBy");
            this.Property(p => p.CreatedDate).HasColumnName("CreatedDate");
            this.Property(p => p.UpdatedBy).HasColumnName("UpdatedBy");
            this.Property(p => p.UpdatedDate).HasColumnName("UpdatedDate");

            // Relationships for one-to-many on Group and Calendar.
            this.HasOptional(e => e.OrganizationGroup)
                .WithMany(d => d.CampusProfiles)
                .HasForeignKey(e => e.OrganizationGroupId);

            this.HasRequired(e => e.Calendar)
                .WithMany(d => d.CampusProfiles)
                .HasForeignKey(e => e.CalendarId);

        }
    }
}

