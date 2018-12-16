using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class StaffElectronicEmailMap : EntityTypeConfiguration<StaffElectronicEmail>
    {
        public StaffElectronicEmailMap()
        {
            // Primary Key
            this.HasKey(t => t.StaffNaturalKey);

            // Properties
            this.Property(t => t.ElectronicMailTypeNaturalKey)
                .HasMaxLength(100);

            this.Property(t => t.ElectronicMailAddress)
                .HasMaxLength(60);

            // Table & Column Mappings
            this.ToTable("EXT.StaffElectronicEmail");
            this.Property(t => t.StaffNaturalKey).HasColumnName("StaffNaturalKey");
            this.Property(t => t.ElectronicMailTypeNaturalKey).HasColumnName("ElectronicMailTypeNaturalKey");
            this.Property(t => t.ElectronicMailAddress).HasColumnName("ElectronicMailAddress");


        }


    }
}
