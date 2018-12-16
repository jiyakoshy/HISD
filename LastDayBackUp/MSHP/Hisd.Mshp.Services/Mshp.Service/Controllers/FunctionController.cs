﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Routing;
using System.Data.SqlClient;
using Mshp.Service.Report;
using System.Web.UI.WebControls;
using System.Net;

namespace Mshp.Service
{
    public class FunctionController : ODataController
    {
        private MshpDbContext db;
        private Configuration cfg;

        public FunctionController()
        {
            db = new MshpDbContext();
            cfg = new Configuration();
        }
        
        [HttpGet, ODataRoute("GetSchoolYearFor(Date={d})")]
        public IHttpActionResult GetSchoolYearFor([FromODataUri] string d)
        {
            if (!DateTime.TryParse(d, out DateTime date))
                return BadRequest();
            else
            {
                var m = date.ToString("MM");
                var y = date.ToString("yyyy");
                if (Int32.Parse(m) >= cfg.BeginOfSchoolYearMonth)
                    return Ok(y + "-" + (Int32.Parse(y) + 1).ToString());

                return Ok((Int32.Parse(y) - 1).ToString() + "-" + y);
            }
        }


        [HttpGet, ODataRoute("GetCurrentSchoolYear()")]
        public IHttpActionResult GetCurrentSchoolYear()
        {
            var query = (from cs in db.CalendarSet select new { cs.SchoolYear })
                        .Distinct()
                        .OrderByDescending(x => x.SchoolYear)
                        .Take(1);

            return Ok(query.ToArray()[0].SchoolYear);
        }


        [HttpGet, ODataRoute("GetPreviousSchoolYear()")]
        public IHttpActionResult GetPreviousSchoolYear()
        {
            var query = (from cs in db.CalendarSet select new { cs.SchoolYear })
                        .Distinct()
                        .OrderByDescending(x => x.SchoolYear)
                        .Take(2)
                        .ToList();

            return Ok(query[1].SchoolYear);
        }


        [HttpGet, ODataRoute("GetSchoolYearDropdownList()")]
        public IHttpActionResult GetSchoolYearList()
        {
            var result = new List<string>();
            var query = (from s in db.CalendarSet select new { s.SchoolYear })
                        .Distinct()
                        .OrderByDescending(x => x.SchoolYear)
                        .ToArray();

            foreach (var item in query)
                result.Add(item.SchoolYear);

            return Ok(result.ToArray());
        }

        [HttpGet, ODataRoute("GetEnrollmentDataByCampus(SchoolYear={schoolYear},CampusNumber={campusNumber})"), EnableQuery]
        public IQueryable<EnrollmentDataObject> GetEnrollmentDataByCampus([FromODataUri] string schoolYear, string campusNumber)
        {
            var result = from cs in db.CalendarSet
                         join ces in db.CampusEnrollmentSet on cs.Id equals ces.CalendarId
                         join cps in db.CampusProfileSet on ces.CampusProfileId equals cps.Id
                         where cs.SchoolYear == schoolYear && cps.CampusNumber == campusNumber
                         select new EnrollmentDataObject()
                         {
                             CalendarId = cs.Id,
                             CampusEnrollmentId = ces.Id,
                             CampusProfileId = cps.Id,
                             SchoolYear = cs.SchoolYear,
                             CampusNumber = cps.CampusNumber,
                             CompareDaySeq = cs.CompareDaySeq,
                             ReportDate = cs.ReportDate,
                             InstructionDay = cs.InstructionDay,
                             IEE = ces.IEE,
                             IPK = ces.IPK,
                             IKG = ces.IKG,
                             I01 = ces.I01,
                             I02 = ces.I02,
                             I03 = ces.I03,
                             I04 = ces.I04,
                             I05 = ces.I05,
                             I06 = ces.I06,
                             I07 = ces.I07,
                             I08 = ces.I08,
                             I09 = ces.I09,
                             I10 = ces.I10,
                             I11 = ces.I11,
                             I12 = ces.I12,
                             Total = ces.Total,
                             CreatedDate = ces.CreatedDate,
                             CreatedBy = ces.CreatedBy,
                             UpdatedDate = ces.UpdatedDate,
                             UpdatedBy = ces.UpdatedBy,
                             ReportSchedule = cs.ReportSchedule
                         };
            return result;
        }

