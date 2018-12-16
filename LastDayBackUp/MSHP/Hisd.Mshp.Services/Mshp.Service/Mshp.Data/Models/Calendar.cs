using System;
using System.Collections.Generic;

namespace Mshp.Service
{
    public class Calendar
    {
        public int Id { get; set; }
        public string SchoolYear { get; set; }
        public int CompareDaySeq { get; set; }
        public int InstructionDay { get; set; }
        public DateTime? ReportDate { get; set; }
        public string PlanNotes { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string ReportSchedule { get; set; }

        public virtual ICollection<CampusEnrollment> CampusEnrollments { get; set; }
        public virtual ICollection<CampusProfile> CampusProfiles { get; set; }
        public virtual ICollection<OrganizationGroup> OrganizationGroups { get; set; }

        public Calendar()
        {
            CampusEnrollments = new HashSet<CampusEnrollment>();
            CampusProfiles = new HashSet<CampusProfile>();
            OrganizationGroups = new HashSet<OrganizationGroup>();
        }

    }
}
