using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Query;
using System.Web.OData.Routing;
using HISD.MAS.DAL.Models;
using HISD.MAS.DAL.Models.EDW;
using System.Threading.Tasks;
using System.Web.ModelBinding;
using Medallion.Threading.Sql;
using Newtonsoft.Json;
using System.Globalization;

namespace HISD.MAS.Web.Controllers
{
    public class ActivityLogsController : ODataController
    {
        private MASContext db = new MASContext();
        private EDWMASContext edwdb = new EDWMASContext();
        private string connectionStringMAS = System.Configuration.ConfigurationManager.ConnectionStrings["MASContext"].ConnectionString;
        
        // GET: odata/ ActivityLogs
        [EnableQuery]
        public IQueryable<ActivityLog> Get()
        {
            return db.ActivityLogs;
        }

        // GET: odata/ ActivityLogs(5)
        [EnableQuery]
        public SingleResult<ActivityLog> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.ActivityLogs.Where(al => al.ActivityLogID == key));
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetTotalActivitiesByMentees(TimeConfigurationID={timeconfigID},CampusID={campus},StDate={stDate},EdDate={edDate})")]
        public IQueryable<TotalNumberofActivitiesByMentees> GetTotalActivitiesByMentees([FromODataUri] int timeconfigID, [FromODataUri]string campus, [FromODataUri]string stDate, [FromODataUri]string edDate)
        {
            DateTime dtFrom = Convert.ToDateTime(stDate);
            DateTime dtTo = Convert.ToDateTime(edDate);
            var stMonthYear = stDate.Split('-')[0].ToString() + stDate.Split('-')[2].ToString();
            var stLastDay = DateTime.DaysInMonth(Int32.Parse(stDate.Split('-')[2].ToString()), Int32.Parse(stDate.Split('-')[0].ToString()));
            var allCbmStandards = db.CBMStandards.ToList();
            int totalActivities = 0;
            foreach (CBMStandard pr in allCbmStandards)
            {
                DateTime cbmDate;
                var cbmMonthYear = pr.Month.ToString("00") + pr.Year;
                if (cbmMonthYear == stMonthYear)
                {
                    cbmDate = Convert.ToDateTime(pr.Month.ToString() + "/" + stLastDay.ToString() + "/" + pr.Year);
                }
                else
                {
                    cbmDate = Convert.ToDateTime(pr.Month.ToString() + "/01/" + pr.Year);
                }

                if (cbmDate >= dtFrom && cbmDate <= dtTo)
                {
                    totalActivities += pr.NoOfLogs;
                }
            }
            var totalActivies = (from x in db.MentorMenteeRelationships.ToList()
                                 join y in db.ActivityLog_Mentees.ToList() on x.MentorMenteeRelationshipID equals y.MentorMenteeRelationshipID into xy
                                 from xyz in xy.DefaultIfEmpty()
                                 where x.TimeConfigurationID.Equals(timeconfigID)
                                 where x.CampusID.Equals(campus)
                                 where x.RelationshipStatus.Equals("Active")
                                 group xyz by new
                                 {
                                     x.MentorEmployeeID,
                                     x.MenteeEmployeeID,
                                     xy
                                 } into mpr
                                 select new TotalNumberofActivitiesByMentees
                                 {
                                     CampusID = campus,
                                     MentorEmployeeID = mpr.Key.MentorEmployeeID,
                                     MenteeEmployeeID = mpr.Key.MenteeEmployeeID,
                                     CompletedActivitiesCount = mpr.Key.xy.Where(pr => pr.MenteeEmployeeID == mpr.Key.MenteeEmployeeID).Count() == 0 ? 0 : mpr.Key.xy.DefaultIfEmpty().Count(),
                                     TotalActivitiesCount = totalActivities
                                 }).AsEnumerable().ToList();
            return totalActivies.AsQueryable<TotalNumberofActivitiesByMentees>();
        }

        // GET: odata/ActivityLogs(Id)/ActivityLog_ActivityToolItems
        [HttpGet]
        [EnableQuery]
        [ODataRoute("ActivityLogs({Key})/ActivityLog_ActivityToolItems")]
        public IHttpActionResult GetActivityLog_ActivityToolItems([FromODataUri] int key)
        {
            var activitylog = db.ActivityLogs.FirstOrDefault(al => al.ActivityLogID == key);
            if (activitylog == null)
            {
                return NotFound();
            }

            return Ok(db.ActivityLog_ActivityToolItems.Where(ati => ati.ActivityLogID == key));
        }


        // GET: odata/ActivityLogs(Id)/ActivityLog_ActivityStandardItems({ActivityLog_ActivityToolItemID})
        [HttpGet]
        [EnableQuery]
        [ODataRoute("ActivityLogs({Key})/ActivityLog_ActivityToolItems({activitylogATIid})")]
        public IHttpActionResult ActivityLog_ActivityToolItem([FromODataUri] int key, 
            [FromODataUri] int activitylogATIid)
        {
            var activitylog = db.ActivityLogs.FirstOrDefault(al => al.ActivityLogID == key);
            if (activitylog == null)
            {
                return NotFound();
            }

            // querable, no FirstOrDefault
            var ActivityLog_ActivityToolItems = db.ActivityLog_ActivityToolItems.Where(ati => ati.ActivityLog.ActivityLogID == key
            && ati.ActivityLogActivityToolItemID == activitylogATIid);
            if (!ActivityLog_ActivityToolItems.Any())
            {
                return NotFound();
            }
            return Ok(SingleResult.Create(ActivityLog_ActivityToolItems));
        }

        // GET: odata/ActivityLogs(Id)/ActivityLog_ActivityStandardItems
        [HttpGet]
        [EnableQuery]
        [ODataRoute("ActivityLogs({Key})/ActivityLog_ActivityStandardItems")]
        public IHttpActionResult ActivityLog_ActivityStandardItems([FromODataUri] int key)
        {
            var activitylog = db.ActivityLogs.FirstOrDefault(al => al.ActivityLogID == key);
            if (activitylog == null)
            {
                return NotFound();
            }

            // return the collection of ActivityLog_ActivityStandardItems
            return Ok(db.ActivityLog_ActivityStandardItems.Where(asi => asi.ActivityLogID == key));
        }

        // GET: odata/ActivityLogs(Id)/ActivityLog_ActivityStandardItems({ActivityLog_ActivityStandardItemID})
        [HttpGet]
        [EnableQuery]
        [ODataRoute("ActivityLogs({Key})/ActivityLog_ActivityStandardItems({activitylogASIid})")]
        public IHttpActionResult ActivityLog_ActivityStandardItem([FromODataUri] int key,
            [FromODataUri] int activitylogASIid)
        {
            var activitylog = db.ActivityLogs.FirstOrDefault(al => al.ActivityLogID == key);
            if (activitylog == null)
            {
                return NotFound();
            }

            // querable, no FirstOrDefault
            var activitylog_ActivityStandardItems = db.ActivityLog_ActivityStandardItems.Where(asi => asi.ActivityLog.ActivityLogID == key
            && asi.ActivityLogActivityStandardItemID == activitylogASIid);
            if (!activitylog_ActivityStandardItems.Any())
            {
                return NotFound();
            }
            return Ok(SingleResult.Create(activitylog_ActivityStandardItems));
        }

        // GET: odata/ActivityLogs(Id)/ActivityLog_Mentees
        [HttpGet]
        [EnableQuery]
        [ODataRoute("ActivityLogs({Key})/ActivityLog_Mentees")]
        public IHttpActionResult ActivityLog_Mentees([FromODataUri] int key)
        {
            var activitylog = db.ActivityLogs.FirstOrDefault(al => al.ActivityLogID == key);
            if (activitylog == null)
            {
                return NotFound();
            }

            // return the collection of ActivityLog_ActivityToolItems
            return Ok(db.ActivityLog_Mentees.Where(ame => ame.ActivityLogID == key));
        }

        // GET: odata/ActivityLogs(Id)/ActivityLog_Mentees({ActivityLog_MenteeID})
        [HttpGet]
        [EnableQuery]
        [ODataRoute("ActivityLogs({Key})/ActivityLog_Mentees({activitylogAMEid})")]
        public IHttpActionResult ActivityLog_Mentees([FromODataUri] int key,
            [FromODataUri] int activitylogAMEid)
        {
            var activitylog = db.ActivityLogs.FirstOrDefault(al => al.ActivityLogID == key);
            if (activitylog == null)
            {
                return NotFound();
            }

            // querable, no FirstOrDefault
            var activitylog_Mentees = db.ActivityLog_Mentees.Where(ame => ame.ActivityLog.ActivityLogID == key
            && ame.ActivityLogMenteeID == activitylogAMEid);
            if (!activitylog_Mentees.Any())
            {
                return NotFound();
            }
            return Ok(SingleResult.Create(activitylog_Mentees));
        }
        //CUSTOM NEEDS 
        // GET: odata/GetMentorsInActiveRelationshipByCampusID: Returns all existing Active Mentors Details
        //Old Menthod was removed by MPR.
        //MPR New Service without EDW Call. New Method for above old method
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetMentorsInActiveRelationshipByCampusID(CampusID={campusID},TimeConfigurationID={timeConfigID})")]      //,TimeConfigurationID={timeConfigID}
        public IQueryable<MentorMenteeRelationship> GetMentorsInActiveRelationshipByCampusID([FromODataUri] string campusID, [FromODataUri] int timeConfigID)
        {
            return db.MentorMenteeRelationships
                 .Where(a => a.TimeConfigurationID == timeConfigID && a.CampusID == campusID)
                 .GroupBy(test => test.MentorEmployeeID).Select(g => g.FirstOrDefault())
                  .ToList()
                 .Select(w => new MentorMenteeRelationship
                 {
                     MentorMenteeRelationshipID = w.MentorMenteeRelationshipID,
                     MentorEmployeeID = w.MentorEmployeeID.Trim(),
                     MenteeEmployeeID = w.MenteeEmployeeID.Trim(),
                     RelationshipStatus = w.RelationshipStatus,
                     PrincipalApproval = w.PrincipalApproval,
                     MentorAgreement = w.MentorAgreement,
                     ApprovalDate = w.ApprovalDate,
                     CampusID = w.CampusID,
                     TimeConfigurationID = w.TimeConfigurationID,
                     RelationshipStartDate = w.RelationshipStartDate,
                     RelationshipEndDate  = w.RelationshipEndDate,
                     CreateDate = w.CreateDate,
                     CreatedBy = w.CreatedBy,
                     UpdateDate = w.UpdateDate,
                     UpdatedBy = w.UpdatedBy
                 }).AsQueryable();
        }

        //// GET: odata/GetMenteesInActiveRelationshipByCampusID: Returns all existing Active Mentors Details
        //Old Menthod was removed by MPR.
        //MPR New Service without EDW Call. New Method for above old method
        //// GET: odata/GetMenteesInActiveRelationshipByCampusID: Returns all existing Active Mentors Details
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetMenteesInActiveRelationshipByCampusID(CampusID={campusID},TimeConfigurationID={timeConfigID})")]
        public IQueryable<MentorMenteeRelationship> GetMenteesInActiveRelationshipByCampusID([FromODataUri] string campusID, [FromODataUri] int timeConfigID)
        {
            return db.MentorMenteeRelationships
                 .Where(a => a.TimeConfigurationID == timeConfigID && a.CampusID == campusID)
                 .GroupBy(test => test.MenteeEmployeeID).Select(g => g.FirstOrDefault())
                  .ToList()
                 .Select(w => new MentorMenteeRelationship
                 {
                     MentorMenteeRelationshipID = w.MentorMenteeRelationshipID,
                     MentorEmployeeID = w.MentorEmployeeID.Trim(),
                     MenteeEmployeeID = w.MenteeEmployeeID.Trim(),
                     RelationshipStatus = w.RelationshipStatus,
                     PrincipalApproval = w.PrincipalApproval,
                     MentorAgreement = w.MentorAgreement,
                     ApprovalDate = w.ApprovalDate,
                     CampusID = w.CampusID,
                     TimeConfigurationID = w.TimeConfigurationID,
                     RelationshipStartDate = w.RelationshipStartDate,
                     RelationshipEndDate = w.RelationshipEndDate,
                     CreateDate = w.CreateDate,
                     CreatedBy = w.CreatedBy,
                     UpdateDate = w.UpdateDate,
                     UpdatedBy = w.UpdatedBy
                 }).AsQueryable();
        }

        //Old Menthod was removed by MPR.
        //MPR New Service without EDW Call. New Method for above old method.
        // GET: odata/GetMenteesInActiveRelationshipByMentorID: Returns all existing Active Mentee Details
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetMenteesInActiveRelationshipByMentorID(EmployeeID={employeeID},CampusID={campusID},TimeConfigurationID={timeConfigID})")]
        public IQueryable<MentorMenteeRelationship> GetMenteesInActiveRelationshipByMentorID([FromODataUri] int timeConfigID, [FromODataUri] string campusID, [FromODataUri] string employeeID)
        {
            return db.MentorMenteeRelationships
                 .Where(a => a.TimeConfigurationID == timeConfigID && a.CampusID == campusID && a.MentorEmployeeID == employeeID)
                 .GroupBy(test => test.MenteeEmployeeID).Select(g => g.FirstOrDefault())
                  .ToList()
                 .Select(w => new MentorMenteeRelationship
                 {
                     MentorMenteeRelationshipID = w.MentorMenteeRelationshipID,
                     MentorEmployeeID = w.MentorEmployeeID.Trim(),
                     MenteeEmployeeID = w.MenteeEmployeeID.Trim(),
                     RelationshipStatus = w.RelationshipStatus,
                     PrincipalApproval = w.PrincipalApproval,
                     MentorAgreement = w.MentorAgreement,
                     ApprovalDate = w.ApprovalDate,
                     CampusID = w.CampusID,
                     TimeConfigurationID = w.TimeConfigurationID,
                     RelationshipStartDate = w.RelationshipStartDate,
                     RelationshipEndDate = w.RelationshipEndDate,
                     CreateDate = w.CreateDate,
                     CreatedBy = w.CreatedBy,
                     UpdateDate = w.UpdateDate,
                     UpdatedBy = w.UpdatedBy
                 }).AsQueryable();          
        }

