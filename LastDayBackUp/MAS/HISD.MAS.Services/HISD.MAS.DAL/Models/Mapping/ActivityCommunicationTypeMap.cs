using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class ActivityCommunicationTypeMap : EntityTypeConfiguration<ActivityCommunicationType>
    {
        public ActivityCommunicationTypeMap()
        {
            // Primary Key
            this.HasKey(t => t.ActivityCommunicationTypeID);

            // Properties
            this.Property(t => t.ActivityCommunicationTypeName)
                .IsRequired()
                .HasMaxLength(100);

            // Table & Column Mappings
            this.ToTable("ActivityCommunicationTypes");
            this.Property(t => t.ActivityCommunicationTypeID).HasColumnName("ActivityCommunicationTypeID");
            this.Property(t => t.ActivityCommunicationTypeName).HasColumnName("ActivityCommunicationTypeName");
            this.Property(t => t.Status).HasColumnName("Status");
        }
    }
}
