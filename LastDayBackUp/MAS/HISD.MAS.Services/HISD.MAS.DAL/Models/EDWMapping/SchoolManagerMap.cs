using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDWMapping
{
    public class SchoolManagerMap : EntityTypeConfiguration<SchoolManager>
    {
        public SchoolManagerMap()
        {
            // Primary Key
            this.HasKey(t => t.EducationOrgNaturalKey);

            // Properties
            this.Property(t => t.CILSchoolManagerStaffNaturalKey)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.ERPSchoolManagerStaffNaturalKey)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.Up1ManagerStaffNaturalKey)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.Up1EducationOrgNaturalKey)
                .HasMaxLength(100);

            this.Property(t => t.Up2ManagerStaffNaturalKey)
                .HasMaxLength(100);

            this.Property(t => t.Up2EducationOrgNaturalKey)
                .HasMaxLength(100);

            this.Property(t => t.BoardDistrictNaturalKey)
                .HasMaxLength(100);
            
            // Table & Column Mappings
            this.ToTable("EXT.SchoolManagers");
            this.Property(t => t.EducationOrgNaturalKey).HasColumnName("EducationOrgNaturalKey");
            this.Property(t => t.CILSchoolManagerStaffNaturalKey).HasColumnName("CILSchoolManagerStaffNaturalKey");
            this.Property(t => t.ERPSchoolManagerStaffNaturalKey).HasColumnName("ERPSchoolManagerStaffNaturalKey");
            this.Property(t => t.Up1ManagerStaffNaturalKey).HasColumnName("Up1ManagerStaffNaturalKey");
            this.Property(t => t.Up1EducationOrgNaturalKey).HasColumnName("Up1EducationOrgNaturalKey");
            this.Property(t => t.Up2ManagerStaffNaturalKey).HasColumnName("Up2ManagerStaffNaturalKey");
            this.Property(t => t.Up2EducationOrgNaturalKey).HasColumnName("Up2EducationOrgNaturalKey");
            this.Property(t => t.BoardDistrictNaturalKey).HasColumnName("BoardDistrictNaturalKey");
            
        }
    }
}