        //MPR New Method for All ActivityLogs........
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetAllActivityLogsByTimeConfig(TimeConfigurationID={timeConfigID})")]
        public IQueryable<ActivityLogsByTimeConfig> GetAllActivityLogsByTimeConfig([FromODataUri] int timeConfigID)
        {
            // get all existing Mentor Mentee Relationships under HISD
            var allActivityLogs = (from AL in db.ActivityLogs.Where(tr => tr.TimeConfigurationID == timeConfigID)
                                       // activity codes
                                   join ac in db.ActivityCodes
                                   on AL.ActivityCodeID equals ac.ActivityCodeID into MasAC
                                   from refMasAC in MasAC.DefaultIfEmpty()

                                       // activity Standard Items 
                                   join ASI_all in (
                                           from AL_ASI in db.ActivityLog_ActivityStandardItems
                                           join asi in db.ActivityStandardItems
                                           on AL_ASI.ActivityStandardItemID equals asi.ActivityStandardItemID into MasASI
                                           from MasASIinfo in MasASI.DefaultIfEmpty()
                                           select new
                                           {
                                               ASIActivityLogID = AL_ASI.ActivityLogID,
                                               ActivityLogActivityStandardItemID = AL_ASI.ActivityLogActivityStandardItemID,
                                               ActivityStandardItemID = AL_ASI.ActivityStandardItemID,
                                               ActivityStandardItemName = MasASIinfo.ActivityStandardItemName,
                                               ActivityStandardGroupID = MasASIinfo.ActivityStandardGroupID,
                                               ALSI_CreateDate = AL_ASI.CreateDate,
                                               ALSI_CreatedBy = AL_ASI.CreatedBy,
                                               ALSI_UpdateDate = AL_ASI.UpdateDate,
                                               ALSI_UpdatedBy = AL_ASI.UpdatedBy

                                           }
                                   ).DefaultIfEmpty()

                                   on AL.ActivityLogID equals ASI_all.ASIActivityLogID into ALnASI
                                   from refALSI in ALnASI.DefaultIfEmpty()
                                       // activity Tool Items 
                                   join ATI_all in (
                                           from AL_ATI in db.ActivityLog_ActivityToolItems
                                           join ati in db.ActivityToolItems
                                           on AL_ATI.ActivityToolItemID equals ati.ActivityToolItemID into MasATI
                                           from MasATIinfo in MasATI.DefaultIfEmpty()
                                           select new
                                           {
                                               ATIActivityLogID = AL_ATI.ActivityLogID,
                                               ActivityLogActivityToolItemID = AL_ATI.ActivityLogActivityToolItemID,
                                               ActivityToolItemID = AL_ATI.ActivityToolItemID,
                                               ActivityToolItemName = MasATIinfo.ActivityToolItemName,
                                               ALTI_CreateDate = AL_ATI.CreateDate,
                                               ALTI_CreatedBy = AL_ATI.CreatedBy,
                                               ALTI_UpdateDate = AL_ATI.UpdateDate,
                                               ALTI_UpdatedBy = AL_ATI.UpdatedBy

                                           }
                                   ).DefaultIfEmpty()

                                   on AL.ActivityLogID equals ATI_all.ATIActivityLogID into ALnATI
                                   from refALTI in ALnATI.DefaultIfEmpty()
                                       // Activity Log Mentees & Verification Comments
                                       //join AME_all in db.ActivityLog_Mentees
                                   join AME_all in (
                                           from AL_AME in db.ActivityLog_Mentees
                                           join mcli in db.MultiChoiceListItems
                                           on AL_AME.MultiChoiceListItemID equals mcli.MultiChoiceListItemID into MasAME
                                           from MasAMEinfo in MasAME.DefaultIfEmpty()
                                           select new
                                           {
                                               AMEActivityLogID = AL_AME.ActivityLogID,
                                               ActivityLogMenteeID = AL_AME.ActivityLogMenteeID,
                                               MultiChoiceListItemID = AL_AME.MultiChoiceListItemID,
                                               MultiChoiceListItemCode = MasAMEinfo.MultiChoiceListItemCode,
                                               MultiChoiceListItemDescription = MasAMEinfo.MultiChoiceListItemDescription,
                                               MenteeEmployeeID = AL_AME.MenteeEmployeeID,
                                               MenteeVerificationStatus = AL_AME.MenteeVerificationStatus,
                                               ALME_CreateDate = AL_AME.CreateDate,
                                               ALME_CreatedBy = AL_AME.CreatedBy,
                                               ALME_UpdateDate = AL_AME.UpdateDate,
                                               ALME_UpdatedBy = AL_AME.UpdatedBy,
                                               MenteeComments = AL_AME.MenteeComments
                                           }
                                   ).DefaultIfEmpty()

                                   on AL.ActivityLogID equals AME_all.AMEActivityLogID into ALnAME
                                   from refALME in ALnAME.DefaultIfEmpty()

                                   select new
                                   {
                                       ActivityLogID = AL.ActivityLogID,
                                       CampusID = AL.CampusID,

                                       ActivityCodeID = AL.ActivityCodeID,
                                       ActivityCodeName = refMasAC.ActivityCodeName,
                                       ActivityCodeDescription = refMasAC.ActivityCodeDescription,

                                       MentorEmployeeID = AL.MentorEmployeeID,
                                       MentorComments = AL.MentorComments,

                                       ActivityStartTime = AL.ActivityStartTime,
                                       //ActivityEndTime = AL.ActivityEndTime,
                                       Duration = AL.Duration,

                                       ActivityLogActivityStandardItemID = refALSI.ActivityLogActivityStandardItemID,
                                       ActivityStandardItemID = refALSI.ActivityStandardItemID,
                                       ActivityStandardItemName = refALSI.ActivityStandardItemName,
                                       ActivityStandardGroupID = refALSI.ActivityStandardGroupID,

                                       ALSI_CreateDate = refALSI.ALSI_CreateDate,
                                       ALSI_CreatedBy = refALSI.ALSI_CreatedBy,

                                       ALSI_UpdateDate = refALSI.ALSI_UpdateDate,
                                       ALSI_UpdatedBy = refALSI.ALSI_UpdatedBy,

                                       ActivityLogActivityToolItemID = refALTI.ActivityLogActivityToolItemID,
                                       ActivityToolItemID = refALTI.ActivityToolItemID,
                                       ActivityToolItemName = refALTI.ActivityToolItemName,
                                       ALTI_CreateDate = refALTI.ALTI_CreateDate,
                                       ALTI_CreatedBy = refALTI.ALTI_CreatedBy,
                                       ALTI_UpdateDate = refALTI.ALTI_UpdateDate,
                                       ALTI_UpdatedBy = refALTI.ALTI_UpdatedBy,

                                       ActivityLogMenteeID = refALME.ActivityLogMenteeID,
                                       MenteeEmployeeID = refALME.MenteeEmployeeID,
                                       MenteeVerificationStatus = refALME.MenteeVerificationStatus,
                                       MenteeComments = refALME.MenteeComments,
                                       MultiChoiceListItemID = refALME.MultiChoiceListItemID,
                                       MultiChoiceListItemCode = refALME.MultiChoiceListItemCode,
                                       MultiChoiceListItemDescription = refALME.MultiChoiceListItemDescription,
                                       ALME_CreateDate = refALME.ALME_CreateDate,
                                       ALME_CreatedBy = refALME.ALME_CreatedBy,
                                       ALME_UpdateDate = refALME.ALME_UpdateDate,
                                       ALME_UpdatedBy = refALME.ALME_UpdatedBy,
                                       CreateDate = AL.CreateDate,
                                       CreatedBy = AL.CreatedBy,

                                       UpdateDate = AL.UpdateDate,
                                       UpdatedBy = AL.UpdatedBy,

                                       TimeConfigurationID = AL.TimeConfigurationID
                                   }).AsEnumerable().ToList();
            List<ActivityLogsByTimeConfig> ActivityLogList = new List<ActivityLogsByTimeConfig>();
            foreach (var a in allActivityLogs)
            {
                if (!ActivityLogList.Any(al => al.ActivityLogID == a.ActivityLogID && al.MentorEmployeeID == a.MentorEmployeeID))
                {
                    ActivityLogsByTimeConfig obj1 = new ActivityLogsByTimeConfig();
                    obj1.ActivityLogID = a.ActivityLogID;
                    obj1.TimeConfigurationID = a.TimeConfigurationID;

                    obj1.EducationOrgNaturalKey = a.CampusID;

                    obj1.CreateDate = a.CreateDate;
                    obj1.CreatedBy = a.CreatedBy;
                    obj1.UpdateDate = a.UpdateDate;
                    obj1.UpdatedBy = a.UpdatedBy;

                    obj1.ActivityStartTime = a.ActivityStartTime;
                    obj1.Duration = a.Duration;
                    //obj1.ActivityEndTime = a.ActivityEndTime;

                    obj1.ActivityCodeID = a.ActivityCodeID;
                    obj1.ActivityCodeName = a.ActivityCodeName;
                    obj1.ActivityCodeDescription = a.ActivityCodeDescription;

                    obj1.MentorEmployeeID = a.MentorEmployeeID;
                    obj1.MentorComments = a.MentorComments;

                    obj1.Mentees = new List<ActivityLogMenteeInfoByTimeConfig>();

                    // Add all affiliated Mentees 
                    foreach (var aMentee in allActivityLogs)
                    {
                        if (obj1.ActivityLogID == aMentee.ActivityLogID && obj1.MentorEmployeeID == aMentee.MentorEmployeeID)
                        {
                            if (!obj1.Mentees.Any(omi => omi.StaffNaturalKey == aMentee.MenteeEmployeeID))
                            {
                                obj1.Mentees.Add(
                                     new ActivityLogMenteeInfoByTimeConfig
                                     {
                                         ActivityLogMenteeID = aMentee.ActivityLogMenteeID,
                                         ActivityLogID = aMentee.ActivityLogID,
                                         StaffNaturalKey = aMentee.MenteeEmployeeID,
                                         EducationOrgNaturalKey = aMentee.CampusID,
                                         VerificationStatus = aMentee.MenteeVerificationStatus,
                                         VerficationCommentItemID = aMentee.MultiChoiceListItemID,
                                         VerificationCommentDescription = aMentee.MultiChoiceListItemDescription,
                                         VerificationCommentCode = aMentee.MultiChoiceListItemCode,
                                         MenteeComments = aMentee.MenteeComments,
                                         CreateDate = aMentee.ALME_CreateDate,
                                         CreatedBy = aMentee.ALME_CreatedBy,
                                         UpdateDate = aMentee.ALME_UpdateDate,
                                         UpdatedBy = aMentee.ALME_UpdatedBy

                                     }
                                 );
                            }
                        }
                    }

                    obj1.ActivityStandardItems = new List<ActivityLogStandardItemInfo>();
                    // Add all affiliated Activity Standard Items 
                    foreach (var aMentee in allActivityLogs)
                    {
                        if (obj1.ActivityLogID == aMentee.ActivityLogID && obj1.MentorEmployeeID == aMentee.MentorEmployeeID)
                        {
                            if (!obj1.ActivityStandardItems.Any(asi => asi.ActivityStandardItemID == aMentee.ActivityStandardItemID))
                            {
                                obj1.ActivityStandardItems.Add(
                                     new ActivityLogStandardItemInfo
                                     {
                                         ActivityLogActivityStandardItemID = aMentee.ActivityLogActivityStandardItemID,
                                         ActivityLogID = aMentee.ActivityLogID,
                                         ActivityStandardItemID = aMentee.ActivityStandardItemID,
                                         ActivityStandardItemName = aMentee.ActivityStandardItemName,
                                         CreateDate = aMentee.ALSI_CreateDate,
                                         CreatedBy = aMentee.ALSI_CreatedBy,
                                         UpdateDate = aMentee.ALSI_UpdateDate,
                                         UpdatedBy = aMentee.ALSI_UpdatedBy


                                     }
                                );

                            }
                        }
                    }

                    obj1.ActivityToolItems = new List<ActivityLogToolItemInfo>();
                    // Add all affiliated Activity Tool Items 
                    foreach (var aMentee in allActivityLogs)
                    {
                        if (obj1.ActivityLogID == aMentee.ActivityLogID && obj1.MentorEmployeeID == aMentee.MentorEmployeeID)
                        {
                            if (!obj1.ActivityToolItems.Any(ati => ati.ActivityToolItemID == aMentee.ActivityToolItemID))
                            {
                                obj1.ActivityToolItems.Add(
                                     new ActivityLogToolItemInfo
                                     {
                                         ActivityLogActivityToolItemID = aMentee.ActivityLogActivityToolItemID,
                                         ActivityLogID = aMentee.ActivityLogID,
                                         ActivityToolItemID = aMentee.ActivityToolItemID,
                                         ActivityToolItemName = aMentee.ActivityToolItemName,
                                         CreateDate = aMentee.ALTI_CreateDate,
                                         CreatedBy = aMentee.ALTI_CreatedBy,
                                         UpdateDate = aMentee.ALTI_UpdateDate,
                                         UpdatedBy = aMentee.ALTI_UpdatedBy
                                     }
                                );

                            }
                        }
                    }
                    ActivityLogList.Add(obj1);
                }
            }
            return ActivityLogList.AsQueryable<ActivityLogsByTimeConfig>();
        }


