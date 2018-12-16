using HisdAPI.Entities;
using System.Data.Entity.ModelConfiguration;

namespace HisdAPI.DAL.EntityConfiguration
{
    public class JobCodeMap: EntityTypeConfiguration<JobCodeEntity>
    {
        public JobCodeMap()
        {
            HasKey(jc => jc.JobCodeNaturalKey);

            ToTable("EXT.JobCode");
        }
    }
}