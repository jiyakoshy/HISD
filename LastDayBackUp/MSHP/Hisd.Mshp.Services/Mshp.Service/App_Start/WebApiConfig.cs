using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.OData.Batch;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;
using Microsoft.OData.Edm;
using Mshp.Service.Report;
//using HISD.Error;

namespace Mshp.Service
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            var cors = new EnableCorsAttribute("*", "*", "*")
            {
                SupportsCredentials = true
            };
            config.EnableCors(cors);

            config.Count().Filter().OrderBy().Expand().Select().MaxTop(null);
            config.MapODataServiceRoute(
                routeName: "odata",
                routePrefix: "odata",
                model: GetEdmModel(),
                batchHandler: new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer)
                );

            //config.RegisterHttpFilters();
            config.EnsureInitialized();
        }

        private static IEdmModel GetEdmModel()
        {
            var builder = new ODataConventionModelBuilder
            {
                Namespace = "mshp",
                ContainerName = "DefaultContainer"
            };
            builder.EntitySet<Calendar>("Calendar");
            builder.EntitySet<CampusEnrollment>("CampusEnrollment");
            builder.EntitySet<CampusProfile>("CampusProfile");
            builder.EntitySet<OrganizationGroup>("OrganizationGroup");


            /* General Functions */
            builder.Function("GetSchoolYearFor")
                .Returns<string>()
                .Parameter<string>("Date");

            builder.Function("GetCurrentSchoolYear")
                .Returns<string>();

            builder.Function("GetPreviousSchoolYear")
                .Returns<string>();

            builder.Function("GetSchoolYearDropdownList")
                .Returns<string[]>();

            var fx0 = builder.Function("GetEnrollmentData");
            fx0.Parameter<string>("SchoolYear");
            fx0.Parameter<string>("CampusNumber");
            fx0.Parameter<int>("CompareDaySeq");
            fx0.ReturnsCollectionFromEntitySet<EnrollmentDataObject>("EnrollmentDataObject");


            /* Report Functions */
            var fx01 = builder.Function("GetNonReportingCampusesReport");
            fx01.Parameter<string>("SchoolYear");
            fx01.Parameter<int>("CompareDaySeq");
            fx01.ReturnsCollectionFromEntitySet<NonReportingCampusesDataObject>("NonCampusesInputDataObject");

            var fx02 = builder.Function("GetDetailLevelAllReport");
            fx02.Parameter<string>("SchoolYear");
            fx02.Parameter<int>("CompareDaySeq");
            fx02.ReturnsCollectionFromEntitySet<ReportDataObject>("ReportDataObject");

            var fx03 = builder.Function("GetDetailLevelOrganizationGroupIdReport");
            fx03.Parameter<string>("SchoolYear");
            fx03.Parameter<int>("CompareDaySeq");
            fx03.Parameter<int>("OrganizationGroupId");
            fx03.ReturnsCollectionFromEntitySet<ReportDataObject>("ReportDataObject");

            var fx04 = builder.Function("GetDetailLevelCampusNumberReport");
            fx04.Parameter<string>("SchoolYear");
            fx04.Parameter<int>("CompareDaySeq");
            fx04.Parameter<string>("CampusNumber");
            fx04.ReturnsCollectionFromEntitySet<ReportDataObject>("ReportDataObject");

            var fx05 = builder.Function("GetSummaryAndDetailReport");
            fx05.Parameter<string>("SchoolYear");
            fx05.Parameter<int>("CompareDaySeq");
            fx05.ReturnsCollectionFromEntitySet<ReportDataObject>("ReportDataObject");

            var fx06 = builder.Function("GetSummaryReport");
            fx06.Parameter<string>("SchoolYear");
            fx06.Parameter<int>("CompareDaySeq");
            fx06.ReturnsCollectionFromEntitySet<ReportDataObject>("ReportDataObject");

            var fx07 = builder.Function("GetCSOSummaryReport");
            fx07.Parameter<string>("SchoolYear");
            fx07.Parameter<int>("CompareDaySeq");
            fx07.ReturnsCollectionFromEntitySet<ReportDataObject>("ReportDataObject");

            var fx08 = builder.Function("GetEnrollmentDataByCampus");
            fx08.Parameter<string>("SchoolYear");
            fx08.Parameter<string>("CampusNumber");
            fx08.ReturnsCollectionFromEntitySet<EnrollmentDataObject>("EnrollmentDataObject");

            var fx09 = builder.Function("GetAnnualSetupDataByCampus");
            fx09.Parameter<string>("SchoolYear");
            fx09.ReturnsCollectionFromEntitySet<AnnualSetupDataObject>("AnnualSetupDataObject");

            //var fx10 = builder.Function("InsertAnnualSetup");
            //fx10.Parameter<string>("SchoolYear");
            //fx10.Parameter<string>("PrevSchoolYear");
            //fx10.Parameter<string>("CreatedBy");
            //fx10.Parameter<string>("updatedBy");

            var edmModel = builder.GetEdmModel();
            return edmModel;
        }
    }
}

