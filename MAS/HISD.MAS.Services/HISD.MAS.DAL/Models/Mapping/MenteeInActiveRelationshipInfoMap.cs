using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.Mapping
{
    public partial class MenteeInActiveRelationshipInfoMap : EntityTypeConfiguration<MenteeInActiveRelationshipInfo>
    {
        public MenteeInActiveRelationshipInfoMap()
        {
            // Primary Key
            //this.HasKey(t => t.MenteeEndDateID);
            this.HasKey(t => t.StaffNaturalKey);

            // Properties
            //this.Property(t => t.MenteeEndDateID).IsRequired();

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

            this.Property(t => t.JobCodeDescription)
                .HasMaxLength(200);

            this.Property(t => t.EducationOrgNaturalKey)
                .HasMaxLength(100);
            
            this.Property(t => t.NameOfInstitution)
                .HasMaxLength(100);

            this.Property(t => t.CertificationStatus)
                .HasMaxLength(100);

            this.Property(t => t.ACP)
                .HasMaxLength(100);

            this.Property(t => t.ElectronicMailAddress)
                .HasMaxLength(60);

            this.Property(t => t.MenteeEndDate)
                .IsRequired();

            this.Property(t => t.MentorAgreement);

            this.Property(t => t.LatestHireDate);

            this.Property(t => t.TimeConfigurationID);
            

            // Table & Column Mappings
            // Just runtime memory space
        }

        
    }
}
