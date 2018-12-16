using HisdAPI.Entities;
using System.Data.Entity.ModelConfiguration;


namespace HisdAPI.DAL.EntityConfiguration
{
    public class JobFamilyMap: EntityTypeConfiguration<JobFamily>
    {
        public JobFamilyMap()
        {
            HasKey(jf => jf.JobFamilyNaturalKey);
            ToTable("EXT.JobFamily");
        }
    }
}