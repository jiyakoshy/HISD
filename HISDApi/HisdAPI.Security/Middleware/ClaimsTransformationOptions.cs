using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace HisdAPI.Security.Middleware
{
    public class ClaimsTransformationOptions
    {
        public Func<ClaimsPrincipal, Task<ClaimsPrincipal>> ClaimsTransformation { get; set; }
    }
}