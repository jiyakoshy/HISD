using NLog;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;

namespace HISD.Error.ExceptionFilters
{  
    public class NotImplementedExceptionFilterAttribute:ExceptionFilterAttribute
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();
        public override void OnException(HttpActionExecutedContext context)
        {
            if (context.Exception is NotImplementedException)
            {
                logger.Error(context.Exception as NotImplementedException);
                context.Response = new HttpResponseMessage(HttpStatusCode.NotImplemented);                                
            }
        }
    }
}
