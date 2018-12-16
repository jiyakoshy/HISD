using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class QualificationTypeMap : EntityTypeConfiguration<QualificationType>
    {
        public QualificationTypeMap()
        {
            // Primary Key
            this.HasKey(t => t.QualificationTypeNaturalKey);

            // Properties
            this.Property(t => t.CodeValue)
                .IsRequired()
                .HasMaxLength(20);

            this.Property(t => t.Description)
                .HasMaxLength(200);

            // Table & Column Mappings
            this.ToTable("EXT.QualificationType");
            this.Property(t => t.QualificationTypeNaturalKey).HasColumnName("QualificationTypeNaturalKey");
            this.Property(t => t.CodeValue).HasColumnName("CodeValue");
            this.Property(t => t.Description).HasColumnName("Description");
            
        }

        
    }
}
