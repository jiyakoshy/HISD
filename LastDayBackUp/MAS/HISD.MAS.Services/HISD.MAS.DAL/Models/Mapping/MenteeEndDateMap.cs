using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace HISD.MAS.DAL.Models.Mapping
{
    public class MenteeEndDateMap : EntityTypeConfiguration<MenteeEndDate>
    {
        public MenteeEndDateMap()
        {
            // Primary Key
            this.HasKey(t => t.MenteeEndDateID);

            this.Property(t => t.MenteeEmployeeID)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.CampusID)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.MenteeEndDateTime);
                

            // Table & Column Mappings
            this.ToTable("MenteeEndDates");
            this.Property(t => t.MenteeEndDateID).HasColumnName("MenteeEndDateID");
            this.Property(t => t.MenteeEmployeeID).HasColumnName("MenteeEmployeeID");
            this.Property(t => t.CampusID).HasColumnName("CampusID");
            this.Property(t => t.MenteeEndDateTime).HasColumnName("MenteeEndDate");
            this.Property(t => t.CreateDate).HasColumnName("CreateDate");
            this.Property(t => t.CreatedBy).HasColumnName("CreatedBy");
            this.Property(t => t.UpdateDate).HasColumnName("UpdateDate");
            this.Property(t => t.UpdatedBy).HasColumnName("UpdatedBy");

        }
    }
}
