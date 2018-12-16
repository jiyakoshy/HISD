using HisdAPI.Entities;
using System.Data.Entity.ModelConfiguration;

namespace HisdAPI.DAL.EntityConfiguration
{ 
    public class JobFunctionMap : EntityTypeConfiguration<JobFunction>
    {
        public JobFunctionMap()
        {
            HasKey(jf => jf.JobFunctionNaturalKey);
            ToTable("EXT.JobFunction");
        }
    }
}