using System.Data.Entity.ModelConfiguration;
using HISD.DAC.DAL.Models.DAC;

namespace HISD.DAC.DAL.Models.DACMapping
{
   public class HomeMessageMap : EntityTypeConfiguration<HomeMessage>
    {
        public HomeMessageMap()
        {
            // Primary Key
            this.HasKey(t => t.HomeMessageID);

            // Properties
            

            // Table & Column Mappings
            this.ToTable("HomeMessage");
            this.Property(t => t.HomeMessageID).HasColumnName("HomeMessageID");
            this.Property(t => t.HomeMessageHeader).HasColumnName("HomeMessageHeader");
            this.Property(t => t.HomeMessageBody).HasColumnName("HomeMessageBody");
            this.Property(t => t.CreatedBy).HasColumnName("CreatedBy");
            this.Property(t => t.CreatedDate).HasColumnName("CreatedDate");
            this.Property(t => t.UpdatedBy).HasColumnName("UpdatedBy");
            this.Property(t => t.UpdatedDate).HasColumnName("UpdatedDate");
        }
    }
}
