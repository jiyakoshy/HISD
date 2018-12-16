using System.Data.Entity.ModelConfiguration;
using HISD.DAC.DAL.Models.DAC;


namespace HISD.DAC.DAL.Models.DACMapping
{
   public  class JobCodeMap : EntityTypeConfiguration<JobCode>
    {
        public JobCodeMap()
        {
            // Primary Key
            this.HasKey(t => t.JobCodeID);

            // Properties
            this.Property(t => t.JobCodeNaturalKey)
                .HasMaxLength(100);

          


            this.Property(t => t.JobFamilyNaturalKey)
              .HasMaxLength(100);

            this.Property(t => t.JobFunctionNaturalKey)
              .HasMaxLength(100);

            this.Property(t => t.CreatedBy)
               .HasMaxLength(50);

            this.Property(t => t.UpdatedBy)
               .HasMaxLength(50);

            // Table & Column Mappings
            this.ToTable("JobCodes");
            this.Property(t => t.JobCodeID).HasColumnName("JobCodeID");
            this.Property(t => t.JobCodeNaturalKey).HasColumnName("JobCodeNaturalKey");
            this.Property(t => t.JobFamilyNaturalKey).HasColumnName("JobFamilyNaturalKey");
            this.Property(t => t.JobFunctionNaturalKey).HasColumnName("JobFunctionNaturalKey");
            this.Property(t => t.CandidateTypeID).HasColumnName("CandidateTypeID");
            this.Property(t => t.CreatedBy).HasColumnName("CreatedBy");
            this.Property(t => t.CreatedDate).HasColumnName("CreatedDate");
            this.Property(t => t.UpdatedBy).HasColumnName("UpdatedBy");
            this.Property(t => t.UpdatedDate).HasColumnName("UpdatedDate");
        }
    }
}
