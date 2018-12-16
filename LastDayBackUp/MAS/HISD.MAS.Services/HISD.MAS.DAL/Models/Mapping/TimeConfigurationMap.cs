using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class TimeConfigurationMap : EntityTypeConfiguration<TimeConfiguration>
    {
        public TimeConfigurationMap()
        {
            // Primary Key
            this.HasKey(t => t.TimeConfigurationID);

            // Properties
            this.Property(t => t.SchoolYear)
                .IsRequired()
                .IsFixedLength()
                .HasMaxLength(20);

            // Table & Column Mappings
            this.ToTable("TimeConfigurations");
            this.Property(t => t.TimeConfigurationID).HasColumnName("TimeConfigurationID");
            this.Property(t => t.LogStartDate).HasColumnName("LogStartDate");
            this.Property(t => t.LogEndDate).HasColumnName("LogEndDate");
            this.Property(t => t.SchoolStartDate).HasColumnName("SchoolStartDate");
            this.Property(t => t.SchoolEndDate).HasColumnName("SchoolEndDate");
            this.Property(t => t.SchoolYear).HasColumnName("SchoolYear");
            this.Property(t => t.CreateDate).HasColumnName("CreateDate");
            this.Property(t => t.CreatedBy).HasColumnName("CreatedBy");
            this.Property(t => t.UpdateDate).HasColumnName("UpdateDate");
            this.Property(t => t.UpdatedBy).HasColumnName("UpdatedBy");
            //this.Property(t => t.RelationshipInactiveDate).HasColumnName("RelationshipInactiveDate");
        }
    }
}
