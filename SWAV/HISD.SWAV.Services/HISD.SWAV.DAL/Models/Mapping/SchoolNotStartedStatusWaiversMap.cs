using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.SWAV.DAL.Models.SWAV;

namespace HISD.SWAV.DAL.Models.Mapping
{
    public class SchoolNotStartedStatusWaiversMap : EntityTypeConfiguration<SchoolNotStartedStatusWaivers>
    {
        public SchoolNotStartedStatusWaiversMap()
        {
            this.HasKey(t => t.WaiverAdministrationID);

            /*this.ToTable("WaiverAdministration");
            this.Property(t => t.WaiverAdministrationID).HasColumnName("WaiverAdministrationID");
            //this.Property(t => t.CampusNumber).HasColumnName("CampusNumber");
            this.Property(t => t.Elementary).HasColumnName("Elementary");
            this.Property(t => t.Middle).HasColumnName("Middle");
            this.Property(t => t.High).HasColumnName("High");
            this.Property(t => t.WaiverID).HasColumnName("WaiverID");
            //this.Property(t => t.WaiverStatusID).HasColumnName("WaiverStatusID");
            this.Property(t => t.WaiverName).HasColumnName("WaiverName");
            this.Property(t => t.WaiverDescription).HasColumnName("WaiverDescription");
            this.Property(t => t.WaiverType1).HasColumnName("WaiverType1");
            this.Property(t => t.SchoolStartYear).HasColumnName("SchoolStartYear");
            this.Property(t => t.SchoolEndYear).HasColumnName("SchoolEndYear");
            this.Property(t => t.Deleted).HasColumnName("Deleted");
            this.Property(t => t.ReportTypeID).HasColumnName("ReportTypeID");*/
        }
    }
}
