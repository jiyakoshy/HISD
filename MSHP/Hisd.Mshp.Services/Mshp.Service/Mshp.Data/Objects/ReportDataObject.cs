using System;
using System.Collections.Generic;
using System.Linq;

namespace Mshp.Service.Report
{
    public class ReportDataObject
    {       
        public int Id { get; set; }             //#1)
        public string CampusNumber { get; set; }
        public string SchoolYear { get; set; }
        public int CompareDaySeq { get; set; }
        public DateTime? ReportDate { get; set; }
        public int InstructionDay { get; set; }
        public int? LevelGroupID { get; set; }
        public string LevelGroup { get; set; }
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
        public int? Capacity { get; set; }
        public int? Projection { get; set; }
        public int? PrevSnapshot { get; set; }
        public string LastYear { get; set; }
        public int? LastYearCapacity { get; set; }
        public int LastYearEnrollment { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        private FunctionController functionController;
        public ReportDataObject()
        {
            functionController = new FunctionController();
        }

        public IList<ReportDataObject> GetDetailLevelAllDataSet(string schoolYear, int compareDaySeq)
        {
            return functionController.GetDetailLevelAllReport(schoolYear, compareDaySeq).ToList();
        }

        public IList<ReportDataObject> GetDetailLevelOrganizationGroupIdDataSet(string schoolYear, int compareDaySeq, int organizationGroupId)
        {
            return functionController.GetDetailLevelOrganizationGroupIdReport(schoolYear, compareDaySeq, organizationGroupId).ToList();
        }

        public IList<ReportDataObject> GetDetailLevelCampusNumberDataSet(string schoolYear, int compareDaySeq, string campusNumber)
        {
            return functionController.GetDetailLevelCampusNumberReport(schoolYear, compareDaySeq, campusNumber).ToList();
        }

        public IList<ReportDataObject> GetSummaryAndDetailDataSet(string schoolYear, int compareDaySeq)
        {
            return functionController.GetSummaryAndDetailReport(schoolYear, compareDaySeq).ToList();
        }

        public IList<ReportDataObject> GetSummaryDataSet(string schoolYear, int compareDaySeq)
        {
            return functionController.GetSummaryReport(schoolYear, compareDaySeq).ToList();
        }

    }
}


/* Annotation:
 #1) Id is required by ODataModelBuilder() to validate model.
*/
