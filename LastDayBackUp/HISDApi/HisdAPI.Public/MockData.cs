using HisdAPI.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HisdAPI.Public
{
    public class MockData
    {
        public IEnumerable<SchoolDataEntity> GetSchoolDataEntity()
        {
            return new List<SchoolDataEntity>
            {
                new SchoolDataEntity()
                {
                    SchoolNumber = "E1",
                    SchoolName="Alcott Elementary School",
                    StreetAddress = "5859 Bellfort Street",
                    City = "Houston",
                    State = "TX",
                    Zip = "77033",
                    PhoneNumber = "713-732-3540",
                    FaxNumber = "713-732-3542",
                    Hours="7:30 a.m.- 3:00 p.m",
                    PrincipalFirstName ="William",
                    PrincipalMiddleName ="",
                    PrincipalLastName ="Price",
                    TrusteeAreas ="1",
                    TotalEnrollment ="300",
                    website ="AlcottES",
                    GradeLevelCode_PK ="true",
                    GradeLevelCode_KG ="true",
                    GradeLevelCode_1 ="true",
                    GradeLevelCode_2 ="true",
                    GradeLevelCode_3 ="true",
                    GradeLevelCode_4 ="true",
                    GradeLevelCode_5 ="true",
                    GradeLevelCode_6 ="false",
                    GradeLevelCode_7 ="false",
                    GradeLevelCode_8 ="false",
                    GradeLevelCode_9 ="false",
                    GradeLevelCode_10 ="false",
                    GradeLevelCode_11 ="false",
                    GradeLevelCode_12 ="false",
                    grades ="PS-E5",
                    GeographicalLatitude ="29.667478",
                    GeographicalLongitude ="-95.329648",
                    SchoolPdf ="Alcott_ES.pdf",
                    FULL_SCHOOL_CODE = "100"
                },
                new SchoolDataEntity()
                {
                    SchoolNumber="E2",
                    SchoolName ="Almeda Elementary School",
                    StreetAddress ="14226 Almeda School Road",
                    City ="Houston",
                    State ="TX",
                    Zip ="77047",
                    PhoneNumber ="713-434-5620",
                    FaxNumber ="713-434-5622",
                    Hours ="7:30 a.m.- 3:00 p.m",
                    PrincipalFirstName ="Beverly",
                    PrincipalMiddleName ="J",
                    PrincipalLastName ="Cage",
                    TrusteeAreas ="1",
                    TotalEnrollment ="400",
                    website ="AlmedaES",
                    GradeLevelCode_PK ="false",
                    GradeLevelCode_KG ="false",
                    GradeLevelCode_1 ="true",
                    GradeLevelCode_2 ="true",
                    GradeLevelCode_3 ="true",
                    GradeLevelCode_4 ="true",
                    GradeLevelCode_5 ="true",
                    GradeLevelCode_6 ="false",
                    GradeLevelCode_7 ="false",
                    GradeLevelCode_8 ="false",
                    GradeLevelCode_9 ="false",
                    GradeLevelCode_10 ="false",
                    GradeLevelCode_11 ="false",
                    GradeLevelCode_12 ="false",
                    grades ="1-5",
                    GeographicalLatitude ="29.600943",
                    GeographicalLongitude ="-95.417247",
                    SchoolPdf ="Almeda_ES.pdf",
                    FULL_SCHOOL_CODE =""
                },
                new SchoolDataEntity()
                {
                    SchoolNumber="M1",
                    SchoolName ="Attucks Middle School",
                    StreetAddress ="4330 Belfort",
                    City ="Houston",
                    State ="TX",
                    Zip ="77051",
                    PhoneNumber ="713-732-3670",
                    FaxNumber ="713-732-3677",
                    Hours ="8:30AM - 3:00PM",
                    PrincipalFirstName ="Dr. Deirdre",
                    PrincipalMiddleName ="",
                    PrincipalLastName ="Sharkey",
                    TrusteeAreas ="2",
                    TotalEnrollment ="200",
                    website ="http://schools.houstonisd.org/domain/5930",
                    GradeLevelCode_PK ="false",
                    GradeLevelCode_KG ="false",
                    GradeLevelCode_1 ="false",
                    GradeLevelCode_2 ="false",
                    GradeLevelCode_3 ="false",
                    GradeLevelCode_4 ="false",
                    GradeLevelCode_5 ="false",
                    GradeLevelCode_6 ="true",
                    GradeLevelCode_7 ="true",
                    GradeLevelCode_8 ="true",
                    GradeLevelCode_9 ="false",
                    GradeLevelCode_10 ="false",
                    GradeLevelCode_11 ="false",
                    GradeLevelCode_12 ="false",
                    grades ="6-8",
                    GeographicalLatitude ="29.669321",
                    GeographicalLongitude ="-95.363724",
                    SchoolPdf ="",
                    FULL_SCHOOL_CODE =""
                },
                new SchoolDataEntity()
                {
                    SchoolNumber="M2",
                    SchoolName ="Frank Black Middle School",
                    StreetAddress ="1575 Chantilly",
                    City ="Houston",
                    State ="TX",
                    Zip ="77018",
                    PhoneNumber ="713-613-2505",
                    FaxNumber ="713-613-2533",
                    Hours ="8:30AM - 3:00PM",
                    PrincipalFirstName ="Meilin",
                    PrincipalMiddleName ="J",
                    PrincipalLastName ="Jao",
                    TrusteeAreas ="2",
                    TotalEnrollment ="300",
                    website ="http://schools.houstonisd.org/Page/2507",
                    GradeLevelCode_PK ="false",
                    GradeLevelCode_KG ="false",
                    GradeLevelCode_1 ="false",
                    GradeLevelCode_2 ="false",
                    GradeLevelCode_3 ="false",
                    GradeLevelCode_4 ="false",
                    GradeLevelCode_5 ="false",
                    GradeLevelCode_6 ="true",
                    GradeLevelCode_7 ="true",
                    GradeLevelCode_8 ="true",
                    GradeLevelCode_9 ="false",
                    GradeLevelCode_10 ="false",
                    GradeLevelCode_11 ="false",
                    GradeLevelCode_12 ="false",
                    grades ="6-8",
                    GeographicalLatitude ="29.829178",
                    GeographicalLongitude ="-95.439198",
                    SchoolPdf ="",
                    FULL_SCHOOL_CODE =""
                },
                new SchoolDataEntity()
                {
                    SchoolNumber="H1",
                    SchoolName ="Austin High School",
                    StreetAddress ="1700 Dumble Street",
                    City ="Houston",
                    State ="TX",
                    Zip ="",
                    PhoneNumber ="",
                    FaxNumber ="",
                    Hours ="8:30AM - 3:00PM",
                    PrincipalFirstName ="Jorge",
                    PrincipalMiddleName ="L.",
                    PrincipalLastName ="Arredondo",
                    TrusteeAreas ="2",
                    TotalEnrollment ="200",
                    website ="http://sfamustangs.org/index.html",
                    GradeLevelCode_PK ="false",
                    GradeLevelCode_KG ="false",
                    GradeLevelCode_1 ="false",
                    GradeLevelCode_2 ="false",
                    GradeLevelCode_3 ="false",
                    GradeLevelCode_4 ="false",
                    GradeLevelCode_5 ="false",
                    GradeLevelCode_6 ="false",
                    GradeLevelCode_7 ="false",
                    GradeLevelCode_8 ="false",
                    GradeLevelCode_9 ="true",
                    GradeLevelCode_10 ="true",
                    GradeLevelCode_11 ="true",
                    GradeLevelCode_12 ="true",
                    grades ="9-12",
                    GeographicalLatitude ="29.731638",
                    GeographicalLongitude ="-95.332006",
                    SchoolPdf ="",
                    FULL_SCHOOL_CODE ="xxx"
                },
                new SchoolDataEntity()
                {
                    SchoolNumber="H2",
                    SchoolName ="Bellaire High School",
                    StreetAddress ="5100 Maple St",
                    City ="Bellaire",
                    State ="TX",
                    Zip ="77401",
                    PhoneNumber ="713-667-2064",
                    FaxNumber ="",
                    Hours ="8:30AM - 3:00PM",
                    PrincipalFirstName ="Michael",
                    PrincipalMiddleName ="",
                    PrincipalLastName ="McDonough",
                    TrusteeAreas ="2",
                    TotalEnrollment ="300",
                    website ="",
                    GradeLevelCode_PK ="false",
                    GradeLevelCode_KG ="false",
                    GradeLevelCode_1 ="false",
                    GradeLevelCode_2 ="false",
                    GradeLevelCode_3 ="false",
                    GradeLevelCode_4 ="false",
                    GradeLevelCode_5 ="false",
                    GradeLevelCode_6 ="false",
                    GradeLevelCode_7 ="false",
                    GradeLevelCode_8 ="true",
                    GradeLevelCode_9 ="true",
                    GradeLevelCode_10 ="true",
                    GradeLevelCode_11 ="true",
                    GradeLevelCode_12 ="true",
                    grades ="8-12",
                    GeographicalLatitude ="29.692657",
                    GeographicalLongitude ="-95.469217",
                    SchoolPdf ="",
                    FULL_SCHOOL_CODE ="xxx"
                }
            };
        }

        public IEnumerable<TrusteeAreaEntity> GetTrusteeAreaEntity()
        {
            return new List<TrusteeAreaEntity>
            {
                new TrusteeAreaEntity
                {
                    TrusteeName="Anna Eastman",
                    TrusteeArea="1",
                    TrusteeEmail="test@gmail.com"
                },
                new TrusteeAreaEntity
                {
                    TrusteeName="Rhonda Skillern-Jones",
                    TrusteeArea="2",
                    TrusteeEmail="test@gmail.com"
                },
                new TrusteeAreaEntity
                {
                    TrusteeName="Manuel Rodríguez Jr.",
                    TrusteeArea="3",
                    TrusteeEmail="test@gmail.com"
                },
                new TrusteeAreaEntity
                {
                    TrusteeName="Paula M. Harris",
                    TrusteeArea="4",
                    TrusteeEmail="test@gmail.com"
                },
                new TrusteeAreaEntity
                {
                    TrusteeName="Lawrence Marshall",
                    TrusteeArea="5",
                    TrusteeEmail="test@gmail.com"
                },
                new TrusteeAreaEntity
                {
                    TrusteeName="Michael L. Luncefordn",
                    TrusteeArea="6",
                    TrusteeEmail="test@gmail.com"
                },
                new TrusteeAreaEntity
                {
                    TrusteeName="Greg Meyers",
                    TrusteeArea="7",
                    TrusteeEmail="test@gmail.com"
                },
                new TrusteeAreaEntity
                {
                    TrusteeName="Harvin C. Moore",
                    TrusteeArea="8",
                    TrusteeEmail="test@gmail.com"
                },
                new TrusteeAreaEntity
                {
                    TrusteeName="Juliet K. Stipeche",
                    TrusteeArea="9",
                    TrusteeEmail="test@gmail.com"
                },
            };
        }

        public IEnumerable<SchoolLeadershipEntity> GetSchoolLeadershipEntity()
        {
            return new List<SchoolLeadershipEntity>
            {
                new SchoolLeadershipEntity
                {
                    SchoolNumber="E1",
                    LeaderLvl1Title="level1-title",
                    LeaderLvl1Name="level1-name",
                    LeaderLvl1Email="level1@gmail.com",
                    LeaderLvl2Title="level2-title",
                    LeaderLvl2Name="level2-name",
                    LeaderLvl2Email="level2@gmail.com",
                    LeaderLvl3Name="level3-name",
                    LeaderLvl3Title="level3-title",
                    LeaderLvl3Email="level3@gmail.com"
                }
            };
        }

        public IEnumerable<SchoolDemographicsEntity> GetSchoolDemographicsEntity()
        {
            return new List<SchoolDemographicsEntity>
            {
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E1",
                    DemographicCategory="African American",
                    StudentCount="200",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E1",
                    DemographicCategory="Hispanic",
                    StudentCount="500",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E1",
                    DemographicCategory="Asian",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E1",
                    DemographicCategory="White",
                    StudentCount="50",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E1",
                    DemographicCategory="Pacific/Hawaian",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E1",
                    DemographicCategory="Native/Alaskan",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E1",
                    DemographicCategory="Other",
                    StudentCount="200",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E1",
                    DemographicCategory="African American",
                    StudentCount="200",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E1",
                    DemographicCategory="Hispanic",
                    StudentCount="500",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E1",
                    DemographicCategory="Asian",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E1",
                    DemographicCategory="White",
                    StudentCount="50",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E1",
                    DemographicCategory="Pacific/Hawaian",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E1",
                    DemographicCategory="Native/Alaskan",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E1",
                    DemographicCategory="Other",
                    StudentCount="200",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E2",
                    DemographicCategory="African American",
                    StudentCount="200",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E2",
                    DemographicCategory="Hispanic",
                    StudentCount="500",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E2",
                    DemographicCategory="Asian",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E2",
                    DemographicCategory="White",
                    StudentCount="50",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E2",
                    DemographicCategory="Pacific/Hawaian",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E2",
                    DemographicCategory="Native/Alaskan",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E2",
                    DemographicCategory="Other",
                    StudentCount="200",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E2",
                    DemographicCategory="African American",
                    StudentCount="200",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E2",
                    DemographicCategory="Hispanic",
                    StudentCount="500",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E2",
                    DemographicCategory="Asian",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E2",
                    DemographicCategory="White",
                    StudentCount="50",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E2",
                    DemographicCategory="Pacific/Hawaian",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E2",
                    DemographicCategory="Native/Alaskan",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="E2",
                    DemographicCategory="Other",
                    StudentCount="200",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M1",
                    DemographicCategory="African American",
                    StudentCount="200",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M1",
                    DemographicCategory="Hispanic",
                    StudentCount="500",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M1",
                    DemographicCategory="Asian",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M1",
                    DemographicCategory="White",
                    StudentCount="50",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M1",
                    DemographicCategory="Pacific/Hawaian",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M1",
                    DemographicCategory="Native/Alaskan",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M1",
                    DemographicCategory="Other",
                    StudentCount="200",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M1",
                    DemographicCategory="African American",
                    StudentCount="200",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M1",
                    DemographicCategory="Hispanic",
                    StudentCount="500",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M1",
                    DemographicCategory="Asian",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M1",
                    DemographicCategory="White",
                    StudentCount="50",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M1",
                    DemographicCategory="Pacific/Hawaian",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M1",
                    DemographicCategory="Native/Alaskan",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M1",
                    DemographicCategory="Other",
                    StudentCount="200",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M2",
                    DemographicCategory="African American",
                    StudentCount="200",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M2",
                    DemographicCategory="Hispanic",
                    StudentCount="500",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M2",
                    DemographicCategory="Asian",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M2",
                    DemographicCategory="White",
                    StudentCount="50",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M2",
                    DemographicCategory="Pacific/Hawaian",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M2",
                    DemographicCategory="Native/Alaskan",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M2",
                    DemographicCategory="Other",
                    StudentCount="200",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M2",
                    DemographicCategory="African American",
                    StudentCount="200",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M2",
                    DemographicCategory="Hispanic",
                    StudentCount="500",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M2",
                    DemographicCategory="Asian",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M2",
                    DemographicCategory="White",
                    StudentCount="50",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M2",
                    DemographicCategory="Pacific/Hawaian",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M2",
                    DemographicCategory="Native/Alaskan",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="M2",
                    DemographicCategory="Other",
                    StudentCount="200",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H1",
                    DemographicCategory="African American",
                    StudentCount="200",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H1",
                    DemographicCategory="Hispanic",
                    StudentCount="500",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H1",
                    DemographicCategory="Asian",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H1",
                    DemographicCategory="White",
                    StudentCount="50",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H1",
                    DemographicCategory="Pacific/Hawaian",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H1",
                    DemographicCategory="Native/Alaskan",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H1",
                    DemographicCategory="Other",
                    StudentCount="200",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H1",
                    DemographicCategory="African American",
                    StudentCount="200",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H1",
                    DemographicCategory="Hispanic",
                    StudentCount="500",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H1",
                    DemographicCategory="Asian",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H1",
                    DemographicCategory="White",
                    StudentCount="50",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H1",
                    DemographicCategory="Pacific/Hawaian",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H1",
                    DemographicCategory="Native/Alaskan",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H1",
                    DemographicCategory="Other",
                    StudentCount="200",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H2",
                    DemographicCategory="African American",
                    StudentCount="200",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H2",
                    DemographicCategory="Hispanic",
                    StudentCount="500",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H2",
                    DemographicCategory="Asian",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H2",
                    DemographicCategory="White",
                    StudentCount="50",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H2",
                    DemographicCategory="Pacific/Hawaian",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H2",
                    DemographicCategory="Native/Alaskan",
                    StudentCount="0",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H2",
                    DemographicCategory="Other",
                    StudentCount="200",
                    AcademicYear="2017"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H2",
                    DemographicCategory="African American",
                    StudentCount="200",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H2",
                    DemographicCategory="Hispanic",
                    StudentCount="500",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H2",
                    DemographicCategory="Asian",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H2",
                    DemographicCategory="White",
                    StudentCount="50",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H2",
                    DemographicCategory="Pacific/Hawaian",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H2",
                    DemographicCategory="Native/Alaskan",
                    StudentCount="0",
                    AcademicYear="2016"
                },
                new SchoolDemographicsEntity
                {
                    SchoolNumber="H2",
                    DemographicCategory="Other",
                    StudentCount="200",
                    AcademicYear="2016"
                }
            };
        }

        public IEnumerable<DistrictProgramsAtSchoolEntity> GetDistrictProgramsAtSchoolEntity()
        {
            return new List<DistrictProgramsAtSchoolEntity>
            {
                new DistrictProgramsAtSchoolEntity
                {
                    SchoolNumber = "E1",
                    DistrictProgramID = "5"
                },
                new DistrictProgramsAtSchoolEntity
                {
                    SchoolNumber = "M1",
                    DistrictProgramID = "3"
                },
                new DistrictProgramsAtSchoolEntity
                {
                    SchoolNumber = "E2",
                    DistrictProgramID = "2"
                },
                new DistrictProgramsAtSchoolEntity
                {
                    SchoolNumber = "E1",
                    DistrictProgramID = "6"
                },
                new DistrictProgramsAtSchoolEntity
                {
                    SchoolNumber = "E2",
                    DistrictProgramID = "6"
                },
                new DistrictProgramsAtSchoolEntity
                {
                    SchoolNumber = "H1",
                    DistrictProgramID = "4"
                },
                new DistrictProgramsAtSchoolEntity
                {
                    SchoolNumber = "H2",
                    DistrictProgramID = "3"
                },
                new DistrictProgramsAtSchoolEntity
                {
                    SchoolNumber = "M1",
                    DistrictProgramID = "4"
                }
            };
        }

        public List<MagnetProgramsLkupEntity> GetMagnetProgramsLkupEntity()
        {
            return new List<MagnetProgramsLkupEntity>
            {
                new MagnetProgramsLkupEntity
                {
                    MagnetSubcategoryId="1",
                    CodeValue="",
                    MagnetSubcategoryName="Magnet",
                    MagnetSubcategoryValue="0",
                    ToolTipDesc="Magnet"
                },
                new MagnetProgramsLkupEntity
                {
                    MagnetSubcategoryId="2",
                    CodeValue="",
                    MagnetSubcategoryName="fine arts education system",
                    MagnetSubcategoryValue="1",
                    ToolTipDesc="fine arts"
                },
                new MagnetProgramsLkupEntity
                {
                    MagnetSubcategoryId="3",
                    CodeValue="",
                    MagnetSubcategoryName="STEM",
                    MagnetSubcategoryValue="2",
                    ToolTipDesc="STEM"
                },
                new MagnetProgramsLkupEntity
                {
                    MagnetSubcategoryId="4",
                    CodeValue="",
                    MagnetSubcategoryName="languages",
                    MagnetSubcategoryValue="3",
                    ToolTipDesc="languages"
                },
                new MagnetProgramsLkupEntity
                {
                    MagnetSubcategoryId="5",
                    CodeValue="",
                    MagnetSubcategoryName="leadership",
                    MagnetSubcategoryValue="4",
                    ToolTipDesc="leadership"
                },
                new MagnetProgramsLkupEntity
                {
                    MagnetSubcategoryId="6",
                    CodeValue="",
                    MagnetSubcategoryName="Montessori School",
                    MagnetSubcategoryValue="5",
                    ToolTipDesc="montessori"
                }
            };
        }

        public List<SchoolProgramsEntity> GetSchoolProgramsEntity()
        {
            return new List<SchoolProgramsEntity>
            {
                new SchoolProgramsEntity
                {
                    SchoolNumber="E1",
                    SchoolProgramCategory="Special Education",
                    SchoolProgramDesc="Speech Therapy Services",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="E1",
                    SchoolProgramCategory="Multi lingual",
                    SchoolProgramDesc="English as a Second Language",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="E1",
                    SchoolProgramCategory="Magnet",
                    SchoolProgramDesc="Montessori (SWAS)",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="E1",
                    SchoolProgramCategory="Advanced Academics",
                    SchoolProgramDesc="Vanguard Neighborhood",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="E1",
                    SchoolProgramCategory="Career and Technical Education",
                    SchoolProgramDesc="Career Development",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="M1",
                    SchoolProgramCategory="Special Education",
                    SchoolProgramDesc="Behavior Support (BSC) Services",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="M1",
                    SchoolProgramCategory="Multi lingual",
                    SchoolProgramDesc="Developmental Bilingual Program",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="M1",
                    SchoolProgramCategory="Magnet",
                    SchoolProgramDesc="Dual Language (SWP)",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="M1",
                    SchoolProgramCategory="Advanced Academics",
                    SchoolProgramDesc="Vanguard Neighborhood",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="M1",
                    SchoolProgramCategory="Career and Technical Education",
                    SchoolProgramDesc="Health Sciencet",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="H1",
                    SchoolProgramCategory="Special Education",
                    SchoolProgramDesc="Skills for Learning and Living (SLL)",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="H1",
                    SchoolProgramCategory="Multi lingual",
                    SchoolProgramDesc="Two-Way Bilingual Program",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="H1",
                    SchoolProgramCategory="Magnet",
                    SchoolProgramDesc="Vanguard (SUS)",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="H1",
                    SchoolProgramCategory="Advanced Academics",
                    SchoolProgramDesc="Pre-AP",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="H1",
                    SchoolProgramCategory="Career and Technical Education",
                    SchoolProgramDesc="Carrer Preparation I",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="E2",
                    SchoolProgramCategory="Special Education",
                    SchoolProgramDesc="Speech Therapy Services",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="E2",
                    SchoolProgramCategory="Multi lingual",
                    SchoolProgramDesc="English as a Second Language",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="E2",
                    SchoolProgramCategory="Magnet",
                    SchoolProgramDesc="Montessori (SWAS)",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="E2",
                    SchoolProgramCategory="Advanced Academics",
                    SchoolProgramDesc="Vanguard Neighborhood",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="E2",
                    SchoolProgramCategory="Career and Technical Education",
                    SchoolProgramDesc="Career Development",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="M2",
                    SchoolProgramCategory="Special Education",
                    SchoolProgramDesc="Behavior Support (BSC) Services",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="M2",
                    SchoolProgramCategory="Multi lingual",
                    SchoolProgramDesc="Developmental Bilingual Program",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="M2",
                    SchoolProgramCategory="Magnet",
                    SchoolProgramDesc="Dual Language (SWP)",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="M2",
                    SchoolProgramCategory="Advanced Academics",
                    SchoolProgramDesc="Vanguard Neighborhood",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="M2",
                    SchoolProgramCategory="Career and Technical Education",
                    SchoolProgramDesc="Health Sciencet",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="H2",
                    SchoolProgramCategory="Special Education",
                    SchoolProgramDesc="Skills for Learning and Living (SLL)",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="H2",
                    SchoolProgramCategory="Multi lingual",
                    SchoolProgramDesc="Two-Way Bilingual Program",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="H2",
                    SchoolProgramCategory="Magnet",
                    SchoolProgramDesc="Vanguard (SUS)",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="H2",
                    SchoolProgramCategory="Advanced Academics",
                    SchoolProgramDesc="Pre-AP",
                    MagnetSubcategoryId=""
                },
                new SchoolProgramsEntity
                {
                    SchoolNumber="H2",
                    SchoolProgramCategory="Career and Technical Education",
                    SchoolProgramDesc="Carrer Preparation I",
                    MagnetSubcategoryId=""
                }
            };
        }

        public List<DistrictProgramsLkupEntity> GetDistrictProgramsLkupEntity()
        {
            return new List<DistrictProgramsLkupEntity>
            {
                new DistrictProgramsLkupEntity
                {
                    DistrictProgramId = "1",
                    CodeValue = "",
                    DistrictProgramDesc="full service schools",
                    SearchByThisProgram="1",
                    ToolTipDesc="full service schools"
                },
                new DistrictProgramsLkupEntity
                {
                    DistrictProgramId = "2",
                    CodeValue = "",
                    DistrictProgramDesc="early childhoold centers",
                    SearchByThisProgram="1",
                    ToolTipDesc="early childhoold centers"
                },
                new DistrictProgramsLkupEntity
                {
                    DistrictProgramId = "3",
                    CodeValue = "",
                    DistrictProgramDesc="charter schools",
                    SearchByThisProgram="1",
                    ToolTipDesc="charter schools"
                },
                new DistrictProgramsLkupEntity
                {
                    DistrictProgramId = "4",
                    CodeValue = "",
                    DistrictProgramDesc="IB schools",
                    SearchByThisProgram="1",
                    ToolTipDesc="IB schools"
                },
                new DistrictProgramsLkupEntity
                {
                    DistrictProgramId = "5",
                    CodeValue = "",
                    DistrictProgramDesc="alternative schools",
                    SearchByThisProgram="1",
                    ToolTipDesc="alternative schools"
                },
                new DistrictProgramsLkupEntity
                {
                    DistrictProgramId = "6",
                    CodeValue = "",
                    DistrictProgramDesc="elementary schools",
                    SearchByThisProgram="0",
                    ToolTipDesc="elementary schools"
                }
            };
        }

        public List<SchoolDemographicsSupplementEntity> GetSchoolDemographicsSupplementEntity()
        {           
            return new List<SchoolDemographicsSupplementEntity>
            {
                new SchoolDemographicsSupplementEntity
                {
                    LunchProgramPercent = "80",
                    InBoundaryPercent = "80",
                    SpecialEdPercent = "10",
                    EnglishLearnerPercent = "80",
                    AcademicYear = "2011",
                    SchoolNumber = "E1"
                }
            };
        }

        public List<PerformanceMetricsEntity> GetPerformanceMetricsEntity()
        {
            return new List<PerformanceMetricsEntity>
            {
                new PerformanceMetricsEntity
                {
                   SourceID = "1",
                   Name="Meeting or exceeding math standards",
                   Definition="Percentage of students who earned met or exceeded state standards in math on the Texas Assessment of Knowledge and Skills test (TAKS).",
                   UI_Category="Student Performance",
                   MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "2",
                    Name ="Meeting or exceeding reading standards",
                    Definition ="Percentage of students who earned met or exceeded state standards in reading on the Texas Assessment of Knowledge and Skills test (TAKS).",
                    UI_Category ="Student Performance",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "3",
                    Name ="Exceeding math standards",
                    Definition ="Percentage of students who earned commended on the state standards in math on Texas Assessment of Knowledge and Skills test (TAKS).",
                    UI_Category ="Student Performance",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "4",
                    Name ="Exceeding reading standards",
                    Definition ="Percentage of students who earned commended on the state standards in reading on Texas Assessment of Knowledge and Skills test (TAKS).",
                    UI_Category ="Student Performance",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "5",
                    Name ="Graduation rate",
                    Definition ="Graduation rate is the percentage of students from a cohort of first-time ninth graders who graduate by the expected graduation date four years later.",
                    UI_Category ="Student Performance",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "6",
                    Name ="5 year graduation rate",
                    Definition ="Graduation rate is the percentage of students from a cohort of first-time ninth graders who graduate five years later.",
                    UI_Category ="Student Performance",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "7",
                    Name ="Retention of effective and highly effective teachers",
                    Definition ="The percentage of Effective or Highly effective teachers rated by EVAAS who are returning to school from the previous school year.",
                    UI_Category ="Student Performance",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "8",
                    Name ="College enrollment",
                    Definition ="The percentage of students graduating in June or August that are registered to a college or university the fall following their high school graduation.",
                    UI_Category ="Student Performance",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "9",
                    Name ="Advanced placement performance",
                    Definition ="The percentage of students participating in an Advanced Placement examination and scoring 3, 4 or 5. These scores generally enable students to receive college credit.",
                    UI_Category ="Student Performance",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "10",
                    Name ="Median Math Performance Level",
                    Definition ="Percentage of students at or above the 50th NPR on Stanford/Aprenda Math.",
                    UI_Category ="Student Performance",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "11",
                    Name ="Median Reading Performance Level",
                    Definition ="Percentage of students at or above the 50th NPR on Stanford/Aprenda reading.",
                    UI_Category ="Student Performance",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "12",
                    Name ="9th grade completion",
                    Definition ="The percentage of first time 9th grade students who earned enough credits by the end of spring semester to be promoted to 10th grade. These students are on track for graduation.",
                    UI_Category ="Student Progress",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "13",
                    Name ="Student re-enrollment",
                    Definition ="Percentage of students who returned to the school the following year. This does not include students in school's highest grade level.",
                    UI_Category ="Safe and effective ",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "14",
                    Name ="Student attendance",
                    Definition ="Average daily attendance at the end of the school year.",
                    UI_Category ="Safe and Effective",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "15",
                    Name ="Students with 90% attendance",
                    Definition ="Percentage of the students with 90% attendance at the end of the school year.",
                    UI_Category ="Unique School Indicators",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "16",
                    Name ="Advanced placement enrollment",
                    Definition ="Percentage of students enrolled in one or more Advanced placement(AP) courses. This is for the students enrolled as of the last date of the school year.",
                    UI_Category ="Unique School Indicators",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "17",
                    Name ="School enrollment",
                    Definition ="School enrollment by ethnicity and othe demographic categories.",
                    UI_Category ="Demographics",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "18",
                    Name ="Student growth in math",
                    Definition ="Student growth in math from one year to the next based on EVAAS-mean NCE gain over grades.",
                    UI_Category ="Student Progress",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "19",
                    Name ="Student growth in reading",
                    Definition ="School enrollment by ethnicity and othe demographic categories.",
                    UI_Category ="Student Progress",
                    MetricType ="P"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "20",
                    Name ="Expulsions",
                    Definition ="School enrollment by ethnicity and othe demographic categories.",
                    UI_Category ="Safe and Effective schools",
                    MetricType ="V"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "21",
                    Name ="In-School Suspensions",
                    Definition ="School enrollment by ethnicity and othe demographic categories.",
                    UI_Category ="Safe and Effective schools",
                    MetricType ="V"
                },
                new PerformanceMetricsEntity
                {
                    SourceID = "22",
                    Name ="Out-of-school Suspensions",
                    Definition ="School enrollment by ethnicity and othe demographic categories.",
                    UI_Category ="Safe and Effective schools",
                    MetricType ="V"
                }
            };
        }

        public IEnumerable<FeederNDestinationListEntity> GetFeederNDestinationListEntity()
        {

            return new List<FeederNDestinationListEntity>
            {
                new FeederNDestinationListEntity
                {
                    SchoolNumber = "E1",
                    DestinationSchoolNumber = "M1"
                },
                new FeederNDestinationListEntity
                {
                    SchoolNumber = "E1",
                    DestinationSchoolNumber = "M2"
                },
                new FeederNDestinationListEntity
                {
                    SchoolNumber = "E2",
                    DestinationSchoolNumber = "M2"
                },
                new FeederNDestinationListEntity
                {
                    SchoolNumber = "M1",
                    DestinationSchoolNumber="H1"
                },
                new FeederNDestinationListEntity
                {
                    SchoolNumber = "M2",
                    DestinationSchoolNumber = "H1"
                },
                new FeederNDestinationListEntity
                {
                    SchoolNumber = "E1",
                    DestinationSchoolNumber="H1"
                },
                new FeederNDestinationListEntity
                {
                    SchoolNumber="E2",
                    DestinationSchoolNumber="H1"
                },
                new FeederNDestinationListEntity
                {
                    SchoolNumber="M2",
                    DestinationSchoolNumber="H2"
                }
            };
        }

    }
}