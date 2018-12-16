using System;
using System.Data.Entity;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using HISD.DAC.DAL.Models.DACMapping;

namespace HISD.DAC.DAL.Models.DAC
{
   

    public partial class DACContext : DbContext
    {

        static DACContext()
        {
            Database.SetInitializer<DACContext>(null);
        }
        public DACContext()
            : base("name=DACContext")
        {
        }

        public DbSet<CandidateNominee> CandidateNominees { get; set; }
        public DbSet<CandidateNomineeVoteSummary> CandidateNomineeVoteSummaries { get; set; }
        public DbSet<CandidateNomineeVoteDetail> CandidateNomineeVoteDetails { get; set; }
        public DbSet<CandidateType> CandidateTypes { get; set; }
        public DbSet<HomeMessage> HomeMessages { get; set; }
        public DbSet<JobCode> JobCodes { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<PayGradeLevel> PayGradeLevels { get; set; }
        public DbSet<SalaryPlanType> SalaryPlanTypes { get; set; }
        public DbSet<VotingSetting> VotingSettings { get; set; }
        //public virtual DbSet<VotingSettingTemp> VotingSettingTemps { get; set; }
        public DbSet<DACtbBallotTemp> DACtbBallotTemps { get; set; }
        //public virtual DbSet<DACtbBallotVoteTemp> DACtbBallotVoteTemps { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new CandidateNomineesMap());
            modelBuilder.Configurations.Add(new CandidateNomineesVoteSummaryMap());
            modelBuilder.Configurations.Add(new CandidateNomineeVoteDetailMap());
            modelBuilder.Configurations.Add(new CandidateTypeMap());
            modelBuilder.Configurations.Add(new DACtbBallotTempMap());
            //modelBuilder.Configurations.Add(new DACtbBallotVoteTempMap());
            modelBuilder.Configurations.Add(new HomeMessageMap());
            modelBuilder.Configurations.Add(new JobCodeMap());
            modelBuilder.Configurations.Add(new LocationMap());
            modelBuilder.Configurations.Add(new PayGradeLevelMap());
            modelBuilder.Configurations.Add(new SalaryPlanTypeMap());
            modelBuilder.Configurations.Add(new VotingSettingMap());

            //    modelBuilder.Entity<CandidateNomineesVoteSummary>()
            //    .Property(e => e.CreatedBy)
            //    .IsUnicode(false);

            //modelBuilder.Entity<CandidateNomineesVoteSummary>()
            //    .Property(e => e.UpdatedBy)
            //    .IsUnicode(false);

            //modelBuilder.Entity<CandidateNomineeVoteDetail>()
            //    .Property(e => e.CreatedBy)
            //    .IsUnicode(false);

            //modelBuilder.Entity<CandidateNomineeVoteDetail>()
            //    .Property(e => e.UpdatedBy)
            //    .IsUnicode(false);

            //modelBuilder.Entity<CandidateType>()
            //    .Property(e => e.Description)
            //    .IsUnicode(false);

            //modelBuilder.Entity<CandidateType>()
            //    .Property(e => e.CreatedBy)
            //    .IsUnicode(false);

            //modelBuilder.Entity<CandidateType>()
            //    .Property(e => e.UpdatedBy)
            //    .IsUnicode(false);

            //modelBuilder.Entity<HomeMessage>()
            //    .Property(e => e.HomeMessageContent)
            //    .IsUnicode(false);

            //modelBuilder.Entity<HomeMessage>()
            //    .Property(e => e.CreatedBy)
            //    .IsUnicode(false);

            //modelBuilder.Entity<HomeMessage>()
            //    .Property(e => e.UpdatedBy)
            //    .IsUnicode(false);

            //modelBuilder.Entity<JobCode>()
            //    .Property(e => e.JobCodeNaturalKey)
            //    .IsUnicode(false);

            //modelBuilder.Entity<JobCode>()
            //    .Property(e => e.JobCodeDescription)
            //    .IsUnicode(false);

            //modelBuilder.Entity<JobCode>()
            //    .Property(e => e.JobCodeShortDescription)
            //    .IsUnicode(false);

            //modelBuilder.Entity<JobCode>()
            //    .Property(e => e.JobFamilyNaturalKey)
            //    .IsUnicode(false);

            //modelBuilder.Entity<JobCode>()
            //    .Property(e => e.JobFunctionNaturalKey)
            //    .IsUnicode(false);

            //modelBuilder.Entity<JobCode>()
            //    .Property(e => e.UpdatedBy)
            //    .IsUnicode(false);

            //modelBuilder.Entity<Location>()
            //    .Property(e => e.CreatedBy)
            //    .IsUnicode(false);

            //modelBuilder.Entity<Location>()
            //    .Property(e => e.UpdatedBy)
            //    .IsUnicode(false);

            //modelBuilder.Entity<PayGradeLevel>()
            //    .Property(e => e.PayGradeLevelNaturalKey)
            //    .IsUnicode(false);

            //modelBuilder.Entity<PayGradeLevel>()
            //    .Property(e => e.UpdatedBy)
            //    .IsUnicode(false);

            //modelBuilder.Entity<SalaryPlanType>()
            //    .Property(e => e.SalaryPlanTypeNaturalKey)
            //    .IsUnicode(false);

            //modelBuilder.Entity<SalaryPlanType>()
            //    .Property(e => e.CreatedBy)
            //    .IsUnicode(false);

            //modelBuilder.Entity<SalaryPlanType>()
            //    .Property(e => e.UpdatedBy)
            //    .IsUnicode(false);

            //modelBuilder.Entity<SalaryPlanType>()
            //    .HasOptional(e => e.PayGradeLevel)
            //    .WithRequired(e => e.SalaryPlanType);

            //modelBuilder.Entity<VotingSetting>()
            //    .Property(e => e.SchoolYear)
            //    .IsUnicode(false);

            //modelBuilder.Entity<VotingSetting>()
            //    .Property(e => e.CreatedBy)
            //    .IsUnicode(false);

            //modelBuilder.Entity<VotingSetting>()
            //    .Property(e => e.UpdatedBy)
            //    .IsUnicode(false);

            //modelBuilder.Entity<VotingSettingTemp>()
            //    .Property(e => e.SchoolYear)
            //    .IsUnicode(false);

            //modelBuilder.Entity<DACtbBallotTemp>()
            //    .Property(e => e.SchoolYear)
            //    .IsUnicode(false);

            //modelBuilder.Entity<DACtbBallotVoteTemp>()
            //    .Property(e => e.EmployeeID)
            //    .IsUnicode(false);
        }
    }
}
