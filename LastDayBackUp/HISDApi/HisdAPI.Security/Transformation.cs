using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

using System.DirectoryServices.AccountManagement;


namespace HisdAPI.Security
{
    public class Transformation
    {
        public static async Task<ClaimsPrincipal> ClaimsTransformation(ClaimsPrincipal incoming)
        {
            if (!incoming.Identity.IsAuthenticated)
            {
                return incoming;
            }
            var claims = new List<Claim>();

            // set up domain context
            using (PrincipalContext ctx = new PrincipalContext(ContextType.Domain))
            {
                // find a user
                UserPrincipal user = UserPrincipal.FindByIdentity(ctx, incoming.Identity.Name);
                claims.Add(new Claim(ClaimTypes.UserData, user.DisplayName));
                claims.Add(new Claim(ClaimTypes.NameIdentifier, incoming.Identity.Name));

                if (user != null)
                {
                    // get the authorization groups - those are the "roles" 
                    var groups = user.GetAuthorizationGroups();

                    foreach (Principal principal in groups)
                    {
                        // do something with the group (or role) in question
                        claims.Add(new Claim(ClaimTypes.Role, principal.Name));
                    }
                }
            }

            var id = new ClaimsIdentity("Windows");
            id.AddClaims(claims);

            return new ClaimsPrincipal(id);
        }
    }
}
