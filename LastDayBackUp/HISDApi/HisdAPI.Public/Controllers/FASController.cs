using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using HisdAPI.DAL;
using HisdAPI.Entities;

namespace HisdAPI.Public.Controllers
{
    public class FASController : ApiController
    {
        private EDWDataModel db = new EDWDataModel();

        [Route("api/values")]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [Route("api/SchoolDataEntity")]
        public async Task<IHttpActionResult> GetSchoolDataEntity()
        {
            var schoolDataQuery = @"select
	            SchoolName,
	            SchoolNumber,
	            CAST(GeographicalLatitude as varchar) as GeographicalLatitude,
	            CAST(GeographicalLongitude as varchar) as GeographicalLongitude,
	            FULL_SCHOOL_CODE,
	            StreetAddress,
	            PrincipalFirstName,
	            ISNULL(SUbstring(PrincipalMiddleName, 1,1),'') AS PrincipalMiddleName,
	            PrincipalLastName,
	            City,
	            State,
	            Zip,
	            PhoneNumber,
                FaxNumber,
				FullURL as website,
				SchoolPdf,
				SchoolBoundary,
				CAST(CEILING(TotalEnrollment) as varchar) as TotalEnrollment,
				CAST(TrusteeAreas as varchar) as TrusteeAreas,
	            (CASE WHEN [1] = '1' THEN 'true' ELSE 'false' END) as GradeLevelCode_1,
	            (CASE WHEN [2] = '2' THEN 'true' ELSE 'false' END) as GradeLevelCode_2,
	            (CASE WHEN [3] = '3' THEN 'true' ELSE 'false' END) as GradeLevelCode_3,
	            (CASE WHEN [4] = '4' THEN 'true' ELSE 'false' END) as GradeLevelCode_4,
	            (CASE WHEN [5] = '5' THEN 'true' ELSE 'false' END) as GradeLevelCode_5,
	            (CASE WHEN [6] = '6' THEN 'true' ELSE 'false' END) as GradeLevelCode_6,
	            (CASE WHEN [7] = '7' THEN 'true' ELSE 'false' END) as GradeLevelCode_7,
	            (CASE WHEN [8] = '8' THEN 'true' ELSE 'false' END) as GradeLevelCode_8,
	            (CASE WHEN [9] = '9' THEN 'true' ELSE 'false' END) as GradeLevelCode_9,
	            (CASE WHEN [10] = '10' THEN 'true' ELSE 'false' END) as GradeLevelCode_10,
	            (CASE WHEN [11] = '11' THEN 'true' ELSE 'false' END) as GradeLevelCode_11,
	            (CASE WHEN [12] = '12' THEN 'true' ELSE 'false' END) as GradeLevelCode_12,
	            (CASE WHEN [K] = 'K' THEN 'true' ELSE 'false' END) as GradeLevelCode_KG,
	            (CASE WHEN [PK] = 'PK' THEN 'true' ELSE 'false' END) as GradeLevelCode_PK,
	            (CASE WHEN [PE] = 'PE' THEN 'true' ELSE 'false' END) as GradeLevelCode_PE

             from
            (SELECT *
                FROM
                (
                select 
                    eo.[NameOfInstitution] as SchoolName,
                    eo.[EducationOrgNaturalKey] as SchoolNumber,
                    GeographicalLatitude as GeographicalLatitude,
                    GeographicalLongitude as GeographicalLongitude,
                    eo.[StateOrganizationId] as FULL_SCHOOL_CODE,
                    eo.[StreetNumberName] as StreetAddress,
                    principal.[FirstName] as PrincipalFirstName,
                    principal.[MiddleName] as PrincipalMiddleName,
                    principal.[LastSurname] as PrincipalLastName,
                    eo.[City],
                    eo.[State],
                    eo.[PostalCode] as Zip,
                    eo.[TelephoneNumber] as PhoneNumber,
                    sgla.[GradeLvlTypeNaturalKey],
                    eo.[FaxNumber],
					eurl.FullURL,
					epdf.FullURL as SchoolPdf,
					eBoundary.FullURL as SchoolBoundary,
					bd.BoardDistrictNumber as TrusteeAreas,
					kpi.KPIDataValue as TotalEnrollment
                FROM [EDB].[EXT].[EducationOrganization] as eo	            
                LEFT JOIN [EDB].[EXT].[EducationOrganizationAddress] as eoa 
	                on eo.[EducationOrgNaturalKey] = eoa.[EducationOrgNaturalKey] 
                LEFT JOIN [EDB].[EXT].[SchoolManagers] as sm
	                on eo.[EducationOrgNaturalKey] = sm.[EducationOrgNaturalKey]
                LEFT JOIN [EDB].[EXT].[Staff] as principal
	                on sm.[CILSchoolManagerStaffNaturalKey] = principal.[StaffNaturalKey]
                LEFT JOIN [EDB].[EXT].[SchoolGradeLevelAssociation] as sgla
	                on eo.[EducationOrgNaturalKey] = sgla.[EducationOrgNaturalKey]
                     and sgla.SchoolYearNaturalKey in (select SchoolYearTypeNaturalKey from edb.ext.SchoolYearType where CurrentSchoolYear=1)	  
				LEFT JOIN [EDB].[EXT].[EducationOrganizationURL] as eurl
	            	on eo.[EducationOrgNaturalKey] = eurl.[EducationOrgNaturalKey] and eurl.EducationOrganizationURLType='Website'
				LEFT JOIN [EDB].[EXT].[EducationOrganizationURL] as epdf
	            	on eo.[EducationOrgNaturalKey] = epdf.[EducationOrgNaturalKey] and epdf.EducationOrganizationURLType='Profile'
				LEFT JOIN [EDB].[EXT].[EducationOrganizationURL] as eBoundary
	            	on eo.[EducationOrgNaturalKey] = eBoundary.[EducationOrgNaturalKey] and eBoundary.EducationOrganizationURLType='Boundary'
				LEFT JOIN [EXT].[App_FAS_KPI] as kpi
					on eo.[EducationOrgNaturalKey] = kpi.EducationOrgNaturalKey and kpi.KPITypeNaturalKey = 'FAS_002'
                    and kpi.SchoolYearTypeNaturalKey in (select MAX(SchoolYearTypeNaturalKey) from [EXT].[App_FAS_KPI] where KPITypeNaturalKey = 'FAS_002')	 
                    and  kpi.StudentGroupTypeNaturalKey='01'
				LEFT JOIN [EDB].[EXT].[BoardDistrict] as bd
					on bd.BoardDistrictNaturalKey = sm.BoardDistrictNaturalKey 	
				WHERE eo.OrgGrpNaturalKey = 'Campus' and eo.OperationalStatusNaturalKey = 'A' and eo.LocalOrganizationCode <> '000'
                ) AS source
                PIVOT
                (
                    MAX([GradeLvlTypeNaturalKey])
                    FOR [GradeLvlTypeNaturalKey] IN ([1] , [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12], [K], [PK], [PE])
                ) as pvt) as basedata";
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<SchoolDataEntity>(schoolDataQuery);
            var lasync =  results.ToListAsync();            

            return Ok(await lasync);
        }

