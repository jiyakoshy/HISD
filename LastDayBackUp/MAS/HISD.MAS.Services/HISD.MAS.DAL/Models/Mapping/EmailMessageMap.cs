using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class EmailMessageMap : EntityTypeConfiguration<EmailMessage>
    {
        public EmailMessageMap()
        {
            // Primary Key
            this.HasKey(t => t.EmailMessageID);

            // Properties
            this.Property(t => t.EmailMessageCode)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.EmailMessageContent)
                .IsRequired();

            // Table & Column Mappings
            this.ToTable("EmailMessages");
            this.Property(t => t.EmailMessageID).HasColumnName("EmailMessageID");
            this.Property(t => t.EmailMessageCode).HasColumnName("EmailMessageCode");
            this.Property(t => t.EmailMessageContent).HasColumnName("EmailMessageContent");
        }
    }
}
