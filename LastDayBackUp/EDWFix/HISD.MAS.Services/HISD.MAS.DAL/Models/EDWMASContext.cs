using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using HISD.MAS.DAL.Models.Mapping;
using HISD.MAS.DAL.Models.EDWMapping;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models
{
    public partial class EDWMASContext : DbContext
    {
        static EDWMASContext()
        {
            Database.SetInitializer<EDWMASContext>(null);
        }

        public EDWMASContext()
            : base("Name=EDWMASContext")
        {
        }

        public DbSet<EducationOrganization> EducationOrganizations { get; set; } 
        public DbSet<EmployeeHISDStatusType> EmployeeHISDStatusTypes { get; set; }
        public DbSet<EmployeeStatusType> EmployeeStatusTypes { get; set; }
        public DbSet<JobCode> JobCodes { get; set; }
        public DbSet<JobFamily> JobFamilies { get; set; }
        public DbSet<JobFunction> JobFunctions { get; set; }
        public DbSet<QualificationGroupAssociation> QualificationGroupAssociations { get; set; }
        public DbSet<QualificationType> QualificationTypes { get; set; }
        public DbSet<SalaryPlanType> SalaryPlanTypes { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<StaffQualificationAssociation> StaffQualificationAssociations { get; set; }
        public DbSet<StaffElectronicEmail> StaffElectronicEmails { get; set; }
        public DbSet<StaffAccomplishment> StaffAccomplishments { get; set; }
        public DbSet<AccomplishmentType> AccomplishmentTypes { get; set; }
        public DbSet<MenteeEndDateInfo> EDWMenteeInfos { get; set; }
        public DbSet<MentorMenteeRelationshipInfo> EDWMentorMenteeRelationshipInfos {get; set;}
        public DbSet<CampusContactInfo> EDWCampusContactInfos { get; set; }
        public DbSet<UserInfo> UserInfos { get; set; }
        public DbSet<SchoolManager> SchoolManagers { get; set; }
        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new EducationOrganizationMap());
            modelBuilder.Configurations.Add(new EmployeeHISDStatusTypeMap());
            modelBuilder.Configurations.Add(new EmployeeStatusTypeMap());
            modelBuilder.Configurations.Add(new JobCodeMap());
            modelBuilder.Configurations.Add(new JobFamilyMap());
            modelBuilder.Configurations.Add(new JobFunctionMap());
            modelBuilder.Configurations.Add(new QualificationGroupAssociationMap());
            modelBuilder.Configurations.Add(new QualificationTypeMap());
            modelBuilder.Configurations.Add(new SalaryPlanTypeMap());
            modelBuilder.Configurations.Add(new StaffMap());
            modelBuilder.Configurations.Add(new StaffQualificationAssociationMap());
            modelBuilder.Configurations.Add(new StaffElectronicEmailMap());
            modelBuilder.Configurations.Add(new StaffAccomplishmentMap());
            modelBuilder.Configurations.Add(new AccomplishmentTypeMap());
            modelBuilder.Configurations.Add(new MenteeInfoMap());
            modelBuilder.Configurations.Add(new MentorMenteeRelationshipInfoMap());
            modelBuilder.Configurations.Add(new CampusContactInfoMap());
            modelBuilder.Configurations.Add(new UserInfoMap());
            modelBuilder.Configurations.Add(new SchoolManagerMap());
            
        }
    }
}