        // GET: odata/GetActivityLogsByCampusID: Returns all existing Active Mentors Details
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetActivityLogsByCampusID(CampusID={campusID})")]
        public IQueryable<ActivityLogWithComplexTypeInfo> GetActivityLogsByCampusID([FromODataUri] string campusID)
        {
            // get all existing Mentor Mentee Relationships under HISD
            var MASActivityLogsInfo =
                (
                    from AL in db.ActivityLogs.Where(al => al.CampusID == campusID)
                        // activity codes
                    join ac in db.ActivityCodes
                    on AL.ActivityCodeID equals ac.ActivityCodeID into MasAC
                    from refMasAC in MasAC.DefaultIfEmpty()
                    
                    // activity Standard Items 
                    join ASI_all in (
                            from AL_ASI in db.ActivityLog_ActivityStandardItems
                            join asi in db.ActivityStandardItems
                            on AL_ASI.ActivityStandardItemID equals asi.ActivityStandardItemID into MasASI
                            from MasASIinfo in MasASI.DefaultIfEmpty()
                            select new
                            {
                                ASIActivityLogID = AL_ASI.ActivityLogID,
                                ActivityLogActivityStandardItemID = AL_ASI.ActivityLogActivityStandardItemID,
                                ActivityStandardItemID = AL_ASI.ActivityStandardItemID,
                                ActivityStandardItemName = MasASIinfo.ActivityStandardItemName,
                                ActivityStandardGroupID = MasASIinfo.ActivityStandardGroupID,
                                ALSI_CreateDate = AL_ASI.CreateDate,
                                ALSI_CreatedBy = AL_ASI.CreatedBy,
                                ALSI_UpdateDate = AL_ASI.UpdateDate,
                                ALSI_UpdatedBy = AL_ASI.UpdatedBy

                            }
                    ).DefaultIfEmpty()

                    on AL.ActivityLogID equals ASI_all.ASIActivityLogID into ALnASI
                    from refALSI in ALnASI.DefaultIfEmpty()
                   
                    // activity Tool Items 
                    join ATI_all in (
                            from AL_ATI in db.ActivityLog_ActivityToolItems
                            join ati in db.ActivityToolItems
                            on AL_ATI.ActivityToolItemID equals ati.ActivityToolItemID into MasATI
                            from MasATIinfo in MasATI.DefaultIfEmpty()
                            select new
                            {
                                ATIActivityLogID = AL_ATI.ActivityLogID,
                                ActivityLogActivityToolItemID = AL_ATI.ActivityLogActivityToolItemID,
                                ActivityToolItemID = AL_ATI.ActivityToolItemID,
                                ActivityToolItemName = MasATIinfo.ActivityToolItemName,
                                ALTI_CreateDate = AL_ATI.CreateDate,
                                ALTI_CreatedBy = AL_ATI.CreatedBy,
                                ALTI_UpdateDate = AL_ATI.UpdateDate,
                                ALTI_UpdatedBy = AL_ATI.UpdatedBy

                            }
                    ).DefaultIfEmpty()

                    on AL.ActivityLogID equals ATI_all.ATIActivityLogID into ALnATI
                    from refALTI in ALnATI.DefaultIfEmpty()
                    
                    join AME_all in (
                            from AL_AME in db.ActivityLog_Mentees
                            join mcli in db.MultiChoiceListItems
                            on AL_AME.MultiChoiceListItemID equals mcli.MultiChoiceListItemID into MasAME
                            from MasAMEinfo in MasAME.DefaultIfEmpty()
                            select new
                            {
                                AMEActivityLogID = AL_AME.ActivityLogID,
                                ActivityLogMenteeID = AL_AME.ActivityLogMenteeID,
                                MultiChoiceListItemID = AL_AME.MultiChoiceListItemID,
                                MultiChoiceListItemCode = MasAMEinfo.MultiChoiceListItemCode,
                                MultiChoiceListItemDescription = MasAMEinfo.MultiChoiceListItemDescription,
                                MenteeEmployeeID = AL_AME.MenteeEmployeeID,
                                MenteeVerificationStatus = AL_AME.MenteeVerificationStatus,
                                ALME_CreateDate = AL_AME.CreateDate,
                                ALME_CreatedBy = AL_AME.CreatedBy,
                                ALME_UpdateDate = AL_AME.UpdateDate,
                                ALME_UpdatedBy = AL_AME.UpdatedBy
                            }
                    ).DefaultIfEmpty()

                    on AL.ActivityLogID equals AME_all.AMEActivityLogID into ALnAME
                    from refALME in ALnAME.DefaultIfEmpty()
                    select new
                    {
                        ActivityLogID = AL.ActivityLogID,
                        CampusID = AL.CampusID,

                        ActivityCodeID = AL.ActivityCodeID,
                        ActivityCodeName = refMasAC.ActivityCodeName,
                        ActivityCodeDescription = refMasAC.ActivityCodeDescription,

                        MentorEmployeeID = AL.MentorEmployeeID,
                        MentorComments = AL.MentorComments,

                        ActivityStartTime = AL.ActivityStartTime,
                        //ActivityEndTime = AL.ActivityEndTime,
                        Duration = AL.Duration,

                        ActivityLogActivityStandardItemID = refALSI.ActivityLogActivityStandardItemID,
                        ActivityStandardItemID = refALSI.ActivityStandardItemID,
                        ActivityStandardItemName = refALSI.ActivityStandardItemName,
                        ActivityStandardGroupID = refALSI.ActivityStandardGroupID,
                        
                        ALSI_CreateDate = refALSI.ALSI_CreateDate,
                        ALSI_CreatedBy = refALSI.ALSI_CreatedBy,
                        
                        ALSI_UpdateDate = refALSI.ALSI_UpdateDate,
                        ALSI_UpdatedBy = refALSI.ALSI_UpdatedBy,

                        //Path = img != null ? img.Path : ""
                        ActivityLogActivityToolItemID = refALTI != null ?  refALTI.ActivityLogActivityToolItemID : 0,
                        ActivityToolItemID = refALTI.ActivityToolItemID,
                        ActivityToolItemName = refALTI.ActivityToolItemName,
                        ALTI_CreateDate = refALTI.ALTI_CreateDate,
                        ALTI_CreatedBy = refALTI.ALTI_CreatedBy,
                        ALTI_UpdateDate = refALTI.ALTI_UpdateDate,
                        ALTI_UpdatedBy = refALTI.ALTI_UpdatedBy,

                        ActivityLogMenteeID = refALME.ActivityLogMenteeID,
                        MenteeEmployeeID = refALME.MenteeEmployeeID,
                        MenteeVerificationStatus = refALME.MenteeVerificationStatus,
                        MultiChoiceListItemID = refALME.MultiChoiceListItemID,
                        MultiChoiceListItemCode = refALME.MultiChoiceListItemCode,
                        MultiChoiceListItemDescription = refALME.MultiChoiceListItemDescription,
                        ALME_CreateDate = refALME.ALME_CreateDate,
                        ALME_CreatedBy = refALME.ALME_CreatedBy,
                        ALME_UpdateDate = refALME.ALME_UpdateDate,
                        ALME_UpdatedBy = refALME.ALME_UpdatedBy,

                        CreateDate = AL.CreateDate,
                        CreatedBy = AL.CreatedBy,

                        UpdateDate = AL.UpdateDate,
                        UpdatedBy = AL.UpdatedBy,

                        TimeConfigurationID = AL.TimeConfigurationID

                    }
                    ).AsEnumerable().ToList();

            // Get CSO for this Campus

            var staffCSO =
                (from ED in edwdb.EducationOrganizations.Where(edo => edo.EducationOrgNaturalKey == campusID)
                 join SM in edwdb.SchoolManagers
                 on ED.EducationOrgNaturalKey equals SM.EducationOrgNaturalKey into EducationOrgNCSO
                 from campusCSO in EducationOrgNCSO.DefaultIfEmpty()
                 select new
                 {
                     campusCSO.Up2ManagerStaffNaturalKey,
                     campusCSO.EducationOrgNaturalKey,
                     ED.NameOfInstitution,
                 } into g
                 select g).AsEnumerable().Select(a => new EmployeeInfo
                 {
                     StaffNaturalKey = a.Up2ManagerStaffNaturalKey,
                     EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                     NameOfInstitution = a.NameOfInstitution,
                 }).AsEnumerable().ToList();

            // Retrieve Staff Info from EDW
            String[] CSOEmployeeIDs = staffCSO.Select(cso => cso.StaffNaturalKey).Distinct().ToArray();
            String[] MentorEmployeeIDs = MASActivityLogsInfo.Select(me => me.MentorEmployeeID).Distinct().ToArray();
            String[] MenteeEmployeeIDs = MASActivityLogsInfo.Select(me => me.MenteeEmployeeID).Distinct().ToArray();
            String[] EmployeeIDs = CSOEmployeeIDs.Concat(MentorEmployeeIDs.Concat(MenteeEmployeeIDs)).ToArray();

            var allEDWEmployeesInfo =
               (from ST in edwdb.Staffs
                join STM in edwdb.StaffElectronicEmails
                on ST.StaffNaturalKey equals STM.StaffNaturalKey into StaffEmail
                from se in StaffEmail.DefaultIfEmpty()
                join ED in edwdb.EducationOrganizations
                on ST.EducationOrgNaturalKey equals ED.EducationOrgNaturalKey into StaffOrganization
                from e in StaffOrganization.DefaultIfEmpty()
                join JC in edwdb.JobCodes
                on ST.JobCodeNaturalKey equals JC.JobCodeNaturalKey into StaffJobCode
                from m in StaffJobCode.DefaultIfEmpty()
                where (
                       (EmployeeIDs.Contains(ST.StaffNaturalKey))
                )
                select new
                {
                    ST.StaffNaturalKey,
                    ST.FirstName,
                    ST.LastSurname,
                    ST.MiddleName,
                    ST.LoginId,
                    m.JobCodeDescription,
                    e.EducationOrgNaturalKey,
                    e.NameOfInstitution,
                    se.ElectronicMailAddress,
                    ST.LatestHireDate

                } into g
                select g).AsEnumerable().Select(a => new EmployeeInfo
                 {
                     StaffNaturalKey = a.StaffNaturalKey,
                     FirstName = a.FirstName,
                     LastSurname = a.LastSurname,
                     MiddleName = a.MiddleName,
                     LoginId = a.LoginId,
                     JobCodeDescription = a.JobCodeDescription,
                     EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                     NameOfInstitution = a.NameOfInstitution,
                     ElectronicMailAddress = a.ElectronicMailAddress,
                     LatestHireDate = a.LatestHireDate
                 }).AsEnumerable();

            // Join CSO with MAS Activity Log table 

            var activityLogsWithCSO =
                (from activitylogs in MASActivityLogsInfo
                 join csoEmpID in staffCSO
                 on activitylogs.CampusID equals csoEmpID.EducationOrgNaturalKey 
                 select new
                 {activitylogs, csoEmpID}
                 ).AsEnumerable().ToList();

            // fianl join to populate all information 
            var combinedActivityLogInfos = (                  from masAL in activityLogsWithCSO
                                                              join edwMentorEMPLOYEES in allEDWEmployeesInfo
                                                              on masAL.activitylogs.MentorEmployeeID equals edwMentorEMPLOYEES.StaffNaturalKey into EmpMentorsinAL
                                                              from mentorInAL in EmpMentorsinAL.DefaultIfEmpty()
                                                              join edwMenteeEMPLOYEES in allEDWEmployeesInfo
                                                              on masAL.activitylogs.MenteeEmployeeID equals edwMenteeEMPLOYEES.StaffNaturalKey into EmpMenteesinAL
                                                              from menteeInAL in EmpMenteesinAL.DefaultIfEmpty()
                                                              join edwCSOEMPLOYEE in allEDWEmployeesInfo
                                                              on masAL.csoEmpID.StaffNaturalKey equals edwCSOEMPLOYEE.StaffNaturalKey into EmpCSOinAL
                                                              from CSOInAL in EmpCSOinAL.DefaultIfEmpty()
                                                              select new ActivityLogInfo
                                                              {
                                                                  ActivityLogID = masAL.activitylogs.ActivityLogID,

                                                                  //MENTOR INFO
                                                                  MentorEmployeeID = mentorInAL.StaffNaturalKey,
                                                                  MentorFirstName = mentorInAL.FirstName,
                                                                  MentorLastSurname = mentorInAL.LastSurname,
                                                                  MentorMiddleName = mentorInAL.MiddleName,
                                                                  MentorElectronicMailAddress = mentorInAL.ElectronicMailAddress,
                                                                  MentorJobCodeDescription = mentorInAL.JobCodeDescription,
                                                                  MentorLatestHireDate = mentorInAL.LatestHireDate,
                                                                  //MENTEE INFO
                                                                  MenteeEmployeeID = menteeInAL.StaffNaturalKey,
                                                                  MenteeFirstName = menteeInAL.FirstName,
                                                                  MenteeLastSurname = menteeInAL.LastSurname,
                                                                  MenteeMiddleName = menteeInAL.MiddleName,
                                                                  MenteeElectronicMailAddress = menteeInAL.ElectronicMailAddress,
                                                                  MenteeJobCodeDescription = menteeInAL.JobCodeDescription,
                                                                  MenteeLatestHireDate = menteeInAL.LatestHireDate,
                                                                  MenteeVerificationStatus = masAL.activitylogs.MenteeVerificationStatus,
                                                                  MultiChoiceListItemID = masAL.activitylogs.MultiChoiceListItemID,
                                                                  MultiChoiceListItemCode = masAL.activitylogs.MultiChoiceListItemCode,
                                                                  MultiChoiceListItemDescription = masAL.activitylogs.MultiChoiceListItemDescription,
                                                                  // CAMPUS INFO
                                                                  EducationOrgNaturalKey = mentorInAL.EducationOrgNaturalKey,
                                                                  NameOfInstitution = mentorInAL.NameOfInstitution,

                                                                  // CSO INFO
                                                                  CSOEmployeeID = CSOInAL.StaffNaturalKey,
                                                                  CSOFirstName = CSOInAL.FirstName,
                                                                  CSOLastSurname = CSOInAL.LastSurname,
                                                                  CSOMiddleName = CSOInAL.MiddleName,
                                                                  CSOLoginID = CSOInAL.LoginId,
                                                                  CSOElectronicMailAddress = CSOInAL.ElectronicMailAddress,
                                                                  CSOJobCodeDescription = CSOInAL.JobCodeDescription,
                                                                  CSOLatestHireDate = CSOInAL.LatestHireDate,


                                                                  // Activity Code
                                                                  ActivityCodeID = masAL.activitylogs.ActivityCodeID,
                                                                  ActivityCodeName = masAL.activitylogs.ActivityCodeName,
                                                                  ActivityCodeDescription = masAL.activitylogs.ActivityCodeDescription,


                                                                  //time
                                                                  ActivityStartTime = masAL.activitylogs.ActivityStartTime,
                                                                  //ActivityEndTime = masAL.activitylogs.ActivityEndTime,
                                                                  CreateDate = masAL.activitylogs.CreateDate,
                                                                  CreatedBy = masAL.activitylogs.CreatedBy,
                                                                  UpdateDate = masAL.activitylogs.UpdateDate,
                                                                  UpdatedBy = masAL.activitylogs.UpdatedBy,
                                                                  Duration = masAL.activitylogs.Duration,


                                                                  // Activity Standard Items
                                                                  ActivityLogActivityStandardItemID = masAL.activitylogs.ActivityLogActivityStandardItemID,
                                                                  ActivityStandardItemID = masAL.activitylogs.ActivityStandardItemID,
                                                                  ActivityStandardItemName = masAL.activitylogs.ActivityStandardItemName,
                                                                  ALStandardItem_CreateDate = masAL.activitylogs.ALSI_CreateDate,
                                                                  ALStandardItem_CreatedBy = masAL.activitylogs.ALSI_CreatedBy,
                                                                  ALStandardItem_UpdateDate = masAL.activitylogs.ALSI_UpdateDate,
                                                                  ALStandardItem_UpdatedBy = masAL.activitylogs.ALSI_UpdatedBy,


                                                                  // Activity Tool Items 
                                                                  ActivityLogActivityToolItemID = masAL.activitylogs.ActivityLogActivityToolItemID,
                                                                  ActivityToolItemID = masAL.activitylogs.ActivityToolItemID,
                                                                  ActivityToolItemName = masAL.activitylogs.ActivityToolItemName,
                                                                  ALToolItem_CreateDate = masAL.activitylogs.ALTI_CreateDate,
                                                                  ALToolItem_CreatedBy = masAL.activitylogs.ALTI_CreatedBy,
                                                                  ALToolItem_UpdateDate = masAL.activitylogs.ALTI_UpdateDate,
                                                                  ALToolItem_UpdatedBy = masAL.activitylogs.ALTI_UpdatedBy,

                                                                  //time Configuration ID
                                                                  ActivityLogMenteeID = masAL.activitylogs.ActivityLogMenteeID,
                                                                  MentorComments = masAL.activitylogs.MentorComments,
                                                                  TimeConfigurationID = masAL.activitylogs.TimeConfigurationID,
                                                                  ALMentee_CreateDate = masAL.activitylogs.ALME_CreateDate,
                                                                  ALMentee_CreatedBy = masAL.activitylogs.ALME_CreatedBy,
                                                                  ALMentee_UpdateDate = masAL.activitylogs.ALME_UpdateDate,
                                                                  ALMentee_UpdatedBy = masAL.activitylogs.ALME_UpdatedBy

                                                              }).AsEnumerable().ToList();

            List<ActivityLogWithComplexTypeInfo> ActivityLogList = new List<ActivityLogWithComplexTypeInfo>();
            foreach (var a in combinedActivityLogInfos)
            {
                if (!ActivityLogList.Any(al => al.ActivityLogID == a.ActivityLogID && al.MentorEmployeeID == a.MentorEmployeeID))
                {
                    ActivityLogWithComplexTypeInfo obj1 = new ActivityLogWithComplexTypeInfo();
                    obj1.ActivityLogID = a.ActivityLogID;
                    obj1.TimeConfigurationID = a.TimeConfigurationID;

                    obj1.EducationOrgNaturalKey = a.EducationOrgNaturalKey;
                    obj1.NameOfInstitution = a.NameOfInstitution;

                    obj1.CreateDate = a.CreateDate;
                    obj1.CreatedBy = a.CreatedBy;
                    obj1.UpdateDate = a.UpdateDate;
                    obj1.UpdatedBy = a.UpdatedBy;

                    obj1.ActivityStartTime = a.ActivityStartTime;
                    obj1.Duration = a.Duration;
                    //obj1.ActivityEndTime = a.ActivityEndTime;

                    obj1.ActivityCodeID = a.ActivityCodeID;
                    obj1.ActivityCodeName = a.ActivityCodeName;
                    obj1.ActivityCodeDescription = a.ActivityCodeDescription;
                    //Mentor 
                    obj1.MentorEmployeeID = a.MentorEmployeeID;
                    obj1.MentorFirstName = a.MentorFirstName;
                    obj1.MentorMiddleName = a.MentorMiddleName;
                    obj1.MentorLastSurname = a.MentorLastSurname;
                    obj1.MentorJobCodeDescription = a.MentorJobCodeDescription;
                    obj1.MentorElectronicMailAddress = a.MentorElectronicMailAddress;
                    obj1.MentorComments = a.MentorComments;
                    obj1.MentorName = a.MentorFirstName +" "+a.MentorLastSurname;

                    //CSO Info
                    obj1.CSOEmployeeID = a.CSOEmployeeID;
                    obj1.CSOFirstName = a.CSOFirstName;
                    obj1.CSOLastSurname = a.CSOLastSurname;
                    obj1.CSOMiddleName = a.CSOMiddleName;
                    obj1.CSOLoginID = a.CSOLoginID;
                    obj1.CSOElectronicMailAddress = a.CSOElectronicMailAddress;
                    obj1.CSOJobCodeDescription = a.CSOJobCodeDescription;
                    obj1.CSOLatestHireDate = a.CSOLatestHireDate;
                    
                    obj1.Mentees = new List<ActivityLogMenteeInfo>();

                    // Add all affiliated Mentees 
                    foreach (var aMentee in combinedActivityLogInfos)
                    {
                        if (obj1.ActivityLogID == aMentee.ActivityLogID && obj1.MentorEmployeeID == aMentee.MentorEmployeeID)
                        {
                            if (!obj1.Mentees.Any(omi => omi.StaffNaturalKey == aMentee.MenteeEmployeeID))
                            {
                                obj1.Mentees.Add(
                                     new ActivityLogMenteeInfo
                                     {
                                         ActivityLogMenteeID = aMentee.ActivityLogMenteeID,
                                         ActivityLogID = aMentee.ActivityLogID,
                                         StaffNaturalKey = aMentee.MenteeEmployeeID,
                                         FirstName = aMentee.MenteeFirstName,
                                         LastSurname = aMentee.MenteeLastSurname,
                                         MiddleName = aMentee.MenteeMiddleName,
                                         MenteeName = aMentee.MenteeFirstName +" "+ aMentee.MenteeLastSurname,
                                         JobCodeDescription = aMentee.MenteeJobCodeDescription,
                                         EducationOrgNaturalKey = aMentee.EducationOrgNaturalKey,
                                         NameOfInstitution = aMentee.NameOfInstitution,
                                         ElectronicMailAddress = aMentee.MenteeElectronicMailAddress,
                                         LatestHireDate = aMentee.MenteeLatestHireDate,
                                         VerificationStatus = aMentee.MenteeVerificationStatus,
                                         VerficationCommentItemID = aMentee.MultiChoiceListItemID,
                                         VerificationCommentDescription = aMentee.MultiChoiceListItemDescription,
                                         VerificationCommentCode = aMentee.MultiChoiceListItemCode,
                                         CreateDate = aMentee.ALMentee_CreateDate,
                                         CreatedBy = aMentee.ALMentee_CreatedBy,
                                         UpdateDate = aMentee.ALMentee_UpdateDate,
                                         UpdatedBy = aMentee.ALMentee_UpdatedBy 
                                         
                                     }

                                );

                            }
                        }
                    }

                    obj1.ActivityStandardItems = new List<ActivityLogStandardItemInfo>();
                    // Add all affiliated Activity Standard Items 
                    foreach (var aMentee in combinedActivityLogInfos)
                    {
                        if (obj1.ActivityLogID == aMentee.ActivityLogID && obj1.MentorEmployeeID == aMentee.MentorEmployeeID)
                        {
                            if (!obj1.ActivityStandardItems.Any(asi => asi.ActivityStandardItemID == aMentee.ActivityStandardItemID))
                            {
                                obj1.ActivityStandardItems.Add(
                                     new ActivityLogStandardItemInfo
                                     {
                                         ActivityLogActivityStandardItemID = aMentee.ActivityLogActivityStandardItemID,
                                         ActivityLogID = aMentee.ActivityLogID,
                                         ActivityStandardItemID = aMentee.ActivityStandardItemID,
                                         ActivityStandardItemName = aMentee.ActivityStandardItemName,
                                         CreateDate = aMentee.ALStandardItem_CreateDate,
                                         CreatedBy = aMentee.ALStandardItem_CreatedBy,
                                         UpdateDate = aMentee.ALStandardItem_UpdateDate,
                                         UpdatedBy = aMentee.ALStandardItem_UpdatedBy


                                     }
                                );

                            }
                        }
                    }

                    obj1.ActivityToolItems = new List<ActivityLogToolItemInfo>();
                    // Add all affiliated Activity Tool Items 
                    foreach (var aMentee in combinedActivityLogInfos)
                    {
                        if (obj1.ActivityLogID == aMentee.ActivityLogID && obj1.MentorEmployeeID == aMentee.MentorEmployeeID)
                        {
                            if (!obj1.ActivityToolItems.Any(ati => ati.ActivityToolItemID == aMentee.ActivityToolItemID))
                            {
                                obj1.ActivityToolItems.Add(
                                     new ActivityLogToolItemInfo
                                     {
                                         ActivityLogActivityToolItemID = aMentee.ActivityLogActivityToolItemID,
                                         ActivityLogID = aMentee.ActivityLogID,
                                         ActivityToolItemID = aMentee.ActivityToolItemID,
                                         ActivityToolItemName = aMentee.ActivityToolItemName,
                                         CreateDate = aMentee.ALToolItem_CreateDate,
                                         CreatedBy = aMentee.ALToolItem_CreatedBy,
                                         UpdateDate = aMentee.ALToolItem_UpdateDate,
                                         UpdatedBy = aMentee.ALToolItem_UpdatedBy
                                     }
                                );

                            }
                        }
                    }
                    ActivityLogList.Add(obj1);
               }
        }


            return ActivityLogList.AsQueryable<ActivityLogWithComplexTypeInfo>();
        }
        
        
        // GET: odata/GetAllActivityLogs: Returns all existing Activity Logs for whole HISD district
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetAllActivityLogs")]
        public IQueryable<ActivityLogWithComplexTypeInfo> GetAllActivityLogs()
        {
            // get all existing Mentor Mentee Relationships under HISD
            var MASActivityLogsInfo =
                (
                    from AL in db.ActivityLogs
                        // activity codes
                    join ac in db.ActivityCodes
                    on AL.ActivityCodeID equals ac.ActivityCodeID into MasAC
                    from refMasAC in MasAC.DefaultIfEmpty()

                        // activity Standard Items 
                    join ASI_all in (
                            from AL_ASI in db.ActivityLog_ActivityStandardItems
                            join asi in db.ActivityStandardItems
                            on AL_ASI.ActivityStandardItemID equals asi.ActivityStandardItemID into MasASI
                            from MasASIinfo in MasASI.DefaultIfEmpty()
                            select new
                            {
                                ASIActivityLogID = AL_ASI.ActivityLogID,
                                ActivityLogActivityStandardItemID = AL_ASI.ActivityLogActivityStandardItemID,
                                ActivityStandardItemID = AL_ASI.ActivityStandardItemID,
                                ActivityStandardItemName = MasASIinfo.ActivityStandardItemName,
                                ActivityStandardGroupID = MasASIinfo.ActivityStandardGroupID,
                                ALSI_CreateDate = AL_ASI.CreateDate,
                                ALSI_CreatedBy = AL_ASI.CreatedBy,
                                ALSI_UpdateDate = AL_ASI.UpdateDate,
                                ALSI_UpdatedBy = AL_ASI.UpdatedBy

                            }
                    ).DefaultIfEmpty()
                   
                    on AL.ActivityLogID equals ASI_all.ASIActivityLogID into ALnASI
                    from refALSI in ALnASI.DefaultIfEmpty()
                        // activity Tool Items 
                    join ATI_all in (
                            from AL_ATI in db.ActivityLog_ActivityToolItems
                            join ati in db.ActivityToolItems
                            on AL_ATI.ActivityToolItemID equals ati.ActivityToolItemID into MasATI
                            from MasATIinfo in MasATI.DefaultIfEmpty()
                            select new
                            {
                                ATIActivityLogID = AL_ATI.ActivityLogID,
                                ActivityLogActivityToolItemID = AL_ATI.ActivityLogActivityToolItemID,
                                ActivityToolItemID = AL_ATI.ActivityToolItemID,
                                ActivityToolItemName = MasATIinfo.ActivityToolItemName,
                                ALTI_CreateDate = AL_ATI.CreateDate,
                                ALTI_CreatedBy = AL_ATI.CreatedBy,
                                ALTI_UpdateDate = AL_ATI.UpdateDate,
                                ALTI_UpdatedBy = AL_ATI.UpdatedBy

                            }
                    ).DefaultIfEmpty()

                    on AL.ActivityLogID equals ATI_all.ATIActivityLogID into ALnATI
                    from refALTI in ALnATI.DefaultIfEmpty()
                            // Activity Log Mentees & Verification Comments
                            //join AME_all in db.ActivityLog_Mentees
                        join AME_all in (
                                from AL_AME in db.ActivityLog_Mentees
                                join mcli in db.MultiChoiceListItems
                                on AL_AME.MultiChoiceListItemID equals mcli.MultiChoiceListItemID into MasAME
                                from MasAMEinfo in MasAME.DefaultIfEmpty()
                                select new
                                {
                                    AMEActivityLogID = AL_AME.ActivityLogID,
                                    ActivityLogMenteeID = AL_AME.ActivityLogMenteeID,
                                    MultiChoiceListItemID = AL_AME.MultiChoiceListItemID,
                                    MultiChoiceListItemCode = MasAMEinfo.MultiChoiceListItemCode,
                                    MultiChoiceListItemDescription = MasAMEinfo.MultiChoiceListItemDescription,
                                    MenteeEmployeeID = AL_AME.MenteeEmployeeID,
                                    MenteeVerificationStatus = AL_AME.MenteeVerificationStatus,
                                    ALME_CreateDate = AL_AME.CreateDate,
                                    ALME_CreatedBy = AL_AME.CreatedBy,
                                    ALME_UpdateDate = AL_AME.UpdateDate,
                                    ALME_UpdatedBy = AL_AME.UpdatedBy,
                                    MenteeComments = AL_AME.MenteeComments
                                }
                        ).DefaultIfEmpty()

                        on AL.ActivityLogID equals AME_all.AMEActivityLogID into ALnAME
                        from refALME in ALnAME.DefaultIfEmpty()

                    select new
                    {
                        ActivityLogID = AL.ActivityLogID,
                        CampusID = AL.CampusID,

                        ActivityCodeID = AL.ActivityCodeID,
                        ActivityCodeName = refMasAC.ActivityCodeName,
                        ActivityCodeDescription = refMasAC.ActivityCodeDescription,

                        MentorEmployeeID = AL.MentorEmployeeID,
                        MentorComments = AL.MentorComments,

                        ActivityStartTime = AL.ActivityStartTime,
                        //ActivityEndTime = AL.ActivityEndTime,
                        Duration = AL.Duration,

                        ActivityLogActivityStandardItemID = refALSI.ActivityLogActivityStandardItemID,
                        ActivityStandardItemID = refALSI.ActivityStandardItemID,
                        ActivityStandardItemName = refALSI.ActivityStandardItemName,
                        ActivityStandardGroupID = refALSI.ActivityStandardGroupID,
                        
                        ALSI_CreateDate = refALSI.ALSI_CreateDate,
                        ALSI_CreatedBy = refALSI.ALSI_CreatedBy,

                        ALSI_UpdateDate = refALSI.ALSI_UpdateDate,
                        ALSI_UpdatedBy = refALSI.ALSI_UpdatedBy,

                        ActivityLogActivityToolItemID = refALTI.ActivityLogActivityToolItemID,
                        ActivityToolItemID = refALTI.ActivityToolItemID,
                        ActivityToolItemName = refALTI.ActivityToolItemName,
                        ALTI_CreateDate = refALTI.ALTI_CreateDate,
                        ALTI_CreatedBy = refALTI.ALTI_CreatedBy,
                        ALTI_UpdateDate = refALTI.ALTI_UpdateDate,
                        ALTI_UpdatedBy = refALTI.ALTI_UpdatedBy,

                        ActivityLogMenteeID = refALME.ActivityLogMenteeID,
                        MenteeEmployeeID = refALME.MenteeEmployeeID,
                        MenteeVerificationStatus = refALME.MenteeVerificationStatus,
                        MenteeComments = refALME.MenteeComments,
                        MultiChoiceListItemID = refALME.MultiChoiceListItemID,
                        MultiChoiceListItemCode = refALME.MultiChoiceListItemCode,
                        MultiChoiceListItemDescription = refALME.MultiChoiceListItemDescription,
                        ALME_CreateDate = refALME.ALME_CreateDate,
                        ALME_CreatedBy = refALME.ALME_CreatedBy,
                        ALME_UpdateDate = refALME.ALME_UpdateDate,
                        ALME_UpdatedBy = refALME.ALME_UpdatedBy,
                        CreateDate = AL.CreateDate,
                        CreatedBy = AL.CreatedBy,

                        UpdateDate = AL.UpdateDate,
                        UpdatedBy = AL.UpdatedBy,

                        TimeConfigurationID = AL.TimeConfigurationID
                    }).AsEnumerable().ToList();
            
            // Get CSO for activty affilated Campuses
            String[] activityLogCampuses = MASActivityLogsInfo.Select(aledu => aledu.CampusID).Distinct().ToArray();
            var staffCSOs =
                (from ED in edwdb.EducationOrganizations.Where(edu => activityLogCampuses.Contains(edu.EducationOrgNaturalKey))
                 join SM in edwdb.SchoolManagers
                 on ED.EducationOrgNaturalKey equals SM.EducationOrgNaturalKey into EducationOrgNCSO
                 from campusCSO in EducationOrgNCSO.DefaultIfEmpty()
                 select new
                 {
                     campusCSO.Up2ManagerStaffNaturalKey,
                     campusCSO.EducationOrgNaturalKey,
                     ED.NameOfInstitution,
                 } into g
                 select g).AsEnumerable().Select(a => new EmployeeInfo
                 {
                     StaffNaturalKey = a.Up2ManagerStaffNaturalKey,
                     EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                     NameOfInstitution = a.NameOfInstitution,
                 }).AsEnumerable().ToList();
            
            // Retrieve Staff Info from EDW
            String[] CSOEmployeeIDs = staffCSOs.Select(cso => cso.StaffNaturalKey).Distinct().ToArray();
            String[] MentorEmployeeIDs = MASActivityLogsInfo.Select(me => me.MentorEmployeeID).Distinct().ToArray();
            String[] MenteeEmployeeIDs = MASActivityLogsInfo.Select(me => me.MenteeEmployeeID).Distinct().ToArray();
            String[] EmployeeIDs = CSOEmployeeIDs.Concat(MentorEmployeeIDs.Concat(MenteeEmployeeIDs)).ToArray();

            var allEDWEmployeesInfo =
               (from ST in edwdb.Staffs
                join STM in edwdb.StaffElectronicEmails
                on ST.StaffNaturalKey equals STM.StaffNaturalKey into StaffEmail
                from se in StaffEmail.DefaultIfEmpty()
                join ED in edwdb.EducationOrganizations
                on ST.EducationOrgNaturalKey equals ED.EducationOrgNaturalKey into StaffOrganization
                from e in StaffOrganization.DefaultIfEmpty()
                join JC in edwdb.JobCodes
                on ST.JobCodeNaturalKey equals JC.JobCodeNaturalKey into StaffJobCode
                from m in StaffJobCode.DefaultIfEmpty()
                where (
                       (EmployeeIDs.Contains(ST.StaffNaturalKey))
                )
                select new
                {
                    ST.StaffNaturalKey,
                    ST.FirstName,
                    ST.LastSurname,
                    ST.MiddleName,
                    ST.LoginId,
                    m.JobCodeDescription,
                    e.EducationOrgNaturalKey,
                    e.NameOfInstitution,
                    se.ElectronicMailAddress,
                    ST.LatestHireDate

                } into g
                select g).AsEnumerable().Select(a => new EmployeeInfo
                 {
                     StaffNaturalKey = a.StaffNaturalKey,
                     FirstName = a.FirstName,
                     LastSurname = a.LastSurname,
                     MiddleName = a.MiddleName,
                     LoginId = a.LoginId,
                     JobCodeDescription = a.JobCodeDescription,
                     EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                     NameOfInstitution = a.NameOfInstitution,
                     ElectronicMailAddress = a.ElectronicMailAddress,
                     LatestHireDate = a.LatestHireDate
                 }).AsEnumerable().ToList();

            // Join CSO with MAS Activity Log table 

            var activityLogsWithCSO =
                (from activitylogs in MASActivityLogsInfo
                 join csoEmpID in staffCSOs
                 on activitylogs.CampusID equals csoEmpID.EducationOrgNaturalKey
                 select new
                 { activitylogs, csoEmpID }
                 ).AsEnumerable().ToList();

            // fianl join to populate all information 
            var combinedActivityLogInfos = (from masAL in activityLogsWithCSO
                                            join edwMentorEMPLOYEES in allEDWEmployeesInfo
                                            on masAL.activitylogs.MentorEmployeeID equals edwMentorEMPLOYEES.StaffNaturalKey into EmpMentorsinAL
                                            from mentorInAL in EmpMentorsinAL.DefaultIfEmpty()
                                            join edwMenteeEMPLOYEES in allEDWEmployeesInfo
                                            on masAL.activitylogs.MenteeEmployeeID equals edwMenteeEMPLOYEES.StaffNaturalKey into EmpMenteesinAL
                                            from menteeInAL in EmpMenteesinAL.DefaultIfEmpty()
                                            join edwCSOEMPLOYEE in allEDWEmployeesInfo
                                            on masAL.csoEmpID.StaffNaturalKey equals edwCSOEMPLOYEE.StaffNaturalKey into EmpCSOinAL
                                            from CSOInAL in EmpCSOinAL.DefaultIfEmpty()
                                            select new ActivityLogInfo
                                            {
                                                ActivityLogID = masAL.activitylogs.ActivityLogID,

                                                //MENTOR INFO
                                                MentorEmployeeID = mentorInAL.StaffNaturalKey,
                                                MentorFirstName = mentorInAL.FirstName,
                                                MentorLastSurname = mentorInAL.LastSurname,
                                                MentorMiddleName = mentorInAL.MiddleName,
                                                MentorElectronicMailAddress = mentorInAL.ElectronicMailAddress,
                                                MentorJobCodeDescription = mentorInAL.JobCodeDescription,
                                                MentorLatestHireDate = mentorInAL.LatestHireDate,
                                                //MENTEE INFO
                                                MenteeEmployeeID = menteeInAL.StaffNaturalKey,
                                                MenteeFirstName = menteeInAL.FirstName,
                                                MenteeLastSurname = menteeInAL.LastSurname,
                                                MenteeMiddleName = menteeInAL.MiddleName,
                                                MenteeElectronicMailAddress = menteeInAL.ElectronicMailAddress,
                                                MenteeJobCodeDescription = menteeInAL.JobCodeDescription,
                                                MenteeLatestHireDate = menteeInAL.LatestHireDate,
                                                MenteeVerificationStatus = masAL.activitylogs.MenteeVerificationStatus,
                                                
                                                MultiChoiceListItemID = masAL.activitylogs.MultiChoiceListItemID,
                                                MultiChoiceListItemCode = masAL.activitylogs.MultiChoiceListItemCode,
                                                MultiChoiceListItemDescription = masAL.activitylogs.MultiChoiceListItemDescription,
                                                MenteeComments = masAL.activitylogs.MenteeComments,
                                                // CAMPUS INFO
                                                EducationOrgNaturalKey = mentorInAL.EducationOrgNaturalKey,
                                                NameOfInstitution = mentorInAL.NameOfInstitution,

                                                // CSO INFO
                                                CSOEmployeeID = CSOInAL.StaffNaturalKey,
                                                CSOFirstName = CSOInAL.FirstName,
                                                CSOLastSurname = CSOInAL.LastSurname,
                                                CSOMiddleName = CSOInAL.MiddleName,
                                                CSOLoginID = CSOInAL.LoginId,
                                                CSOElectronicMailAddress = CSOInAL.ElectronicMailAddress,
                                                CSOJobCodeDescription = CSOInAL.JobCodeDescription,
                                                CSOLatestHireDate = CSOInAL.LatestHireDate,


                                                // Activity Code
                                                ActivityCodeID = masAL.activitylogs.ActivityCodeID,
                                                ActivityCodeName = masAL.activitylogs.ActivityCodeName,
                                                ActivityCodeDescription = masAL.activitylogs.ActivityCodeDescription,


                                                //time
                                                ActivityStartTime = masAL.activitylogs.ActivityStartTime,
                                                //ActivityEndTime = masAL.activitylogs.ActivityEndTime,
                                                CreateDate = masAL.activitylogs.CreateDate,
                                                CreatedBy = masAL.activitylogs.CreatedBy,
                                                UpdateDate = masAL.activitylogs.UpdateDate,
                                                UpdatedBy = masAL.activitylogs.UpdatedBy,
                                                Duration = masAL.activitylogs.Duration,


                                                // Activity Standard Items
                                                ActivityLogActivityStandardItemID = masAL.activitylogs.ActivityLogActivityStandardItemID,
                                                ActivityStandardItemID = masAL.activitylogs.ActivityStandardItemID,
                                                ActivityStandardItemName = masAL.activitylogs.ActivityStandardItemName,
                                                ALStandardItem_CreateDate = masAL.activitylogs.ALSI_CreateDate,
                                                ALStandardItem_CreatedBy = masAL.activitylogs.ALSI_CreatedBy,
                                                ALStandardItem_UpdateDate = masAL.activitylogs.ALSI_UpdateDate,
                                                ALStandardItem_UpdatedBy = masAL.activitylogs.ALSI_UpdatedBy,


                                                // Activity Tool Items 
                                                ActivityLogActivityToolItemID = masAL.activitylogs.ActivityLogActivityToolItemID,
                                                ActivityToolItemID = masAL.activitylogs.ActivityToolItemID,
                                                ActivityToolItemName = masAL.activitylogs.ActivityToolItemName,
                                                ALToolItem_CreateDate = masAL.activitylogs.ALTI_CreateDate,
                                                ALToolItem_CreatedBy = masAL.activitylogs.ALTI_CreatedBy,
                                                ALToolItem_UpdateDate = masAL.activitylogs.ALTI_UpdateDate,
                                                ALToolItem_UpdatedBy = masAL.activitylogs.ALTI_UpdatedBy,

                                                //time Configuration ID
                                                ActivityLogMenteeID = masAL.activitylogs.ActivityLogMenteeID,
                                                MentorComments = masAL.activitylogs.MentorComments,
                                                TimeConfigurationID = masAL.activitylogs.TimeConfigurationID,
                                                ALMentee_CreateDate = masAL.activitylogs.ALME_CreateDate,
                                                ALMentee_CreatedBy = masAL.activitylogs.ALME_CreatedBy,
                                                ALMentee_UpdateDate = masAL.activitylogs.ALME_UpdateDate,
                                                ALMentee_UpdatedBy = masAL.activitylogs.ALME_UpdatedBy

                                            }).AsEnumerable().ToList();

            List<ActivityLogWithComplexTypeInfo> ActivityLogList = new List<ActivityLogWithComplexTypeInfo>();
            foreach (var a in combinedActivityLogInfos)
            {
                if (!ActivityLogList.Any(al => al.ActivityLogID == a.ActivityLogID && al.MentorEmployeeID == a.MentorEmployeeID))
                {
                    ActivityLogWithComplexTypeInfo obj1 = new ActivityLogWithComplexTypeInfo();
                    obj1.ActivityLogID = a.ActivityLogID;
                    obj1.TimeConfigurationID = a.TimeConfigurationID;

                    obj1.EducationOrgNaturalKey = a.EducationOrgNaturalKey;
                    obj1.NameOfInstitution = a.NameOfInstitution;

                    obj1.CreateDate = a.CreateDate;
                    obj1.CreatedBy = a.CreatedBy;
                    obj1.UpdateDate = a.UpdateDate;
                    obj1.UpdatedBy = a.UpdatedBy;

                    obj1.ActivityStartTime = a.ActivityStartTime;
                    obj1.Duration = a.Duration;
                    //obj1.ActivityEndTime = a.ActivityEndTime;

                    obj1.ActivityCodeID = a.ActivityCodeID;
                    obj1.ActivityCodeName = a.ActivityCodeName;
                    obj1.ActivityCodeDescription = a.ActivityCodeDescription;

                    obj1.MentorEmployeeID = a.MentorEmployeeID;
                    obj1.MentorFirstName = a.MentorFirstName;
                    obj1.MentorMiddleName = a.MentorMiddleName;
                    obj1.MentorLastSurname = a.MentorLastSurname;
                    obj1.MentorName = a.MentorFirstName + " " +a.MentorLastSurname;
                    obj1.MentorJobCodeDescription = a.MentorJobCodeDescription;
                    obj1.MentorElectronicMailAddress = a.MentorElectronicMailAddress;
                    obj1.MentorComments = a.MentorComments;

                    //CSO Info
                    obj1.CSOEmployeeID = a.CSOEmployeeID;
                    obj1.CSOFirstName = a.CSOFirstName;
                    obj1.CSOLastSurname = a.CSOLastSurname;
                    obj1.CSOMiddleName = a.CSOMiddleName;
                    obj1.CSOLoginID = a.CSOLoginID;
                    obj1.CSOElectronicMailAddress = a.CSOElectronicMailAddress;
                    obj1.CSOJobCodeDescription = a.CSOJobCodeDescription;
                    obj1.CSOLatestHireDate = a.CSOLatestHireDate;

                    obj1.Mentees = new List<ActivityLogMenteeInfo>();

                    // Add all affiliated Mentees 
                    foreach (var aMentee in combinedActivityLogInfos)
                    {
                        if (obj1.ActivityLogID == aMentee.ActivityLogID && obj1.MentorEmployeeID == aMentee.MentorEmployeeID)
                        {
                            if (!obj1.Mentees.Any(omi => omi.StaffNaturalKey == aMentee.MenteeEmployeeID))
                            {
                                obj1.Mentees.Add(
                                     new ActivityLogMenteeInfo
                                     {
                                         ActivityLogMenteeID = aMentee.ActivityLogMenteeID,
                                         ActivityLogID = aMentee.ActivityLogID,
                                         StaffNaturalKey = aMentee.MenteeEmployeeID,
                                         FirstName = aMentee.MenteeFirstName,
                                         LastSurname = aMentee.MenteeLastSurname,
                                         MiddleName = aMentee.MenteeMiddleName,
                                         MenteeName = aMentee.MenteeFirstName +" "+ aMentee.MenteeLastSurname,
                                         JobCodeDescription = aMentee.MenteeJobCodeDescription,
                                         EducationOrgNaturalKey = aMentee.EducationOrgNaturalKey,
                                         NameOfInstitution = aMentee.NameOfInstitution,
                                         ElectronicMailAddress = aMentee.MenteeElectronicMailAddress,
                                         LatestHireDate = aMentee.MenteeLatestHireDate,
                                         VerificationStatus = aMentee.MenteeVerificationStatus,
                                         VerficationCommentItemID = aMentee.MultiChoiceListItemID,
                                         VerificationCommentDescription = aMentee.MultiChoiceListItemDescription,
                                         VerificationCommentCode = aMentee.MultiChoiceListItemCode,
                                         MenteeComments = aMentee.MenteeComments,
                                         CreateDate = aMentee.ALMentee_CreateDate,
                                         CreatedBy = aMentee.ALMentee_CreatedBy,
                                         UpdateDate = aMentee.ALMentee_UpdateDate,
                                         UpdatedBy = aMentee.ALMentee_UpdatedBy

                                     }

                                );

                            }
                        }
                    }

                    obj1.ActivityStandardItems = new List<ActivityLogStandardItemInfo>();
                    // Add all affiliated Activity Standard Items 
                    foreach (var aMentee in combinedActivityLogInfos)
                    {
                        if (obj1.ActivityLogID == aMentee.ActivityLogID && obj1.MentorEmployeeID == aMentee.MentorEmployeeID)
                        {
                            if (!obj1.ActivityStandardItems.Any(asi => asi.ActivityStandardItemID == aMentee.ActivityStandardItemID))
                            {
                                obj1.ActivityStandardItems.Add(
                                     new ActivityLogStandardItemInfo
                                     {
                                         ActivityLogActivityStandardItemID = aMentee.ActivityLogActivityStandardItemID,
                                         ActivityLogID = aMentee.ActivityLogID,
                                         ActivityStandardItemID = aMentee.ActivityStandardItemID,
                                         ActivityStandardItemName = aMentee.ActivityStandardItemName,
                                         CreateDate = aMentee.ALStandardItem_CreateDate,
                                         CreatedBy = aMentee.ALStandardItem_CreatedBy,
                                         UpdateDate = aMentee.ALStandardItem_UpdateDate,
                                         UpdatedBy = aMentee.ALStandardItem_UpdatedBy


                                     }
                                );

                            }
                        }
                    }

                    obj1.ActivityToolItems = new List<ActivityLogToolItemInfo>();
                    // Add all affiliated Activity Tool Items 
                    foreach (var aMentee in combinedActivityLogInfos)
                    {
                        if (obj1.ActivityLogID == aMentee.ActivityLogID && obj1.MentorEmployeeID == aMentee.MentorEmployeeID)
                        {
                            if (!obj1.ActivityToolItems.Any(ati => ati.ActivityToolItemID == aMentee.ActivityToolItemID))
                            {
                                obj1.ActivityToolItems.Add(
                                     new ActivityLogToolItemInfo
                                     {
                                         ActivityLogActivityToolItemID = aMentee.ActivityLogActivityToolItemID,
                                         ActivityLogID = aMentee.ActivityLogID,
                                         ActivityToolItemID = aMentee.ActivityToolItemID,
                                         ActivityToolItemName = aMentee.ActivityToolItemName,
                                         CreateDate = aMentee.ALToolItem_CreateDate,
                                         CreatedBy = aMentee.ALToolItem_CreatedBy,
                                         UpdateDate = aMentee.ALToolItem_UpdateDate,
                                         UpdatedBy = aMentee.ALToolItem_UpdatedBy
                                     }
                                );

                            }
                        }
                    }
                    ActivityLogList.Add(obj1);
                }
            }
            return ActivityLogList.AsQueryable<ActivityLogWithComplexTypeInfo>();
        }