        [Route("api/TrusteeAreaEntity")]
        public async Task<IHttpActionResult> GetTrusteeAreaEntity()
        {
            const string trusteeQuery= @"SELECT 
                  CAST([BoardDistrictNumber] as varchar) as TrusteeArea
                  ,([BoardMemberLoginId]+'@houstonisd.org') as TrusteeEmail
                  ,([BoardMemberFirstName] + ' ' + [BoardMemberLastSurName]) as TrusteeName
              FROM [EDB].[EXT].[BoardDistrict]";

            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<TrusteeAreaEntity>(trusteeQuery);
            var lasync = results.ToListAsync();

            return Ok(await lasync);
        }

        [Route("api/DistrictProgramsAtSchoolEntity")]
        public async Task<IHttpActionResult> GetDistrictProgramsAtSchoolEntity()
        {
            const string districtProgramQuery = @"SELECT EducationOrgNaturalKey as SchoolNumber,
                           SchoolCharacteristicTypeNaturalKey as DistrictProgramID
                    FROM EDB.EXT.SchoolCharacteristicAssociation
                    where SourceTypeNaturalKey='SP'
                    and SchoolYearId in (select max(SchoolYearId) from EDB.EXT.SchoolCharacteristicAssociation where SourceTypeNaturalKey='SP')";

            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<DistrictProgramsAtSchoolEntity>(districtProgramQuery);
            var lasync = results.ToListAsync();

            return Ok(await lasync);            
        }

