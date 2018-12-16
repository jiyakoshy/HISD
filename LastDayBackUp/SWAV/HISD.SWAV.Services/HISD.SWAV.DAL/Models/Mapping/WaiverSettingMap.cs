using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.SWAV.DAL.Models.SWAV;

namespace HISD.SWAV.DAL.Models.Mapping
{
    public class WaiverSettingMap : EntityTypeConfiguration<WaiverSetting>
    {
        public WaiverSettingMap()
        {
            this.HasKey(t => t.WaiverSettingID);

            this.ToTable("WaiverSettings");
            this.Property(t => t.WaiverSettingID).HasColumnName("WaiverSettingID");
            this.Property(t => t.SchoolStartYear).HasColumnName("SchoolStartYear");
            this.Property(t => t.SchoolEndYear).HasColumnName("SchoolEndYear");
            this.Property(t => t.EnrollmentStartDate).HasColumnName("EnrollmentStartDate");
            this.Property(t => t.EnrollmentEndDate).HasColumnName("EnrollmentEndDate");
            this.Property(t => t.EnrollmentStartTime).HasColumnName("EnrollmentStartTime");
            this.Property(t => t.EnrollmentEndTime).HasColumnName("EnrollmentEndTime");
            this.Property(t => t.IsActive).HasColumnName("IsActive");
            this.Property(t => t.SchoolWaiverCopyStatus).HasColumnName("SchoolWaiverCopyStatus");
        }
    }
}
