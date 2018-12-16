using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class MultiChoiceListMap : EntityTypeConfiguration<MultiChoiceList>
    {
        public MultiChoiceListMap()
        {
            // Primary Key
            this.HasKey(t => t.MultiChoiceListID);

            // Properties
            //this.Property(t => t.SiteContentID)
                //.HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            this.Property(t => t.MultiChoiceListCode)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.MultiChoiceListDescription)
                .IsRequired()
                .HasMaxLength(255);

            this.Property(t => t.Status);


            // Table & Column Mappings
            this.ToTable("MultiChoiceLists");
            this.Property(t => t.MultiChoiceListID).HasColumnName("MultiChoiceListID");
            this.Property(t => t.MultiChoiceListCode).HasColumnName("MultiChoiceListCode");
            this.Property(t => t.MultiChoiceListDescription).HasColumnName("MultiChoiceListDescription");
            this.Property(t => t.Status).HasColumnName("Status");
            
        }
    }
}
