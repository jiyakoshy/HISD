using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Query;
using System.Web.OData.Routing;
using HISD.MAS.DAL.Models;
using System.Threading.Tasks;
using System.Web.ModelBinding;
using Microsoft.OData.UriParser;
using System.Reflection;
using System.Web;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;
using HISD.MAS.DAL.Models.Mapping;
using HISD.MAS.DAL.Models.EDW;
using HISD.MAS.DAL.Models.EDWMapping;
using HISD.MAS.Web.Helpers;

namespace HISD.MAS.Web.Controllers
{
    public class CommonInfoController : ODataController
    {

        //private MASContext db = new MASContext();
        private EDWMASContext edwdb = new EDWMASContext();
        
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetUserInfoByLoginID(LoginID={userloginID})")]
        public IQueryable<UserInfo> GetUserInfoByLoginID([FromODataUri] string userloginID)
        {
            var aUser = (from ST in edwdb.Staffs
                           join ED in edwdb.EducationOrganizations on ST.EducationOrgNaturalKey equals ED.EducationOrgNaturalKey
                           where ST.LoginId.Equals(userloginID)
                           select new
                           {
                               LoginId = ST.LoginId,
                               StaffNaturalKey = ST.StaffNaturalKey,
                               EmployeeNumber = ST.EmployeeNumber,
                               FirstName = ST.FirstName,
                               LastSurname = ST.LastSurname,
                               MiddleName = ST.MiddleName,
                               EducationOrgNaturalKey = ST.EducationOrgNaturalKey,
                               NameOfInstitution = ED.NameOfInstitution
                               
                           }).AsEnumerable().Select(x => new UserInfo
                           {
                               LoginId = x.LoginId,
                               StaffNaturalKey = x.StaffNaturalKey,
                               EmployeeNumber = x.EmployeeNumber,
                               FirstName = x.FirstName,
                               LastSurname = x.LastSurname,
                               MiddleName = x.MiddleName,
                               EducationOrgNaturalKey = x.EducationOrgNaturalKey,
                               NameOfInstitution = x.NameOfInstitution
                           }).ToArray();

            return aUser.AsQueryable<UserInfo>();
        }

    }
}
