using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class EmployeeHISDStatusTypeMap : EntityTypeConfiguration<EmployeeHISDStatusType>
    {
        public EmployeeHISDStatusTypeMap()
        {
            // Primary Key
            this.HasKey(t => t.EmployeeHISDStatusTypeNaturalKey);

            // Properties
            this.Property(t => t.EmployeeHISDStatusTypeCode)
                .IsRequired()
                .HasMaxLength(20);

            this.Property(t => t.EmployeeHISDStatusTypeDescription)
                .HasMaxLength(200);

            // Table & Column Mappings
            this.ToTable("EXT.EmployeeHISDStatusType");
            this.Property(t => t.EmployeeHISDStatusTypeNaturalKey).HasColumnName("EmployeeHISDStatusTypeNaturalKey");
            this.Property(t => t.EmployeeHISDStatusTypeCode).HasColumnName("EmployeeHISDStatusTypeCode");
            this.Property(t => t.EmployeeHISDStatusTypeDescription).HasColumnName("EmployeeHISDStatusTypeDescription");
            
        }

        
    }
}
