using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using HISD.MAS.DAL.Models.Mapping;

namespace HISD.MAS.DAL.Models
{
    public partial class MASContext : DbContext
    {
        static MASContext()
        {
            Database.SetInitializer<MASContext>(null);
        }

        public MASContext()
            : base("Name=MASContext")
        {
        }

        public DbSet<ActivityCode> ActivityCodes { get; set; }
        public DbSet<ActivityCommunicationType> ActivityCommunicationTypes { get; set; }
        public DbSet<ActivityLog_ActivityStandardItems> ActivityLog_ActivityStandardItems { get; set; }
        public DbSet<ActivityLog_ActivityToolItems> ActivityLog_ActivityToolItems { get; set; }
        public DbSet<ActivityLog_Mentees> ActivityLog_Mentees { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }
        public DbSet<ActivityLogInfo> ActivityLogInfos { get; set; }
        public DbSet<ActivityStandardGroup> ActivityStandardGroups { get; set; }
        public DbSet<ActivityStandardItem> ActivityStandardItems { get; set; }
        public DbSet<ActivityToolItem> ActivityToolItems { get; set; }

        //public DbSet<ActivityLogEntryEmailHistory> ActivityLogEntryEmailHistories { get; set; }
        public DbSet<CampusAdminSetupEmailHistory> CampusAdminSetupEmailHistories { get; set; }
        public DbSet<CampusContact> CampusContacts { get; set; }
        public DbSet<CBMStandard> CBMStandards { get; set; }
        public DbSet<EmailMessage> EmailMessages { get; set; }
        public DbSet<ErrorMessage> ErrorMessages { get; set; }
        public DbSet<HomeMessage> HomeMessages { get; set; }
        public DbSet<MentorMenteeRelationship> MentorMenteeRelationships { get; set; }
        //public DbSet<MentorMenteeSetupEmailHistory> MentorMenteeSetupEmailHistories { get; set; }
        public DbSet<sysdiagram> sysdiagrams { get; set; }
        public DbSet<TimeConfiguration> TimeConfigurations { get; set; }
        public DbSet<SiteContent> SiteContents { get; set; }
        public DbSet<MenteeEndDate> MenteeEndDates { get; set; }
        public DbSet<MentorMenteeRelationshipInfo> MentorMenteeRelationshipInfos { get; set; }
        public DbSet<MultiChoiceList> MultiChoiceLists { get; set; }
        public DbSet<MultiChoiceListItem> MultiChoiceListItems { get; set; }


        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new ActivityCodeMap());
            modelBuilder.Configurations.Add(new ActivityCommunicationTypeMap());
            modelBuilder.Configurations.Add(new ActivityLog_ActivityStandardItemsMap());
            modelBuilder.Configurations.Add(new ActivityLog_ActivityToolItemsMap());
            modelBuilder.Configurations.Add(new ActivityLog_MenteesMap());
            //modelBuilder.Configurations.Add(new ActivityLogEntryEmailHistoryMap());
            modelBuilder.Configurations.Add(new ActivityLogMap());
            modelBuilder.Configurations.Add(new ActivityStandardGroupMap());
            modelBuilder.Configurations.Add(new ActivityStandardItemMap());
            modelBuilder.Configurations.Add(new ActivityToolItemMap());
            //modelBuilder.Configurations.Add(new CampusAdminSetupEmailHistoryMap());
            modelBuilder.Configurations.Add(new CBMStandardMap());
            modelBuilder.Configurations.Add(new EmailMessageMap());
            modelBuilder.Configurations.Add(new ErrorMessageMap());
            modelBuilder.Configurations.Add(new HomeMessageMap());
            modelBuilder.Configurations.Add(new MentorMenteeRelationshipMap());
            //modelBuilder.Configurations.Add(new MentorMenteeSetupEmailHistoryMap());
            modelBuilder.Configurations.Add(new sysdiagramMap());
            modelBuilder.Configurations.Add(new TimeConfigurationMap());
            modelBuilder.Configurations.Add(new SiteContentMap());
            modelBuilder.Configurations.Add(new MenteeEndDateMap());
            modelBuilder.Configurations.Add(new MentorMenteeRelationshipInfoMap());
            modelBuilder.Configurations.Add(new MultiChoiceListMap());
            modelBuilder.Configurations.Add(new MultiValuedListItemMap());
        }
    }
}
