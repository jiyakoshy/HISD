using System;
using System.Collections.Generic;

namespace Mshp.Service
{
    public class CampusProfile
    {
        public int CampusProfileId { get; set; }
        public virtual int CalendarId { get; set; }
        public virtual int? OrganizationGroupId { get; set; }
        public string CampusNumber { get; set; }
        public int? Capacity { get; set; }
        public int? Projection { get; set; }
        public int? Snapshot { get; set; } 
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public virtual Calendar Calendar { get; set; }
        public virtual OrganizationGroup OrganizationGroup { get; set; }
        public virtual ICollection<CampusEnrollment> CampusEnrollments { get; set; }
        
        public CampusProfile()
        {
            CampusEnrollments = new HashSet<CampusEnrollment>();
        }
    }
}
