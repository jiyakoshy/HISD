using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class UserInfoMap : EntityTypeConfiguration<UserInfo>
    {
        public UserInfoMap()
        {
            // Primary Key
            this.HasKey(t => t.StaffNaturalKey);

            // Properties
            this.Property(t => t.EmployeeNumber)
                .IsRequired()
                .HasMaxLength(10);

            this.Property(t => t.FirstName)
                .IsRequired()
                .HasMaxLength(75);

            this.Property(t => t.LastSurname)
                .IsRequired()
                .HasMaxLength(75);

            this.Property(t => t.FirstName)
                .IsRequired()
                .HasMaxLength(75);

            this.Property(t => t.LastSurname)
                .IsRequired()
                .HasMaxLength(75);

            this.Property(t => t.MiddleName)
                .HasMaxLength(75);

            this.Property(t => t.LoginId)
                .HasMaxLength(60);

            this.Property(t => t.EducationOrgNaturalKey)
                .HasMaxLength(100);
            
            this.Property(t => t.NameOfInstitution)
                .HasMaxLength(100);

            // Table & Column Mappings
            // Just runtime memory space
        }

        
    }
}
