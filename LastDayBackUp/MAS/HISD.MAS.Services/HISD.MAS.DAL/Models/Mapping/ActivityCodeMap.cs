using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class ActivityCodeMap : EntityTypeConfiguration<ActivityCode>
    {
        public ActivityCodeMap()
        {
            // Primary Key
            this.HasKey(t => t.ActivityCodeID);

            // Properties
            this.Property(t => t.ActivityCodeName)
                .IsRequired()
                .HasMaxLength(50);

            this.Property(t => t.ActivityCodeDescription)
                .HasMaxLength(255);

            
            // Table & Column Mappings
            this.ToTable("ActivityCodes");
            this.Property(t => t.ActivityCodeID).HasColumnName("ActivityCodeID");
            this.Property(t => t.ActivityCodeName).HasColumnName("ActivityCodeName");
            this.Property(t => t.ActivityCodeDescription).HasColumnName("ActivityCodeDescription");
            this.Property(t => t.Status).HasColumnName("Status");
            // relations 
            
        }
    }
}
