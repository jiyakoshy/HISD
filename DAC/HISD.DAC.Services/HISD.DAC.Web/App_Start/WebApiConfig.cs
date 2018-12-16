using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;
using System.Web.OData.Batch;
using HISD.DAC.DAL.Models.DAC;
using System.Web.Http.Cors;

namespace HISD.DAC.Web
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

            // DAC
            builder.EntitySet<CandidateNominee>("CandidateNominees");
            builder.EntitySet<CandidateNomineeVoteSummary>("CandidateNomineesVoteSummarys");
            builder.EntitySet<CandidateNomineeVoteDetail>("CandidateNomineeVoteDetails");
            builder.EntitySet<CandidateType>("CandidateTypes");
            builder.EntitySet<DACtbBallotTemp>("DACtbBallotTemps");
            builder.EntitySet<DACtbBallotVoteTemp>("DACtbBallotVoteTemps");
            builder.EntitySet<HomeMessage>("HomeMessages");
            builder.EntitySet<JobCode>("JobCodes");
            builder.EntitySet<Location>("Locations");
            builder.EntitySet<PayGradeLevel>("PayGradeLevels");
            builder.EntitySet<SalaryPlanType>("SalaryPlanTypes");
            builder.EntitySet<VotingSetting>("VotingSettings");
            builder.EntitySet<VotingSettingTemp>("VotingSettingTemps");




            // Get All activity Logs details for Reporting
           
            builder.Function("AddCandidateNominee")
               .ReturnsCollectionFromEntitySet<CandidateNominee>("AddCandidateNominee");

            builder.Function("CastVote")
               .ReturnsCollectionFromEntitySet<CandidateNomineeVoteDetail>("CastVote");



            // service routing 
            config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel()
                , new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer));
        }
    }
}
