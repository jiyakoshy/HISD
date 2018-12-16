using System.Collections.Generic;

namespace Mshp.Service
{
    public class OrganizationGroup
    {
        public int Id { get; set; }
        public virtual int CalendarId { get; set; }
        public string SchoolYear { get; set; }
        public string ShortDescription { get; set; }
        public string Description { get; set; }
        public bool IsOrganizationGroup { get; set; }
        public int DisplayOrder { get; set; }
        public virtual Calendar Calendar { get; set; }
        public virtual ICollection<CampusProfile> CampusProfiles { get; set; }

        public OrganizationGroup()
        {
            CampusProfiles = new HashSet<CampusProfile>();
        }
    }
}
