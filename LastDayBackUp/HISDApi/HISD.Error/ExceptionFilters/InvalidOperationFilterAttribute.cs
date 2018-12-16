using NLog;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;


namespace HISD.Error.ExceptionFilters
{
    class InvalidOperationFilterAttribute : ExceptionFilterAttribute
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();
        public override void OnException(HttpActionExecutedContext context)
        {
            if (context.Exception is InvalidOperationException)
            {
                logger.Error(context.Exception as InvalidOperationException);
                context.Response = new HttpResponseMessage(HttpStatusCode.NotImplemented);
            }            
        }
    }
}
