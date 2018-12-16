using NLog;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;

namespace HISD.Error.ExceptionFilters
{
    public class ArgumentExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();
        public override void OnException(HttpActionExecutedContext context)
        {
            if (context.Exception is ArgumentException)
            {
                logger.Error(context.Exception as ArgumentException);
                context.Response = new HttpResponseMessage(HttpStatusCode.NotImplemented);
            } else if (context.Exception is ArgumentNullException)
            {
                logger.Error(context.Exception as ArgumentNullException);
                context.Response = new HttpResponseMessage(HttpStatusCode.NotImplemented);
            }
            else if (context.Exception is ArgumentOutOfRangeException)
            {
                logger.Error(context.Exception as ArgumentOutOfRangeException);
                context.Response = new HttpResponseMessage(HttpStatusCode.NotImplemented);
            }

        }
    }
}
