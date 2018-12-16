using System.Data.Entity.ModelConfiguration;
using HISD.DAC.DAL.Models.DAC;

namespace HISD.DAC.DAL.Models.DACMapping
{
    public class VotingSettingMap : EntityTypeConfiguration<VotingSetting>
    {
        public VotingSettingMap()
        {
            // Primary Key
            this.HasKey(t => t.VotingSettingID);

            // Properties
            this.Property(t => t.VotingStartDate)
                .IsRequired();

            this.Property(t => t.VotingStartTime)
               .IsRequired();

            this.Property(t => t.VotingEndDate)
                .IsRequired();

            this.Property(t => t.VotingEndTime)
               .IsRequired();

            this.Property(t => t.SchoolYear)
                .HasMaxLength(10)
               .IsRequired();

            this.Property(t => t.CreatedBy)
               .HasMaxLength(50);
            this.Property(t => t.UpdatedBy)
               .HasMaxLength(50);

            // Table & Column Mappings
            this.ToTable("VotingSetting");
            this.Property(t => t.VotingSettingID).HasColumnName("VotingSettingID");
            this.Property(t => t.VotingStartDate).HasColumnName("VotingStartDate");
            this.Property(t => t.VotingStartTime).HasColumnName("VotingStartTime");
            this.Property(t => t.VotingEndDate).HasColumnName("VotingEndDate");
            this.Property(t => t.VotingEndTime).HasColumnName("VotingEndTime");
            this.Property(t => t.CandidateNomineeSettingsStartDate).HasColumnName("CandidateNomineeSettingsStartDate");
            this.Property(t => t.CandidateNomineeSettingsStartTime).HasColumnName("CandidateNomineeSettingsStartTime");
            this.Property(t => t.CandidateNomineeSettingsEndDate).HasColumnName("CandidateNomineeSettingsEndDate");
            this.Property(t => t.CandidateNomineeSettingsEndTime).HasColumnName("CandidateNomineeSettingsEndTime");
            this.Property(t => t.ResultsAvailableStartDate).HasColumnName("ResultsAvailableStartDate");
            this.Property(t => t.ResultsAvailableStartTime).HasColumnName("ResultsAvailableStartTime");
            this.Property(t => t.IsActive).HasColumnName("IsActive");
            this.Property(t => t.SchoolYear).HasColumnName("SchoolYear");
            this.Property(t => t.CreatedBy).HasColumnName("CreatedBy");
            this.Property(t => t.CreatedDate).HasColumnName("CreatedDate");
            this.Property(t => t.UpdatedBy).HasColumnName("UpdatedBy");
            this.Property(t => t.UpdatedDate).HasColumnName("UpdatedDate");
        }
    }
}
