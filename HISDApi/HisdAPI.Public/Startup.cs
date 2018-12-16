using Owin;
using System.Web.Http;

namespace HisdAPI.Public
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {            
            WebApiConfig.Register(new HttpConfiguration());                        
        }
    }
}