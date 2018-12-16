using HisdAPI.Entities;
using System.Data.Entity.ModelConfiguration;

namespace HisdAPI.DAL.EntityConfiguration
{
    public class EducationOrganizationMap: EntityTypeConfiguration<EducationOrganization>
    {
        public EducationOrganizationMap()
        {
            HasKey(eo => eo.EducationOrgNaturalKey);

            Property(eo => eo.OrganizationCode).HasMaxLength(10);
            Property(eo => eo.LocalOrganizationCode).HasMaxLength(10);
            Property(eo => eo.NameOfInstitution).HasMaxLength(75);
            Property(eo => eo.StateOrganizationId).HasMaxLength(60);
            Property(eo => eo.StreetNumberName).HasMaxLength(150);
            Property(eo => eo.ApartmentRoomSuiteNumber).HasMaxLength(20);
            Property(eo => eo.BuildingSiteNumber).HasMaxLength(20);
            Property(eo => eo.City).HasMaxLength(30);
            Property(eo => eo.NameOfCounty).HasMaxLength(30);
            Property(eo => eo.State).HasMaxLength(20);
            Property(eo => eo.TelephoneNumber).HasMaxLength(15);            

            ToTable("EXT.EducationOrganization");
        }
    }
}