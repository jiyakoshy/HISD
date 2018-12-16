using System.Data.Entity.ModelConfiguration;
using HISD.DAC.DAL.Models.DAC;

namespace HISD.DAC.DAL.Models.DACMapping
{
    public class CandidateNomineesVoteSummaryMap : EntityTypeConfiguration<CandidateNomineeVoteSummary>
    {
        public CandidateNomineesVoteSummaryMap()
        {
            // Primary Key
            this.HasKey(t => t.CandidateNomineeVoteSummaryID);

            // Properties
            this.Property(t => t.CandidateNomineeID)
                .IsRequired();
            this.Property(t => t.VoteCount)
               .IsRequired();
            this.Property(t => t.CreatedBy)
               .HasMaxLength(50);
            this.Property(t => t.UpdatedBy)
               .HasMaxLength(50);

            // Table & Column Mappings
            this.ToTable("CandidateNomineeVoteSummary");
            this.Property(t => t.CandidateNomineeVoteSummaryID).HasColumnName("CandidateNomineeVoteSummaryID");
            this.Property(t => t.CandidateNomineeID).HasColumnName("CandidateNomineeID");
            this.Property(t => t.VoteCount).HasColumnName("VoteCount");
            this.Property(t => t.CreatedBy).HasColumnName("CreatedBy");
            this.Property(t => t.CreatedDate).HasColumnName("CreatedDate");
            this.Property(t => t.UpdatedBy).HasColumnName("UpdatedBy");
            this.Property(t => t.UpdatedDate).HasColumnName("UpdatedDate");
        }
    }
}
