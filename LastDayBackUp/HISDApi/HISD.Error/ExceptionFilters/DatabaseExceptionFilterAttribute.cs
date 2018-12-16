using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;
using System.Data;
using NLog;

namespace HISD.Error.ExceptionFilters
{
    public class DatabaseExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();
        public override void OnException(HttpActionExecutedContext context)
        {
            if (context.Exception is DataException)
            {                
                logger.Error(context.Exception as DataException);
                context.Response = new HttpResponseMessage(HttpStatusCode.ServiceUnavailable);                                
            }
        }
    }
}
