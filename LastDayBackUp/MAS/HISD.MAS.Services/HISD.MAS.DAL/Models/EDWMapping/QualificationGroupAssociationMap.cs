using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class QualificationGroupAssociationMap : EntityTypeConfiguration<QualificationGroupAssociation>
    {
        public QualificationGroupAssociationMap()
        {
            // Primary Key
            this.HasKey(t => t.QualificationGroupAssociationNaturalKey);

            // Properties
            this.Property(t => t.QualificationGroupTypeNaturalKey)
                .IsRequired()
                .HasMaxLength(100);

            this.Property(t => t.QualificationTypeNaturalKey)
                .HasMaxLength(100);

            // Table & Column Mappings
            this.ToTable("EXT.QualificationGroupAssociation");
            this.Property(t => t.QualificationGroupAssociationNaturalKey).HasColumnName("QualificationGroupAssociationNaturalKey");
            this.Property(t => t.QualificationGroupTypeNaturalKey).HasColumnName("QualificationGroupTypeNaturalKey");
            this.Property(t => t.QualificationTypeNaturalKey).HasColumnName("QualificationTypeNaturalKey");
            this.Property(t => t.BeginDate).HasColumnName("BeginDate");
            this.Property(t => t.EndDate).HasColumnName("EndDate");

        }


    }
}
