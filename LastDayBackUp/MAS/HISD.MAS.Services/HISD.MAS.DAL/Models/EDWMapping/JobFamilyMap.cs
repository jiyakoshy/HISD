using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class JobFamilyMap : EntityTypeConfiguration<JobFamily>
    {
        public JobFamilyMap()
        {
            // Primary Key
            this.HasKey(t => t.JobFamilyNaturalKey);

            // Properties
            this.Property(t => t.JobFamilyCode)
                .IsRequired()
                .HasMaxLength(10);

            this.Property(t => t.JobFamilyDescription)
                .HasMaxLength(100);

            this.Property(t => t.JobFamilyShortDescription)
                .HasMaxLength(20);

            
            // Table & Column Mappings
            this.ToTable("EXT.JobFamily");
            this.Property(t => t.JobFamilyNaturalKey).HasColumnName("JobFamilyNaturalKey");
            this.Property(t => t.JobFamilyCode).HasColumnName("JobFamilyCode");
            this.Property(t => t.JobFamilyDescription).HasColumnName("JobFamilyDescription");
            this.Property(t => t.JobFamilyShortDescription).HasColumnName("JobFamilyShortDescription");
            
        }

        
    }
}
