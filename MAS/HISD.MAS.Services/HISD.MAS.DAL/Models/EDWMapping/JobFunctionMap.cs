using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class JobFunctionMap : EntityTypeConfiguration<JobFunction>
    {
        public JobFunctionMap()
        {
            // Primary Key
            this.HasKey(t => t.JobFunctionNaturalKey);

            // Properties
            this.Property(t => t.JobfunctionCode)
                .IsRequired()
                .HasMaxLength(10);

            this.Property(t => t.JobFunctionDescription)
                .HasMaxLength(100);

            this.Property(t => t.JobFunctionShortDescription)
                .HasMaxLength(20);

            // Table & Column Mappings
            this.ToTable("EXT.JobFunction");
            this.Property(t => t.JobFunctionNaturalKey).HasColumnName("JobFunctionNaturalKey");
            this.Property(t => t.JobfunctionCode).HasColumnName("JobfunctionCode");
            this.Property(t => t.JobFunctionDescription).HasColumnName("JobFunctionDescription");
            this.Property(t => t.JobFunctionShortDescription).HasColumnName("JobFunctionShortDescription");
            
        }

        
    }
}
