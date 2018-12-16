using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
//using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using HISD.SWAV.DAL.Models.Mapping;
namespace HISD.SWAV.DAL.Models.SWAV
{
   

    public partial class SWAVContext : DbContext
    {
        static SWAVContext()
        {
            Database.SetInitializer<SWAVContext>(null);
        }
        public SWAVContext()
            : base("name=SWAVContext")
        {
        }

        /*public virtual DbSet<EmailMessage> EmailMessages { get; set; }
        public virtual DbSet<ReportType> ReportTypes { get; set; }
        public virtual DbSet<SchoolWaiver> SchoolWaivers { get; set; }
        public virtual DbSet<WaiverAdministration> WaiverAdministrations { get; set; }
        public virtual DbSet<Waiver> Waivers { get; set; }
        public virtual DbSet<WaiverSetting> WaiverSettings { get; set; }
        public virtual DbSet<WaiverType> WaiverTypes { get; set; }
        public virtual DbSet<WaiverStatu> WaiverStatus { get; set; }*/
        public DbSet<EmailMessage> EmailMessages { get; set; }
        public DbSet<ReportType> ReportTypes { get; set; }
        public DbSet<SchoolWaiver> SchoolWaivers { get; set; }
        public DbSet<WaiverAdministration> WaiverAdministrations { get; set; }
        public DbSet<WaiverRequestDetail> WaiverRequestDetails { get; set; }
        public DbSet<Waiver> Waivers { get; set; }
        public DbSet<WaiverSetting> WaiverSettings { get; set; }
        public DbSet<WaiverType> WaiverTypes { get; set; }
        public DbSet<WaiverStatus> WaiverStatus { get; set; }
        public DbSet<SchoolStatus> SchoolStatus { get; set; }
        public DbSet<SDMC> SDMC { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new WaiverMap());
            modelBuilder.Configurations.Add(new SchoolWaiverMap());
            modelBuilder.Configurations.Add(new WaiverAdministrationMap());
            modelBuilder.Configurations.Add(new WaiverRequestDetailMap());
            modelBuilder.Configurations.Add(new EmailMessageMap());
            modelBuilder.Configurations.Add(new ReportTypeMap());
            modelBuilder.Configurations.Add(new WaiverSettingMap());
            modelBuilder.Configurations.Add(new WaiverStatusMap());
            modelBuilder.Configurations.Add(new WaiverTypeMap());
            modelBuilder.Configurations.Add(new SchoolStatusMap());
            modelBuilder.Configurations.Add(new SDMCMap());
            /*modelBuilder.Entity<EmailMessage>()
                .Property(e => e.EmailMessageCode)
                .IsUnicode(false);

            modelBuilder.Entity<EmailMessage>()
                .Property(e => e.EmailMessageContent)
                .IsUnicode(false);

            modelBuilder.Entity<EmailMessage>()
                .Property(e => e.CreatedBy)
                .IsUnicode(false);

            modelBuilder.Entity<EmailMessage>()
                .Property(e => e.UpdatedBy)
                .IsUnicode(false);

            modelBuilder.Entity<ReportType>()
                .Property(e => e.CreatedBy)
                .IsUnicode(false);

            modelBuilder.Entity<ReportType>()
                .Property(e => e.UpdatedBy)
                .IsUnicode(false);

            modelBuilder.Entity<SchoolWaiver>()
                .Property(e => e.CreatedBy)
                .IsUnicode(false);

            modelBuilder.Entity<SchoolWaiver>()
                .Property(e => e.UpdatedBy)
                .IsUnicode(false);

            modelBuilder.Entity<WaiverAdministration>()
                .Property(e => e.CreatedBy)
                .IsUnicode(false);

            modelBuilder.Entity<WaiverAdministration>()
                .Property(e => e.UpdatedBy)
                .IsUnicode(false);

            modelBuilder.Entity<WaiverSetting>()
                .Property(e => e.CreatedBy)
                .IsUnicode(false);

            modelBuilder.Entity<WaiverSetting>()
                .Property(e => e.UpdatedBy)
                .IsUnicode(false);

            modelBuilder.Entity<WaiverType>()
                .Property(e => e.WaiverType1)
                .IsFixedLength();

            modelBuilder.Entity<WaiverType>()
                .Property(e => e.CreatedBy)
                .IsUnicode(false);

            modelBuilder.Entity<WaiverType>()
                .Property(e => e.UpdatedBy)
                .IsUnicode(false);*/
        }
    }
}
