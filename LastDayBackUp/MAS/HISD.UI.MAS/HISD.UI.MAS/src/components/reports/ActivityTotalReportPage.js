import React from 'react';
import PropTypes from 'prop-types';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
// actions
import * as reportsActions from './../../actions/reportsActions';
import * as sharedActions from './../../actions/sharedActions';
import * as campusActions from './../../actions/campusActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';

import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import Utilities from '../../utilities/utilities';
import LinkFormatter from '../common/formatters/linkFormatter';
import { campusesFormattedForDropdown4CSO, campusesFormattedForDropdown, teacherFormattedForDropdown } from './../../selectors/selectors';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';
import { debuglog } from 'util';

let hasMounted = false;
class ActivityTotalReportPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            campusID: '',
            CSOEmployeeID: '',
            schoolID: '',
            schoolOfficeOptions: [],
            schoolNameOptions: [],
            hideDialog: true,
            reportStartDate: null,
            reportEndDate: null,
            firstDayOfWeek: DayOfWeek.Sunday,
            dayPickerStrings: Utilities.getDayPickerStrings(),
            dialogAction: '',
            subtext: '',
            csoActivitieTotalRecords: []
        };
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);

        this.onCSODropdownChanged = this.onCSODropdownChanged.bind(this);
        this.onSchoolDropdownChanged = this.onSchoolDropdownChanged.bind(this);

        this.onSelectReportStartDate = this.onSelectReportStartDate.bind(this);
        this.onSelectReportEndDate = this.onSelectReportEndDate.bind(this);
        
        this.runReport = this.runReport.bind(this);
        this.isValidForm = this.isValidForm.bind(this);
    }

    componentDidMount(){
        const role = this.props.userProps.user.role;
        this.setState({campusID: this.props.campusID});
        this.props.actions.clearReportData();
        
        // load the list of CSO/s 
        this.props.actions.loadAllCSO()
        .then(csoStaffs => this.loadAllCSOJSON());
        this.props.actions.loadAllCampuses();
        hasMounted = true;
    }

    runReport(){
        if(this.isValidForm() == true){
            //let params = { StartDate: Utilities.getODataDate(this.state.reportStartDate), EndDate: Utilities.getODataDate(this.state.reportEndDate), SchoolID: this.state.schoolID, };
            let params = { StartDate: Utilities.getODataDate(this.state.reportStartDate), EndDate: Utilities.getODataDate23hours(this.state.reportEndDate), SchoolID: this.state.schoolID, CSOEmployeeID: this.state.CSOEmployeeID};
            this.props.actions.loadActivityTotalReport(params)
            .then(reportData => this.loadActivityTotalReportJSON());
        }
    }

    // Process ALL CSO to display 
    loadAllCSOJSON(){
        if(this.props.csoStaffs != ""){
                let csoListItems = [];
                //loop over each row
                    for(let i=0; i<this.props.csoStaffs.length; i++){
                        let element = {};
                        element.StaffNaturalKey = this.props.csoStaffs[i].Up2ManagerStaffNaturalKey;
                        element.FirstName = this.props.csoStaffs[i].Up2Manager.FirstName;
                        element.LastSurname = this.props.csoStaffs[i].Up2Manager.LastSurname;
                        element.LoginId = this.props.csoStaffs[i].Up2Manager.LoginId;
                        if(csoListItems.findIndex(x => x.StaffNaturalKey === element.StaffNaturalKey) === -1){
                            csoListItems.push(element);
                        }
                    }
                const first = {text: "--- All CSO/s ---", key: "All"};
                let hisdCSOs =  teacherFormattedForDropdown(csoListItems);
                hisdCSOs.unshift(first);
                this.setState({schoolOfficeOptions: hisdCSOs, CSOEmployeeID: 'All'});
                //this.setState({schoolOfficeOptions: csoListItems});
        }
    }

    // process the reportdata to display
    loadActivityTotalReportJSON(){
            let csoActivityItems = [];
            if(this.props.reportData != ""){
                let durationSum = 0;
                
                //loop over each row
                    for(let i=0; i<this.props.reportData.length; i++ ){
                        let isLast = false;
                        durationSum += this.props.reportData[i].TotalDuration;
                        let currentCSOID = this.props.reportData[i].CSOEmployeeID;
                        let nextCSOID = '';
                        if(i== this.props.reportData.length-1){
                            nextCSOID = currentCSOID;
                            isLast = true;
                        }
                        else{
                            nextCSOID = this.props.reportData[i+1].CSOEmployeeID;
                        }
                        
                        if(currentCSOID != nextCSOID){
                            isLast = true;
                        }

                        //Populate the record rows
                        let activitySession = {};
                        activitySession.ActivityLogID =  this.props.reportData[i].ActivityLogID;
                        activitySession.CSOEmployeeID =  this.props.reportData[i].CSOEmployeeID;
                        activitySession.CSOName       =  this.props.reportData[i].CSOFirstName + " " + this.props.reportData[i].CSOLastSurname;
                        activitySession.EducationOrgNaturalKey =  this.props.reportData[i].EducationOrgNaturalKey;
                        activitySession.NameOfInstitution =  this.props.reportData[i].NameOfInstitution;
                        activitySession.TotalDuration =  this.props.reportData[i].TotalDuration;
                        activitySession.ActivityCodeID =  this.props.reportData[i].ActivityCodeID;
                        activitySession.ActivityCodeName =  this.props.reportData[i].ActivityCodeName;

                        if(isLast){
                            activitySession.AtivityTotalTime = durationSum;
                            durationSum = 0;
                        }
                        else {
                            activitySession.AtivityTotalTime = '';
                        }
                        csoActivityItems.push(activitySession);             
                    }
            }
            //store the list in state array  
            this.setState({csoActivitieTotalRecords: csoActivityItems});
    }

    isValidForm(){
        let isValid = true;
        if(this.state.reportStartDate == null){
            isValid = false;
            this.displayMessage('Error: Invalid Start Date. Start Date must be selected', '');
        }
        else if(this.state.reportEndDate == null){
            isValid = false;
            this.displayMessage('Error: Invalid End Date. End Date must be selected', '');
        }
        return isValid;
    }
    onCSODropdownChanged(item){
        this.setState({CSOEmployeeID: item.key});
        // format the list of campueses under this CSO
        if(this.props.csoStaffs != ""){
                let csoCampuses = [];
                //loop over each row
                    for(let i=0; i<this.props.csoStaffs.length; i++){
                        if(this.props.csoStaffs[i].Up2ManagerStaffNaturalKey === item.key){
                            let element = {};
                            element.StaffNaturalKey = this.props.csoStaffs[i].Up2ManagerStaffNaturalKey;
                            element.EducationOrgNaturalKey = this.props.csoStaffs[i].EducationOrganization.EducationOrgNaturalKey;
                            element.NameOfInstitution = this.props.csoStaffs[i].EducationOrganization.NameOfInstitution;
                            if(csoCampuses.findIndex(x => x.EducationOrgNaturalKey === element.EducationOrgNaturalKey) === -1){
                                csoCampuses.push(element);
                            }
                        }
                    }
                const first = {text: "--- All Schools ---", key: "All"};
                let csoCampuesList =  campusesFormattedForDropdown4CSO(csoCampuses);
                csoCampuesList.unshift(first);
                this.setState({schoolNameOptions: csoCampuesList, schoolID: 'All'});
                //this.setState({schoolOfficeOptions: csoListItems});
        }

    }
    
    onSchoolDropdownChanged(item) {
        this.setState({ schoolID: item.key });
    }

    onSelectReportStartDate(date) {
        this.setState({ reportStartDate: date });
    }

    onSelectReportEndDate(date) {
        this.setState({ reportEndDate: date });
    }

    formatDate(date) {
        if (date) {
            let newDate = Utilities.getDateOnly(date);
            return newDate;
        }
        return '';
    }

    okDialog(){
        this.closeDialog();
    }

    showDialog() {
      this.setState({ hideDialog: false });
    }
  
    closeDialog() {
      this.setState({ hideDialog: true });
    }

    displayMessage(message, action){
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    renderShowsTotal(start, to, total) {
        return (
          <p style={{color: 'black'}}>
            From {start} to {to}. Total: {total}&nbsp;&nbsp;
          </p>
        );
    }

    dateFormatter(cell, row) {
        let formattedDate = Utilities.getDateOnly(cell);
        if(formattedDate == "12/31/1969") formattedDate = "";
        return (formattedDate);
    }
    
    render() {
        const options = {
            defaultSortName: 'CSOName',
            sortOrder: 'asc',
            prePage: 'Prev',
            nextPage: 'Next',
            firstPage: 'First',
            lastPage: 'Last',
            paginationShowsTotal: this.renderShowsTotal
        };
        let { firstDayOfWeek } = this.state.firstDayOfWeek;
        let { dayPickerStrings } = this.state.dayPickerStrings;
        const reportStartDate = this.state.reportStartDate;
        const reportEndDate = this.state.reportEndDate;
        //let csoOptionItems = this.state.schoolOfficeOptions.map((aCSO) =>
          //      <option key={aCSO.CSOEmployeeID}>{aCSO.CSOName}</option>
        //);
        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Activity Total Report" campus={this.props.campusName} hideCampusDrpDwn="Hide"/>
                        <form className="form-horizontal">
                            <div className="form-group">
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{paddingTop: "8px"}}>School Office</label>
                                <div className="col-md-10 col-lg-10 col-sm-10">
                                    <Dropdown placeHolder="Select CSO" selectedKey={this.state.CSOEmployeeID} options={this.state.schoolOfficeOptions} defaultSelectedKey="All" onChanged={this.onCSODropdownChanged} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{paddingTop: "8px"}}>School Name</label>
                                <div className="col-md-10 col-lg-10 col-sm-10">
                                    <Dropdown placeHolder="Select School" selectedKey={this.state.schoolID} options={this.state.schoolNameOptions} defaultSelectedKey="All" onChanged={this.onSchoolDropdownChanged} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{paddingTop: "8px"}}>Start Date</label>
                                <div className="col-md-4 col-lg-4 col-sm-4">
                                    <DatePicker value={reportStartDate} firstDayOfWeek={firstDayOfWeek} strings={dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectReportStartDate} placeholder="Select start date..." />
                                </div>
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{paddingTop: "8px"}}>End Date</label>
                                <div className="col-md-4 col-lg-4 col-sm-4">
                                    <DatePicker value={reportEndDate} firstDayOfWeek={firstDayOfWeek} strings={dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectReportEndDate} placeholder="Select end date..." />
                                </div>
                            </div>
                        </form>
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div className="white-box">
                                    <div className="col-md-12 col-lg-12 col-sm-12 pull-right" style={{textAlign: 'right', paddingBottom: '8px'}}>
                                        <PrimaryButton
                                            text="Run Report"
                                            onClick={this.runReport}
                                        />
                                    </div>
                                    <BootstrapTable data={this.state.csoActivitieTotalRecords} hover condensed pagination options={options} search exportCSV>
                                        <TableHeaderColumn dataField="ActivityLogID" isKey hidden />
                                        <TableHeaderColumn dataField="CSOName" dataSort  width={"140px"} dataAlign="left">CSO Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="NameOfInstitution"  dataAlign="left">School Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="EducationOrgNaturalKey" dataAlign="left">PS Dept ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ActivityCodeName"  dataAlign="left">Activity Code</TableHeaderColumn>
                                        <TableHeaderColumn dataField="TotalDuration" dataAlign="left">Time(mins)</TableHeaderColumn>
                                        <TableHeaderColumn dataField="AtivityTotalTime" dataSort dataAlign="left">CSO Total(mins)</TableHeaderColumn>
                                    </BootstrapTable>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <Dialog
                        hidden={this.state.hideDialog}
                        onDismiss={this.closeDialog}
                        dialogContentProps={{
                            type: DialogType.normal,
                            title: 'Activity Total Report',
                            subText: this.state.subtext
                        }}
                        modalProps={{
                            isBlocking: true,
                            containerClassName: 'ms-dialogMainOverride'
                        }}
                        >
                        <DialogFooter>
                            <PrimaryButton onClick={this.okDialog} text="Ok" />
                            <DefaultButton onClick={this.closeDialog} text="Cancel" />
                        </DialogFooter>
                    </Dialog>
                </div>
            </IfAnyGranted>
        );
    }
}

ActivityTotalReportPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    relationships: PropTypes.array,
    newRelationship: PropTypes.func,
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object,
    allCampuses: PropTypes.array,
    csoStaffs: PropTypes.array,
    history: PropTypes.object,
    reportData: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    let campuses = campusesFormattedForDropdown(state.campuses, state.userProps.user.campusID, state.userProps.user.campusName);
    const first = {text: "--- All Schools ---", key: "All"};
    campuses.unshift(first);

        return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        userProps: state.userProps,
        allCampuses: campuses,
        csoStaffs: state.csoStaffs,
        reportData: state.reportData
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, reportsActions, campusActions, sharedActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityTotalReportPage);