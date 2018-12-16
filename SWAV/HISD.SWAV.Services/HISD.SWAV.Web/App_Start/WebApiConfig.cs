using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
//using System.Web.Http.OData.Batch;
//using System.Web.Http.OData.Builder;
//using System.Web.Http.OData.Extensions;
using System.Web.OData;
using System.Web.OData.Builder;
using System.Web.OData.Routing;
using System.Web.OData.Extensions;
using System.Web.OData.Batch;
using System.Web.Http.Cors;
using HISD.SWAV.DAL.Models.SWAV;

namespace HISD.SWAV.Web
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

            ODataModelBuilder builder = new ODataConventionModelBuilder();
            //ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<SchoolWaiver>("SchoolWaivers");
            builder.Function("AddSchoolWaivers")
                .ReturnsCollectionFromEntitySet<SchoolWaiversArray>("AddSchoolWaivers");
            builder.Function("UpdateSchoolWaivers")
                .ReturnsCollectionFromEntitySet<SchoolWaiversArray>("UpdateSchoolWaivers");
            builder.EntitySet<WaiverAdministration>("WaiverAdministrations");
            builder.Function("CopyGeneralWaivers")
                .ReturnsCollectionFromEntitySet<GeneralWaiversArray>("CopyGeneralWaivers");
            builder.EntitySet<WaiverSetting>("WaiverSettings");
            /*builder.Function("UpdateWaiverSettings")
                .ReturnsCollectionFromEntitySet<WaiverSetting>("UpdateWaiverSettings");*/
            builder.Function("GetSchoolStatus")
                .ReturnsCollectionFromEntitySet<SchoolStatus>("CurrentSchoolYearStatus")
                .Parameter<int>("SchoolStartYear");
            builder.Function("GetSchoolStatusWaivers")
                .ReturnsCollectionFromEntitySet<SchoolSatusWaivers>("CurrentSchoolYearStatusWaivers")
                .Parameter<int>("SchoolStartYear");
            builder.Function("GetSchoolCustomWaivers")
                .ReturnsCollectionFromEntitySet<SchoolCustomWaivers>("SchoolCustomWaivers")
                .Parameter<int>("SchoolStartYear");
            builder.Function("GetSchoolNotStartedStatusWaivers")
                .ReturnsCollectionFromEntitySet<SchoolNotStartedStatusWaivers>("SchoolNotStartedStatus")
                .Parameter<int>("SchoolStartYear");
            builder.Function("GetGeneralWaivers")
                .ReturnsCollectionFromEntitySet<SchoolNotStartedStatusWaivers>("GeneralWaivers")
                .Parameter<int>("SchoolStartYear");
            builder.EntitySet<Waiver>("Waivers");
            builder.Function("AddCustomWaiver")
                .ReturnsCollectionFromEntitySet<Waiver>("AddCustomWaiver");
            builder.Function("AddGeneralWaiver")
                .ReturnsCollectionFromEntitySet<Waiver>("AddGeneralWaiver");
            //builder.Function("UpdateSchoolCustomWaiver")
            //.ReturnsCollectionFromEntitySet<Waiver>("UpdateSchoolCustomWaiver");
            builder.EntitySet<WaiverRequestDetail>("WaiverRequestDetails");
            builder.Function("GetWaiverRequestDetail")
                .ReturnsCollectionFromEntitySet<WaiverRequestDetailAll>("WaiverRequestDetail")
                .Parameter<int>("SchoolStartYear");
            builder.Function("GetWaiverRequestSchools")
                .ReturnsCollectionFromEntitySet<SchoolStatus>("WaiverRequestSchools")
                .Parameter<int>("SchoolStartYear");
            var resetSchoolWaivers = builder.Function("ResetSchoolWaivers");
            resetSchoolWaivers.Parameter<int>("SchoolStartYear");
            resetSchoolWaivers.Parameter<string>("CampusNumber");
            resetSchoolWaivers.ReturnsCollectionFromEntitySet<SchoolWaiver>("SchoolWaiverss");
            var finalizeSchoolWaivers = builder.Function("FinalizeSchoolWaivers");
            finalizeSchoolWaivers.Parameter<int>("SchoolStartYear");
            finalizeSchoolWaivers.Parameter<string>("CampusNumber");
            finalizeSchoolWaivers.ReturnsCollectionFromEntitySet<SchoolWaiver>("FinalizeSchoolWaiverss");
            builder.Function("AddWaiverRequestDetailsForm")
                .ReturnsCollectionFromEntitySet<WaiverRequestDetailsFormSchools>("AddWaiverRequestDetailsFormSchools");
            builder.EntitySet<SDMC>("SDMC");
            config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel()
                , new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer));
        }
    }
}
