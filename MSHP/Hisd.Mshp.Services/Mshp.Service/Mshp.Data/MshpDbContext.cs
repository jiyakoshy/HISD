using System.Data.Entity;

namespace Mshp.Service
{
    public class MshpDbContext : DbContext
    {
        static MshpDbContext()
        {
            Database.SetInitializer<MshpDbContext>(null);
        }

        public MshpDbContext()
            : base("Name=MshpConnection")
        {
        }

        public DbSet<Calendar> CalendarSet { get; set; }
        public DbSet<CampusEnrollment> CampusEnrollmentSet { get; set; }
        public DbSet<CampusProfile> CampusProfileSet { get; set; }
        public DbSet<OrganizationGroup> OrganizationGroupSet { get; set; }



        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new CalendarMapper());
            modelBuilder.Configurations.Add(new CampusEnrollmentMapper());
            modelBuilder.Configurations.Add(new CampusProfileMapper());
            modelBuilder.Configurations.Add(new OrganizationGroupMapper());

        }

    }
}