        [Route("api/DistrictProgramsLkupEntity")]
        public async Task<IHttpActionResult> GetDistrictProgramsLkupEntity()
        {
            const string districtProgramLookupQuery = @"SELECT  [SchoolCharacteristicTypeNaturalKey] as DistrictProgramId,
	            [Description] as DistrictProgramDesc,
	            [SchoolCharacteristicTypeNaturalKey] as CodeValue,
	            '1' as SearchByThisProgram,
	            [Description] as ToolTipDesc
            FROM [EDB].[EXT].[SchoolCharacteristicType]
            where SchoolCharacteristicTypeNaturalKey in ('RA_AS','RA_CS','RA_ECC','RA_IB')";

            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<DistrictProgramsLkupEntity>(districtProgramLookupQuery);
            var lasync = results.ToListAsync();

            return Ok(await lasync);            
        }

        [Route("api/SchoolProgramsEntity")]
        public async Task<IHttpActionResult> GetSchoolProgramsEntity()
        {
            const string programsQuery = @"select dpa.EducationOrgNaturalKey as SchoolNumber,
                          'FAKE' as SchoolProgramCategory,
                          dpt.Description as SchoolProgramDesc,
                          dpt.MagnetThemeTypeNaturalKey as MagnetSubcategoryId
              FROM [EDB].[EXT].[App_FAS_SchoolHISDDepartmentProgramAssociation] dpa
              left join [EDB].[EXT].[App_FAS_HISDDepartmentProgramType] dpt
              on dpa.[HISDDepartmentProgramTypeNaturalKey] = dpt.[HISDDepartmentProgramTypeNaturalKey]";

            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<SchoolProgramsEntity>(programsQuery);
            var lasync = results.ToListAsync();

            return Ok(await lasync);            
        }

        [Route("api/MagnetProgramsLkupEntity")]
        public async Task<IHttpActionResult> GetMagnetProgramsLkupEntity()
        {
            const string magnetQuery = @"SELECT  [MagnetThemeTypeNaturalKey] as MagnetSubcategoryId,
               [MagnetThemeTypeNaturalKey] as CodeValue,
               [Description] as MagnetSubcategoryName,
	           [MagnetThemeTypeNaturalKey] as MagnetSubcategoryValue,
	           REPLACE([Description], ' ','') as ToolTipDesc
          FROM [EDB].[EXT].[App_FAS_MagnetThemeType]
          WHERE Description not like '%other%'
            and Description not like '%test%'";

            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<MagnetProgramsLkupEntity>(magnetQuery);
            var lasync = results.ToListAsync();

            return Ok(await lasync);            
        }

        [Route("api/SchoolDemographicsEntity")]
        public async Task<IHttpActionResult> GetSchoolDemographicsEntity()
        {
            var schoolDemographicDataQuery = @"
               with data as (
                    select max(SchoolYearTypeNaturalKey) as max_AcademicYear from edb.ext.App_FAS_KPI 
                    where KPITypeNaturalKey IN ('FAS_002')
                    )
                    select Distinct 
                           kpi.EducationOrgNaturalKey as SchoolNumber,
                           sgt.ShortDescription as DemographicCategory,
                           CAST(FORMAT(kpi.KPIDataValue, '0.#####') as varchar) as StudentCount,
                           CAST(kpi.SchoolYearTypeNaturalKey as varchar) as AcademicYear
                        from [EXT].[App_FAS_KPI] kpi
                    inner join [EXT].[StudentGroupType] sgt on kpi.StudentGroupTypeNaturalKey = sgt.StudentGroupTypeNaturalKey
                    where kpi.KPITypeNaturalKey='FAS_002' and sgt.StudentGroupTypeNaturalKey!='01'
                    and SchoolYearTypeNaturalKey in (select max_AcademicYear from data)";
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<SchoolDemographicsEntity>(schoolDemographicDataQuery);
            var lasync = results.ToListAsync();

            return Ok(await lasync);
        }

