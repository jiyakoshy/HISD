using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using System.Web.OData;
using System.Web.OData.Builder;
using System.Web.OData.Routing;
using System.Web.OData.Extensions;
using System.Web.OData.Batch;
using HISD.MAS.DAL.Models;
using HISD.MAS.DAL.Models.EDW;
using System.Web.Http.Cors;

namespace HISD.MAS.Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            //Enable CORS at the Global level
            EnableCorsAttribute cors = new EnableCorsAttribute("*", "*", "*");
            cors.SupportsCredentials = true;
            config.EnableCors(cors);

            // Web API routes
            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            
            //gloabal query option enable 
            config.Count().Filter().OrderBy().Expand().Select().MaxTop(null);
            
            // Odata Config
            ODataModelBuilder builder = new ODataConventionModelBuilder();
            
            builder.EntitySet<CampusContact>("CampusContacts");
            builder.EntitySet<MentorMenteeRelationship>("MentorMenteeRelationships");
            builder.EntitySet<ActivityCode>("ActivityCodes");
            builder.EntitySet<ActivityStandardGroup>("ActivityStandardGroups");
            builder.EntitySet<ActivityStandardItem>("ActivityStandardItems");
            builder.EntitySet<CBMStandard>("CBMStandards");
            builder.EntitySet<ActivityToolItem>("ActivityToolItems");
            builder.EntitySet<ActivityCommunicationType>("ActivityCommunicationTypes");
            builder.EntitySet<ActivityLog>("ActivityLogs");
            builder.EntitySet<EmailMessage>("EmailMessages");
            builder.EntitySet<ErrorMessage>("ErrorMessages");
            builder.EntitySet<HomeMessage>("HomeMessages");
            builder.EntitySet<TimeConfiguration>("TimeConfigurations");
            builder.EntitySet<SiteContent>("SiteContents");
            builder.EntitySet<MultiChoiceList>("MultiChoiceLists");
            builder.EntitySet<MultiChoiceListItem>("MultiChoiceListItems");
            builder.EntitySet<MenteeEndDate>("MenteeEndDates");
            
            //EDW
            builder.EntitySet<EducationOrganization>("EducationOrganizations");
            builder.EntitySet<MenteeInfo>("MenteeInfos");
            builder.EntitySet<Staff>("Staffs");

            //custom Odata FUNCTION(unbound) for retrieving Mentors/Mentees

            /* ----- MENTEES ------*/
            //MENTEE
            builder.Function("GetMentees")
                .ReturnsCollectionFromEntitySet<MenteeInfo>("MenteeInfos");
            builder.Function("GetMenteesByCampusID")
                .ReturnsCollectionFromEntitySet<MenteeInfo>("MenteeInfos")
                .Parameter<string>("CampusID");
            builder.Function("GetMenteeInfoByEmployeeID")
                .Returns<MenteeInfo>()
                .Parameter<string>("EmployeeID");


            /* ----- EMAILS ------*/
            //MENTEE
            builder.Function("SendEmailCIC")
                .ReturnsCollectionFromEntitySet<CampusContactArray>("SendEmailCICs");
            

            /*-------- MENTOR-MENTEE RELATIONSHIPS --------*/
            // MentorMenteeRelationshipInfo is an Open Complex Type

            builder.EntitySet<MentorMenteeRelationshipInfo>("MentorMenteeRelationshipInfos");

            builder.Function("GetAllMentorMenteeRelationships")
                .ReturnsCollectionFromEntitySet<MentorMenteeRelationshipInfo>("MentorMenteeRelationshipInfos");

            builder.Function("GetMentorMenteeRelationshipsMentees")
                .ReturnsCollectionFromEntitySet<MentorMenteeRelationship>("MentorMenteeRelationshipss");

            var relationshipsByStatus = builder.Function("GetRalationshipCountsByStatus");
            relationshipsByStatus.Parameter<int>("TimeConfigurationID");
            relationshipsByStatus.Parameter<string>("CampusID");
            relationshipsByStatus.ReturnsCollectionFromEntitySet<NumberofRelationShipsByStatus>("RalationshipCountsByStatus");

            var topCampusesOnRelationShipFromTimeConfiguration = builder.Function("GetTopCampusesOnRelationShipFromTimeConfiguration");
            topCampusesOnRelationShipFromTimeConfiguration.Parameter<int>("TimeConfigurationID");
            topCampusesOnRelationShipFromTimeConfiguration.ReturnsCollectionFromEntitySet<TopCampusesOnRelationShip>("TopCampusesOnRelationShipFromTimeConfiguration");

            builder.Function("GetMentorsCountWithoutAgreementAccepted")
                .ReturnsCollectionFromEntitySet<MentorsCountWithoutAgreementsCount>("MentorsCountWithoutAgreementsCounts")
                .Parameter<int>("TimeConfigurationID");
            //builder.Function("GetRalationshipCountsByStatus")
            //    .ReturnsCollectionFromEntitySet<NumberofRelationShipsByStatus>("GetRalationshipCountsByStatuss")
            //    .Parameter<int>("TimeConfigurationID")
            //    .Pa;
            /* ----- MENTEE END DATES ------*/
            //MENTEE END DATE - OUTPUT: collection of Mentee details
            builder.Function("GetAllMenteeEndDates")
                .ReturnsCollectionFromEntitySet<MenteeEndDateInfo>("MenteeEndDatesInfo");

            // MENTEE END DATE DETAILS BY CAMPUS ID: Unbound funtion 
            builder.Function("GetMenteeEndDatesByCampusID")
                 .ReturnsCollectionFromEntitySet<MenteeEndDateInfo>("MenteeEndDatesInACampusInfo")
                 .Parameter<string>("CampusID");
            // MENTEE ENDDATE DETAILS BY EMPLOYEE ID: Unbound function
            builder.Function("GetMenteeEndDateByEmployeeID")
                .Returns<MenteeEndDateInfo>()
                .Parameter<string>("EmployeeID");

            
            /* ----- CAMPUS CONTACTS ------*/
            // Collection of all existing CAMPUS CONTATCS INFO: for Admin Role
            builder.Function("GetAllCampusContacts")
                 .ReturnsCollectionFromEntitySet<CampusContactInfo>("CampusContactsInfo");
                
            // CAMPUS CONTACT DETAILS BY CAMPUS ID: Unbound funtion 
            builder.Function("GetCampusContactsByCampusID")
                 .ReturnsCollectionFromEntitySet<CampusContactInfo>("CampusContactsInACampusInfo")
                 .Parameter<string>("CampusID");

            // CAMPUS CONTACT DETAILS BY EMPLOYEE ID: Unbound function
            builder.Function("GetCampusContactByEmployeeID")
                .Returns<CampusContactInfo>()
                .Parameter<string>("EmployeeID");

            /* ----- ACTIVITY LOGS -----*/
            // Active Mentors in Relationships DETAILS BY CAMPUS ID: Unbound funtion 
            builder.Function("GetMentorsInActiveRelationshipByCampusID")
                 .ReturnsCollectionFromEntitySet<EmployeeInfo>("ActiveMentorInfos")
                 .Parameter<string>("CampusID");
            // Active Mentees in Relationships DETAILS BY CAMPUS ID: Unbound funtion 
            builder.Function("GetMenteesInActiveRelationshipByCampusID")
                 .ReturnsCollectionFromEntitySet<MenteeInActiveRelationshipInfo>("ActiveMenteeInCampusInfos")
                 .Parameter<string>("CampusID");

            var totalActivitiesMentee = builder.Function("GetTotalActivitiesByMentees");
            totalActivitiesMentee.Parameter<int>("TimeConfigurationID");
            totalActivitiesMentee.Parameter<string>("CampusID");
            totalActivitiesMentee.Parameter<string>("StDate");
            totalActivitiesMentee.Parameter<string>("EdDate");
            totalActivitiesMentee.ReturnsCollectionFromEntitySet<TotalNumberofActivitiesByMentees>("GetTotalActivitiesByMenteess");

            //builder.Function("GetTotalActivitiesByMentees")
            //    .ReturnsCollectionFromEntitySet<TotalNumberofActivitiesByMentees>("GetTotalActivitiesByMenteess")
            //    .Parameter<int>("TimeConfigurationID");

            // Active Mentees in an active Relation tied with this Mentor: Unbound funtion 
            builder.Function("GetMenteesInActiveRelationshipByMentorID")
                 .ReturnsCollectionFromEntitySet<MenteeInActiveRelationshipInfo>("ActiveMenteeInfos")
                 .Parameter<string>("EmployeeID");

            // Get All activity Logs details for Reporting
            builder.Function("GetAllActivityLogs")
                 .ReturnsCollectionFromEntitySet<ActivityLogWithComplexTypeInfo>("ActivityLogInfos");

            // Get All activity Logs details for Reporting
            builder.Function("GetActivityLogsCompletedByMentor")
                 .ReturnsCollectionFromEntitySet<ActivityLogCompetedByMentorInfo>("ActivityLogsCompletedByMentorInfos");

            // Get Activity Logs Details for a campus: Unbound function 
            builder.Function("GetActivityLogsByCampusID")
                 .ReturnsCollectionFromEntitySet<ActivityLogWithComplexTypeInfo>("ActivityLogsWithComplexTypeInfos")
                 .Parameter<string>("CampusID");
            // Get Activity Logs Details for a specific Mentee affiliated with
            builder.Function("GetActivityLogsByMenteeID")
                .ReturnsCollectionFromEntitySet<ActivityLogWithComplexTypeInfo>("ActivityLogsByMentee")
                .Parameter<string>("EmployeeID");

            //GetActivityLogTotalTime for Reporting
            builder.Function("GetActivityLogsTotalTime")
                 .ReturnsCollectionFromEntitySet<ActivityLogTotalTimeInfo>("ActivityLogsTotalTimeInfos");
            
            //Unbound: Custom action to create Activity Logs and affiliated entities
            var createActivityLog = builder.Action("CreateActivityLogs");
            createActivityLog.Returns<int>();
            createActivityLog.EntityParameter<ActivityLog>("ActivityLog");
            createActivityLog.CollectionParameter<int>("ActivityToolItemIDs");
            createActivityLog.CollectionParameter<int>("ActivityStandardItemIDs");
            createActivityLog.CollectionParameter<string>("ActivityLog_MenteeEmployeeIDs");
            createActivityLog.Namespace = "ActivityLog.Actions";

            //Bound Custom action: Update an Existing Activity Log and related Entities
            //var updateActivityLog = builder.EntityType<ActivityLog>().Collection.Action("UpdateActivityLogs").Returns<bool>();
            var updateActivityLog = builder.Action("UpdateActivityLogs").Returns<bool>();
            updateActivityLog.EntityParameter<ActivityLog>("ActivityLog");
            updateActivityLog.CollectionParameter<int>("ActivityToolItemIDs");
            updateActivityLog.CollectionParameter<int>("ActivityStandardItemIDs");
            updateActivityLog.CollectionParameter<string>("ActivityLog_MenteeEmployeeIDs");
            updateActivityLog.CollectionParameter<string>("ActivityLog_DeletedMenteeEmployeeIDs");
            

            //custom Odata FUNCTION(unbound) for retrieving COMMON data 
            builder.Function("GetUserInfoByLoginID")
                .Returns<UserInfo>()
                .Parameter<string>("LoginID");

            // service routing 
            config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel()
                , new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer));

        }
    }
}