        // GET: odata/GetAllActivityLogs: Returns all existing Activity Logs affiliated with this selected Employee as Mentee
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetActivityLogsByMenteeID(EmployeeID={employeeID})")]
        public IQueryable<ActivityLogWithComplexTypeInfo> GetActivityLogsByMenteeID([FromODataUri] string employeeID)
        {
            // get all Activity Logs relted to this Mentee 
            int [] affiliatedActivityLogIDs = db.ActivityLog_Mentees.Where(alm => alm.MenteeEmployeeID == employeeID).Select(alm => alm.ActivityLogID).Distinct().ToArray();

            // get all existing Mentor Mentee Relationships under HISD
            var MASActivityLogsInfo =
                    ( from AL in db.ActivityLogs.Where(al => affiliatedActivityLogIDs.Contains(al.ActivityLogID))
                        // activity codes
                    join ac in db.ActivityCodes
                    on AL.ActivityCodeID equals ac.ActivityCodeID into MasAC
                    from refMasAC in MasAC.DefaultIfEmpty()

                        // activity Standard Items 
                    join ASI_all in (
                            from AL_ASI in db.ActivityLog_ActivityStandardItems
                            join asi in db.ActivityStandardItems
                            on AL_ASI.ActivityStandardItemID equals asi.ActivityStandardItemID into MasASI
                            from MasASIinfo in MasASI.DefaultIfEmpty()
                            select new
                            {
                                ASIActivityLogID = AL_ASI.ActivityLogID,
                                ActivityLogActivityStandardItemID = AL_ASI.ActivityLogActivityStandardItemID,
                                ActivityStandardItemID = AL_ASI.ActivityStandardItemID,
                                ActivityStandardItemName = MasASIinfo.ActivityStandardItemName,
                                ActivityStandardGroupID = MasASIinfo.ActivityStandardGroupID,
                                ALSI_CreateDate = AL_ASI.CreateDate,
                                ALSI_CreatedBy = AL_ASI.CreatedBy,
                                ALSI_UpdateDate = AL_ASI.UpdateDate,
                                ALSI_UpdatedBy = AL_ASI.UpdatedBy

                            }
                    ).DefaultIfEmpty()

                    on AL.ActivityLogID equals ASI_all.ASIActivityLogID into ALnASI
                    from refALSI in ALnASI.DefaultIfEmpty()

                        // activity Tool Items 
                    join ATI_all in (
                            from AL_ATI in db.ActivityLog_ActivityToolItems
                            join ati in db.ActivityToolItems
                            on AL_ATI.ActivityToolItemID equals ati.ActivityToolItemID into MasATI
                            from MasATIinfo in MasATI.DefaultIfEmpty()
                            select new
                            {
                                ATIActivityLogID = AL_ATI.ActivityLogID,
                                ActivityLogActivityToolItemID = AL_ATI.ActivityLogActivityToolItemID,
                                ActivityToolItemID = AL_ATI.ActivityToolItemID,
                                ActivityToolItemName = MasATIinfo.ActivityToolItemName,
                                ALTI_CreateDate = AL_ATI.CreateDate,
                                ALTI_CreatedBy = AL_ATI.CreatedBy,
                                ALTI_UpdateDate = AL_ATI.UpdateDate,
                                ALTI_UpdatedBy = AL_ATI.UpdatedBy

                            }
                    ).DefaultIfEmpty()

                    on AL.ActivityLogID equals ATI_all.ATIActivityLogID into ALnATI
                    from refALTI in ALnATI.DefaultIfEmpty()

                        // Activity Log Mentees & Verification Comments
                        //join AME_all in db.ActivityLog_Mentees
                    join AME_all in (
                            from AL_AME in db.ActivityLog_Mentees.Where(alm => alm.MenteeEmployeeID == employeeID)
                            join mcli in db.MultiChoiceListItems
                            on AL_AME.MultiChoiceListItemID equals mcli.MultiChoiceListItemID into MasAME
                            from MasAMEinfo in MasAME.DefaultIfEmpty()
                            select new
                            {
                                AMEActivityLogID = AL_AME.ActivityLogID,
                                ActivityLogMenteeID = AL_AME.ActivityLogMenteeID,
                                MultiChoiceListItemID = AL_AME.MultiChoiceListItemID,
                                MultiChoiceListItemCode = MasAMEinfo.MultiChoiceListItemCode,
                                MultiChoiceListItemDescription = MasAMEinfo.MultiChoiceListItemDescription,
                                MenteeEmployeeID = AL_AME.MenteeEmployeeID,
                                MenteeVerificationStatus = AL_AME.MenteeVerificationStatus,
                                MenteeComments = AL_AME.MenteeComments,
                                ALME_CreateDate = AL_AME.CreateDate,
                                ALME_CreatedBy = AL_AME.CreatedBy,
                                ALME_UpdateDate = AL_AME.UpdateDate,
                                ALME_UpdatedBy = AL_AME.UpdatedBy
                            }
                    ).DefaultIfEmpty()

                    on AL.ActivityLogID equals AME_all.AMEActivityLogID into ALnAME
                    from refALME in ALnAME.DefaultIfEmpty()
                    select new
                    {
                        ActivityLogID = AL.ActivityLogID,
                        CampusID = AL.CampusID,

                        ActivityCodeID = AL.ActivityCodeID,
                        ActivityCodeName = refMasAC.ActivityCodeName,
                        ActivityCodeDescription = refMasAC.ActivityCodeDescription,

                        MentorEmployeeID = AL.MentorEmployeeID,
                        MentorComments = AL.MentorComments,

                        ActivityStartTime = AL.ActivityStartTime,
                        //ActivityEndTime = AL.ActivityEndTime,
                        Duration = AL.Duration,

                        ActivityLogActivityStandardItemID = refALSI.ActivityLogActivityStandardItemID,
                        ActivityStandardItemID = refALSI.ActivityStandardItemID,
                        ActivityStandardItemName = refALSI.ActivityStandardItemName,
                        ActivityStandardGroupID = refALSI.ActivityStandardGroupID,

                        ALSI_CreateDate = refALSI.ALSI_CreateDate,
                        ALSI_CreatedBy = refALSI.ALSI_CreatedBy,

                        ALSI_UpdateDate = refALSI.ALSI_UpdateDate,
                        ALSI_UpdatedBy = refALSI.ALSI_UpdatedBy,

                        ActivityLogActivityToolItemID = refALTI.ActivityLogActivityToolItemID,
                        ActivityToolItemID = refALTI.ActivityToolItemID,
                        ActivityToolItemName = refALTI.ActivityToolItemName,
                        ALTI_CreateDate = refALTI.ALTI_CreateDate,
                        ALTI_CreatedBy = refALTI.ALTI_CreatedBy,
                        ALTI_UpdateDate = refALTI.ALTI_UpdateDate,
                        ALTI_UpdatedBy = refALTI.ALTI_UpdatedBy,

                        ActivityLogMenteeID = refALME.ActivityLogMenteeID,
                        MenteeEmployeeID = refALME.MenteeEmployeeID,
                        MenteeVerificationStatus = refALME.MenteeVerificationStatus,
                        MultiChoiceListItemID = refALME.MultiChoiceListItemID,
                        MultiChoiceListItemCode = refALME.MultiChoiceListItemCode,
                        MultiChoiceListItemDescription = refALME.MultiChoiceListItemDescription,
                        MenteeComments = refALME.MenteeComments,
                        ALME_CreateDate = refALME.ALME_CreateDate,
                        ALME_CreatedBy = refALME.ALME_CreatedBy,
                        ALME_UpdateDate = refALME.ALME_UpdateDate,
                        ALME_UpdatedBy = refALME.ALME_UpdatedBy,

                        CreateDate = AL.CreateDate,
                        CreatedBy = AL.CreatedBy,

                        UpdateDate = AL.UpdateDate,
                        UpdatedBy = AL.UpdatedBy,

                        TimeConfigurationID = AL.TimeConfigurationID
                    }
                    ).AsEnumerable().ToList();

            // Retrieve Staff Info from EDW
            List<string> EmployeeIDs = new List<string>();
            EmployeeIDs.Add(MASActivityLogsInfo.Select(me => me.MentorEmployeeID).FirstOrDefault().ToString());
            EmployeeIDs.Add(employeeID);
            
            var allEDWEmployeesInfo =
               (from ST in edwdb.Staffs
                join STM in edwdb.StaffElectronicEmails
                on ST.StaffNaturalKey equals STM.StaffNaturalKey into StaffEmail
                from se in StaffEmail.DefaultIfEmpty()
                join ED in edwdb.EducationOrganizations
                on ST.EducationOrgNaturalKey equals ED.EducationOrgNaturalKey into StaffOrganization
                from e in StaffOrganization.DefaultIfEmpty()
                join JC in edwdb.JobCodes
                on ST.JobCodeNaturalKey equals JC.JobCodeNaturalKey into StaffJobCode
                from m in StaffJobCode.DefaultIfEmpty()
                where (
                       (EmployeeIDs.Contains(ST.StaffNaturalKey))
                )
                select new
                {
                    ST.StaffNaturalKey,
                    ST.FirstName,
                    ST.LastSurname,
                    ST.MiddleName,
                    ST.LoginId,
                    m.JobCodeDescription,
                    e.EducationOrgNaturalKey,
                    e.NameOfInstitution,
                    se.ElectronicMailAddress,
                    ST.LatestHireDate

                } into g
                select g).AsEnumerable().Select(a => new EmployeeInfo
                {
                    StaffNaturalKey = a.StaffNaturalKey,
                    FirstName = a.FirstName,
                    LastSurname = a.LastSurname,
                    MiddleName = a.MiddleName,
                    LoginId = a.LoginId,
                    JobCodeDescription = a.JobCodeDescription,
                    EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                    NameOfInstitution = a.NameOfInstitution,
                    ElectronicMailAddress = a.ElectronicMailAddress,
                    LatestHireDate = a.LatestHireDate
                }).AsEnumerable().ToList();
            
            // fianl join to populate all information 
            var combinedActivityLogInfos = (from masAL in MASActivityLogsInfo
                                            join edwMentorEMPLOYEES in allEDWEmployeesInfo
                                            on masAL.MentorEmployeeID equals edwMentorEMPLOYEES.StaffNaturalKey into EmpMentorsinAL
                                            from mentorInAL in EmpMentorsinAL.DefaultIfEmpty()
                                            join edwMenteeEMPLOYEES in allEDWEmployeesInfo
                                            on masAL.MenteeEmployeeID equals edwMenteeEMPLOYEES.StaffNaturalKey into EmpMenteesinAL
                                            from menteeInAL in EmpMenteesinAL.DefaultIfEmpty()
                                            select new ActivityLogInfo
                                            {
                                                ActivityLogID = masAL.ActivityLogID,

                                                //MENTOR INFO
                                                MentorEmployeeID = mentorInAL.StaffNaturalKey,
                                                MentorFirstName = mentorInAL.FirstName,
                                                MentorLastSurname = mentorInAL.LastSurname,
                                                MentorMiddleName = mentorInAL.MiddleName,
                                                MentorElectronicMailAddress = mentorInAL.ElectronicMailAddress,
                                                MentorJobCodeDescription = mentorInAL.JobCodeDescription,
                                                MentorLatestHireDate = mentorInAL.LatestHireDate,
                                                //MENTEE INFO
                                                MenteeEmployeeID = menteeInAL.StaffNaturalKey,
                                                MenteeFirstName = menteeInAL.FirstName,
                                                MenteeLastSurname = menteeInAL.LastSurname,
                                                MenteeMiddleName = menteeInAL.MiddleName,
                                                MenteeElectronicMailAddress = menteeInAL.ElectronicMailAddress,
                                                MenteeJobCodeDescription = menteeInAL.JobCodeDescription,
                                                MenteeLatestHireDate = menteeInAL.LatestHireDate,
                                                MenteeVerificationStatus = masAL.MenteeVerificationStatus,
                                                MultiChoiceListItemID = masAL.MultiChoiceListItemID,
                                                MultiChoiceListItemCode = masAL.MultiChoiceListItemCode,
                                                MultiChoiceListItemDescription = masAL.MultiChoiceListItemDescription,
                                                MenteeComments = masAL.MenteeComments,
                                                // CAMPUS INFO
                                                EducationOrgNaturalKey = mentorInAL.EducationOrgNaturalKey,
                                                NameOfInstitution = mentorInAL.NameOfInstitution,

                                                // Activity Code
                                                ActivityCodeID = masAL.ActivityCodeID,
                                                ActivityCodeName = masAL.ActivityCodeName,
                                                ActivityCodeDescription = masAL.ActivityCodeDescription,


                                                //time
                                                ActivityStartTime = masAL.ActivityStartTime,
                                                //ActivityEndTime = masAL.ActivityEndTime,
                                                CreateDate = masAL.CreateDate,
                                                CreatedBy = masAL.CreatedBy,
                                                UpdateDate = masAL.UpdateDate,
                                                UpdatedBy = masAL.UpdatedBy,
                                                Duration = masAL.Duration,


                                                // Activity Standard Items
                                                ActivityLogActivityStandardItemID = masAL.ActivityLogActivityStandardItemID,
                                                ActivityStandardItemID = masAL.ActivityStandardItemID,
                                                ActivityStandardItemName = masAL.ActivityStandardItemName,
                                                ALStandardItem_CreateDate = masAL.ALSI_CreateDate,
                                                ALStandardItem_CreatedBy = masAL.ALSI_CreatedBy,
                                                ALStandardItem_UpdateDate = masAL.ALSI_UpdateDate,
                                                ALStandardItem_UpdatedBy = masAL.ALSI_UpdatedBy,


                                                // Activity Tool Items 
                                                ActivityLogActivityToolItemID = masAL.ActivityLogActivityToolItemID,
                                                ActivityToolItemID = masAL.ActivityToolItemID,
                                                ActivityToolItemName = masAL.ActivityToolItemName,
                                                ALToolItem_CreateDate = masAL.ALTI_CreateDate,
                                                ALToolItem_CreatedBy = masAL.ALTI_CreatedBy,
                                                ALToolItem_UpdateDate = masAL.ALTI_UpdateDate,
                                                ALToolItem_UpdatedBy = masAL.ALTI_UpdatedBy,

                                                //time Configuration ID
                                                ActivityLogMenteeID = masAL.ActivityLogMenteeID,
                                                MentorComments = masAL.MentorComments,
                                                TimeConfigurationID = masAL.TimeConfigurationID,
                                                ALMentee_CreateDate = masAL.ALME_CreateDate,
                                                ALMentee_CreatedBy = masAL.ALME_CreatedBy,
                                                ALMentee_UpdateDate = masAL.ALME_UpdateDate,
                                                ALMentee_UpdatedBy = masAL.ALME_UpdatedBy

                                            }).AsEnumerable().ToList();
            
            List<ActivityLogWithComplexTypeInfo> ActivityLogList = new List<ActivityLogWithComplexTypeInfo>();
            foreach (var a in combinedActivityLogInfos)
            {
                if (!ActivityLogList.Any(al => al.ActivityLogID == a.ActivityLogID && al.MentorEmployeeID == a.MentorEmployeeID))
                {
                    ActivityLogWithComplexTypeInfo obj1 = new ActivityLogWithComplexTypeInfo();
                    obj1.ActivityLogID = a.ActivityLogID;
                    obj1.TimeConfigurationID = a.TimeConfigurationID;

                    obj1.EducationOrgNaturalKey = a.EducationOrgNaturalKey;
                    obj1.NameOfInstitution = a.NameOfInstitution;

                    obj1.CreateDate = a.CreateDate;
                    obj1.CreatedBy = a.CreatedBy;
                    obj1.UpdateDate = a.UpdateDate;
                    obj1.UpdatedBy = a.UpdatedBy;

                    obj1.ActivityStartTime = a.ActivityStartTime;
                    obj1.Duration = a.Duration;
                    //obj1.ActivityEndTime = a.ActivityEndTime;

                    obj1.ActivityCodeID = a.ActivityCodeID;
                    obj1.ActivityCodeName = a.ActivityCodeName;
                    obj1.ActivityCodeDescription = a.ActivityCodeDescription;

                    obj1.MentorEmployeeID = a.MentorEmployeeID;
                    obj1.MentorFirstName = a.MentorFirstName;
                    obj1.MentorMiddleName = a.MentorMiddleName;
                    obj1.MentorLastSurname = a.MentorLastSurname;
                    obj1.MentorName = a.MentorFirstName + " " + a.MentorLastSurname;
                    obj1.MentorJobCodeDescription = a.MentorJobCodeDescription;
                    obj1.MentorElectronicMailAddress = a.MentorElectronicMailAddress;
                    obj1.MentorComments = a.MentorComments;
                    
                    obj1.Mentees = new List<ActivityLogMenteeInfo>();

                    // Add all affiliated Mentees 
                    foreach (var aMentee in combinedActivityLogInfos)
                    {
                        if (obj1.ActivityLogID == aMentee.ActivityLogID && obj1.MentorEmployeeID == aMentee.MentorEmployeeID)
                        {
                            if (!obj1.Mentees.Any(omi => omi.StaffNaturalKey == aMentee.MenteeEmployeeID))
                            {
                                obj1.Mentees.Add(
                                     new ActivityLogMenteeInfo
                                     {
                                         ActivityLogMenteeID = aMentee.ActivityLogMenteeID,
                                         ActivityLogID = aMentee.ActivityLogID,
                                         StaffNaturalKey = aMentee.MenteeEmployeeID,
                                         FirstName = aMentee.MenteeFirstName,
                                         LastSurname = aMentee.MenteeLastSurname,
                                         MiddleName = aMentee.MenteeMiddleName,
                                         MenteeName = aMentee.MenteeFirstName + " " +aMentee.MenteeLastSurname,
                                         JobCodeDescription = aMentee.MenteeJobCodeDescription,
                                         EducationOrgNaturalKey = aMentee.EducationOrgNaturalKey,
                                         NameOfInstitution = aMentee.NameOfInstitution,
                                         ElectronicMailAddress = aMentee.MenteeElectronicMailAddress,
                                         LatestHireDate = aMentee.MenteeLatestHireDate,
                                         VerificationStatus = aMentee.MenteeVerificationStatus,
                                         VerficationCommentItemID = aMentee.MultiChoiceListItemID,
                                         VerificationCommentDescription = aMentee.MultiChoiceListItemDescription,
                                         VerificationCommentCode = aMentee.MultiChoiceListItemCode,
                                         MenteeComments = aMentee.MenteeComments,
                                         CreateDate = aMentee.ALMentee_CreateDate,
                                         CreatedBy = aMentee.ALMentee_CreatedBy,
                                         UpdateDate = aMentee.ALMentee_UpdateDate,
                                         UpdatedBy = aMentee.ALMentee_UpdatedBy

                                     }

                                );

                            }
                        }
                    }

                    obj1.ActivityStandardItems = new List<ActivityLogStandardItemInfo>();
                    // Add all affiliated Activity Standard Items 
                    foreach (var aMentee in combinedActivityLogInfos)
                    {
                        if (obj1.ActivityLogID == aMentee.ActivityLogID && obj1.MentorEmployeeID == aMentee.MentorEmployeeID)
                        {
                            if (!obj1.ActivityStandardItems.Any(asi => asi.ActivityStandardItemID == aMentee.ActivityStandardItemID))
                            {
                                obj1.ActivityStandardItems.Add(
                                     new ActivityLogStandardItemInfo
                                     {
                                         ActivityLogActivityStandardItemID = aMentee.ActivityLogActivityStandardItemID,
                                         ActivityLogID = aMentee.ActivityLogID,
                                         ActivityStandardItemID = aMentee.ActivityStandardItemID,
                                         ActivityStandardItemName = aMentee.ActivityStandardItemName,
                                         CreateDate = aMentee.ALStandardItem_CreateDate,
                                         CreatedBy = aMentee.ALStandardItem_CreatedBy,
                                         UpdateDate = aMentee.ALStandardItem_UpdateDate,
                                         UpdatedBy = aMentee.ALStandardItem_UpdatedBy


                                     }
                                );

                            }
                        }
                    }

                    obj1.ActivityToolItems = new List<ActivityLogToolItemInfo>();
                    // Add all affiliated Activity Tool Items 
                    foreach (var aMentee in combinedActivityLogInfos)
                    {
                        if (obj1.ActivityLogID == aMentee.ActivityLogID && obj1.MentorEmployeeID == aMentee.MentorEmployeeID)
                        {
                            if (!obj1.ActivityToolItems.Any(ati => ati.ActivityToolItemID == aMentee.ActivityToolItemID))
                            {
                                obj1.ActivityToolItems.Add(
                                     new ActivityLogToolItemInfo
                                     {
                                         ActivityLogActivityToolItemID = aMentee.ActivityLogActivityToolItemID,
                                         ActivityLogID = aMentee.ActivityLogID,
                                         ActivityToolItemID = aMentee.ActivityToolItemID,
                                         ActivityToolItemName = aMentee.ActivityToolItemName,
                                         CreateDate = aMentee.ALToolItem_CreateDate,
                                         CreatedBy = aMentee.ALToolItem_CreatedBy,
                                         UpdateDate = aMentee.ALToolItem_UpdateDate,
                                         UpdatedBy = aMentee.ALToolItem_UpdatedBy
                                     }
                                );

                            }
                        }
                    }
                    ActivityLogList.Add(obj1);
                }
            }
            return ActivityLogList.AsQueryable<ActivityLogWithComplexTypeInfo>();
        }

        
        // GET: odata/GetAllActivityLogsTotalTime: Returns Timiming surmmary of Activity Logs
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetActivityLogsTotalTime")]
        public IQueryable<ActivityLogTotalTimeInfo> GetActivityLogsTotalTime()
        {
            // get all existing ActivityLog Details
            var MASActivityLogsInfo = db.ActivityLogs.AsEnumerable().ToList();

            
            // Get CSO for activty affilated Campuses
            String[] activityLogCampuses = MASActivityLogsInfo.Select(aledu => aledu.CampusID).Distinct().ToArray();


            // ActivityLog with Campus Name
            var MASActivityLogsCampusName =
                (from EDUname in edwdb.EducationOrganizations.Where(edu => activityLogCampuses.Contains(edu.EducationOrgNaturalKey))
                 select new
                 { EDUname.EducationOrgNaturalKey,
                 EDUname.NameOfInstitution});
            // Now join campus name with Activity Log infos

            var MASActivityLogsWithCampusInfo =
                (from activitylogs in MASActivityLogsInfo
                 join campusName in MASActivityLogsCampusName
                 on activitylogs.CampusID equals campusName.EducationOrgNaturalKey
                 select new
                 { activitylogs, campusName.NameOfInstitution }
                 ).AsEnumerable().ToList();

            // Get CSO for activty affilated Campuses
            var staffCSOs =
                (from ED in edwdb.EducationOrganizations.Where(edu => activityLogCampuses.Contains(edu.EducationOrgNaturalKey))
                 join SM in edwdb.SchoolManagers
                 on ED.EducationOrgNaturalKey equals SM.EducationOrgNaturalKey into EducationOrgNCSO
                 from campusCSO in EducationOrgNCSO.DefaultIfEmpty()
                 select new
                 {
                     campusCSO.Up2ManagerStaffNaturalKey,
                     campusCSO.EducationOrgNaturalKey,
                     ED.NameOfInstitution,
                 } into g
                 select g).AsEnumerable().Select(a => new EmployeeInfo
                 {
                     StaffNaturalKey = a.Up2ManagerStaffNaturalKey,
                     EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                     NameOfInstitution = a.NameOfInstitution,
                 }).AsEnumerable().ToList();

            // Retrieve Staff Info from EDW
            String[] CSOEmployeeIDs = staffCSOs.Select(cso => cso.StaffNaturalKey).Distinct().ToArray();
            //String[] MentorEmployeeIDs = MASActivityLogsInfo.Select(me => me.MentorEmployeeID).Distinct().ToArray();
            //String[] EmployeeIDs = CSOEmployeeIDs.Concat(MentorEmployeeIDs).ToArray();

            var allEDWEmployeesInfo =
               (from ST in edwdb.Staffs
                join STM in edwdb.StaffElectronicEmails
                on ST.StaffNaturalKey equals STM.StaffNaturalKey into StaffEmail
                from se in StaffEmail.DefaultIfEmpty()
                join ED in edwdb.EducationOrganizations
                on ST.EducationOrgNaturalKey equals ED.EducationOrgNaturalKey into StaffOrganization
                from e in StaffOrganization.DefaultIfEmpty()
                join JC in edwdb.JobCodes
                on ST.JobCodeNaturalKey equals JC.JobCodeNaturalKey into StaffJobCode
                from m in StaffJobCode.DefaultIfEmpty()
                where (
                       (CSOEmployeeIDs.Contains(ST.StaffNaturalKey))
                )
                select new
                {
                    ST.StaffNaturalKey,
                    ST.FirstName,
                    ST.LastSurname,
                    ST.MiddleName,
                    ST.LoginId,
                    m.JobCodeDescription,
                    e.EducationOrgNaturalKey,
                    e.NameOfInstitution,
                    se.ElectronicMailAddress,
                    ST.LatestHireDate

                } into g
                select g).AsEnumerable().Select(a => new EmployeeInfo
                {
                    StaffNaturalKey = a.StaffNaturalKey,
                    FirstName = a.FirstName,
                    LastSurname = a.LastSurname,
                    MiddleName = a.MiddleName,
                    LoginId = a.LoginId,
                    JobCodeDescription = a.JobCodeDescription,
                    EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                    NameOfInstitution = a.NameOfInstitution,
                    ElectronicMailAddress = a.ElectronicMailAddress,
                    LatestHireDate = a.LatestHireDate
                }).AsEnumerable().ToList();

            // Join CSO with MAS Activity Log table 

            var activityLogsWithCSO =
                (from activitylogs in MASActivityLogsWithCampusInfo
                 join csoEmpID in staffCSOs
                 on activitylogs.activitylogs.CampusID equals csoEmpID.EducationOrgNaturalKey
                 select new
                 { activitylogs, csoEmpID }
                 ).AsEnumerable().ToList();

            // fianl join to populate all information 
            var combinedActivityLogTotalInfos = (from masAL in activityLogsWithCSO
                                            //join edwMentorEMPLOYEES in allEDWEmployeesInfo
                                            //on masAL.activitylogs.MentorEmployeeID equals edwMentorEMPLOYEES.StaffNaturalKey into EmpMentorsinAL
                                            //from mentorInAL in EmpMentorsinAL.DefaultIfEmpty()
                                            join edwCSOEMPLOYEE in allEDWEmployeesInfo
                                            on masAL.csoEmpID.StaffNaturalKey equals edwCSOEMPLOYEE.StaffNaturalKey into EmpCSOinAL
                                            from CSOInAL in EmpCSOinAL.DefaultIfEmpty()
                                            select new 
                                            {
                                                
                                                // CAMPUS INFO
                                                EducationOrgNaturalKey = masAL.activitylogs.activitylogs.CampusID, // mentorInAL.EducationOrgNaturalKey,
                                                NameOfInstitution = masAL.activitylogs.NameOfInstitution,

                                                // CSO INFO
                                                CSOEmployeeID = CSOInAL.StaffNaturalKey,
                                                CSOFirstName = CSOInAL.FirstName,
                                                CSOLastSurname = CSOInAL.LastSurname,
                                                CSOMiddleName = CSOInAL.MiddleName,
                                                CSOLoginID = CSOInAL.LoginId,
                                                CSOElectronicMailAddress = CSOInAL.ElectronicMailAddress,
                                                CSOJobCodeDescription = CSOInAL.JobCodeDescription,
                                                CSOLatestHireDate = CSOInAL.LatestHireDate,
                                                
                                                //time
                                                Duration = masAL.activitylogs.activitylogs.Duration,
                                                
                                            } into g
                                              select g).GroupBy(x => new { x.CSOEmployeeID, x.EducationOrgNaturalKey })
                                              
                                              .Select(x => new
                                              {

                                                  CSOEmployeeID = x.Max(z => z.CSOEmployeeID),
                                                  EducationOrgNaturalKey = x.Max(z => z.EducationOrgNaturalKey),

                                                  CSOFirstName = x.Max(z => z.CSOFirstName),
                                                  CSOLastSurname = x.Max(z => z.CSOLastSurname),
                                                  CSOMiddleName = x.Max(z => z.CSOMiddleName),
                                                  CSOLoginID = x.Max(z => z.CSOLoginID),
                                                  CSOElectronicMailAddress = x.Max(z => z.CSOElectronicMailAddress),
                                                  CSOJobCodeDescription = x.Max(z => z.CSOJobCodeDescription),
                                                  CSOLatestHireDate = x.Max(z => z.CSOLatestHireDate),
                                                  
                                                  NameOfInstitution = x.Max(z => z.NameOfInstitution),
                                                  
                                                  //time
                                                  Duration = x.Sum(z => z.Duration)


                                              }).AsEnumerable().Select(a => new ActivityLogTotalTimeInfo
                                              {
                                                  // CAMPUS INFO
                                                  EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                                                  NameOfInstitution = a.NameOfInstitution,

                                                  // CSO INFO
                                                  CSOEmployeeID = a.CSOEmployeeID,
                                                  CSOFirstName = a.CSOFirstName,
                                                  CSOLastSurname = a.CSOLastSurname,
                                                  CSOMiddleName = a.CSOMiddleName,
                                                  CSOLoginID = a.CSOLoginID,
                                                  CSOElectronicMailAddress = a.CSOElectronicMailAddress,
                                                  CSOJobCodeDescription = a.CSOJobCodeDescription,
                                                  CSOLatestHireDate = a.CSOLatestHireDate,
                                                  
                                                  //time
                                                  TotalDuration = a.Duration,
                                               }).AsEnumerable().ToList();

            
            return combinedActivityLogTotalInfos.AsQueryable<ActivityLogTotalTimeInfo>();
        }

