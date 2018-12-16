using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.SWAV.DAL.Models.SWAV;

namespace HISD.SWAV.DAL.Models.Mapping
{
    public class WaiverRequestDetailMap : EntityTypeConfiguration<WaiverRequestDetail>
    {
        public WaiverRequestDetailMap()
        {
            this.HasKey(t => t.WaiverRequestDetailID);

            this.ToTable("WaiverRequestDetails");
            this.Property(t => t.WaiverRequestDetailID).HasColumnName("WaiverRequestDetailID");
            this.Property(t => t.SourceOfData).HasColumnName("SourceOfData");
            this.Property(t => t.EvidenceOfCompliance).HasColumnName("EvidenceOfCompliance");
            this.Property(t => t.SchoolWaiverID).HasColumnName("SchoolWaiverID");
        }
    }
}
