using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.SWAV.DAL.Models.SWAV;

namespace HISD.SWAV.DAL.Models.Mapping
{
    public class SchoolStatusWaiversMap : EntityTypeConfiguration<SchoolSatusWaivers>
    {
        public SchoolStatusWaiversMap()
        {
            this.HasKey(t => t.SchoolWaiverID);

            this.ToTable("SchoolStatusWaivers");
            this.Property(t => t.SchoolWaiverID).HasColumnName("SchoolWaiverID");
            this.Property(t => t.CampusNumber).HasColumnName("CampusNumber");
            this.Property(t => t.WaiverID).HasColumnName("WaiverID");
            this.Property(t => t.WaiverName).HasColumnName("WaiverName");
            this.Property(t => t.WaiverDescription).HasColumnName("WaiverDescription");
            this.Property(t => t.WaiverStatusID).HasColumnName("WaiverStatusID");
            this.Property(t => t.WaiverTypeID).HasColumnName("WaiverTypeID");
            this.Property(t => t.WaiverType1).HasColumnName("WaiverType1");
            this.Property(t => t.CustomApprovalStatus).HasColumnName("CustomApprovalStatus");
            this.Property(t => t.SchoolWaiverDeleted).HasColumnName("SchoolWaiverDeleted");
            this.Property(t => t.SchoolStartYear).HasColumnName("SchoolStartYear");
            this.Property(t => t.SchoolEndYear).HasColumnName("SchoolEndYear");
            this.Property(t => t.EmailMessageID).HasColumnName("EmailMessageID");
        }

    }
}
