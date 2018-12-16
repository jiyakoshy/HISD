using HisdAPI.Entities;
using System.Data.Entity.ModelConfiguration;

namespace HisdAPI.DAL.EntityConfiguration
{
    public class SchoolManagersMap: EntityTypeConfiguration<SchoolManagers>
    {
        public SchoolManagersMap()
        {
            HasKey(sm => sm.EducationOrgNaturalKey);

            HasRequired(sm => sm.CILSchoolManager)
                .WithMany(s => s.SchoolManagers)
                .HasForeignKey(p => p.ERPSchoolManagerStaffNaturalKey);

            HasRequired(sm => sm.Up1Manager)
                .WithMany(s => s.Up1Managers)
                .HasForeignKey(p => p.Up1ManagerStaffNaturalKey);

            HasRequired(sm => sm.Up2Manager)
                .WithMany(s => s.Up2Managers)
                .HasForeignKey(p => p.Up2ManagerStaffNaturalKey);

            ToTable("EXT.SchoolManagers");
        }
    }
}