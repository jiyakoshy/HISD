using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class CampusContactInfoMap : EntityTypeConfiguration<CampusContactInfo>
    {
        public CampusContactInfoMap()
        {
            // Primary Key
            this.HasKey(t => t.CampusContactID);
            this.HasKey(t => t.StaffNaturalKey);

            // Properties
            this.Property(t => t.StaffNaturalKey)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.FirstName)
                .IsRequired()
                .HasMaxLength(75);

            this.Property(t => t.LastSurname)
                .IsRequired()
                .HasMaxLength(75);

            this.Property(t => t.MiddleName)
                .HasMaxLength(75);

            this.Property(t => t.ElectronicMailAddress)
                .HasMaxLength(60);

            this.Property(t => t.LoginId)
                .HasMaxLength(60);

            this.Property(t => t.JobCodeDescription)
                .HasMaxLength(200);

            this.Property(t => t.EducationOrgNaturalKey)
                .IsRequired()
                .HasMaxLength(100);
            
            this.Property(t => t.NameOfInstitution)
                .HasMaxLength(100);
            this.Property(t => t.TimeConfigurationID)
                .IsRequired();
            

            
            // Table & Column Mappings
            // Just runtime memory space
        }

        
    }
}
