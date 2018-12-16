using System.Data.Entity.ModelConfiguration;
using HISD.DAC.DAL.Models.DAC;

namespace HISD.DAC.DAL.Models.DACMapping
{
    public class DACtbBallotTempMap : EntityTypeConfiguration<DACtbBallotTemp>
    {
        public DACtbBallotTempMap()
        {
            // Primary Key
            this.HasKey(t => t.DACtbBallotID);

            // Properties
            this.Property(t => t.VotingStartDate)
                .IsRequired();
            this.Property(t => t.VotingEndDate)
               .IsRequired();
            this.Property(t => t.BeginSchoolYear)
               .IsRequired();
            this.Property(t => t.EndSchoolYear)
               .IsRequired();
            this.Property(t => t.StartDate)
                .HasColumnType("Date");
            this.Property(t => t.EndDate)
              .HasColumnType("Date");
            this.Property(t => t.SchoolYear)
                .HasMaxLength(25)
              .IsRequired();


            // Table & Column Mappings
            this.ToTable("DACtbBallotTemp");
            this.Property(t => t.DACtbBallotID).HasColumnName("DACtbBallotID");
            this.Property(t => t.StartDate).HasColumnName("StartDate");
            this.Property(t => t.VotingStartDate).HasColumnName("VotingStartDate");
            this.Property(t => t.StartTime).HasColumnName("StartTime");
            this.Property(t => t.EndDate).HasColumnName("EndDate");
            this.Property(t => t.VotingEndDate).HasColumnName("VotingEndDate");
            this.Property(t => t.EndTime).HasColumnName("EndTime");
            this.Property(t => t.BeginSchoolYear).HasColumnName("BeginSchoolYear");
            this.Property(t => t.EndSchoolYear).HasColumnName("EndSchoolYear");
            this.Property(t => t.SchoolYear).HasColumnName("SchoolYear");
        }
    }
}
