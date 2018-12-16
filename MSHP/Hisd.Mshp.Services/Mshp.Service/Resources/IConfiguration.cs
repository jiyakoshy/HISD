using System.Linq;

namespace Mshp.Service
{
    public interface IConfiguration
    {
        string DatabaseConnection { get; }
        string ApplicationId { get; }

        int BeginOfSchoolYearMonth { get; }

    }
}
