using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class EmployeeStatusTypeMap : EntityTypeConfiguration<EmployeeStatusType>
    {
        public EmployeeStatusTypeMap()
        {
            // Primary Key
            this.HasKey(t => t.EmployeeStatusTypeNaturalKey);

            // Properties
            this.Property(t => t.EmployeeStatusTypeCode)
                .IsRequired()
                .HasMaxLength(50);

            this.Property(t => t.EmployeeStatusTypeDescription)
                .HasMaxLength(100);

            // Table & Column Mappings
            this.ToTable("EXT.EmployeeStatusType");
            this.Property(t => t.EmployeeStatusTypeNaturalKey).HasColumnName("EmployeeStatusTypeNaturalKey");
            this.Property(t => t.EmployeeStatusTypeCode).HasColumnName("EmployeeStatusTypeCode");
            this.Property(t => t.EmployeeStatusTypeDescription).HasColumnName("EmployeeStatusTypeDescription");
            
        }

        
    }
}
