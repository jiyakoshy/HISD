namespace HisdAPI.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("EXT.StudentAPEXAssessment")]
    public partial class StudentAPEXAssessment
    {
        [Key]
        [StringLength(500)]
        public string StuAPEXAssetNaturalKey { get; set; }

        public int? SchoolYearId { get; set; }

        [StringLength(100)]
        public string SourceOrganizationId { get; set; }

        [StringLength(100)]
        public string SourceSchoolYear { get; set; }

        [StringLength(100)]
        public string SourceProgramName { get; set; }

        [StringLength(100)]
        public string SourceProgramType { get; set; }

        [StringLength(100)]
        public string SourceProgramCode { get; set; }

        [StringLength(100)]
        public string SourceSolution { get; set; }

        [StringLength(100)]
        public string SourcePathway { get; set; }

        [StringLength(100)]
        public string SourceSubject { get; set; }

        [StringLength(100)]
        public string SourceTitle { get; set; }

        [StringLength(100)]
        public string SourceProductCode { get; set; }

        [StringLength(100)]
        public string SourceHISDCourseCode { get; set; }

        [StringLength(100)]
        public string SourceClassroomName { get; set; }

        [StringLength(100)]
        public string SourceClassroomId { get; set; }

        [StringLength(100)]
        public string SourceIsProctored { get; set; }

        [StringLength(100)]
        public string SourceClassroomArchiveDate { get; set; }

        [StringLength(100)]
        public string SourceClassroomStatus { get; set; }

        [StringLength(100)]
        public string SourceStudentFirstName { get; set; }

        [StringLength(100)]
        public string SourceStudentMiddleName { get; set; }

        [StringLength(100)]
        public string SourceStudentLastName { get; set; }

        [StringLength(100)]
        public string SourceStudentUsername { get; set; }

        [StringLength(100)]
        public string SourceStudentId { get; set; }

        [StringLength(100)]
        public string SourceStudentEmail { get; set; }

        [StringLength(100)]
        public string SourceEnrollmentStatus { get; set; }

        [StringLength(100)]
        public string SourceEnrollmentDate { get; set; }

        [StringLength(100)]
        public string SourceStudentStartDate { get; set; }

        [StringLength(100)]
        public string SourceClassroomStartDate { get; set; }

        [StringLength(100)]
        public string SourceServed { get; set; }

        [StringLength(100)]
        public string SourceDaysToStartSinceEnrolled { get; set; }

        [StringLength(100)]
        public string SourceLastLogin { get; set; }

        [StringLength(100)]
        public string SourceFirstAccessed { get; set; }

        [StringLength(100)]
        public string SourceLastAccessed { get; set; }

        [StringLength(100)]
        public string SourceDaysSinceLastAccess { get; set; }

        [StringLength(100)]
        public string SourceTimeSpentHours { get; set; }

        [StringLength(100)]
        public string SourceTimeSpentMinutes { get; set; }

        [StringLength(100)]
        public string SourceTimeSpent { get; set; }

        [StringLength(100)]
        public string SourceTimeSpentDays { get; set; }

        [StringLength(100)]
        public string SourceWithdrawalDate { get; set; }

        [StringLength(100)]
        public string SourceWithdrawReason { get; set; }

        [StringLength(100)]
        public string SourceFinalGrade { get; set; }

        [StringLength(100)]
        public string SourcePassing { get; set; }

        [StringLength(100)]
        public string SourceValidFinalGradeEntry { get; set; }

        [StringLength(100)]
        public string SourceCompletionDate { get; set; }

        [StringLength(100)]
        public string SourceDaysToCompletion { get; set; }

        [StringLength(100)]
        public string SourceQualityOfWork { get; set; }

        [StringLength(100)]
        public string SourceProgress { get; set; }

        [StringLength(100)]
        public string SourceOnSchedulePercent { get; set; }

        [StringLength(100)]
        public string SourceGradeToDate { get; set; }

        [StringLength(100)]
        public string SourceOverallGrade { get; set; }

        [StringLength(100)]
        public string SourceTeacherName { get; set; }

        [StringLength(100)]
        public string SourceTeacherUsername { get; set; }

        [StringLength(100)]
        public string SourceTeacherId { get; set; }

        [StringLength(100)]
        public string SourceTeacherEmail { get; set; }

        [StringLength(100)]
        public string SourceActivitiesCompleted { get; set; }

        [StringLength(100)]
        public string SourceActivityCountTotal { get; set; }

        [StringLength(100)]
        public string SourceActivityCompletePercent { get; set; }

        [StringLength(100)]
        public string SourceActivityCountDueToNow { get; set; }

        [StringLength(100)]
        public string SourcePointsEarned { get; set; }

        [StringLength(100)]
        public string SourcePointsAttempted { get; set; }

        [StringLength(100)]
        public string SourcePointsPossible { get; set; }

        [StringLength(100)]
        public string SourceExtraCredit { get; set; }

        [StringLength(100)]
        public string SourceScoredActivitiesInCourse { get; set; }

        [StringLength(100)]
        public string SourcePointsPossibleNonModifiedCourse { get; set; }

        [StringLength(100)]
        public string SourcePointsExcluded { get; set; }

        [StringLength(100)]
        public string SourceTestOutPoints { get; set; }

        [StringLength(100)]
        public string SourceExcusedPoints { get; set; }

        [StringLength(200)]
        public string SourceEnrollmentId { get; set; }

        public DateTime? LatestModifiedTimeStamp { get; set; }
    }
}
