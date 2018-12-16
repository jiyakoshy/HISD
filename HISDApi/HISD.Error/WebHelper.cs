using HISD.Error.ExceptionFilters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace HISD.Error
{
    public static class WebHelper
    {
        public static HttpConfiguration RegisterHttpFilters(this HttpConfiguration config)
        {
            config.Filters.Add(new NullReferenceExceptionFilterAttribute());
            config.Filters.Add(new DatabaseExceptionFilterAttribute());
            config.Filters.Add(new ArgumentExceptionFilterAttribute());
            config.Filters.Add(new NotImplementedExceptionFilterAttribute());
            config.Filters.Add(new InvalidOperationFilterAttribute());
            return config;
        }
    }
}
