using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDWMapping
{
    public class EducationOrganizationMap : EntityTypeConfiguration<EducationOrganization>
    {
        public EducationOrganizationMap()
        {
            // Primary Key
            this.HasKey(t => t.EducationOrgNaturalKey);

            // Properties
            this.Property(t => t.EducationOrgNaturalKey)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.OrganizationCode)
                .IsRequired()
                .HasMaxLength(10);

            this.Property(t => t.LocalOrganizationCode)
                .IsRequired()
                .HasMaxLength(10);

            this.Property(t => t.NameOfInstitution)
                .HasMaxLength(75);

            this.Property(t => t.StateOrganizationId)
                .HasMaxLength(60);

            this.Property(t => t.ShortNameOfInstitution)
                .HasMaxLength(60);

            this.Property(t => t.ManagerPositionNumber)
                .HasMaxLength(50);

            this.Property(t => t.StreetNumberName)
                .HasMaxLength(150);

            this.Property(t => t.BuildingSiteNumber)
                .HasMaxLength(20);
                
            this.Property(t => t.City)
                .HasMaxLength(20);

            this.Property(t => t.NameOfCounty)
                .HasMaxLength(20);

            this.Property(t => t.State)
                .HasMaxLength(20);

            this.Property(t => t.PostalCode)
                .HasMaxLength(20);

            this.Property(t => t.TelephoneNumber)
                .HasMaxLength(15);

            this.Property(t => t.FaxNumber)
                .HasMaxLength(15);

            this.Property(t => t.OperationalStatusNaturalKey)
                .HasMaxLength(100);

            this.Property(t => t.OrgGrpNaturalKey)
                .HasMaxLength(100);

            this.Property(t => t.ERPOrganizationCode)
                .HasMaxLength(10);
            
            // Table & Column Mappings
            this.ToTable("EXT.EducationOrganization");
            this.Property(t => t.EducationOrgNaturalKey).HasColumnName("EducationOrgNaturalKey");
            this.Property(t => t.OrganizationCode).HasColumnName("OrganizationCode");
            this.Property(t => t.LocalOrganizationCode).HasColumnName("LocalOrganizationCode");
            this.Property(t => t.NameOfInstitution).HasColumnName("NameOfInstitution");
            this.Property(t => t.StateOrganizationId).HasColumnName("StateOrganizationId");
            this.Property(t => t.ShortNameOfInstitution).HasColumnName("ShortNameOfInstitution");
            this.Property(t => t.ManagerPositionNumber).HasColumnName("ManagerPositionNumber");
            this.Property(t => t.StreetNumberName).HasColumnName("StreetNumberName");
            this.Property(t => t.ApartmentRoomSuiteNumber).HasColumnName("ApartmentRoomSuiteNumber");
            this.Property(t => t.BuildingSiteNumber).HasColumnName("BuildingSiteNumber");
            this.Property(t => t.City).HasColumnName("City");
            this.Property(t => t.NameOfCounty).HasColumnName("NameOfCounty");
            this.Property(t => t.State).HasColumnName("State");
            this.Property(t => t.PostalCode).HasColumnName("PostalCode");
            this.Property(t => t.TelephoneNumber).HasColumnName("TelephoneNumber");
            this.Property(t => t.FaxNumber).HasColumnName("FaxNumber");
            this.Property(t => t.OperationalStatusNaturalKey).HasColumnName("OperationalStatusNaturalKey");
            this.Property(t => t.OrgGrpNaturalKey).HasColumnName("OrgGrpNaturalKey");
            this.Property(t => t.ERPOrganizationCode).HasColumnName("ERPOrganizationCode");
        }
    }
}
