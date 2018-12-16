<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Mshp.Service.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>MSHP</title>
    <link rel="icon" href="http://apidev.houstonisd.org/mshp/Resources/Media/ODataLogo-32.png" />
</head>
<body style="background:top right url(Resources/Media/hisd_seal.gif) no-repeat #f2f4ee;font-size:larger;" >
    <form id="form1" runat="server">
        <div>
        <h3>Memberships Data Service is running...(Update 06/01/2018)</h3>
        <strong>Metadata</strong> <br />
        <a href="odata/">odata</a><br /><br />

        <strong>Entities and count</strong> <br />
        <a href="odata/Calendar">Calendar</a>&nbsp;&nbsp;-&nbsp;&nbsp;<a href="odata/Calendar/$count">count</a><br />
        <a href="odata/CampusProfile">CampusProfile</a>&nbsp;&nbsp;-&nbsp;&nbsp;<a href="odata/CampusProfile/$count">count</a><br />
        <a href="odata/CampusEnrollment">CampusEnrollment</a>&nbsp;&nbsp;-&nbsp;&nbsp;<a href="odata/CampusEnrollment/$count">count</a><br />
        <a href="odata/OrganizationGroup">OrganizationGroup</a>&nbsp;&nbsp;-&nbsp;&nbsp;<a href="odata/OrganizationGroup/$count">count</a><br />

        <div style="display:normal;">
            <hr />
            <strong>General Functions</strong><br />
            odata/GetCurrentSchoolYear() <br />
            odata/GetPreviousSchoolYear() <br />            
            odata/GetSchoolYearFor(Date='2018-08-25') <br />
            odata/GetSchoolYearDropdownList() <br />
            odata/GetEnrollmentData(SchoolYear='2017-2018',CampusNumber='104',CompareDaySeq=22)  <i style="color:red;">[IMPORTANT!]</i><br />

            <hr />
            <strong>Report Functions</strong><br />
            odata/GetNonReportingCampusesReport(SchoolYear='2017-2018',CompareDaySeq=22)  <i>(partial data for Non-Campuses School Report)</i><br />
            <br />
            odata/GetDetailLevelAllReport(SchoolYear='2017-2018',CompareDaySeq=22) <br />
            odata/GetDetailLevelOrganizationGroupIdReport(SchoolYear='2017-2018',CompareDaySeq=22,OrganizationGroupId=174) <br />
            odata/GetDetailLevelCampusNumberReport(SchoolYear='2017-2018',CompareDaySeq=22,CampusNumber='006') <br />
            <br />
            odata/GetSummaryAndDetailReport(SchoolYear='2017-2018',CompareDaySeq=22) <br />
            <br />
            odata/GetSummaryReport(SchoolYear='2017-2018',CompareDaySeq=22) <br />
            <hr />
            <strong>Sample Calendar Query</strong> <br />
            odata/Calendar?$filter=SchoolYear eq '2017-2018' <br />
            odata/Calendar?$filter=SchoolYear eq '2017-2018'&$expand=CampusEnrollments<br />
            odata/Calendar?$filter=SchoolYear eq '2017-2018'&$select=CompareDaySeq,ReportDate<br />
            <br />
            <strong>Sample Profile Query</strong> <br />
            odata/CampusProfile?$top=1&$filter=CampusNumber eq '001'&$expand=Calendar,OrganizationGroup&$orderby=CalendarId desc   <i>[Basic Profile for Austin HS, current SY]</i><br />
            odata/CampusProfile(4678)?$expand=OrganizationGroup    <i>[Complete Profile for a specific school]</i><br />
            odata/CampusProfile(14)?$expand=CampusEnrollments($expand=Calendar) <i style="color:red;">[IMPORTANT!]</i><br />
            <br />
            <strong>Sample Enrollment Query</strong> <br />
            odata/CampusEnrollment(30401)?$expand=Calendar,CampusProfile   <i>[Enrollment details for Anderson ES, 2017-2018]</i><br />
            odata/CampusEnrollment?$filter=CampusProfileId eq 4678    <i>[Enrollment for campus with profile ID 4678]</i><br />
            odata/CampusEnrollment?$filter=CampusProfileId eq 4678&$expand=CampusProfile       <i>[Enrollment and campus details for same campus above]</i><br />
            odata/CampusEnrollment(118121)?$expand=CampusProfile      <i>[First enrollment entry + campus details for same campus above]</i><br />
            odata/CampusEnrollment?$filter=CalendarId eq 473 and CampusProfileId eq 4678&$expand=Calendar   <i>[returns 4770 rows]</i>
            <br />
            <br />

            <hr />
            <strong>Sample Command Queries</strong><br />
            <u>PATCH</u><br />
            <b>Url:</b> /odata/Calendar(494), <b>Body</b>: {PlanNotes:"Test Note",  UpdatedDate:"2018-02-22", UpdatedBy:"TestPATCH"}<br />
            <b>Url:</b> /odata/CampusProfile(4603), <b>Body</b>: {Capacity:1, Projection:2, Snapshot:3, CreatedDate:"2017-08-24", CreatedBy:"wthomas1", UpdatedDate:"2017-10-13", UpdatedBy:"TestPATCH"}<br />  
            <b>Url:</b> /odata/CampusEnrollment(30394) <b>Body</b>: {I09:9, I10:10, I11:11, I12:12, Total:799, UpdatedDate:"2018-02-23", UpdatedBy:"TestPATCH"}<br /> 

            <br />
            <u>PUT</u><br />
            <b>Url:</b> /odata/Calendar(494), <b>Body</b>: {Id:494, SchoolYear:"2017-2018", CompareDaySeq:32, InstructionDay:0, ReportDate:null, PlanNotes:"First Day", CreatedDate:"2017-08-25", CreatedBy:"wthomas1", UpdatedDate:"2018-02-22", UpdatedBy:"TestPUT"} <br />
            <b>Url:</b> /odata/CampusProfile(4603), <b>Body</b>: {Id:4603, CalendarId:463, OrganizationGroupId:174, CampusNumber:"402", Capacity:4, Projection:5, Snapshot:null, CreatedDate:"2017-08-24", CreatedBy:"wthomas1", UpdatedDate:"2017-10-13", UpdatedBy:"TestPUT"} <br />
            <b>Url:</b> /odata/CampusEnrollment(30394) <b>Body</b>: {Id:30394, CampusProfileId:1194, CalendarId:492, IEE:0, IPK:0, IKG:0, I01:1, I02:2, I03:3, I04:4, I05:5, I06:6, I07:7, I08:8, I09:9, I10:10, I11:11, I12:12, Total:99, CreatedDate:"2018-02-23", CreatedBy:"wthomas1", UpdatedDate:"2018-02-23", UpdatedBy:"TestPUT"} <br />
            <br />
            <br />
            <u>DELETE</u><br />
            <b>Url:</b> /odata/Calendar(178)<br />
            <b>Url:</b> /odata/CampusProfile(4603)  <i style="color:red;">Reference Key warning! </i><br />
            <b>Url:</b> /odata/CampusEnrollment(30394) <br />
            <br />
            <br />
            <u>POST</u><br />
            <b>Url:</b> /odata/Calendar  <b>Body</b>: {SchoolYear:"2017-2018", CompareDaySeq:32, InstructionDay:0, ReportDate:null, PlanNotes:"First Day", CreatedDate:"2017-08-25", CreatedBy:"wthomas1", UpdatedDate:"2018-02-22", UpdatedBy:"TestPOST"} <br />
            <b>Url:</b> /odata/CampusProfile <b>Body</b>: {CalendarId:463, OrganizationGroupId:174, CampusNumber:"402", Capacity:0, Projection:0, Snapshot:null, CreatedDate:"2017-08-24", CreatedBy:"wthomas1", UpdatedDate:"2017-10-13", UpdatedBy:"TestPOST"} <br />
            <b>Url:</b> /odata/CampusEnrollment <b>Body</b>: {CampusProfileId:1194, CalendarId:492, IEE:3, IPK:61, IKG:97, I01:128, I02:134, I03:135, I04:120, I05:121, I06:0, I07:0, I08:0, I09:0, I10:0, I11:0, I12:0, Total:799, CreatedDate:"2018-02-23", CreatedBy:"wthomas1", UpdatedDate:"2018-02-23", UpdatedBy:"TestPOST"} <br />
        </div>
        <div style="display:normal;">
            <hr />
            <strong>Report Data Testing</strong><br />
            /Reports/TestGetDetailLevelAllReport.aspx?SchoolYear=2017-2018&CompareDaySeq=21 &nbsp;&nbsp;&nbsp;&nbsp;<br />
            /Reports/TestGetDetailLevelOrganizationGroupIdReport.aspx?SchoolYear=2017-2018&CompareDaySeq=21&OrganizationGroupId=174    <br />            
            /Reports/TestGetDetailLevelCampusNumberReport.aspx?SchoolYear=2017-2018&CompareDaySeq=21&CampusNumber=006    <br />
            <br /> 
            /Reports/TestGetSummaryAndDetailReport.aspx?SchoolYear=2017-2018&CompareDaySeq=21 &nbsp;&nbsp;&nbsp;&nbsp;<br />
            /Reports/TestGetSummaryReport.aspx?SchoolYear=2017-2018&CompareDaySeq=21 &nbsp;&nbsp;&nbsp;&nbsp;<br />
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        </div>
    </form>
</body>
</html>