        [HttpGet, ODataRoute("GetAnnualSetupDataByCampus(SchoolYear={schoolYear})"), EnableQuery]
        public IQueryable<AnnualSetupDataObject> GetAnnualSetupDataByCampus([FromODataUri] string schoolYear)
        {
            var result = from cps in db.CampusProfileSet
                         join cs in db.CalendarSet on cps.CalendarId equals cs.Id
                         join og in db.OrganizationGroupSet on cps.OrganizationGroupId equals og.Id

                         where cs.SchoolYear == schoolYear
                         select new AnnualSetupDataObject()
                         {
                             Id = cps.Id,
                             CampusNumber = cps.CampusNumber,
                             Type = og.Description,
                             Projection = cps.Projection,
                             Capacity = cps.Capacity,
                             Snapshot = cps.Snapshot,
                             CreatedDate = cps.CreatedDate,
                             CreatedBy = cps.CreatedBy,
                             UpdatedDate = cps.UpdatedDate,
                             UpdatedBy = cps.UpdatedBy
                         };
            return result;
        }

        [HttpGet, ODataRoute("GetEnrollmentData(SchoolYear={schoolYear},CampusNumber={campusNumber},CompareDaySeq={compareDaySeq})"), EnableQuery]
        public IQueryable<EnrollmentDataObject> GetEnrollmentData([FromODataUri] string schoolYear, string campusNumber, int compareDaySeq)
        {
            var result = from cs in db.CalendarSet
                         join ces in db.CampusEnrollmentSet on cs.Id equals ces.CalendarId
                         join cps in db.CampusProfileSet on ces.CampusProfileId equals cps.Id
                         where cs.SchoolYear == schoolYear && cps.CampusNumber == campusNumber && cs.CompareDaySeq == compareDaySeq
                         select new EnrollmentDataObject()
                         {
                             CalendarId = cs.Id,
                             CampusEnrollmentId = ces.Id,
                             CampusProfileId = cps.Id,
                             SchoolYear = cs.SchoolYear,
                             CampusNumber = cps.CampusNumber,
                             CompareDaySeq = cs.CompareDaySeq,
                             ReportDate = cs.ReportDate,
                             InstructionDay = cs.InstructionDay,
                             IEE = ces.IEE,
                             IPK = ces.IPK,
                             IKG = ces.IKG,
                             I01 = ces.I01,
                             I02 = ces.I02,
                             I03 = ces.I03,
                             I04 = ces.I04,
                             I05 = ces.I05,
                             I06 = ces.I06,
                             I07 = ces.I07,
                             I08 = ces.I08,
                             I09 = ces.I09,
                             I10 = ces.I10,
                             I11 = ces.I11,
                             I12 = ces.I12,
                             Total = ces.Total,
                             CreatedDate = ces.CreatedDate,
                             CreatedBy = ces.CreatedBy,
                             UpdatedDate = ces.UpdatedDate,
                             UpdatedBy = ces.UpdatedBy
                         };
            return result;
        }

