using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class MultiValuedListItemMap : EntityTypeConfiguration<MultiChoiceListItem>
    {
        public MultiValuedListItemMap()
        {
            // Primary Key
            this.HasKey(t => t.MultiChoiceListItemID);

            // Properties
            //this.Property(t => t.SiteContentID)
                //.HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            this.Property(t => t.MultiChoiceListItemCode)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.MultiChoiceListItemDescription)
                .IsRequired()
                .HasMaxLength(255);

            this.Property(t => t.MultiChoiceListID)
                .IsRequired();

            this.Property(t => t.Status);


            // Table & Column Mappings
            this.ToTable("MultiChoiceListItems");
            this.Property(t => t.MultiChoiceListItemID).HasColumnName("MultiChoiceListItemID");
            this.Property(t => t.MultiChoiceListItemCode).HasColumnName("MultiChoiceListItemCode");
            this.Property(t => t.MultiChoiceListItemDescription).HasColumnName("MultiChoiceListItemDescription");
            this.Property(t => t.MultiChoiceListID).HasColumnName("MultiChoiceListID");
            this.Property(t => t.Status).HasColumnName("Status");
            
        }
    }
}