        [Route("api/SchoolDemographicsSupplementEntity")]
        public async Task<IHttpActionResult> GetSchoolDemographicsSupplementEntity()
        {
            try
            {
                var schoolDemographicSupplementDataQuery = @"
               with data as (
                    select max(SchoolYearTypeNaturalKey) as max_AcademicYear from edb.ext.App_FAS_KPI 
                    where KPITypeNaturalKey IN ('FAS_003','FAS_004','FAS_005')
                    )
                    select EducationOrgNaturalKey as SchoolNumber,
                           CAST(SchoolYearTypeNaturalKey as varchar) as AcademicYear,
                           CAST(CEILING(MAX(case when KPITypeNaturalKey='FAS_003' then KPIDataValue else 0 end)) as varchar) as EnglishLearnerPercent,
                           CAST(CEILING(MAX(case when KPITypeNaturalKey='FAS_004' then KPIDataValue else 0 end)) as varchar) as SpecialEdPercent,
                           CAST(CEILING(MAX(case when KPITypeNaturalKey='FAS_005' then KPIDataValue else 0 end)) as varchar) as LunchProgramPercent,
                           '0' as InBoundaryPercent
                    from edb.ext.App_FAS_KPI A
                    where KPITypeNaturalKey IN ('FAS_003','FAS_004','FAS_005') and SchoolYearTypeNaturalKey in (select max_AcademicYear from data)
                    group by EducationOrgNaturalKey, SchoolYearTypeNaturalKey";
                db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
                var results = db.Database.SqlQuery<SchoolDemographicsSupplementEntity>(schoolDemographicSupplementDataQuery);
                var lasync = results.ToListAsync();

                return Ok(await lasync);
            }catch(Exception)
            {
                return NotFound();
            }
        }

        [Route("api/FeederNDestinationListEntity")]
        public async Task<IHttpActionResult> GetFeederNDestinationListEntity()
        {
            var feederNDestinationListDataQuery = @"
               SELECT [FeederEducationOrgNaturalKey] as SchoolNumber
                    ,[DestinationEducationOrgNaturalKey] as DestinationSchoolNumber
                FROM [EDB].[EXT].[SchoolFeederDestinationAssociation] as sfdt
				INNER JOIN  [EDB].[EXT].[SchoolYearType] as syt
				on sfdt.SchoolYearTypeNaturalKey = syt.SchoolYearTypeNaturalKey
				where syt.CurrentSchoolYear = 1";
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<FeederNDestinationListEntity>(feederNDestinationListDataQuery);
            var lasync = results.ToListAsync();

            return Ok(await lasync);            
        }

        [Route("api/TransportationEntity")]
        public IEnumerable<TransportationEntity> GetTransportationEntity()
        {
            return new List<TransportationEntity>
            {
                new TransportationEntity
                {
                    TransportationMode="bus",
                    SchoolNumber="E1"
                },
                new TransportationEntity
                {
                    TransportationMode="bus",
                    SchoolNumber="E2"
                },
                new TransportationEntity
                {
                    TransportationMode="bus",
                    SchoolNumber="M1"
                },
                new TransportationEntity
                {
                    TransportationMode="bus",
                    SchoolNumber="H1"

                },
                new TransportationEntity
                {
                    TransportationMode="bus",
                    SchoolNumber="E2"
                },
                new TransportationEntity
                {
                    TransportationMode="bus",
                    SchoolNumber="M2"
                },
                new TransportationEntity
                {
                    TransportationMode="bus",
                    SchoolNumber="H2"
                }
            };
        }

