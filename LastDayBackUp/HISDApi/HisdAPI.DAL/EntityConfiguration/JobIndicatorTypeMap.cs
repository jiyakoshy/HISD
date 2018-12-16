using HisdAPI.Entities;
using System.Data.Entity.ModelConfiguration;
namespace HisdAPI.DAL.EntityConfiguration
{
    public class JobIndicatorTypeMap: EntityTypeConfiguration<JobIndicatorType>
    {
        public JobIndicatorTypeMap()
        {
            HasKey(jit => jit.JobIndicatorTypeNaturalKey);
            ToTable("EXT.JobIndicatorType");
        }
    }
}
