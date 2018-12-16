<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TestGetDetailLevelAllReport.aspx.cs" Inherits="Mshp.Service.Reports.TestGetDetailLevelAllReport" %>
<%@ Register Assembly="Microsoft.ReportViewer.WebForms" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>
<%@ Register assembly="Microsoft.ReportViewer.WebForms, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" namespace="Microsoft.Reporting.WebForms" tagprefix="rsweb" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>TestGetDetailLevelAllReport</title>
</head>
<body style="border:0;margin:0;Width:auto;">
    <form id="form1" runat="server">
        <div>
        <asp:ScriptManager ID="Sm1" runat="server" />
        <asp:ObjectDataSource ID="DetailObjectDataSource" runat="server"            
            SelectMethod="GetDetailLevelAllDataSet" 
            TypeName="Mshp.Service.Report.ReportDataObject"
            OldValuesParameterFormatString="original_{0}" >
            <SelectParameters>
                <asp:QueryStringParameter Name="SchoolYear" QueryStringField="SchoolYear" Type="String" />
                <asp:QueryStringParameter Name="CompareDaySeq" QueryStringField="CompareDaySeq" Type="Int32" />
            </SelectParameters>
        </asp:ObjectDataSource>
        <rsweb:ReportViewer ID="Rv1" runat="server" ClientIDMode="AutoID"             
            BackColor="#E1EFEF" ToolbarForegroundColor="#4589B6" ToolbarForegroundDisabledColor="#8BB6BF"
            Width="100%" Height="100%" AsyncRendering="False" SizeToReportContent="True"
            ShowBackButton="False" ShowRefreshButton="False" ShowZoomControl="False" ShowPrintButton="False" HighlightBackgroundColor="" InternalBorderColor="204, 204, 204" InternalBorderStyle="Solid" InternalBorderWidth="1px" LinkActiveColor="69, 137, 182" LinkActiveHoverColor="" LinkDisabledColor="139, 182, 191" PrimaryButtonBackgroundColor="" PrimaryButtonForegroundColor="" PrimaryButtonHoverBackgroundColor="" PrimaryButtonHoverForegroundColor="" SecondaryButtonBackgroundColor="" SecondaryButtonForegroundColor="" SecondaryButtonHoverBackgroundColor="" SecondaryButtonHoverForegroundColor="" SplitterBackColor="" ToolbarDividerColor="" ToolbarHoverBackgroundColor="" ToolbarHoverForegroundColor="" ToolBarItemBorderColor="" ToolBarItemBorderStyle="Solid" ToolBarItemBorderWidth="1px" ToolBarItemHoverBackColor="" ToolBarItemPressedBorderColor="51, 102, 153" ToolBarItemPressedBorderStyle="Solid" ToolBarItemPressedBorderWidth="1px" ToolBarItemPressedHoverBackColor="153, 187, 226">
            <localreport reportpath="Reports\Definition\Detail.rdlc">
                <datasources>
                    <rsweb:ReportDataSource 
                           DataSourceID="DetailObjectDataSource" 
                           Name="MshpServiceReport" />
                </datasources>
            </localreport>
        </rsweb:ReportViewer>
        </div>        
    </form>
</body>
</html>