        [Route("api/PerformanceMetricsEntity")]
        public async Task<IHttpActionResult> GetPerformanceMetricsEntity()
        {
            var performanceMetricsDataQuery = @"
                   SELECT  [KPITypeNaturalKey] as SourceID,
                      [KPISourceType] as UI_Category,
                      [Description] as Name,
                      [AltDescription] as Definition,
                      [KPIDataType] as MetricType
                  FROM [EDB].[EXT].[App_FAS_KPIType]";
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<PerformanceMetricsEntity>(performanceMetricsDataQuery);
            var lasync = results.ToListAsync();

            return Ok(await lasync);
        }

        [Route("api/StudentPerformanceMetricsEntity")]
        public async Task<IHttpActionResult> GetStudentPerformanceMetricsEntity()
        {
            var StudentPerformanceMetricsDataQuery = @"
                   select kpi.EducationOrgNaturalKey as  SchoolNumber,
                        CAST(kpi.SchoolYearTypeNaturalKey as varchar) as AcademicYear,
                        kpi.KPITypeNaturalKey as PerformanceMetric_SourceID,
                        CAST(CAST(kpi.KPIDataValue as decimal(10,1)) as varchar) as MetricValue,
                        sgt.ShortDescription as Ethnicity
                    from edb.ext.App_FAS_KPI kpi
                        inner join edb.ext.StudentGroupType sgt 
                        on sgt.StudentGroupTypeNaturalKey=kpi.StudentGroupTypeNaturalKey
                        inner join (select KPITypeNaturalKey,max(SchoolYearTypeNaturalKey) as SchoolYearTypeNaturalKey from edb.ext.App_FAS_KPI
                        group by KPITypeNaturalKey) B on kpi.KPITypeNaturalKey=B.KPITypeNaturalKey 
                        and kpi.SchoolYearTypeNaturalKey between B.SchoolYearTypeNaturalKey-1 
                        and B.SchoolYearTypeNaturalKey ";
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<StudentPerformanceMetricsEntity>(StudentPerformanceMetricsDataQuery);
            var lasync = results.ToListAsync();

            return Ok(await lasync);
        }

        [Route("api/SchoolLeadershipEntity")]
        public async Task<IHttpActionResult> GetSchoolLeadershipEntity()
        {
            var schoolLeadershipDataQuery = @"
               SELECT A.EducationOrgNaturalKey as SchoolNumber,
                   'Principal' as LeaderLvl1Title,
                   (B.FirstName+' '+ ISNULL(SUBSTRING(B.MiddleName, 1,1), '' )+' '+B.LastSurname) as LeaderLvl1Name,
                   B.LoginId+'@houstonisd.org' as LeaderLvl1Email,
                   'School Support Officer' as LeaderLvl2Title,
                   (C.FirstName+' '+ISNULL(SUBSTRING(C.MiddleName, 1,1), '' )+' '+C.LastSurname) as LeaderLvl2Name,
                   C.LoginId+'@houstonisd.org' as LeaderLvl2Email,
                   'Chief School Officer' as LeaderLvl3Title,
                   (D.FirstName+' '+ISNULL(SUBSTRING(D.MiddleName, 1,1), '' )+' '+D.LastSurname) as LeaderLvl3Name, 
                   D.LoginId+'@houstonisd.org' as LeaderLvl3Email
                 FROM [EDB].[EXT].[SchoolManagers] A
                 left join [EDB].[EXT].[Staff] B on B.StaffNaturalKey=A.CILSchoolManagerStaffNaturalKey
                 left join [EDB].[EXT].[Staff] C on C.StaffNaturalKey=A.Up1ManagerStaffNaturalKey
                 left join [EDB].[EXT].[Staff] D on D.StaffNaturalKey=A.Up2ManagerStaffNaturalKey";
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<SchoolLeadershipEntity>(schoolLeadershipDataQuery);
            var lasync = results.ToListAsync();

            return Ok(await lasync);
        }