        [HttpGet, ODataRoute("GetNonReportingCampusesReport(SchoolYear={schoolYear},CompareDaySeq={compareDaySeq})"), EnableQuery]
        public IQueryable<NonReportingCampusesDataObject> GetNonReportingCampusesReport([FromODataUri] string schoolYear, int compareDaySeq)
        {
            return db.Database
                    .SqlQuery<NonReportingCampusesDataObject>("dbo.GetNonReportingSchoolReport @SchoolYear, @CompareDaySeq",
                                                  new SqlParameter("@SchoolYear", schoolYear),
                                                  new SqlParameter("@CompareDaySeq", compareDaySeq))
                     .AsQueryable();
            //var result = from c in db.CalendarSet
            //             join ce in db.CampusEnrollmentSet on c.Id equals ce.Id
            //             join cp in db.CampusProfileSet on ce.CampusProfileId equals cp.Id
            //             where c.SchoolYear == schoolYear && c.CompareDaySeq == compareDaySeq
            //             select new NonReportingCampusesDataObject()
            //             {
            //                 CampusNumber = cp.CampusNumber,
            //                 SchoolYear = c.SchoolYear,
            //                 CompareDaySeq = c.CompareDaySeq,
            //                 ReportDate = c.ReportDate,
            //                 InstructionDay = c.InstructionDay,
            //                 IEE = ce.IEE,
            //                 IPK = ce.IPK,
            //                 IKG = ce.IKG,
            //                 I01 = ce.I01,
            //                 I02 = ce.I02,
            //                 I03 = ce.I03,
            //                 I04 = ce.I04,
            //                 I05 = ce.I05,
            //                 I06 = ce.I06,
            //                 I07 = ce.I07,
            //                 I08 = ce.I08,
            //                 I09 = ce.I09,
            //                 I10 = ce.I10,
            //                 I11 = ce.I11,
            //                 I12 = ce.I12,
            //                 Total = ce.Total
            //             };
            //return result;
        }

        [HttpGet, ODataRoute("GetDetailLevelAllReport(SchoolYear={schoolYear},CompareDaySeq={compareDaySeq})"), EnableQuery]
        public IQueryable<ReportDataObject> GetDetailLevelAllReport([FromODataUri] string schoolYear, int compareDaySeq)
        {
            return db.Database
                     .SqlQuery<ReportDataObject>("dbo.GetDetailReport @SchoolYear,  @CompareDaySeq, @OrganizationGroupId=0, @CampusNumber=null",
                                                  new SqlParameter("@SchoolYear", schoolYear),
                                                  new SqlParameter("@CompareDaySeq", compareDaySeq)
                                                  )
                     .AsQueryable();
        }

        [HttpGet, ODataRoute("GetDetailLevelOrganizationGroupIdReport(SchoolYear={schoolYear},CompareDaySeq={compareDaySeq},OrganizationGroupId={organizationGroupId})"), EnableQuery]
        public IQueryable<ReportDataObject> GetDetailLevelOrganizationGroupIdReport([FromODataUri] string schoolYear, int compareDaySeq, int organizationGroupId)
        {
            return db.Database
                     .SqlQuery<ReportDataObject>("dbo.GetDetailReport @SchoolYear,  @CompareDaySeq, @OrganizationGroupId, @CampusNumber=null",
                                                  new SqlParameter("@SchoolYear", schoolYear),
                                                  new SqlParameter("@CompareDaySeq", compareDaySeq),
                                                  new SqlParameter("@OrganizationGroupId", organizationGroupId)
                                                  )
                     .AsQueryable();
        }

        [HttpGet, ODataRoute("GetDetailLevelCampusNumberReport(SchoolYear={schoolYear},CompareDaySeq={compareDaySeq},CampusNumber={campusNumber})"), EnableQuery]
        public IQueryable<ReportDataObject> GetDetailLevelCampusNumberReport([FromODataUri] string schoolYear, int compareDaySeq, string campusNumber)
        {
            int organizationGroupId = 0;
            return db.Database
                     .SqlQuery<ReportDataObject>("dbo.GetDetailReport @SchoolYear,  @CompareDaySeq, @OrganizationGroupId, @CampusNumber",
                                                  new SqlParameter("@SchoolYear", schoolYear),
                                                  new SqlParameter("@CompareDaySeq", compareDaySeq),
                                                  new SqlParameter("@OrganizationGroupId", organizationGroupId),
                                                  new SqlParameter("@CampusNumber", campusNumber)
                                                  )
                     .AsQueryable();
        }

