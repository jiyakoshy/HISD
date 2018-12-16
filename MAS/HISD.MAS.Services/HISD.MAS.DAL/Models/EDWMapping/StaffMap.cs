using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.EDW
{
    public partial class StaffMap:EntityTypeConfiguration<Staff>
    {
        public StaffMap()
        {
            // Primary Key
            this.HasKey(t => t.StaffNaturalKey);

            // Properties
            this.Property(t => t.EmployeeNumber)
                .IsRequired()
                .HasMaxLength(10);

            this.Property(t => t.ERPEmployeeNumber)
                .IsRequired()
                .HasMaxLength(10);

            this.Property(t => t.FirstName)
                .IsRequired()
                .HasMaxLength(75);

            this.Property(t => t.LastSurname)
                .IsRequired()
                .HasMaxLength(75);

            this.Property(t => t.MiddleName)
                .HasMaxLength(75);

            this.Property(t => t.MaidenName)
                .HasMaxLength(35);

            this.Property(t => t.LoginId)
                .HasMaxLength(60);

            this.Property(t => t.SexTypeNaturalKey)
                .HasMaxLength(100);

            this.Property(t => t.PositionNumber)
                .HasMaxLength(100);

            this.Property(t => t.PositionNaturalKey)
                .HasMaxLength(100);

            this.Property(t => t.JobCodeNaturalKey)
                .HasMaxLength(100);
            
            this.Property(t => t.JobFamilyNaturalKey)
                .HasMaxLength(100);

            this.Property(t => t.EducationOrgNaturalKey)
                .HasMaxLength(100);

            this.Property(t => t.SalaryPlanTypeNaturalKey)
                .HasMaxLength(100);

            this.Property(t => t.EmployeeStatusTypeNaturalKey)
                .HasMaxLength(100);

            this.Property(t => t.EmployeeHISDStatusTypeNaturalKey)
                .HasMaxLength(100);

            this.Property(t => t.JobIndicatorTypeNaturalKey)
                .HasMaxLength(100);

            this.Property(t => t.JobFunctionNaturalKey)
                .HasMaxLength(100);

            this.Property(t => t.TxUniqueID)
                .HasMaxLength(12);

            this.Property(t => t.StaffERPGroupTypeNaturalKey)
                .HasMaxLength(100);
            this.Property(t => t.StaffContractTypeNaturalKey)
                .HasMaxLength(100);

            // Table & Column Mappings
            this.ToTable("EXT.Staff");
            this.Property(t => t.StaffNaturalKey).HasColumnName("StaffNaturalKey");
            this.Property(t => t.EmployeeNumber).HasColumnName("EmployeeNumber");
            this.Property(t => t.ERPEmployeeNumber).HasColumnName("ERPEmployeeNumber");
            this.Property(t => t.FirstName).HasColumnName("FirstName");
            this.Property(t => t.LastSurname).HasColumnName("LastSurname");
            this.Property(t => t.MiddleName).HasColumnName("MiddleName");
            this.Property(t => t.MaidenName).HasColumnName("MaidenName");
            this.Property(t => t.LoginId).HasColumnName("LoginId");
            this.Property(t => t.SexTypeNaturalKey).HasColumnName("SexTypeNaturalKey");
            this.Property(t => t.PositionNumber).HasColumnName("PositionNumber");
            this.Property(t => t.PositionNaturalKey).HasColumnName("PositionNaturalKey");
            this.Property(t => t.JobCodeNaturalKey).HasColumnName("JobCodeNaturalKey");
            this.Property(t => t.ActionDate).HasColumnName("ActionDate");
            this.Property(t => t.JobFamilyNaturalKey).HasColumnName("JobFamilyNaturalKey");
            this.Property(t => t.EducationOrgNaturalKey).HasColumnName("EducationOrgNaturalKey");
            this.Property(t => t.FullTimeEquivalent).HasColumnName("FullTimeEquivalent");
            this.Property(t => t.SalaryPlanTypeNaturalKey).HasColumnName("SalaryPlanTypeNaturalKey");
            this.Property(t => t.EmployeeStatusTypeNaturalKey).HasColumnName("EmployeeStatusTypeNaturalKey");
            this.Property(t => t.EmployeeHISDStatusTypeNaturalKey).HasColumnName("EmployeeHISDStatusTypeNaturalKey");
            this.Property(t => t.StaffActiveIndicator).HasColumnName("StaffActiveIndicator");
            this.Property(t => t.JobIndicatorTypeNaturalKey).HasColumnName("JobIndicatorTypeNaturalKey");
            this.Property(t => t.JobFunctionNaturalKey).HasColumnName("JobFunctionNaturalKey");
            this.Property(t => t.TxUniqueID).HasColumnName("TxUniqueID");
            this.Property(t => t.StaffERPGroupTypeNaturalKey).HasColumnName("StaffERPGroupTypeNaturalKey");
            this.Property(t => t.StaffContractTypeNaturalKey).HasColumnName("StaffContractTypeNaturalKey");
            this.Property(t => t.LatestHireDate).HasColumnName("LatestHireDate");
            this.Property(t => t.TerminationDate).HasColumnName("TerminationDate");
           
        }

        
    }
}
