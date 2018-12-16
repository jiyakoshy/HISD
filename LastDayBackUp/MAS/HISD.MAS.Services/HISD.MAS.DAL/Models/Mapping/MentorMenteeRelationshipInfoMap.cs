using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.Mapping
{
    public partial class MentorMenteeRelationshipInfoMap : EntityTypeConfiguration<MentorMenteeRelationshipInfo>
    {
        public MentorMenteeRelationshipInfoMap()
        {
            // Primary Key
            this.HasKey(t => t.MentorMenteeRelationshipID);

            // Properties
            //MENTOR
            this.Property(t => t.MentorEmployeeID)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.MentorFirstName)
                .IsRequired()
                .HasMaxLength(75);

            this.Property(t => t.MentorLastSurname)
                .IsRequired()
                .HasMaxLength(75);

            this.Property(t => t.MentorMiddleName)
                .IsRequired()
                .HasMaxLength(75);

            this.Property(t => t.MentorElectronicMailAddress)
                .HasMaxLength(60);

            this.Property(t => t.MentorJobCodeDescription)
                .HasMaxLength(200);

            this.Property(t => t.MentorLatestHireDate);

            //MENTEE
            this.Property(t => t.MenteeEmployeeID)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.MenteeFirstName)
                .IsRequired()
                .HasMaxLength(75);

            this.Property(t => t.MenteeLastSurname)
                .IsRequired()
                .HasMaxLength(75);

            this.Property(t => t.MenteeMiddleName)
                .IsRequired()
                .HasMaxLength(75);

            this.Property(t => t.MenteeElectronicMailAddress)
                .HasMaxLength(60);

            this.Property(t => t.MenteeJobCodeDescription)
                .HasMaxLength(200);

            //this.Property(t => t.MenteeEndDate);

            // Education Organization
            this.Property(t => t.EducationOrgNaturalKey)
                .HasMaxLength(100);
            
            this.Property(t => t.NameOfInstitution)
                .HasMaxLength(100);
            
            this.Property(t => t.RelationshipStatus)
                .HasMaxLength(20);

            this.Property(t => t.PrincipalApproval)
                .HasMaxLength(20);

            this.Property(t => t.MentorAgreement)
                .HasMaxLength(20);

            this.Property(t => t.TimeConfigurationID)
                .IsRequired();
            this.Property(t => t.MenteeLatestHireDate);
            
            //HasKey(sm => sm.EducationOrgNaturalKey);

            
        // Table & Column Mappings
        // Just runtime memory space
    }


}
}
