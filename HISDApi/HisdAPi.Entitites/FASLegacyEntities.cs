using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HisdAPI.Entities
{
    public class SchoolDataEntity
    {
        public string SchoolName { get; set; }
        public string SchoolNumber { get; set; }
        public string PrincipalFirstName { get; set; }
        public string PrincipalMiddleName { get; set; }
        public string PrincipalLastName { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string PhoneNumber { get; set; }
        public string FaxNumber { get; set; }
        public string grades { get; set; }
        public string GradeLevelCode_EE { get; set; }
        public string GradeLevelCode_PK { get; set; }
        public string GradeLevelCode_KG { get; set; }
        public string GradeLevelCode_1 { get; set; }
        public string GradeLevelCode_2 { get; set; }
        public string GradeLevelCode_3 { get; set; }
        public string GradeLevelCode_4 { get; set; }
        public string GradeLevelCode_5 { get; set; }
        public string GradeLevelCode_6 { get; set; }
        public string GradeLevelCode_7 { get; set; }
        public string GradeLevelCode_8 { get; set; }
        public string GradeLevelCode_9 { get; set; }
        public string GradeLevelCode_10 { get; set; }
        public string GradeLevelCode_11 { get; set; }
        public string GradeLevelCode_12 { get; set; }
        public string GeographicalLatitude { get; set; }
        public string GeographicalLongitude { get; set; }
        public string TrusteeAreas { get; set; }
        public string TotalEnrollment { get; set; }
        public string Hours { get; set; }
        public string website { get; set; }
        public string SchoolPdf { get; set; }
        public string FULL_SCHOOL_CODE { get; set; }
        public string SchoolBoundary { get; set; }
    }

    public class TrusteeAreaEntity
    {
        public string TrusteeName { get; set; }
        public string TrusteeArea { get; set; }
        public string TrusteeEmail { get; set; }
    }

    public class DistrictProgramsAtSchoolEntity
    {
        public string SchoolNumber { get; set; }
        public string DistrictProgramID { get; set; }
    }

    public class DistrictProgramsLkupEntity
    {
        public string DistrictProgramId { get; set; }
        public string DistrictProgramDesc { get; set; }
        public string CodeValue { get; set; }
        public string SearchByThisProgram { get; set; }
        public string ToolTipDesc { get; set; }
    }

    public class SchoolProgramsEntity
    {
        public string SchoolNumber { get; set; }
        public string SchoolProgramCategory { get; set; }
        public string SchoolProgramDesc { get; set; }
        public string MagnetSubcategoryId { get; set; }
    }

    public class MagnetProgramsLkupEntity
    {
        public string MagnetSubcategoryId { get; set; }
        public string MagnetSubcategoryName { get; set; }
        public string CodeValue { get; set; }
        public string MagnetSubcategoryValue { get; set; }
        public string ToolTipDesc { get; set; }
    }

    public class SchoolDemographicsEntity
    {
        public string SchoolNumber { get; set; }
        public string AcademicYear { get; set; }
        public string DemographicCategory { get; set; }
        public string StudentCount { get; set; }
    }

    public class SchoolDemographicsSupplementEntity
    {
        public string SchoolNumber { get; set; }
        public string AcademicYear { get; set; }
        public string EnglishLearnerPercent { get; set; }
        public string InBoundaryPercent { get; set; }
        public string SpecialEdPercent { get; set; }
        public string LunchProgramPercent { get; set; }
    }

    public class FeederNDestinationListEntity
    {
        public string SchoolNumber { get; set; }
        public string DestinationSchoolNumber { get; set; }
    }

    public class TransportationEntity
    {
        public string SchoolNumber { get; set; }
        public string TransportationMode { get; set; }
        public string AM_Time { get; set; }
        public string PM_Time { get; set; }
        public string Stop { get; set; }
    }

    public class PerformanceMetricsEntity
    {
        public string SourceID { get; set; }
        public string UI_Category { get; set; }
        public string Name { get; set; }
        public string Definition { get; set; }
        public string MetricType { get; set; }
    }

    public class StudentPerformanceMetricsEntity
    {
        public string SchoolNumber { get; set; }
        public string AcademicYear { get; set; }
        public string PerformanceMetric_SourceID { get; set; }
        public string MetricValue { get; set; }
        public string Ethnicity { get; set; }
    }

    public class SchoolLeadershipEntity
    {
        public string SchoolNumber { get; set; }
        public string LeaderLvl1Title { get; set; }
        public string LeaderLvl1Name { get; set; }
        public string LeaderLvl1Email { get; set; }
        public string LeaderLvl2Title { get; set; }
        public string LeaderLvl2Name { get; set; }
        public string LeaderLvl2Email { get; set; }
        public string LeaderLvl3Title { get; set; }
        public string LeaderLvl3Name { get; set; }
        public string LeaderLvl3Email { get; set; }
    }

    public class BoundaryAddrEntity
    {
        public string GeoCodesID { get; set; }
        public Int64 AddressNumberMin { get; set; }
        public Int64 AddressNumberMax { get; set; }
        public string AddressNumberType { get; set; }
        public string StreetName { get; set; }
        public string AddressTypeCodeDesc { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zipcode { get; set; }
        public string AddressDirectionCodeDesc { get; set; }
    }

    public class SchoolBoundaryXrefEntity
    {
        public string GeoCodesID { get; set; }
        public string SchoolNumber { get; set; }
    }
}
