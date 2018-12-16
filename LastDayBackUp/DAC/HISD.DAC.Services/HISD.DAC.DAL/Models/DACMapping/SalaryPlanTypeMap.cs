using System.Data.Entity.ModelConfiguration;
using HISD.DAC.DAL.Models.DAC;

namespace HISD.DAC.DAL.Models.DACMapping
{
    public class SalaryPlanTypeMap : EntityTypeConfiguration<SalaryPlanType>
    {
        public SalaryPlanTypeMap()
        {
            // Primary Key
            this.HasKey(t => t.SalaryPlanTypeID);

            // Properties
            this.Property(t => t.SalaryPlanTypeNaturalKey)
                .HasMaxLength(100);

            this.Property(t => t.CreatedBy)
               .HasMaxLength(50);

            this.Property(t => t.UpdatedBy)
               .HasMaxLength(50);

            // Table & Column Mappings
            this.ToTable("SalaryPlanType");
            this.Property(t => t.SalaryPlanTypeID).HasColumnName("SalaryPlanTypeID");
            this.Property(t => t.SalaryPlanTypeNaturalKey).HasColumnName("SalaryPlanTypeNaturalKey");
            this.Property(t => t.CandidateTypeID).HasColumnName("CandidateTypeID");
            this.Property(t => t.CreatedBy).HasColumnName("CreatedBy");
            this.Property(t => t.CreatedDate).HasColumnName("CreatedDate");
            this.Property(t => t.UpdatedBy).HasColumnName("UpdatedBy");
            this.Property(t => t.UpdatedDate).HasColumnName("UpdatedDate");
        }
    }
}
