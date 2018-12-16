using System.Data.Entity.ModelConfiguration;
using HISD.DAC.DAL.Models.DAC;

namespace HISD.DAC.DAL.Models.DACMapping
{
    public class CandidateTypeMap : EntityTypeConfiguration<CandidateType>
    {
        public CandidateTypeMap()
        {
            // Primary Key
            this.HasKey(t => t.CandidateTypeID);

            // Properties
            this.Property(t => t.Description)
                .HasMaxLength(50)
                .IsRequired();

            this.Property(t => t.CreatedBy)
               .HasMaxLength(50);
            this.Property(t => t.UpdatedBy)
               .HasMaxLength(50);

            // Table & Column Mappings
            this.ToTable("CandidateType");
            this.Property(t => t.CandidateTypeID).HasColumnName("CandidateTypeID");
            this.Property(t => t.Description).HasColumnName("Description");
            this.Property(t => t.CreatedBy).HasColumnName("CreatedBy");
            this.Property(t => t.CreatedDate).HasColumnName("CreatedDate");
            this.Property(t => t.UpdatedBy).HasColumnName("UpdatedBy");
            this.Property(t => t.UpdatedDate).HasColumnName("UpdatedDate");
        }
    }
}
