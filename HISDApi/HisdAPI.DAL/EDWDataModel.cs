namespace HisdAPI.DAL
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Reflection;
    using System.Data.Entity.ModelConfiguration;
    using HisdAPI.Entities;

    public partial class EDWDataModel : DbContext
    {
        public EDWDataModel()
            : base("name=MAS")
        {
        }

        public EDWDataModel(string connectionString)
            : base(connectionString)
        {
        }

        public virtual DbSet<AccomplishmentCategoryType> AccomplishmentCategoryTypes { get; set; }
        public virtual DbSet<AccomplishmentType> AccomplishmentTypes { get; set; }
        public virtual DbSet<AdaEligibilityType> AdaEligibilityTypes { get; set; }
        public virtual DbSet<AssessmentAdministratorType> AssessmentAdministratorTypes { get; set; }
        public virtual DbSet<AssessmentBatteryType> AssessmentBatteryTypes { get; set; }
        public virtual DbSet<AssessmentProficiencyRatingType> AssessmentProficiencyRatingTypes { get; set; }
        public virtual DbSet<AssessmentScoreCodeType> AssessmentScoreCodeTypes { get; set; }
        public virtual DbSet<AssessmentSubjectType> AssessmentSubjectTypes { get; set; }
        public virtual DbSet<AssessmentTermType> AssessmentTermTypes { get; set; }
        public virtual DbSet<AssessmentType> AssessmentTypes { get; set; }
        public virtual DbSet<AssessmentVersionType> AssessmentVersionTypes { get; set; }
        public virtual DbSet<ClassroomPositionType> ClassroomPositionTypes { get; set; }
        public virtual DbSet<Course> Courses { get; set; }
        public virtual DbSet<EducationOrganization> EducationOrganizations { get; set; }
        public virtual DbSet<EducationOrganizationHierarchy> EducationOrganizationHierarchies { get; set; }
        public virtual DbSet<ElectronicEMailType> ElectronicEMailTypes { get; set; }
        public virtual DbSet<EmployeeHISDStatusType> EmployeeHISDStatusTypes { get; set; }
        public virtual DbSet<EmployeeStatusType> EmployeeStatusTypes { get; set; }
        public virtual DbSet<EmploymentActionReasonType> EmploymentActionReasonTypes { get; set; }
        public virtual DbSet<EmploymentActionType> EmploymentActionTypes { get; set; }
        public virtual DbSet<EnrollmentStatusType> EnrollmentStatusTypes { get; set; }
        public virtual DbSet<FederalAggregatedEthnicityType> FederalAggregatedEthnicityTypes { get; set; }
        public virtual DbSet<FederalEthnicityType> FederalEthnicityTypes { get; set; }
        public virtual DbSet<GradeLevelType> GradeLevelTypes { get; set; }
        public virtual DbSet<JobIndicatorType> JobIndicatorTypes { get; set; }
        public virtual DbSet<LanguageType> LanguageTypes { get; set; }
        public virtual DbSet<OperationalStatusType> OperationalStatusTypes { get; set; }
        public virtual DbSet<OrganizationalGroup> OrganizationalGroups { get; set; }
        public virtual DbSet<PerformanceEvaluationToolType> PerformanceEvaluationToolTypes { get; set; }
        public virtual DbSet<PersonalIdentificationType> PersonalIdentificationTypes { get; set; }
        public virtual DbSet<PopulationServedType> PopulationServedTypes { get; set; }
        public virtual DbSet<Position> Positions { get; set; }
        public virtual DbSet<QualificationGroupAssociation> QualificationGroupAssociations { get; set; }
        public virtual DbSet<QualificationGroupType> QualificationGroupTypes { get; set; }
        public virtual DbSet<QualificationType> QualificationTypes { get; set; }
        public virtual DbSet<SalaryPlanType> SalaryPlanTypes { get; set; }
        public virtual DbSet<SchoolYearType> SchoolYearTypes { get; set; }
        public virtual DbSet<Section> Sections { get; set; }
        public virtual DbSet<SectionSchedulingType> SectionSchedulingTypes { get; set; }
        public virtual DbSet<Session> Sessions { get; set; }
        public virtual DbSet<SexType> SexTypes { get; set; }
        public virtual DbSet<Staff> Staffs { get; set; }
        public virtual DbSet<StaffAccomplishments> StaffAccomplishments { get; set; }
        public virtual DbSet<StaffContractType> StaffContractTypes { get; set; }
        public virtual DbSet<StaffERPGroupType> StaffERPGroupTypes { get; set; }
        public virtual DbSet<StaffProvisioning> StaffProvisionings { get; set; }
        public virtual DbSet<StaffQualificationAssociation> StaffQualificationAssociations { get; set; }
        public virtual DbSet<StaffSectionAssociation> StaffSectionAssociations { get; set; }
        public virtual DbSet<StaffSupervisorType> StaffSupervisorTypes { get; set; }
        public virtual DbSet<StateAbbreviationType> StateAbbreviationTypes { get; set; }
        public virtual DbSet<Student> Students { get; set; }
        public virtual DbSet<StudentACTAssessment> StudentACTAssessments { get; set; }
        public virtual DbSet<StudentAPAssessment> StudentAPAssessments { get; set; }
        public virtual DbSet<StudentAPEXAssessment> StudentAPEXAssessments { get; set; }
        public virtual DbSet<StudentCogatAssessment> StudentCogatAssessments { get; set; }
        public virtual DbSet<StudentCogatDistrictAssessment> StudentCogatDistrictAssessments { get; set; }
        public virtual DbSet<StudentDemographic> StudentDemographics { get; set; }
        public virtual DbSet<StudentDOB> StudentDOBs { get; set; }
        public virtual DbSet<StudentIOWADistrictAssessment> StudentIOWADistrictAssessments { get; set; }
        public virtual DbSet<StudentIOWAGiftedTalentedAssessment> StudentIOWAGiftedTalentedAssessments { get; set; }
        public virtual DbSet<StudentIOWANonTargetAssessment> StudentIOWANonTargetAssessments { get; set; }
        public virtual DbSet<StudentIOWAYearRoundAssessment> StudentIOWAYearRoundAssessments { get; set; }
        public virtual DbSet<StudentLoginAssociation_VIEW> StudentLoginAssociation_VIEW { get; set; }
        public virtual DbSet<StudentLOGRAMOSDistrictAssessment> StudentLOGRAMOSDistrictAssessments { get; set; }
        public virtual DbSet<StudentLOGRAMOSGiftedTalentedAssessment> StudentLOGRAMOSGiftedTalentedAssessments { get; set; }
        public virtual DbSet<StudentLOGRAMOSNonTargetAssessment> StudentLOGRAMOSNonTargetAssessments { get; set; }
        public virtual DbSet<StudentPSATAssessment> StudentPSATAssessments { get; set; }
        public virtual DbSet<StudentSATAssessment> StudentSATAssessments { get; set; }
        public virtual DbSet<StudentSchoolAssociation> StudentSchoolAssociations { get; set; }
        public virtual DbSet<StudentSectionAssociation> StudentSectionAssociations { get; set; }
        public virtual DbSet<StudentSTAAR_EOCAssessment> StudentSTAAR_EOCAssessment { get; set; }
        public virtual DbSet<StudentSTAAR38Assessment> StudentSTAAR38Assessment { get; set; }
        public virtual DbSet<StudentTELPASAssessment> StudentTELPASAssessments { get; set; }
        public virtual DbSet<TermSpanType> TermSpanTypes { get; set; }
        public virtual DbSet<TermType> TermTypes { get; set; }
        public virtual DbSet<YearsInUSSchoolsType> YearsInUSSchoolsTypes { get; set; }
        public virtual DbSet<StaffElectronicEmail> StaffElectronicEmails { get; set; }
        public virtual DbSet<SchoolManagers> SchoolManagers { get; set; }
        public virtual DbSet<JobCodeEntity> JobCodes { get; set; }
        public virtual DbSet<JobFamily> JobFamilies { get; set; }
        public virtual DbSet<JobFunction> JobFunctions { get; set; }
        public virtual DbSet<AddressEntity> Address { get; set; }
        public virtual DbSet<AddressZonedSchoolAssociation> AddressZonedSchoolAssociations { get; set; }
        public virtual DbSet<App_FAS_KPI> KPI { get; set; }
        public virtual DbSet<App_FAS_KPIType> KPIType { get; set; }
        public virtual DbSet<BoardDistrict> BoardDistricts { get; set; }
        public virtual DbSet<EducationOrganizationAddress> EducationOrganizationAddress { get; set; }
        public virtual DbSet<EducationOrganizationURL> EducationOrganizationURL { get; set; }
        public virtual DbSet<SchoolCharacteristicAssociation> SchoolCharacteristicAssociations { get; set; }
        public virtual DbSet<SchoolCharacteristicType> SchoolCharacteristicTypes { get; set; }
        public virtual DbSet<SchoolGradeLevelAssociation> SchoolGradeLevelAssociations { get; set; }
        public virtual DbSet<SchoolFeederDestinationAssociation> SchoolFeederDestinationAssociations { get; set; }
        public virtual DbSet<App_FAS_SchoolHISDDepartmentProgramAssociation> SchoolHISDDepartmentProgramAssociation { get; set; }
        public virtual DbSet<Vendor> Vendor { get; set; }
        public virtual DbSet<VendorCROSE> VendorCROSE { get; set; }
        public virtual DbSet<StaffPayGradeAssociation> StaffPayGradeAssociations { get; set; }


        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            var typesToRegister = Assembly.GetExecutingAssembly().GetTypes()
                                    .Where(type => !String.IsNullOrEmpty(type.Namespace))
                                    .Where(type => type.BaseType != null && 
                                            type.BaseType.IsGenericType && 
                                            type.BaseType.GetGenericTypeDefinition() == typeof(EntityTypeConfiguration<>));
            foreach (var type in typesToRegister)
            {
                dynamic configurationInstance = Activator.CreateInstance(type);
                modelBuilder.Configurations.Add(configurationInstance);
            }
            base.OnModelCreating(modelBuilder);
                        
        }        
    }
}
