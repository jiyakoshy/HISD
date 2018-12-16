using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class SalaryPlanTypeMap : EntityTypeConfiguration<SalaryPlanType>
    {
        public SalaryPlanTypeMap()
        {
            // Primary Key
            this.HasKey(t => t.SalaryPlanTypeNaturalKey);

            // Properties
            this.Property(t => t.SalaryPlanCode)
                .IsRequired()
                .HasMaxLength(50);

            this.Property(t => t.SalaryPlanTypeDescription)
                .HasMaxLength(100);

            // Table & Column Mappings
            this.ToTable("EXT.SalaryPlanType");
            this.Property(t => t.SalaryPlanTypeNaturalKey).HasColumnName("SalaryPlanTypeNaturalKey");
            this.Property(t => t.SalaryPlanCode).HasColumnName("SalaryPlanCode");
            this.Property(t => t.SalaryPlanTypeDescription).HasColumnName("SalaryPlanTypeDescription");
            
        }

        
    }
}