        // GET: odata/GetActivityLogsCompletedByMentor: Returns Summary of Activity Logs completion by Mentors
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetActivityLogsCompletedByMentor")]
        public IQueryable<ActivityLogCompetedByMentorInfo> GetActivityLogsCompletedByMentor()
        //public IHttpActionResult GetActivityLogsCompletedByMentor()
        {

            // get the #of log requirements: table -> CBMStandard 
            var MASALReferenceCount =
                db.CBMStandards.Where(cbms => cbms.Month == System.DateTime.Now.Month && cbms.Year == System.DateTime.Now.Year.ToString())
               .Select(x => x.NoOfLogs);
            int refActivityLogsRequiredCount = Convert.ToInt32(MASALReferenceCount.FirstOrDefault());
            
            // get all logs inputed by Mentors and accumulate on each realtionship 
            var MASActivityLogsCountPerRelationshipID = db.ActivityLog_Mentees.GroupBy(x => x.MentorMenteeRelationshipID)
                .Select(x => new
                {
                    RelationshipID = x.Key,
                    ActivityLogCount = x.Count()
                });
            // Populate all details for existing Mentor Mentee Relationships 
            // get all existing Mentor Mentee Relationships under HISD
            var allMASMentorMenteeRelationshipsInfo = db.MentorMenteeRelationships.AsEnumerable();

            // retrieve the CIC/Principal as stored CreatedBy in Relationship table 
            string[] CICorPrincipalLoginIDs = allMASMentorMenteeRelationshipsInfo.Select(cp => cp.CreatedBy).Distinct().ToArray();

            String[] MentorEmployeeIDs = allMASMentorMenteeRelationshipsInfo.Select(me => me.MentorEmployeeID).Distinct().ToArray();
            String[] MenteeEmployeeIDs = allMASMentorMenteeRelationshipsInfo.Select(me => me.MenteeEmployeeID).Distinct().ToArray();
            //String[] EmployeeIDs = CICorPrincipalEmployeeIDs.Concat(MentorEmployeeIDs.Concat(MenteeEmployeeIDs)).ToArray();
            String[] EmployeeIDs = MentorEmployeeIDs.Concat(MenteeEmployeeIDs).ToArray();

            var allEDWEmployeesInfo =
               (from ST in edwdb.Staffs
                join STM in edwdb.StaffElectronicEmails
                on ST.StaffNaturalKey equals STM.StaffNaturalKey into StaffEmail
                from se in StaffEmail.DefaultIfEmpty()
                join ED in edwdb.EducationOrganizations
                on ST.EducationOrgNaturalKey equals ED.EducationOrgNaturalKey into StaffOrganization
                from e in StaffOrganization.DefaultIfEmpty()
                    //adding ACP
                join SA in edwdb.StaffAccomplishments.Where(x => x.HighestLevelDegreeIndicator == 1)
                on ST.StaffNaturalKey equals SA.StaffNaturalKey into StaffNAccomplishment
                from SAH in StaffNAccomplishment.DefaultIfEmpty()
                join SAT in edwdb.AccomplishmentTypes
                on SAH.AccomplishmentTypeNaturalKey equals SAT.AccomplishmentTypeNaturalKey into StaffAccomplishmentDegree
                from SAHD in StaffAccomplishmentDegree.DefaultIfEmpty()

                join JC in edwdb.JobCodes
                on ST.JobCodeNaturalKey equals JC.JobCodeNaturalKey into StaffJobCode
                from m in StaffJobCode.DefaultIfEmpty()
                where (
                       (EmployeeIDs.Contains(ST.StaffNaturalKey)) || (CICorPrincipalLoginIDs.Contains(ST.LoginId))
                )
                select new
                {
                    ST.StaffNaturalKey,
                    ST.FirstName,
                    ST.LastSurname,
                    ST.MiddleName,
                    ST.LoginId,
                    m.JobCodeDescription,
                    e.EducationOrgNaturalKey,
                    e.NameOfInstitution,
                    e.LocalOrganizationCode,
                    se.ElectronicMailAddress,
                    ST.LatestHireDate,
                    SAHD.AccomplishmentTypeDescription

                } into g
                select g).AsEnumerable().Select(a => new MenteeInfo // Mentee is considered as the superset of all employees affiliated here
                {
                    StaffNaturalKey = a.StaffNaturalKey,
                    FirstName = a.FirstName,
                    LastSurname = a.LastSurname,
                    MiddleName = a.MiddleName,
                    LoginId = a.LoginId,
                    JobCodeDescription = a.JobCodeDescription,
                    EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                    NameOfInstitution = a.NameOfInstitution,
                    LocalOrganizationCode = a.LocalOrganizationCode,
                    ElectronicMailAddress = a.ElectronicMailAddress,
                    LatestHireDate = a.LatestHireDate,
                    ACP = a.AccomplishmentTypeDescription

                }).AsEnumerable();

            var combinedMentorMenteeRelationshipInfos = (from masMMR in allMASMentorMenteeRelationshipsInfo
                                                         join edwMentorEMPLOYEES in allEDWEmployeesInfo
                                                         on masMMR.MentorEmployeeID equals edwMentorEMPLOYEES.StaffNaturalKey into EmpMentorsinMMR
                                                         from mentorInMMR in EmpMentorsinMMR.DefaultIfEmpty()
                                                         join edwMenteeEMPLOYEES in allEDWEmployeesInfo
                                                         on masMMR.MenteeEmployeeID equals edwMenteeEMPLOYEES.StaffNaturalKey into EmpMenteesinMMR
                                                         from menteeInMMR in EmpMenteesinMMR.DefaultIfEmpty()
                                                         join edwCICorPrincipalEMPLOYEES in allEDWEmployeesInfo
                                                         on masMMR.CreatedBy equals edwCICorPrincipalEMPLOYEES.LoginId into EmpCICorPrincipalinMMR
                                                         from cicORprincipalinMMR in EmpCICorPrincipalinMMR.DefaultIfEmpty()
                                                         select new MentorMenteeRelationshipInfo
                                                         {
                                                             MentorMenteeRelationshipID = masMMR.MentorMenteeRelationshipID,

                                                             //MENTOR INFO
                                                             MentorEmployeeID = mentorInMMR.StaffNaturalKey,
                                                             MentorFirstName = mentorInMMR.FirstName,
                                                             MentorLastSurname = mentorInMMR.LastSurname,
                                                             MentorMiddleName = mentorInMMR.MiddleName,
                                                             MentorElectronicMailAddress = mentorInMMR.ElectronicMailAddress,
                                                             MentorJobCodeDescription = mentorInMMR.JobCodeDescription,
                                                             MentorLatestHireDate = mentorInMMR.LatestHireDate,
                                                             
                                                             //MENTEE INFO
                                                             MenteeEmployeeID = menteeInMMR.StaffNaturalKey,
                                                             MenteeFirstName = menteeInMMR.FirstName,
                                                             MenteeLastSurname = menteeInMMR.LastSurname,
                                                             MenteeMiddleName = menteeInMMR.MiddleName,
                                                             MenteeElectronicMailAddress = menteeInMMR.ElectronicMailAddress,
                                                             MenteeJobCodeDescription = menteeInMMR.JobCodeDescription,
                                                             MenteeLatestHireDate = menteeInMMR.LatestHireDate,
                                                             MenteeACP = menteeInMMR.ACP,
                                                             // CAMPUS INFO
                                                             EducationOrgNaturalKey = menteeInMMR.EducationOrgNaturalKey,
                                                             NameOfInstitution = menteeInMMR.NameOfInstitution,
                                                             LocalOrganizationCode = menteeInMMR.LocalOrganizationCode,
                                                             //RELATION STATUS INFO
                                                             RelationshipStatus = masMMR.RelationshipStatus,
                                                             PrincipalApproval = masMMR.PrincipalApproval,
                                                             MentorAgreement = masMMR.MentorAgreement,
                                                             ApprovalDate = masMMR.ApprovalDate,
                                                             TimeConfigurationID = masMMR.TimeConfigurationID,
                                                             CreateDate = masMMR.CreateDate,
                                                             UpdateDate = masMMR.UpdateDate,
                                                             UpdatedBy = masMMR.UpdatedBy,
                                                             // CIC/Principal
                                                             CreatedBy = masMMR.CreatedBy,
                                                             CreatedByEmployeeID = cicORprincipalinMMR.StaffNaturalKey,
                                                             CreatedByFirstName = cicORprincipalinMMR.FirstName,
                                                             CreatedByMiddleName = cicORprincipalinMMR.MiddleName,
                                                             CreatedByLastSurName = cicORprincipalinMMR.LastSurname,
                                                             CreatedByElectronicMailAddress = cicORprincipalinMMR.ElectronicMailAddress
                                                         }).AsEnumerable();


            // join this MASActivityLogsCountPerRelationshipID with "MM-Relationship Details"

            var CombinedMASActivityLogsCountPerRelationship =
                (from ALInfo in combinedMentorMenteeRelationshipInfos
                 from ALCont in MASActivityLogsCountPerRelationshipID.Where(x => ALInfo.MentorMenteeRelationshipID == x.RelationshipID)

                     //on ALInfo.MentorMenteeRelationshipID equals ALCont.RelationshipID into ALCompletionCount
                     //from alcompletions in ALCompletionCount.DefaultIfEmpty()
                     //where (
                     // apply time range here 
                     //)
                 select new ActivityLogCompetedByMentorInfo
                 {
                     // School
                     NameOfInstitution = ALInfo.NameOfInstitution,
                     EducationOrgNaturalKey = ALInfo.EducationOrgNaturalKey,

                     // CIC
                     PrincipalOrCICEmployeeID = ALInfo.CreatedByEmployeeID,
                     PrincipalOrCICFirstName = ALInfo.CreatedByFirstName,
                     PrincipalOrCICLastSurname = ALInfo.CreatedByMiddleName,
                     //CSOLoginID = ALInfo.cre
                     PrincipalOrCICElectronicMailAddress = ALInfo.CreatedByElectronicMailAddress,
                     //CSOJobCodeDescription = ALInfo.cre

                     // Mentor 
                     MentorEmployeeID = ALInfo.MentorEmployeeID,
                     MentorFirstName = ALInfo.MentorFirstName,
                     MentorLastSurname = ALInfo.MentorLastSurname,
                     MentorMiddleName = ALInfo.MentorMiddleName,
                     MentorElectronicMailAddress = ALInfo.MentorElectronicMailAddress,
                     //MentorJobCodeDescription = ALInfo.MentorJobCodeDescription,
                     //MentorLatestHireDate = ALInfo.MentorLatestHireDate,
                     //MentorComments = ALInfo.Ment

                     // Mentee
                     MenteeEmployeeID = ALInfo.MenteeEmployeeID,
                     MenteeFirstName = ALInfo.MenteeFirstName,
                     MenteeLastSurname = ALInfo.MenteeLastSurname,
                     MenteeMiddleName = ALInfo.MenteeMiddleName,
                     MenteeElectronicMailAddress = ALInfo.MenteeElectronicMailAddress,
                     //MenteeComments = ALInfo.Mente
                     
                     //Month
                     Month = System.DateTime.Now.ToString("MMMM"),
                    //System.DateTime.Now.Month.ToString(),


                    // Accumulated field 
                     MentorMenteeRelationshipID = ALInfo.MentorMenteeRelationshipID,
                     ActivityLogsRequiredCount = refActivityLogsRequiredCount,
                     ActivityLogsEntryCount = ALCont.ActivityLogCount,
                     MetRequirement = refActivityLogsRequiredCount > ALCont.ActivityLogCount ? "NO" : "Yes"
                     

                }).ToList(); 
            /*.Select(a => new MenteeInfo // Mentee is considered as the superset of all employees affiliated here
            {
                StaffNaturalKey = a.StaffNaturalKey,
                FirstName = a.FirstName,
                LastSurname = a.LastSurname,
                MiddleName = a.MiddleName,
                LoginId = a.LoginId,
                JobCodeDescription = a.JobCodeDescription,
                EducationOrgNaturalKey = a.EducationOrgNaturalKey,
                NameOfInstitution = a.NameOfInstitution,
                LocalOrganizationCode = a.LocalOrganizationCode,
                ElectronicMailAddress = a.ElectronicMailAddress,
                LatestHireDate = a.LatestHireDate,
                ACP = a.AccomplishmentTypeDescription

            }).AsEnumerable();*/

            
            //return Ok();
            return CombinedMASActivityLogsCountPerRelationship.AsQueryable<ActivityLogCompetedByMentorInfo>();
        }
        /* ---- update operations -------*/

