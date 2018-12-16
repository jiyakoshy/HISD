using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class SiteContentMap : EntityTypeConfiguration<SiteContent>
    {
        public SiteContentMap()
        {
            // Primary Key
            this.HasKey(t => t.SiteContentID);

            // Properties
            //this.Property(t => t.SiteContentID)
                //.HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            this.Property(t => t.SiteContentCode)
                .HasMaxLength(200);

            this.Property(t => t.SiteContentDescription)
                .HasMaxLength(7000);

            // Table & Column Mappings
            this.ToTable("SiteContents");
            this.Property(t => t.SiteContentID).HasColumnName("SiteContentID");
            this.Property(t => t.SiteContentCode).HasColumnName("SiteContentCode");
            this.Property(t => t.SiteContentDescription).HasColumnName("SiteContentDescription");
            
        }
    }
}