        [Route("api/BoundaryAddrEntity")]
        public async Task<IHttpActionResult> GetBoundaryAddrEntity()
        {
            var boundryAddrDataQuery = @"
              SELECT [MinimumStreetNumber] as AddressNumberMin
                  ,[MaximumStreetNumber] as AddressNumberMax
                  ,[AddressStreetNumberTypeNaturalKey] as AddressNumberType
                  ,[AddressDirTypeDescription] as AddressDirTypeCodeDesc
                  ,[StreetName] 
                  ,[AddressStreetTypeDescription] as AddressTypeCodeDesc
                  ,[City]
                  ,[StateAbbTypeNaturalKey] as State
                  ,[PostalCode] as Zipcode
                  ,[GeocodeTypeNaturalKey] as GeoCodesID
              FROM [EDB].[EXT].[App_FAS_AddressGeocodeRangeAssociation] gra
              JOIN [EXT].[App_FAS_AddressStreetType] ast on ast.[AddressStreetTypeNaturalKey]  = gra.AddressStreetTypeNaturalKey
              JOIN [EXT].[App_FAS_AddressDirectionType] adt on adt.[AddressDirTypeNaturalKey] = gra.AddressDirTypeNaturalKey";
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<BoundaryAddrEntity>(boundryAddrDataQuery);
            var lasync = results.ToListAsync();

            return Ok(await lasync);
        }
        //public IEnumerable<BoundaryAddrEntity> GetBoundaryAddrEntity()
        //{
        //    return new List<BoundaryAddrEntity>
        //    {
        //        new BoundaryAddrEntity
        //        {
        //            GeoCodesID = "5380",
        //            AddressNumberMin="218",
        //            AddressNumberMax="219",
        //            StreetName="plaza verde",
        //            AddressTypeCodeDesc="Avenue",
        //            AddressNumberType="E",
        //            City="Houston",
        //            State="TX",
        //            Zipcode="99999",
        //            AddressDirectionCodeDesc="N/A"
        //        },
        //        new BoundaryAddrEntity
        //        {
        //            GeoCodesID = "5380",
        //            AddressNumberMin="5123",
        //            AddressNumberMax="5300",
        //            StreetName="plaza verde",
        //            AddressTypeCodeDesc="Avenue",
        //            AddressNumberType="O",
        //            City="Houston",
        //            State="TX",
        //            Zipcode="99999",
        //            AddressDirectionCodeDesc="N/A"
        //        },
        //        new BoundaryAddrEntity
        //        {
        //            GeoCodesID = "5381",
        //            AddressNumberMin="550",
        //            AddressNumberMax="600",
        //            StreetName="amityville",
        //            AddressTypeCodeDesc="Avenue",
        //            AddressNumberType="P1",
        //            City="Houston",
        //            State="TX",
        //            Zipcode="99999",
        //            AddressDirectionCodeDesc="N/A"
        //        },
        //        new BoundaryAddrEntity
        //        {
        //            GeoCodesID = "5382",
        //            AddressNumberMin="1700",
        //            AddressNumberMax="1800",
        //            StreetName="west",
        //            AddressTypeCodeDesc="court",
        //            AddressNumberType="A",
        //            City="Houston",
        //            State="TX",
        //            Zipcode="99999",
        //            AddressDirectionCodeDesc="N/A"
        //        }
        //    };
        //}

