using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class CampusContactMap : EntityTypeConfiguration<CampusContact>
    {
        public CampusContactMap()
        {
            // Primary Key
            this.HasKey(t => t.CampusContactID);

            // Properties
            this.Property(t => t.CICEmployeeID)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.CampusID)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.TimeConfigurationID)
                .IsRequired();
            
            // Table & Column Mappings
            this.ToTable("CampusContacts");
            this.Property(t => t.CampusContactID).HasColumnName("CampusContactID");
            this.Property(t => t.CICEmployeeID).HasColumnName("CICEmployeeID");
            this.Property(t => t.CampusID).HasColumnName("CampusID");
            this.Property(t => t.TimeConfigurationID).HasColumnName("TimeConfigurationID");
            this.Property(t => t.CreateDate).HasColumnName("CreateDate");
            this.Property(t => t.CreatedBy).HasColumnName("CreatedBy");
            this.Property(t => t.UpdateDate).HasColumnName("UpdateDate");
            this.Property(t => t.UpdatedBy).HasColumnName("UpdatedBy");
        }
    }
}
