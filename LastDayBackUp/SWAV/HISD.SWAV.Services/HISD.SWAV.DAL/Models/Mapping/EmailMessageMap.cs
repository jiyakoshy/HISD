using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.SWAV.DAL.Models.SWAV;

namespace HISD.SWAV.DAL.Models.Mapping
{
    public class EmailMessageMap : EntityTypeConfiguration<EmailMessage>
    {
        public EmailMessageMap()
        {
            this.HasKey(t => t.EmailMessageID);

            this.ToTable("EmailMessage");
            this.Property(t => t.EmailMessageID).HasColumnName("EmailMessageID");
            this.Property(t => t.EmailMessageCode).HasColumnName("EmailMessageCode");
            this.Property(t => t.EmailMessageContent).HasColumnName("EmailMessageContent");
        }
    }
}
