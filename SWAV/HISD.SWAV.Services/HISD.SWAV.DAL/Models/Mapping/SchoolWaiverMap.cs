using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.SWAV.DAL.Models.SWAV;

namespace HISD.SWAV.DAL.Models.Mapping
{
    public class SchoolWaiverMap : EntityTypeConfiguration<SchoolWaiver>
    {
        public SchoolWaiverMap()
        {
            this.HasKey(t => t.SchoolWaiverID);

            this.ToTable("SchoolWaivers");
            this.Property(t => t.SchoolWaiverID).HasColumnName("SchoolWaiverID");
            this.Property(t => t.CampusNumber).HasColumnName("CampusNumber");
            this.Property(t => t.WaiverID).HasColumnName("WaiverID");
            this.Property(t => t.Elementary).HasColumnName("Elementary");
            this.Property(t => t.Middle).HasColumnName("Middle");
            this.Property(t => t.High).HasColumnName("High");
            this.Property(t => t.WaiverStatusID).HasColumnName("WaiverStatusID");
            this.Property(t => t.CustomApprovalStatus).HasColumnName("CustomApprovalStatus");
            this.Property(t => t.SchoolWaiverDeleted).HasColumnName("SchoolWaiverDeleted");
            this.Property(t => t.SchoolStartYear).HasColumnName("SchoolStartYear");
            this.Property(t => t.SchoolEndYear).HasColumnName("SchoolEndYear");
            this.Property(t => t.EmailMessageID).HasColumnName("EmailMessageID");
        }
    }
}
