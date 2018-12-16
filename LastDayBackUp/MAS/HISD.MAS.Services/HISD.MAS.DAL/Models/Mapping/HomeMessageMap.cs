using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class HomeMessageMap : EntityTypeConfiguration<HomeMessage>
    {
        public HomeMessageMap()
        {
            // Primary Key
            this.HasKey(t => t.HomeMessageID);

            // Properties
            //this.Property(t => t.HomeMessageID)
                //.HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            this.Property(t => t.HomeMessageRole)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.HomeMessageContent)
                .IsRequired();

            // Table & Column Mappings
            this.ToTable("HomeMessages");
            this.Property(t => t.HomeMessageID).HasColumnName("HomeMessageID");
            this.Property(t => t.HomeMessageRole).HasColumnName("HomeMessageRole");
            this.Property(t => t.StartDate).HasColumnName("StartDate");
            this.Property(t => t.EndDate).HasColumnName("EndDate");
            this.Property(t => t.HomeMessageContent).HasColumnName("HomeMessageContent");
        }
    }
}
