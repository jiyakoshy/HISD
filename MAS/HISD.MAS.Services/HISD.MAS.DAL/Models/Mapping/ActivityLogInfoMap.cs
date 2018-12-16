using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.MAS.DAL.Models.EDW;

namespace HISD.MAS.DAL.Models.Mapping
{
    public partial class ActivityLogInfoMap : EntityTypeConfiguration<ActivityLogInfo>
    {
        public ActivityLogInfoMap()
        {
            // Primary Key
            this.HasKey(t => t.ActivityLogID);

            
            
        // Table & Column Mappings
        // Just runtime memory space
    }


}
}
