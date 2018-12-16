using System;

namespace Mshp.Service
{
    public class DetailDataObject
    {
        public int Id { get; set; }             //#1) Important!
        public string CampusNumber { get; set; }
        public string SchoolYear { get; set; }
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
        public int? OrganizationGroupID { get; set; }
        public string OrganizationGroupDescription { get; set; }
        public int? Capacity { get; set; }
        public int? Projection { get; set; }
        public int? PrevSnapshot { get; set; }
        public string LastYear { get; set; }
        public int? LastYearCapacity { get; set; }
        public int LastYearEnrollment { get; set; }
        public int LastYearProjection { get; set; }
        
    }
}


/* Annotation:
 #1) Id is required by ODataModelBuilder() to validate model.
*/
