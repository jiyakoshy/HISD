using System.Data.Entity.ModelConfiguration;

namespace Mshp.Service
{
    public class CampusEnrollmentMapper : EntityTypeConfiguration<CampusEnrollment> 
    {
        public CampusEnrollmentMapper()
        {
            // Primary Key
            this.HasKey(p => p.Id);

            // Table & Column Mappings
            this.ToTable("CampusEnrollment");
            this.Property(p => p.Id).HasColumnName("CampusEnrollmentID");
            this.Property(p => p.CampusProfileId).HasColumnName("CampusProfileID");
            this.Property(p => p.CalendarId).HasColumnName("CalendarID");

            this.Property(p => p.IEE).HasColumnName("IEE");
            this.Property(p => p.IPK).HasColumnName("IPK");
            this.Property(p => p.IKG).HasColumnName("IKG");
            this.Property(p => p.I01).HasColumnName("I01");
            this.Property(p => p.I02).HasColumnName("I02");
            this.Property(p => p.I03).HasColumnName("I03");
            this.Property(p => p.I04).HasColumnName("I04");
            this.Property(p => p.I05).HasColumnName("I05");
            this.Property(p => p.I06).HasColumnName("I06");
            this.Property(p => p.I07).HasColumnName("I07");
            this.Property(p => p.I08).HasColumnName("I08");
            this.Property(p => p.I09).HasColumnName("I09");
            this.Property(p => p.I10).HasColumnName("I10");
            this.Property(p => p.I11).HasColumnName("I11");
            this.Property(p => p.I12).HasColumnName("I12");
            this.Property(p => p.Total).HasColumnName("Total");
            this.Property(p => p.CreatedBy).HasColumnName("CreatedBy");
            this.Property(p => p.CreatedDate).HasColumnName("CreatedDate");
            this.Property(p => p.UpdatedBy).HasColumnName("UpdatedBy");
            this.Property(p => p.UpdatedDate).HasColumnName("UpdatedDate");

            // Relationships for one-to-many on CampusProfile and Calendar.
            this.HasRequired(e => e.CampusProfile)
                .WithMany(d => d.CampusEnrollments)
                .HasForeignKey(e => e.CampusProfileId);

            this.HasRequired(e => e.Calendar)
                .WithMany(d => d.CampusEnrollments)
                .HasForeignKey(e => e.CalendarId);

        }
    }
}

