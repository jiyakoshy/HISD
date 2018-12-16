using System.Data.Entity.ModelConfiguration;
using HISD.DAC.DAL.Models.DAC;

namespace HISD.DAC.DAL.Models.DACMapping
{
    public class CandidateNomineesMap : EntityTypeConfiguration<CandidateNominee>
    {
        public CandidateNomineesMap()
        {

            // Primary Key
            this.HasKey(t => t.CandidateNomineeID);

            // Properties
            this.Property(t => t.EmployeeID)
                .IsRequired()
                .HasMaxLength(50);

            this.Property(t => t.CampusID)
                .IsRequired()
                .HasMaxLength(10);

            this.Property(t => t.CreatedBy)
                .HasMaxLength(50);

            this.Property(t => t.UpdatedBy)
               .HasMaxLength(50);

            // Table & Column Mappings
            this.ToTable("CandidateNominee");
            this.Property(t => t.CandidateNomineeID).HasColumnName("CandidateNomineeID");
            this.Property(t => t.EmployeeID).HasColumnName("EmployeeID");
            this.Property(t => t.CandidateTypeID).HasColumnName("CandidateTypeID");
            this.Property(t => t.DepartmentID).HasColumnName("DepartmentID");
            this.Property(t => t.LocationID).HasColumnName("LocationID");
            this.Property(t => t.CampusID).HasColumnName("CampusID");
            this.Property(t => t.VotingSettingID).HasColumnName("VotingSettingID");
            this.Property(t => t.CreatedBy).HasColumnName("CreatedBy");
            this.Property(t => t.CreatedDate).HasColumnName("CreatedDate");
            this.Property(t => t.UpdatedBy).HasColumnName("UpdatedBy");
            this.Property(t => t.UpdatedDate).HasColumnName("UpdatedDate");


        }
    }
}
