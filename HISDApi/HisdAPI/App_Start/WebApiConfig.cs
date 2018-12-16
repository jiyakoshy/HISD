using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;
using HISD.Error;
using HISD.Error.ExceptionFilters;
using HisdAPI.DAL;
using HisdAPI.Entities;

namespace HisdAPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;

            // Web API Attribute routing
            config.MapHttpAttributeRoutes();

            // Web API Convention based routing
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            //Enabling CORS support globally. AC: Must change before pusing to production
            var corsAttribute = new EnableCorsAttribute("*", "*", "*");
            corsAttribute.SupportsCredentials = true;
            config.EnableCors(corsAttribute);

            // Odata configuration setup
            config.Filter().Expand().Select().OrderBy().MaxTop(null).Count();
            config.MapODataServiceRoute("odata", "odata", model: GetModel());

            // register filters
            config.RegisterHttpFilters();            
        }

        public static Microsoft.OData.Edm.IEdmModel GetModel()
        {
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.Namespace = "HISDAPI";
            builder.ContainerName = "DefaultContainer";
            builder.EntitySet<AccomplishmentCategoryType>("AccomplishmentCategoryTypes");
            builder.EntitySet<AccomplishmentType>("AccomplishmentTypes");

            builder.EntitySet<EducationOrganizationHierarchy>("EducationOrganizationHierarchies");
            builder.EntitySet<EducationOrganization>("EducationOrganizations");
            builder.EntitySet<SchoolManagers>("SchoolManagers");
            builder.EntitySet<SchoolYearType>("SchoolYearTypes");
            builder.EntitySet<SchoolGradeLevelAssociation>("SchoolGradeLevelAssociations");

            builder.EntitySet<GradeLevelType>("GradeLevelTypes");
            builder.EntitySet<JobIndicatorType>("JobIndicatorTypes");
            builder.EntitySet<OrganizationalGroup>("OrganizationalGroups");
            builder.EntitySet<Position>("Positions");

            builder.EntitySet<Staff>("Staffs");
            builder.EntitySet<StaffAccomplishments>("StaffAccomplishments");
            builder.EntitySet<StaffCertification>("StaffCertifications");
            builder.EntitySet<StaffContractType>("StaffContractTypes");
            builder.EntitySet<StaffERPGroupType>("StaffERPGroupTypes");
            builder.EntitySet<StaffSectionAssociation>("StaffSectionAssociations");
            builder.EntitySet<StaffSupervisorType>("StaffSupervisorTypes");
            builder.EntitySet<StaffElectronicEmail>("StaffElectronicEmails");
            builder.EntitySet<EmployeeStatusType>("EmployeeStatusTypes");
            builder.EntitySet<EmployeeHISDStatusType>("EmployeeHISDStatusTypes");
            builder.EntitySet<QualificationType>("QualificationTypes");
            builder.EntitySet<SalaryPlanType>("SalaryPlanTypes");
            builder.EntitySet<StaffQualificationAssociation>("StaffQualificationAssociations");
            builder.EntitySet<QualificationGroupAssociation>("QualificationGroupAssociations");
            builder.EntitySet<StaffPayGradeAssociation>("StaffPayGradeAssociations");

            builder.EntitySet<Student>("Students");
            builder.EntitySet<Course>("Courses");
            builder.EntitySet<StudentSectionAssociation>("StudentSectionAssociations");
            builder.EntitySet<Section>("Sections");
            builder.EntitySet<SectionSchedulingType>("SectionSchedulingTypes");
            builder.EntitySet<Session>("Sessions");
            builder.EntitySet<TermType>("TermTypes");

            builder.EntitySet<JobCodeEntity>("JobCodes");
            builder.EntitySet<JobFamily>("JobFamilies");
            builder.EntitySet<JobFunction>("JobFunctions");

            //Unbound functions            
            builder.Function("CampusType").Returns<string>().Parameter<string>("CampusID");

            FunctionConfiguration campusTypeForYear = builder.Function("CampusTypeForYear").Returns<string>();
            campusTypeForYear.Parameter<string>("CampusID");
            campusTypeForYear.Parameter<string>("YearID");

            FunctionConfiguration allHFWESchools = builder.Function("AllHFWESchools").Returns<string>();
            allHFWESchools.Parameter<string>("YearID");

            FunctionConfiguration educationOrganizationsByCampusType = builder.Function("EducationOrganizationsByCampusType").Returns<string>();
            educationOrganizationsByCampusType.Parameter<string>("CampusTypeID");
            educationOrganizationsByCampusType.Parameter<string>("YearID");

        
            return builder.GetEdmModel();
        }
    }        
}
