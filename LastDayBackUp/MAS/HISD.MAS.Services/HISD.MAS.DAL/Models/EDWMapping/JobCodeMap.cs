using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class JobCodeMap : EntityTypeConfiguration<JobCode>
    {
        public JobCodeMap()
        {
            // Primary Key
            this.HasKey(t => t.JobCodeNaturalKey);

            // Properties
            this.Property(t => t.JobCodeno)
                .IsRequired()
                .HasMaxLength(10);

            this.Property(t => t.JobCodeDescription)
                .HasMaxLength(100);

            this.Property(t => t.JobCodeShortDescription)
                .HasMaxLength(20);

            this.Property(t => t.JobFamilyNaturalKey)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.JobFunctionNaturalKey)
                .HasMaxLength(100);

            // Table & Column Mappings
            this.ToTable("EXT.JobCode");
            this.Property(t => t.JobCodeNaturalKey).HasColumnName("JobCodeNaturalKey");
            this.Property(t => t.JobCodeno).HasColumnName("JobCode");
            this.Property(t => t.JobCodeDescription).HasColumnName("JobCodeDescription");
            this.Property(t => t.JobCodeShortDescription).HasColumnName("JobCodeShortDescription");
            this.Property(t => t.JobFamilyNaturalKey).HasColumnName("JobFamilyNaturalKey");
            this.Property(t => t.JobFunctionNaturalKey).HasColumnName("JobFunctionNaturalKey");
            
        }

        
    }
}