        //POST: odata/create a New  ActivityLogs
        public IHttpActionResult Post(ActivityLog activitylog)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.ActivityLogs.Add(activitylog);
            db.SaveChanges();
            return Created(activitylog);
        }
       
        // PUT: odata/Complete update an  ActivityLogs
        public IHttpActionResult Put([FromODataUri] int key, ActivityLog activitylog)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentActivityLog = db.ActivityLogs.FirstOrDefault(al => al.ActivityLogID == key);

            if (currentActivityLog == null)
            {
                return NotFound();
            }

            activitylog.ActivityLogID = currentActivityLog.ActivityLogID;
            db.Entry(currentActivityLog).CurrentValues.SetValues(activitylog);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // PATCH: odata/Partial update an existing  ActivityLogs
        public IHttpActionResult Patch([FromODataUri] int key, Delta<ActivityLog> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentActivityLog = db.ActivityLogs.FirstOrDefault(al => al.ActivityLogID == key);
            if (currentActivityLog == null)
            {
                return NotFound();
            }
            patch.Patch(currentActivityLog);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);

        }

        /* --------- Operations on Contained Entities --------*/
        
        /*----------------- CUSTOM ACTIONS ------------------------------*/
      
        // CREATION OF ACTIVITY LOG
        [HttpPost]
        //[ODataRoute("ActivityLogs/CreateActivityLogs")]
        [ODataRoute("CreateActivityLogs")]
        public IHttpActionResult CreateActivityLogs(ODataActionParameters parameters)
        {
            //First we check if the parameters are correct for the entire action method
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {
                // Prepare a Distributed Lock Over MAS database <locking object: Activity Logs; Method: Applicaiton Lock>
                var createActivityLogLock = new SqlDistributedLock("createActivityLogLock", connectionStringMAS);

                try
                {
                    //Then we cast our entity parameter in our entity object and validate
                    //it through the controller's Validate<TEntity> method
                    ActivityLog activityLogInfo = (ActivityLog)parameters[typeof(ActivityLog).Name];
                    
                    db.ActivityLogs.Add(
                            new ActivityLog()
                            {
                                MentorEmployeeID = activityLogInfo.MentorEmployeeID,
                                ActivityCodeID = activityLogInfo.ActivityCodeID,
                                CampusID = activityLogInfo.CampusID,
                                ActivityStartTime = activityLogInfo.ActivityStartTime,
                                Duration = activityLogInfo.Duration,
                                CreateDate = System.DateTime.Now,
                                CreatedBy = activityLogInfo.CreatedBy,
                                MentorComments = activityLogInfo.MentorComments,
                                TimeConfigurationID = activityLogInfo.TimeConfigurationID
                            }
                        );

                    // this block of code is protected by the lock!
                    // everything checks out, add the activityLog
                    using (createActivityLogLock.Acquire())
                    {
                        //save the info into ActivtiyLog Table
                        if (db.SaveChanges() > -1)
                        {
                            // activity log got created now create the associated Activity Tool Items Entry
                            // first get the latest created Activity Log 
                            var currentActivityLog = db.ActivityLogs.OrderByDescending(al => al.ActivityLogID).FirstOrDefault();

                            // get the list of selected Tool Item Ids
                            IEnumerable<int> activityToolItemIDs = parameters["ActivityToolItemIDs"] as IEnumerable<int>;
                            foreach (var aToolItemID in activityToolItemIDs)
                            {
                                db.ActivityLog_ActivityToolItems.Add(
                                        new ActivityLog_ActivityToolItems()
                                        {
                                            ActivityLogID = currentActivityLog.ActivityLogID,
                                            ActivityToolItemID = aToolItemID,
                                            CreateDate = System.DateTime.Now,
                                            CreatedBy = currentActivityLog.CreatedBy
                                        }
                                    );
                            }
                            // get the list of selected Standard Item Ids
                            IEnumerable<int> activityStandardItemIDs = parameters["ActivityStandardItemIDs"] as IEnumerable<int>;
                            foreach (var aStandardItemID in activityStandardItemIDs)
                            {
                                db.ActivityLog_ActivityStandardItems.Add(
                                        new ActivityLog_ActivityStandardItems()
                                        {
                                            ActivityLogID = currentActivityLog.ActivityLogID,
                                            ActivityStandardItemID = aStandardItemID,
                                            CreateDate = System.DateTime.Now,
                                            CreatedBy = currentActivityLog.CreatedBy

                                        }
                                    );
                            }
                            // get the list of selected Mentees
                            IEnumerable<string> activityLogMenteeEmployeeIDs = parameters["ActivityLog_MenteeEmployeeIDs"] as IEnumerable<string>;
                            foreach (var aMenteeEmployeeID in activityLogMenteeEmployeeIDs)
                            {
                                //retrieve the active relationhip ID for each pair of Mentor-Mentee
                                var MentorMenteeActiveRelationshipID = db.MentorMenteeRelationships.Where(mmar => mmar.MentorEmployeeID == activityLogInfo.MentorEmployeeID
                                                                                                          && mmar.MenteeEmployeeID == aMenteeEmployeeID
                                                                                                          && mmar.TimeConfigurationID == activityLogInfo.TimeConfigurationID)
                                                                                                          .FirstOrDefault();

                                db.ActivityLog_Mentees.Add(
                                        new ActivityLog_Mentees()
                                        {
                                            ActivityLogID = currentActivityLog.ActivityLogID,
                                            MenteeEmployeeID = aMenteeEmployeeID,
                                            CreateDate = System.DateTime.Now,
                                            CreatedBy = currentActivityLog.CreatedBy,
                                            MentorMenteeRelationshipID = MentorMenteeActiveRelationshipID.MentorMenteeRelationshipID
                                        }
                                    );
                            }

                            if (db.SaveChanges() > -1)
                            {
                                // successfully added activityLog
                                //int newALID  = db.ActivityLogs.OrderByDescending(al => al.ActivityLogID).FirstOrDefault().ActivityLogID;
                                return Ok(currentActivityLog.ActivityLogID);
                                
                                
                                //return Content(HttpStatusCode.Created, SingleResult<ActivityLog>.Create(queryable));
                                //return Created(currentActivityLog);
                                //return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created));

                            }
                            else
                            {
                                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Nested Entity Creation is not successful"));
                            }


                        }
                        else
                        {
                            return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Activity Log Entry Creation is not successful"));
                        }
                    }
                }
                catch (ArgumentNullException)
                {
                    throw new HttpResponseException(HttpStatusCode.BadRequest);
                }
                catch (Exception ex)
                {
                    // CUSTOM Exception Filters to generate Http Error Response 
                    //throw new HttpResponseException(HttpStatusCode.NotAcceptable);
                    throw ex;
                }
            }

            //return StatusCode(HttpStatusCode.NoContent);
        }

        // UPDATE OF AN EXISTING ACTIVITY LOG 
        [HttpPost]
        [ODataRoute("UpdateActivityLogs")]
        //[ODataRoute("ActivityLogs({Key})/UpdateActivityLogs")]
        public IHttpActionResult UpdateActivityLogs(ODataActionParameters parameters)
        {
            //Console.WriteLine("Debug me ...");
            //First we check if the parameters are correct for the entire action method
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {
                // Prepare a Distributed Lock Over MAS database <locking object: Activity Logs; Method: Applicaiton Lock>
                var updateActivityLogLock = new SqlDistributedLock("UpdateActivityLogLock", connectionStringMAS);

                try
                {
                    //Then we cast our entity parameter in our entity object and validate
                    //it through the controller's Validate<TEntity> method
                    ActivityLog receivedActivityLogInfo = (ActivityLog)parameters[typeof(ActivityLog).Name];

                    // Check for  the specific activity log we're going to update 
                    var currentActivityLog = db.ActivityLogs.FirstOrDefault(al => al.ActivityLogID == receivedActivityLogInfo.ActivityLogID);

                    if (currentActivityLog == null)
                    {
                        return NotFound();
                    }
                    // set up the received values into the currentActivityLog Instance 
                    receivedActivityLogInfo.ActivityLogID = currentActivityLog.ActivityLogID;
                    receivedActivityLogInfo.UpdateDate = System.DateTime.Now;
                    db.Entry(currentActivityLog).CurrentValues.SetValues(receivedActivityLogInfo);
                    
                    // this block of code is protected by the lock!
                    // everything checks out, add the activityLog
                    using (updateActivityLogLock.Acquire())
                    {
                        //save the info into ActivtiyLog Table
                        if (db.SaveChanges() > -1)
                        {
                            // delete previous setup of Activity Tool Items for this Actvity Log
                            var toolItemsToDelete = db.ActivityLog_ActivityToolItems.Where(ati => ati.ActivityLogID == currentActivityLog.ActivityLogID);
                            if (toolItemsToDelete != null)
                            {
                                db.ActivityLog_ActivityToolItems.RemoveRange(toolItemsToDelete);
                            }

                            // get the list of selected Tool Item Ids
                            IEnumerable<int> activityToolItemIDs = parameters["ActivityToolItemIDs"] as IEnumerable<int>;
                            foreach (var aToolItemID in activityToolItemIDs)
                            {
                                db.ActivityLog_ActivityToolItems.Add(
                                        new ActivityLog_ActivityToolItems()
                                        {
                                            ActivityLogID = currentActivityLog.ActivityLogID,
                                            ActivityToolItemID = aToolItemID,
                                            CreateDate = System.DateTime.Now,
                                            CreatedBy = currentActivityLog.CreatedBy
                                        }
                                    );
                            }

                            // delete previous setup of Activity Standard Items for this Actvity Log
                            var asiItemsToDelete = db.ActivityLog_ActivityStandardItems.Where(asi => asi.ActivityLogID == currentActivityLog.ActivityLogID);
                            if (asiItemsToDelete != null)
                            {
                                db.ActivityLog_ActivityStandardItems.RemoveRange(asiItemsToDelete);
                            }

                            // get the list of selected Standard Item Ids
                            IEnumerable<int> activityStandardItemIDs = parameters["ActivityStandardItemIDs"] as IEnumerable<int>;
                            foreach (var aStandardItemID in activityStandardItemIDs)
                            {
                                db.ActivityLog_ActivityStandardItems.Add(
                                        new ActivityLog_ActivityStandardItems()
                                        {
                                            ActivityLogID = currentActivityLog.ActivityLogID,
                                            ActivityStandardItemID = aStandardItemID,
                                            CreateDate = System.DateTime.Now,
                                            CreatedBy = currentActivityLog.CreatedBy

                                        }
                                    );
                            }

                            // get the list of selected Mentees to Delete
                            IEnumerable<string> deleteALogMenteeEmployeeIDs = parameters["ActivityLog_DeletedMenteeEmployeeIDs"] as IEnumerable<string>;
                            // retrieve exisitng Mentees to be deleted
                            var menteesExistsToBeDeleted = db.ActivityLog_Mentees.Where(alme => deleteALogMenteeEmployeeIDs.Contains(alme.MenteeEmployeeID) 
                                                                                        && alme.ActivityLogID == receivedActivityLogInfo.ActivityLogID); 
                            // delete previous setup of Activity Tool Items for this Actvity Log
                                db.ActivityLog_Mentees.RemoveRange(menteesExistsToBeDeleted);
                            

                            // Get the list to be added 
                            // Steps - 1). check if exists no operation 2). Not exists do insert

                            // get the list of selected Mentees to add
                            IEnumerable<string> addALogMenteeEmployeeIDs = parameters["ActivityLog_MenteeEmployeeIDs"] as IEnumerable<string>;
                            foreach (var aMenteeEmployeeID in addALogMenteeEmployeeIDs)
                            {
                                // check if Mentee in current iteration is already exists and is there any feedback from him does exists too?
                                var isThisMenteeExists = db.ActivityLog_Mentees.Any(alme => alme.ActivityLogID == receivedActivityLogInfo.ActivityLogID
                                                                                    && alme.MenteeEmployeeID == aMenteeEmployeeID);
                                if (!isThisMenteeExists)
                                {
                                    //retrieve the active relationhip ID for each pair of Mentor-Mentee
                                    var MentorMenteeActiveRelationshipID = db.MentorMenteeRelationships.Where(mmar => mmar.MentorEmployeeID == receivedActivityLogInfo.MentorEmployeeID
                                                                                                              && mmar.MenteeEmployeeID == aMenteeEmployeeID
                                                                                                              && mmar.TimeConfigurationID == receivedActivityLogInfo.TimeConfigurationID)
                                                                                                              .FirstOrDefault();

                                    if (MentorMenteeActiveRelationshipID != null)
                                    {
                                        // inset this Mentee
                                        db.ActivityLog_Mentees.Add(
                                                new ActivityLog_Mentees()
                                                {
                                                    ActivityLogID = currentActivityLog.ActivityLogID,
                                                    MenteeEmployeeID = aMenteeEmployeeID,
                                                    CreateDate = System.DateTime.Now,
                                                    CreatedBy = currentActivityLog.CreatedBy,
                                                    MentorMenteeRelationshipID = MentorMenteeActiveRelationshipID.MentorMenteeRelationshipID
                                                }
                                            );
                                    }
                                    
                                }
                                
                            }

                            if (db.SaveChanges() > -1)
                            {
                                return ResponseMessage(Request.CreateResponse(HttpStatusCode.NoContent));
                                //return Ok(currentActivityLog.ActivityLogID);

                                //return Content(HttpStatusCode.Created, SingleResult<ActivityLog>.Create(queryable));
                                //return Created(currentActivityLog);
                                //

                            }
                            else
                            {
                                return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Nested Entity Creation is not successful"));
                            }


                        }
                        else
                        {
                            return ResponseMessage(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Activity Log Entry Update is not successful"));
                        }
                    }
                }
                catch (ArgumentNullException)
                {
                    throw new HttpResponseException(HttpStatusCode.BadRequest);
                }
                catch (Exception ex)
                {
                    // CUSTOM Exception Filters to generate Http Error Response 
                    //throw new HttpResponseException(HttpStatusCode.NotAcceptable);
                    throw ex;
                }
            }

            //return StatusCode(HttpStatusCode.NoContent);
        }



        //POST: odata/Create an ActivityLog_Mentees collection  
        [HttpPost]
        [ODataRoute("ActivityLogs({Key})/ActivityLog_Mentees")]
        public IHttpActionResult PostActivityLog_Mentees([FromODataUri] int key,
            ActivityLog_Mentees activityLog_Mentee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // check for: the activity log exist?
            var activitylog = db.ActivityLogs.FirstOrDefault(al => al.ActivityLogID == key);
            if (activitylog == null)
            {
                return NotFound();
            }

            // link the activity to the ActivityLog_Mentee (also avoids an invalid activityLog)
            // key on the passed in record - key from the URI will win)

            activityLog_Mentee.ActivityLog = activitylog;

            // add the inputed activityLog_Mentee
            db.ActivityLog_Mentees.Add(activityLog_Mentee);
            db.SaveChanges();

            // return the created activityLog_Mentee
            return Created(activityLog_Mentee);
        }

        
        
        /* ------------------- OPERATOINS UNDER MENTEE SCOPES -----------------------*/ 
        //PATCH: odata/update an exiting ActivityLog_Mentee
        [HttpPatch]
        [ODataRoute("ActivityLogs({Key})/ActivityLog_Mentees({activitylogAMEid})")]
        public IHttpActionResult PatchActivityLog_Mentees([FromODataUri] int key, [FromODataUri] int activitylogAMEid,
            Delta<ActivityLog_Mentees> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // check for: the activity log exist?
            var activitylog = db.ActivityLogs.FirstOrDefault(al => al.ActivityLogID == key);
            if (activitylog == null)
            {
                return NotFound();
            }

            //find a matching ActivityLog_Mentee Instance

            var currentActivityLog_Mentee = db.ActivityLog_Mentees
                .FirstOrDefault(ame => ame.ActivityLogMenteeID == activitylogAMEid && ame.ActivityLog.ActivityLogID == key);

            if (currentActivityLog_Mentee == null)
            {
                return NotFound();
            }

            //apply patch
            patch.Patch(currentActivityLog_Mentee);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool ActivityLogsExists(int key)
        {
            return db.ActivityLogs.Count(al => al.ActivityLogID == key) > 0;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
