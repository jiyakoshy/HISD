using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class ActivityStandardGroupMap : EntityTypeConfiguration<ActivityStandardGroup>
    {
        public ActivityStandardGroupMap()
        {
            // Primary Key
            this.HasKey(t => t.ActivityStandardGroupID);

            // Properties
            this.Property(t => t.ActivityStandardGroupName)
                .HasMaxLength(255);

            // Table & Column Mappings
            this.ToTable("ActivityStandardGroups");
            this.Property(t => t.ActivityStandardGroupID).HasColumnName("ActivityStandardGroupID");
            this.Property(t => t.ActivityStandardGroupName).HasColumnName("ActivityStandardGroupName");
            this.Property(t => t.Status).HasColumnName("Status");

            //Relationships 

        }
    }
}
