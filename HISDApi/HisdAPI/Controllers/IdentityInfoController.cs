using HISD.Error.ExceptionFilters;
using System;
using System.Collections.Generic;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Http.Results;
using System.Data;

namespace HisdAPI.Controllers
{
    public class IdentityInfoController : ApiController
    {
        [Route("api/values")]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [Authorize]
        [Route("api/IdentityInfo")]
        public IEnumerable<ViewClaim> GetIdentityInfo()
        {
            var principal = User as ClaimsPrincipal;

            return principal.Claims.Select(claim => new ViewClaim()
            {
                Type = claim.Type,
                Value = claim.Value
            });
        }

        [Authorize]
        [Route("api/Roles")]
        public IEnumerable<string> GetRoles()
        {
            var principal = User as ClaimsPrincipal;

            return principal.Claims
                .Where(claim => claim.Type.Contains(ClaimsIdentity.DefaultRoleClaimType))
                .Select(claim => claim.Value)
                .Distinct();
        }

        [Route("api/UserInfo")]
        [Authorize]
        public IHttpActionResult GetUserInfo()
        {
            try
            {
                var principal2 = RequestContext.Principal;                
                return GetUserInfo(principal2.Identity.Name);
            }
            catch (Exception)
            {
                return NotFound();
            }
        }

        [Route("api/SelectedUserInfo/{username=username}")]
        [Authorize]
        public IHttpActionResult GetSelectedUserInfo(string username)
        {
            try
            {
                return GetUserInfo(username);                             
            }
            catch(Exception)
            {
                return NotFound();
            } 
        }


        [Route("api/UsersForGroup/{groupname=groupname}")]
        [Authorize]
        public IHttpActionResult GetUsersForGroup(string groupname)
        {
            try
            {
                var users = new List<UserInfo>();                
                using (PrincipalContext ctx = new PrincipalContext(ContextType.Domain))
                {
                    GroupPrincipal group = GroupPrincipal.FindByIdentity(ctx, groupname);
                    if (group != null)
                    {
                        var principalUsers = group.GetMembers(true);
                        
                        foreach (UserPrincipal principal in principalUsers)
                        {
                            var authorizationGroups = principal.GetAuthorizationGroups();
                            var groups = new List<string>();
                            foreach(var grp in authorizationGroups)
                            {
                                groups.Add(grp.Name);
                            }
                            users.Add(new UserInfo
                            {
                                name = principal.Name,
                                email = principal.EmailAddress,
                                loginName = principal.SamAccountName,
                                roles = groups.Distinct()
                            });
                        }
                    }
                    else
                    {
                        return NotFound();
                    }
                }
                return Ok(users);
            }
            catch (Exception)
            {
                return NotFound();
            }
        }

        [Route("api/mytest")]        
        [Authorize]
        public IHttpActionResult GetMyTest()
        {
            throw new DataException("data exception");
            //throw new NotImplementedException("method not implemented");
        }


        private IHttpActionResult GetUserInfo(string username)
        {
            var roles = new List<string>();
            string displayName = String.Empty, emailAddress = String.Empty;
            using (PrincipalContext ctx = new PrincipalContext(ContextType.Domain))
            {
                UserPrincipal user = UserPrincipal.FindByIdentity(ctx, username);
                if (user != null)
                {
                    displayName = user.DisplayName;
                    emailAddress = user.EmailAddress;
                    var groups = user.GetAuthorizationGroups(); // get the authorization groups - those are the "roles" 
                    foreach (Principal principal in groups)
                    {
                        roles.Add(principal.Name);// do something with the group (or role) in question
                    }
                }
                else
                {
                    return NotFound();
                }
            }
            return Ok(new UserInfo
            {
                loginName = username,
                name = displayName,
                email = emailAddress,
                roles = roles.Distinct()
            });

        }

    }

    [DataContract]
    public class ViewClaim
    {
        [DataMember]
        public string Type { get; set; }
        [DataMember]
        public string Value { get; set; }
    }

    [DataContract]
    public class UserInfo
    {
        [DataMember]
        public string loginName { get; set; }
        [DataMember]
        public string name { get; set; }
        [DataMember]
        public string email { get; set; }
        [DataMember]
        public IEnumerable<string> roles { get; set; }
    }
}