        [HttpGet, ODataRoute("GetSummaryAndDetailReport(SchoolYear={schoolYear},CompareDaySeq={compareDaySeq})"), EnableQuery]
        public IQueryable<ReportDataObject> GetSummaryAndDetailReport([FromODataUri] string schoolYear, int compareDaySeq)
        {
            return db.Database
                     .SqlQuery<ReportDataObject>("dbo.GetSummaryAndDetailReport @SchoolYear, @CompareDaySeq",
                                                  new SqlParameter("@SchoolYear", schoolYear),
                                                  new SqlParameter("@CompareDaySeq", compareDaySeq))
                     .AsQueryable();
        }

        [HttpGet, ODataRoute("GetCSOSummaryReport(SchoolYear={schoolYear},CompareDaySeq={compareDaySeq})"), EnableQuery]
        public IQueryable<ReportDataObject> GetCSOSummaryReport([FromODataUri] string schoolYear, int compareDaySeq)
        {
            return db.Database
                     .SqlQuery<ReportDataObject>("dbo.GetSummaryReport @SchoolYear, @CompareDaySeq",
                                                  new SqlParameter("@SchoolYear", schoolYear),
                                                  new SqlParameter("@CompareDaySeq", compareDaySeq))
                     .AsQueryable();
        }
        

        [HttpGet, ODataRoute("GetSummaryReport(SchoolYear={schoolYear},CompareDaySeq={compareDaySeq})"), EnableQuery]
        public IQueryable<ReportDataObject> GetSummaryReport([FromODataUri] string schoolYear, int compareDaySeq)
        {
            return db.Database
                     .SqlQuery<ReportDataObject>("dbo.GetSummaryReportbyYear @SchoolYear, @CompareDaySeq",
                                                  new SqlParameter("@SchoolYear", schoolYear),
                                                  new SqlParameter("@CompareDaySeq", compareDaySeq))
                     .AsQueryable();
        }

        //[HttpPost, ODataRoute("InsertAnnualSetup(SchoolYear={schoolYear},PrevSchoolYear={prevschoolYear},CreatedBy={createdBy},UpdatedBy={updatedBy})")]
        //public IHttpActionResult InsertAnnualSetup([FromODataUri] string schoolYear, string prevschoolYear, string createdBy, string updatedBy)
        //{
        //    db.Database
        //             .ExecuteSqlCommand("dbo.InsertNewCalendar @SchoolYear, @oldSchoolYear, @CreatedBy,@UpdatedBy",
        //                                          new SqlParameter("@SchoolYear", schoolYear),
        //                                          new SqlParameter("@oldSchoolYear", prevschoolYear),
        //                                          new SqlParameter("@CreatedBy", createdBy),
        //                                          new SqlParameter("@UpdatedBy", updatedBy));

        //    return StatusCode(HttpStatusCode.Accepted);

        //}
    }
}
/* Annotations:
    Sample: odata/GetCurrentSchoolYear()
    Sample: odata/GetPreviousSchoolYear()
    Sample: odata/GetSchoolYearList()
    Sample: odata/GetSchoolYearFor(Date='2016-08-25')
    Sample: odata/GetReportDateDropdownList()
    Sample: odata/GetEnrollmentData(SchoolYear='2017-2018',CampusNumber='104',CompareDaySeq=22)
    Sample: odata/GetNoEnrollmentInput(SchoolYear='2017-2018',CompareDaySeq=22)     


    References: 
    [dbo].[MSHPV2spRpt_DetailAllGroupingforSummaryandDetail]  --> GetSummaryAndDetailReport()
    [dbo].[MSHPV2spRpt_DetailAllGrouping] --> GetDetailLevelAllReport(), GetSummaryReport()
    [dbo].[MSHPV2spRpt_DetailBySchool] --> GetDetailLevelCampusNumberReport()
    [dbo].[MSHPV2spRpt_DetailByGrouping] --> GetDetailLevelOrganizationGroupIdReport()

*/