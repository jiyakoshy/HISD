using System;

namespace Mshp.Service
{
    public class CampusEnrollment
    {
        public int CampusEnrollmentId { get; set; }
        public virtual int CampusProfileId { get; set; }
        public virtual int CalendarId { get; set; }
        public int? IEE { get; set; }
        public int? IPK { get; set; }
        public int? IKG { get; set; }
        public int? I01 { get; set; }
        public int? I02 { get; set; }
        public int? I03 { get; set; }
        public int? I04 { get; set; }
        public int? I05 { get; set; }
        public int? I06 { get; set; }
        public int? I07 { get; set; }
        public int? I08 { get; set; }
        public int? I09 { get; set; }
        public int? I10 { get; set; }
        public int? I11 { get; set; }
        public int? I12 { get; set; }
        public int? Total { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }

        public virtual CampusProfile CampusProfile { get; set; }
        public virtual Calendar Calendar { get; set; }
    }
}
