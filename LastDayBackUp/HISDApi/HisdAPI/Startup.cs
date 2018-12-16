using HisdAPI.Security;
using HisdAPI.Security.Middleware;
using Owin;
using System.Web.Http;

namespace HisdAPI
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var httpConfiguration = new HttpConfiguration();
            WebApiConfig.Register(httpConfiguration);
            //app.UseClaimsTransformation(Transformation.ClaimsTransformation);
            app.UseWebApi(httpConfiguration);
        }        
    }
}