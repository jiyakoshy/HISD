using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class StaffQualificationAssociationMap : EntityTypeConfiguration<StaffQualificationAssociation>
    {
        public StaffQualificationAssociationMap()
        {
            // Primary Key
            this.HasKey(t => t.StaffQualificationNaturalKey);

            // Properties
            this.Property(t => t.StaffNaturalKey)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.QualificationTypeNaturalKey)
                .IsRequired()
                .HasMaxLength(100);

            // Table & Column Mappings
            this.ToTable("EXT.StaffQualificationAssociation");
            this.Property(t => t.StaffQualificationNaturalKey).HasColumnName("StaffQualificationNaturalKey");
            this.Property(t => t.StaffNaturalKey).HasColumnName("StaffNaturalKey");
            this.Property(t => t.QualificationTypeNaturalKey).HasColumnName("QualificationTypeNaturalKey");
            this.Property(t => t.BeginDate).HasColumnName("BeginDate");
            this.Property(t => t.EndDate).HasColumnName("EndDate");
            
        }

        
    }
}
