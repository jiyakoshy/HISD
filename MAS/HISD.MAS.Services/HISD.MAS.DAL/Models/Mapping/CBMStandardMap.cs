using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class CBMStandardMap : EntityTypeConfiguration<CBMStandard>
    {
        public CBMStandardMap()
        {
            // Primary Key
            this.HasKey(t => t.CBMStandardID);

            // Properties
            this.Property(t => t.NoOfLogs)
                .IsRequired();

            this.Property(t => t.Month)
                .IsRequired();

            this.Property(t => t.Year)
                .HasMaxLength(4)
                .IsRequired();

            this.Property(t => t.MonthOrder)
                .IsRequired();

            // Table & Column Mappings
            this.ToTable("CBMStandards");
            this.Property(t => t.CBMStandardID).HasColumnName("CBMStandardID");
            this.Property(t => t.NoOfLogs).HasColumnName("NoOfLogs");
            this.Property(t => t.Month).HasColumnName("Month");
            this.Property(t => t.Year).HasColumnName("Year");
            this.Property(t => t.MonthOrder).HasColumnName("MonthOrder");
            this.Property(t => t.NoOfDaysRemainingReminder).HasColumnName("NoOfDaysRemainingReminder");
        }
    }
}
