using System.Data.Entity.ModelConfiguration;

namespace Mshp.Service
{
    public class CalendarMapper : EntityTypeConfiguration<Calendar> 
    {
        public CalendarMapper()
        {
            // Primary Key
            this.HasKey(p => p.CalendarId);

            // Table & Column Mappings
            this.ToTable("Calendar");
            this.Property(p => p.CalendarId).HasColumnName("CalendarID");
            this.Property(p => p.SchoolYear).HasColumnName("SchoolYear");
            this.Property(p => p.CompareDaySeq).HasColumnName("CompareDaySeq");
            this.Property(p => p.InstructionDay).HasColumnName("InstructionDay");
            this.Property(p => p.ReportDate).HasColumnName("ReportDate");
            this.Property(p => p.PlanNotes).HasColumnName("PlanNotes");
            this.Property(p => p.CreatedBy).HasColumnName("CreatedBy");
            this.Property(p => p.CreatedDate).HasColumnName("CreatedDate");
            this.Property(p => p.UpdatedBy).HasColumnName("UpdatedBy");
            this.Property(p => p.UpdatedDate).HasColumnName("UpdatedDate");

        }
    }
}

