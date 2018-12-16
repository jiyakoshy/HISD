using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using HISD.SWAV.DAL.Models.SWAV;

namespace HISD.SWAV.DAL.Models.Mapping
{
    public class SDMCMap : EntityTypeConfiguration<SDMC>
    {
        public SDMCMap()
        {
            this.HasKey(t => t.SDMCID);


            this.ToTable("SDMC");
            this.Property(t => t.SDMCID).HasColumnName("SDMCID");
            this.Property(t => t.CampusNumber).HasColumnName("CampusNumber");
            this.Property(t => t.SDMCName).HasColumnName("SDMCName");
            this.Property(t => t.SDMCEmailAddress).HasColumnName("SDMCEmailAddress");
        }
    }
}
