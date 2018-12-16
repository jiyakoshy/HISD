using System;
using System.Configuration;

namespace Mshp.Service
{
    public class Configuration : IConfiguration
    {
        public Configuration()
        {

        }

        #region Configuration Members...
        public string DatabaseConnection
        {
            get
            {
                return ConfigurationManager.ConnectionStrings["MSHPConnection"].ConnectionString;
            }
        }

        public string ApplicationId
        {
            get
            {
                if (null == ConfigurationManager.AppSettings["ApplicationId"])
                    return "0000";
                return ConfigurationManager.AppSettings["ApplicationId"];
            }
        }

        public int BeginOfSchoolYearMonth
        {
            get
            {
                if (null == ConfigurationManager.AppSettings["BeginOfSchoolYearMonth"])
                    return 8;
                return Convert.ToInt32(ConfigurationManager.AppSettings["BeginOfSchoolYearMonth"]);
            }
        }

        #endregion

    }
}
