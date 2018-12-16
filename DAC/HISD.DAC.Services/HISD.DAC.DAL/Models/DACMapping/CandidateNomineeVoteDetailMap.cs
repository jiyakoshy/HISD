using System.Data.Entity.ModelConfiguration;
using HISD.DAC.DAL.Models.DAC;

namespace HISD.DAC.DAL.Models.DACMapping
{
    public class CandidateNomineeVoteDetailMap : EntityTypeConfiguration<CandidateNomineeVoteDetail>
    {
        public CandidateNomineeVoteDetailMap()
        {
            // Primary Key
            this.HasKey(t => t.CandidateNomineeVoteDetailID);

            // Properties
            this.Property(t => t.CandidateNomineeID)
                .IsRequired();
            this.Property(t => t.VoteCast)
               .IsRequired();
            this.Property(t => t.VoteCastTimestamp)
              .IsRequired();

            this.Property(t => t.CreatedBy)
               .HasMaxLength(50);
            this.Property(t => t.UpdatedBy)
               .HasMaxLength(50);

            // Table & Column Mappings
            this.ToTable("CandidateNomineeVoteDetail");
            this.Property(t => t.CandidateNomineeVoteDetailID).HasColumnName("CandidateNomineeVoteDetailID");
            this.Property(t => t.CandidateNomineeID).HasColumnName("CandidateNomineeID");
            this.Property(t => t.VoteCast).HasColumnName("VoteCast");
            this.Property(t => t.CreatedBy).HasColumnName("CreatedBy");
            this.Property(t => t.CreatedDate).HasColumnName("CreatedDate");
            this.Property(t => t.UpdatedBy).HasColumnName("UpdatedBy");
            this.Property(t => t.UpdatedDate).HasColumnName("UpdatedDate");
        }
    }
}
