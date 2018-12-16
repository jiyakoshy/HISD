using System;

namespace Mshp.Service
{
    public class EnrollmentDataObject
    {
        public int Id { get; set; }         //#1) Annotation
        public int CalendarId { get; set; }
        public int CampusEnrollmentId { get; set; }
        public int CampusProfileId { get; set; }
        public string SchoolYear { get; set; }
        public string CampusNumber { get; set; }
        public int CompareDaySeq { get; set; }
        public DateTime? ReportDate { get; set; }
        public int InstructionDay { get; set; }
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
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }

    }
}


/* Annotation:
 #1) Id is required by ODataModelBuilder() to validate model --althougth it is not returned on any of the store procedures.
     This class object has no mapping to a table, only to linq or store procedures.

*/
