using System;
using System.Collections.Generic;
using System.Data.Entity.Core.EntityClient;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Configuration;

namespace HisdAPI
{
    public static class HAPIConnectionFactory
    {                
        public static string GetConnectionStringFromBuilder()
        {
            string connectionString = new SqlConnectionStringBuilder
            {
                InitialCatalog = "EDB",
                DataSource = "DWICINTDB",
                UserID = "App_MAS",
                Password = "fxtV586ZikASNa2",
                ApplicationName = "EntityFramework"
            }.ConnectionString;            

            return connectionString;
        }

        public static string GetConnectionString(string appId)
        {
            return ConfigurationManager.ConnectionStrings[String.IsNullOrEmpty(appId)? "EDWDataModel1":appId.ToLower()].ConnectionString;            
        }

        public static string GetConnectionString(System.Net.Http.HttpRequestMessage request)
        {
            IEnumerable<string> requests;
            bool found = request.Headers.TryGetValues("AppID", out requests);
            string appId = found ? requests.FirstOrDefault() : string.Empty;
            return GetConnectionString(appId);
        }

    }
}