using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;
using HisdAPI.Entities;

namespace HisdAPI.Public
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API Attribute routing
            config.MapHttpAttributeRoutes();

            // Web API Convention based routing
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // Odata configuration setup
            ODataConfiguration(config);

            //Enabling CORS support globally. AC: Must change before pusing to production
            var corsAttribute = new EnableCorsAttribute("*", "*", "*");
            corsAttribute.SupportsCredentials = true;
            config.EnableCors(corsAttribute);            
        }

        private static void ODataConfiguration(HttpConfiguration config)
        {
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();            

            builder.EntitySet<EducationOrganizationHierarchy>("EducationOrganizationHierarchies");
            builder.EntitySet<EducationOrganization>("EducationOrganizations");
            builder.EntitySet<EducationOrganizationAddress>("EducationOrganizationAddress");
            builder.EntitySet<EducationOrganizationURL>("EducationOrganizationURL");
            builder.EntitySet<SchoolManagers>("SchoolManagers");

            builder.EntitySet<GradeLevelType>("GradeLevelTypes");            
            builder.EntitySet<Staff>("Staffs");                        

            builder.EntitySet<AddressEntity>("Address");
            builder.EntitySet<AddressZonedSchoolAssociation>("AddressZonedSchoolAssociations");
            builder.EntitySet<SchoolFeederDestinationAssociation>("SchoolFeederDestinationAssociations");
            builder.EntitySet<App_FAS_KPI>("KPI");
            builder.EntitySet<App_FAS_KPIType>("KPIType");
            builder.EntitySet<App_FAS_SchoolHISDDepartmentProgramAssociation>("SchoolHISDDepartmentProgramAssociation");
            builder.EntitySet<BoardDistrict>("BoardDistrict");
            builder.EntitySet<SchoolGradeLevelAssociation>("SchoolGradeLevelAssociations");
            builder.EntitySet<SchoolCharacteristicAssociation>("SchoolCharacteristicAssociation");
            builder.EntitySet<SchoolCharacteristicType>("SchoolCharacteristicType");

            builder.EntitySet<Vendor>("Vendor");
            builder.EntitySet<VendorCROSE>("VendorInfo");

            config.Filter().Expand().Select().OrderBy().MaxTop(null).Count();
            config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
        }
    }
}