        [Route("api/SchoolBoundaryXrefEntity")]
        public async Task<IHttpActionResult> GetSchoolBoundaryXrefEntity()
        {
            var schoolBoundaryXrefQuery = @"
                SELECT [GeocodeTypeNaturalKey] as GeoCodesID
                      ,[EducationOrgNaturalKey] as SchoolNumber
                  FROM [EDB].[EXT].[App_FAS_GeocodeSchoolAssociation]";
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<SchoolBoundaryXrefEntity>(schoolBoundaryXrefQuery);
            var lasync = results.ToListAsync();

            return Ok(await lasync);
        }
        //public IEnumerable<SchoolBoundaryXrefEntity> GetSchoolBoundaryXrefEntity()
        //{
        //    return new List<SchoolBoundaryXrefEntity>
        //    {
        //        new SchoolBoundaryXrefEntity
        //        {
        //            GeoCodesID="5380",
        //            SchoolNumber="E1"
        //        },
        //        new SchoolBoundaryXrefEntity
        //        {
        //            GeoCodesID="5380",
        //            SchoolNumber="M1"
        //        },
        //        new SchoolBoundaryXrefEntity
        //        {
        //            GeoCodesID="5380",
        //            SchoolNumber="H1"
        //        },
        //        new SchoolBoundaryXrefEntity
        //        {
        //            GeoCodesID="5381",
        //            SchoolNumber="E2"
        //        },
        //        new SchoolBoundaryXrefEntity
        //        {
        //            GeoCodesID="5381",
        //            SchoolNumber="M2"
        //        },
        //        new SchoolBoundaryXrefEntity
        //        {
        //            GeoCodesID="5380",
        //            SchoolNumber="H2"
        //        },
        //        new SchoolBoundaryXrefEntity
        //        {
        //            GeoCodesID="5382",
        //            SchoolNumber="E2"
        //        },
        //        new SchoolBoundaryXrefEntity
        //        {
        //            GeoCodesID="5382",
        //            SchoolNumber="M2"
        //        },
        //        new SchoolBoundaryXrefEntity
        //        {
        //            GeoCodesID="5380",
        //            SchoolNumber="H2"
        //        }
        //    };

        //}

        [Route("api/GetZonedSchools/{address=address}")]
        public IHttpActionResult GetZonedSchools(string address)
        {
            try
            {
                var result = String.Empty;                

                db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
                var addressDataQuery = $@"
                   SELECT [EducationOrgNaturalKey]      
                      FROM [EDB].[EXT].[AddressZonedSchoolAssociation]
                      where AddressNaturalKey in (select [AddressNaturalKey]                 
                                    FROM [EDB].[EXT].[Address]
	                where CONCAT([StreetNumber], ' ' , [StreetName], ', ', [City], ', ', [State]) like '{address}%')";

                var results = db.Database.SqlQuery<string>(addressDataQuery);
                var zonedSchools = results.ToListAsync().Result.Distinct();
                foreach (var schoolId in zonedSchools)
                    result += $"'{schoolId}',";
                return Ok(result.TrimEnd(','));
            }
            catch (Exception ex)
            {
                return Ok(String.Empty);
            }
        }

        [Route("api/OrganizationGroupEntity")]
        public async Task<IHttpActionResult> GetOrganizationGroupEntity()
        {
            var OrganizationGroupQuery = @"
                SELECT Distinct EOO.NameOfInstitution AS OrganizationGroup
		          ,EOO.EducationOrgNaturalKey AS OrgGroupId
                  FROM [EDB].[EXT].[EducationOrganization] EO
                  JOIN [EDB].EXT.SchoolManagers SM ON EO.EducationOrgNaturalKey = SM.EducationOrgNaturalKey 
                  JOIN [EDB].EXT.EducationOrganization EOO ON SM.Up2EducationOrgNaturalKey = EOO.EducationOrgNaturalKey 
                  JOIN [EDB].EXT.Staff S On SM.Up2ManagerStaffNaturalKey = S.StaffNaturalKey
                  where EO.OperationalStatusNaturalKey = 'A'
                  and EO.OrgGrpNaturalKey = 'Campus' and EO.EducationOrgNaturalKey NOT IN ('000')
                  ORDER BY EOO.EducationOrgNaturalKey";
            db = new EDWDataModel(HAPIConnectionFactory.GetConnectionString(Request));
            var results = db.Database.SqlQuery<OrganizationGroupEntity>(OrganizationGroupQuery);
            var lasync = results.ToListAsync();

            return Ok(await lasync);
        }
    }
}