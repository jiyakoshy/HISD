using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class ErrorMessageMap : EntityTypeConfiguration<ErrorMessage>
    {
        public ErrorMessageMap()
        {
            // Primary Key
            this.HasKey(t => t.ErrorMessageID);

            // Properties
            this.Property(t => t.ErrorMessageCode)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.ErrorMessageContent)
                .IsRequired();

            // Table & Column Mappings
            this.ToTable("ErrorMessages");
            this.Property(t => t.ErrorMessageID).HasColumnName("ErrorMessageID");
            this.Property(t => t.ErrorMessageCode).HasColumnName("ErrorMessageCode");
            this.Property(t => t.ErrorMessageContent).HasColumnName("ErrorMessageContent");
        }
    }
}
