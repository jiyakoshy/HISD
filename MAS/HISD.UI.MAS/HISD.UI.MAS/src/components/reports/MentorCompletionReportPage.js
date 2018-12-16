import React from 'react';
import PropTypes from 'prop-types';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import * as reportsActions from './../../actions/reportsActions';
import * as campusActions from '../../actions/campusActions';
import * as mentorsActions from '../../actions/mentorsActions';
import * as menteesActions from '../../actions/menteesActions';
import * as adminActions from '../../actions/adminActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import Utilities from '../../utilities/utilities';
import LinkFormatter from '../common/formatters/linkFormatter';
import { campusesFormattedForDropdown, teacherFormattedForDropdown } from './../../selectors/selectors';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

let hasMounted = false;

class MentorCompletionReportPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            campusID: '',
            CSOEmployeeID: '',
            schoolID: '',
            mentorName: '',
            mentorEmployeeID: '',
            menteeName: '',
            menteeEmployeeID: '',
            isSchoolDropdownDisabled: false,
            isMentorDropdownDisabled: true,
            isMenteeDropdownDisabled: true,
            schoolNameOptions: [],
            schoolMentors: [],
            schoolMentees: [],
            monthDDOptions: [],
            perRelationshipLogCompletion: [],
            hideDialog: true,
            reportStartDate: null,
            reportEndDate: null,
            firstDayOfWeek: DayOfWeek.Sunday,
            dayPickerStrings: Utilities.getDayPickerStrings(),
            dialogAction: '',
            subtext: ''
        };

        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);

        this.onSchoolDropdownChanged = this.onSchoolDropdownChanged.bind(this);
        this.onMentorDropdownChanged = this.onMentorDropdownChanged.bind(this);
        this.onMenteeDropdownChanged = this.onMenteeDropdownChanged.bind(this);
        this.onSelectReportStartDate = this.onSelectReportStartDate.bind(this);
        this.onSelectReportEndDate = this.onSelectReportEndDate.bind(this);
        this.onMonthDropdownChanged = this.onMonthDropdownChanged.bind(this);

        this.runReport = this.runReport.bind(this);
        this.isValidForm = this.isValidForm.bind(this);
    }

    componentDidMount() {
        const role = this.props.userProps.user.role;
        this.setState({ campusID: this.props.campusID });
        this.props.actions.clearReportData();
        this.props.actions.loadAllCBMStandards();
        if (this.props.userProps.user.role == 'Admin') {
            if (this.props.allCampuses.count == 0)
                this.props.actions.loadAllCampuses();
            this.setState({ schoolID: 'All', isSchoolDropdownDisabled: false });
        }
        else {
            this.setState({ schoolID: this.props.userProps.user.campusID, isSchoolDropdownDisabled: true });
            if (this.props.userProps.user.role == 'Principal' || this.props.userProps.user.role == 'CIC') {
                this.props.actions.loadMentorsByCampus(this.props.userProps.user.campusID)
                    .then(mentors => {
                        const first = { text: "--- All Mentors ---", key: "All" };
                        let schoolMentors = teacherFormattedForDropdown(this.props.mentors);
                        schoolMentors.unshift(first);
                        this.setState({ schoolMentors: schoolMentors, mentorEmployeeID: 'All', isMentorDropdownDisabled: false });
                    });
            }
            else if (this.props.userProps.user.role == 'Mentor') {
                let schoolMentors = [];
                const me = { text: this.props.userProps.user.fullName, key: this.props.userProps.user.staffNaturalKey };
                schoolMentors.push(me);
                this.props.actions.loadMenteesInActiveRelationshipsByMentorID(this.props.userProps.user.staffNaturalKey, this.props.userProps.timeConfigurationID, this.props.campusID)
                    .then(mentees => {
                        const first = { text: "--- All Mentees ---", key: "All" };
                        let schoolMentees = teacherFormattedForDropdown(this.props.mentees);
                        schoolMentees.unshift(first);
                        this.setState({ schoolMentees: schoolMentees, menteeEmployeeID: 'All' });
                    });
                this.setState({ schoolMentors: schoolMentors, mentorEmployeeID: this.props.userProps.user.staffNaturalKey, isMenteeDropdownDisabled: false });
            }
        }
        let monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let d = new Date();
        let currentMonth = monthNames[d.getMonth()];
        this.setState({ currentMonthName: currentMonth });
        this.setState({ currentMonthID: 5 });

        let monthOptions = [{ text: "January", key: 1 }, { text: "February", key: 2 }, { text: "March", key: 3 }, { text: "April", key: 4 },
        { text: "May", key: 5 }, { text: "June", key: 6 }, { text: "July", key: 7 }, { text: "August", key: 8 },
        { text: "September", key: 9 }, { text: "October", key: 10 }, { text: "November", key: 11 }, { text: "December", key: 12 }];

        this.setState({ monthDDOptions: monthOptions, monthID: 5 });

        hasMounted = true;
    }

    runReport() {
        //if(this.isValidForm() == true){
        let params = {
            //StartDate: Utilities.getODataDate(this.state.reportStartDate), 
            //EndDate: Utilities.getODataDate(this.state.reportEndDate), 
            SchoolID: this.state.schoolID, MentorEmployeeID: this.state.mentorEmployeeID, MenteeEmployeeID: this.state.menteeEmployeeID
        };
        this.props.actions.loadMenteeActivityLogsCompletionReport(params)
            .then(reportData => this.loadMentorCompletionReportJSON());
        //}
    }

    //process Mentor Completion Report JSON data
    loadMentorCompletionReportJSON() {
        this.props.actions.loadAllCampusContacts()
            .then(campusContacts => {
                if (this.props.reportData.length > 0) {
                    // let reportDataArray = [...this.props.reportData];
                    let reportDataArray = JSON.parse(JSON.stringify(this.props.reportData));

                    let curYear = new Date().getFullYear();
                    let curMonth = this.state.monthID;
                    let logsRequired = '';
                    this.props.cbmStandards.filter(eleCBM => {
                        if (eleCBM.Month == curMonth && eleCBM.Year == curYear)
                            logsRequired = eleCBM.NoOfLogs;
                    });
                    reportDataArray.map(ele => {
                        ele.CICName = '';
                        ele.CICElectronicMailAddress = '';
                        this.props.campusContacts.map(campC => {
                            if (ele.EducationOrgNaturalKey == campC.EducationOrgNaturalKey) {
                                if (ele.CICName == '') {
                                    ele.CICName = campC.LastSurname + " " + campC.FirstName;
                                    if (campC.ElectronicMailAddress != null)
                                        ele.CICElectronicMailAddress = " " + campC.ElectronicMailAddress;
                                }
                                else {
                                    ele.CICName = ele.CICName + "," + campC.LastSurname + " " + campC.FirstName;
                                    if (campC.ElectronicMailAddress != null)
                                        ele.CICElectronicMailAddress = ele.CICElectronicMailAddress + "," + campC.ElectronicMailAddress;

                                }
                            }
                            while (ele.CICElectronicMailAddress.charAt(0) === ',') {
                                ele.CICElectronicMailAddress = ele.CICElectronicMailAddress.substr(1);
                            }
                        });

                    });

                    let perRelationshipActivityItems = [];
                    if (reportDataArray != "") {
                        // let logRequired = 3;
                        //loop over each row
                        reportDataArray.map(resMentor => {
                            if (((new Date(resMentor.ActivityStartTime).getMonth()) + 1) == this.state.monthID) {

                                resMentor.Mentees.map(resMentee => {
                                    let found = 0;
                                    perRelationshipActivityItems.map(checkFound => {
                                        if (checkFound.MentorEmployeeID == resMentor.MentorEmployeeID && checkFound.MenteeEmployeeID == resMentee.StaffNaturalKey) {
                                            checkFound.LogEntryCount = checkFound.LogEntryCount + 1;
                                            found = 1;
                                            if (checkFound.LogEntyRequired > checkFound.LogEntryCount)
                                                checkFound.MetRequirement = "No";
                                            else
                                                checkFound.MetRequirement = "Yes";
                                        }

                                    });
                                    if (found == 0) {
                                        let menteeSession = {};
                                        menteeSession.ActivityLogMenteeID = resMentee.ActivityLogMenteeID;

                                        let createdMonth = (new Date(resMentor.CreateDate).getMonth()) + 1;
                                        menteeSession.CICName = resMentor.CICName;
                                        menteeSession.CICElectronicMailAddress = resMentor.CICElectronicMailAddress;
                                        menteeSession.MentorName = resMentor.MentorFirstName + " " + resMentor.MentorLastSurname;
                                        menteeSession.MentorEmployeeID = resMentor.MentorEmployeeID;
                                        menteeSession.MentorElectronicMailAddress = resMentor.MentorElectronicMailAddress;
                                        menteeSession.MenteeName = resMentee.FirstName + " " + resMentee.LastSurname;
                                        menteeSession.MenteeEmployeeID = resMentee.StaffNaturalKey;
                                        menteeSession.ActivityLogMenteeID = resMentee.ActivityLogMenteeID;
                                        menteeSession.MenteeElectronicMailAddress = resMentee.ElectronicMailAddress;
                                        menteeSession.NameOfInstitution = resMentor.NameOfInstitution;
                                        menteeSession.PSDeptID = resMentor.EducationOrgNaturalKey;
                                        menteeSession.Month = this.state.currentMonthName;
                                        menteeSession.LogEntyRequired = logsRequired;
                                        menteeSession.LogEntryCount = 1;
                                        if (logsRequired > menteeSession.LogEntryCount)
                                            menteeSession.MetRequirement = "No";
                                        else
                                            menteeSession.MetRequirement = "Yes";
                                        perRelationshipActivityItems.push(menteeSession);
                                    }

                                });

                            }
                        });

                    }
                    //store the list in state array  
                    this.setState({ perRelationshipLogCompletion: perRelationshipActivityItems });
                }
                else {
                    this.setState({ perRelationshipLogCompletion: [] });
                }
            });
    }

    isValidForm() {
        let isValid = true;
        if (this.state.reportStartDate == null) {
            isValid = false;
            this.displayMessage('Error: Invalid Start Date. Start Date must be selected', '');
        }
        else if (this.state.reportEndDate == null) {
            isValid = false;
            this.displayMessage('Error: Invalid End Date. End Date must be selected', '');
        }
        return isValid;
    }

    onSchoolDropdownChanged(item) {
        let isMentorDropdownDisabled = true;
        if (item.key != 'All') isMentorDropdownDisabled = false;
        this.setState({ schoolID: item.key, isMentorDropdownDisabled: isMentorDropdownDisabled, mentorName: '', mentorEmployeeID: '', menteeName: '', menteeEmployeeID: '' });
        this.props.actions.loadMentorsByCampus(item.key)
            .then(mentors => {
                const first = { text: "--- All Mentors ---", key: "All" };
                let schoolMentors = teacherFormattedForDropdown(this.props.mentors);
                schoolMentors.unshift(first);
                this.setState({ schoolMentors: schoolMentors, mentorEmployeeID: 'All' });
            });
    }

    onMentorDropdownChanged(item) {
        let isMenteeDropdownDisabled = true;
        if (item.key != 'All') isMenteeDropdownDisabled = false;
        this.setState({ mentorEmployeeID: item.key, mentorName: item.text, menteeName: '', menteeEmployeeID: '', isMenteeDropdownDisabled: isMenteeDropdownDisabled });
        const mentorEmployeeID = item.key;
        this.props.actions.loadMenteesInActiveRelationshipsByMentorID(mentorEmployeeID, this.props.userProps.timeConfigurationID, this.state.schoolID)
            .then(mentees => {
                const first = { text: "--- All Mentees ---", key: "All" };
                let schoolMentees = teacherFormattedForDropdown(this.props.mentees);
                schoolMentees.unshift(first);
                this.setState({ schoolMentees: schoolMentees, menteeEmployeeID: 'All' });
            });
    }

    onMenteeDropdownChanged(item) {
        this.setState({ menteeEmployeeID: item.key, menteeName: item.text });

    }

    onMonthDropdownChanged(item) {
        this.setState({ monthID: item.key, monthName: item.text });
    }

    onSelectReportStartDate(date) {
        this.setState({ reportStartDate: date });
    }

    onSelectReportEndDate(date) {
        this.setState({ reportEndDate: date });
    }

    okDialog() {
        this.closeDialog();
    }

    showDialog() {
        this.setState({ hideDialog: false });
    }

    closeDialog() {
        this.setState({ hideDialog: true });
    }

    displayMessage(message, action) {
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'black' }}>
                From {start} to {to}. Total: {total}&nbsp;&nbsp;
          </p>
        );
    }

    formatDate(date) {
        if (date) {
            let newDate = Utilities.getDateOnly(date);
            return newDate;
        }
        return '';
    }

    lowerCaseFormatter(cell, row) {
        return (
            <span style={{ textTransform: "lowercase" }}>{cell}</span>
        );
    }

    dateFormatter(cell, row) {
        let formattedDate = Utilities.getDateOnly(cell);
        if (formattedDate == "12/31/1969") formattedDate = "";
        return (formattedDate);
    }

    render() {
        const options = {
            defaultSortName: 'NameOfInstitution',
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
        if (this.props.userProps.user.role != 'Admin' && this.state.schoolID != this.props.userProps.user.campusID && this.state.schoolID == '') {
            this.setState({ schoolID: this.props.userProps.user.campusID, isSchoolDropdownDisabled: true });
        }
        if (this.props.userProps.user.role == 'Mentor' && this.state.mentorEmployeeID != this.props.userProps.user.employeeID && this.state.mentorEmployeeID == '') {
            this.setState({ mentorEmployeeID: this.props.userProps.user.employeeID, isMentorDropdownDisabled: true });
        }

        return (
            <IfAnyGranted expected={['Admin', 'Principal', 'CIC', 'Mentor']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Mentor Completion Report" campus={this.props.campusName} hideCampusDrpDwn="Hide"/>
                        <form className="form-horizontal">
                            <div className="form-group">
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{ paddingTop: "8px" }}>School Name</label>
                                <div className="col-md-10 col-lg-10 col-sm-10">
                                    <Dropdown placeHolder="Select School" selectedKey={this.state.schoolID} options={this.props.allCampuses} defaultSelectedKey="All" onChanged={this.onSchoolDropdownChanged} isDisabled={this.state.isSchoolDropdownDisabled} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{ paddingTop: "8px" }}>Mentor Name</label>
                                <div className="col-md-10 col-lg-10 col-sm-10">
                                    <Dropdown placeHolder="" options={this.state.schoolMentors} selectedKey={this.state.mentorEmployeeID} onChanged={this.onMentorDropdownChanged} isDisabled={this.state.isMentorDropdownDisabled} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{ paddingTop: "8px" }}>Mentee Name</label>
                                <div className="col-md-10 col-lg-10 col-sm-10">
                                    <Dropdown placeHolder="" options={this.state.schoolMentees} selectedKey={this.state.menteeEmployeeID} onChanged={this.onMenteeDropdownChanged} isDisabled={this.state.isMenteeDropdownDisabled} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{ paddingTop: "8px" }}> Month</label>
                                <div className="col-md-10 col-lg-10 col-sm-10">
                                    <Dropdown placeHolder="Select a Month" options={this.state.monthDDOptions} selectedKey={this.state.monthID} onChanged={this.onMonthDropdownChanged} />
                                </div>
                            </div>


                            {/*<div className="form-group">
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{paddingTop: "8px"}}>Start Date</label>
                                <div className="col-md-4 col-lg-4 col-sm-4">
                                    <DatePicker value={reportStartDate} firstDayOfWeek={firstDayOfWeek} strings={dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectReportStartDate} placeholder="Select start date..." />
                                </div>
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{paddingTop: "8px"}}>End Date</label>
                                <div className="col-md-4 col-lg-4 col-sm-4">
                                    <DatePicker value={reportEndDate} firstDayOfWeek={firstDayOfWeek} strings={dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectReportEndDate} placeholder="Select end date..." />
                                </div>
                            </div>*/}
                        </form>
                        <div className="row">

                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div className="white-box">
                                    <div className="col-md-12 col-lg-12 col-sm-12 pull-right" style={{ textAlign: 'right', paddingBottom: '8px' }}>
                                        <PrimaryButton
                                            text="Run Report"
                                            onClick={this.runReport}
                                        />
                                    </div>
                                    <BootstrapTable data={this.state.perRelationshipLogCompletion} hover condensed pagination options={options} search exportCSV>
                                        <TableHeaderColumn dataField="ActivityLogMenteeID" isKey hidden />
                                        <TableHeaderColumn dataField="NameOfInstitution" dataSort dataAlign="left" width={"200px"} tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>School Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="PSDeptID" dataSort dataAlign="left" width={"100px"}>* PS Dept ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="CICName" columnTitle datasort dataAlign="left" width={"100px"} tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }} thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px' }}>CIC Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="CICElectronicMailAddress" columnTitle datasort dataAlign="left" width={"200px"} dataFormat={this.lowerCaseFormatter} tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }} thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px' }}>CIC Email</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MentorName" dataSort dataAlign="left" width={"120px"} tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px' }}>Mentor Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MentorEmployeeID" dataSort dataAlign="left" width={"100px"} thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>Mentor Emp. ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MentorElectronicMailAddress" dataSort dataAlign="left" width={"200px"} dataFormat={this.lowerCaseFormatter} tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px' }}>Mentor Email</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MenteeName" dataSort dataAlign="left" width={"120px"} tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }} thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px' }}>Mentee Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MenteeEmployeeID" dataSort dataAlign="left" width={"100px"} tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }} thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>Mentee Emp. ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MenteeElectronicMailAddress" dataSort dataAlign="left" width={"200px"} dataFormat={this.lowerCaseFormatter} tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>Mentee Email</TableHeaderColumn>
                                        <TableHeaderColumn dataField="Month" dataAlign="center" width={"100px"} thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>Month</TableHeaderColumn>
                                        <TableHeaderColumn dataField="LogEntyRequired" dataAlign="center" width={"100px"} tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }} thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px' }}>Logs Required</TableHeaderColumn>
                                        <TableHeaderColumn dataField="LogEntryCount" dataAlign="center" width={"100px"} thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>Log Entered</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MetRequirement" dataSort dataAlign="center" width={"100px"} tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }} thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px' }}>Met Requirement</TableHeaderColumn>

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
                            title: 'Mentor Completion Report',
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

MentorCompletionReportPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    relationships: PropTypes.array,
    newRelationship: PropTypes.func,
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object,
    campuses: PropTypes.array,
    allCampuses: PropTypes.array,
    reportData: PropTypes.array,
    mentors: PropTypes.array,
    mentees: PropTypes.array,
    history: PropTypes.object,
    campusContacts: PropTypes.array,
    cbmStandards: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    let campuses = [];
    if (state.userProps.user.role == 'Admin') {
        const first = { text: "--- All Schools ---", key: "All" };
        campuses = campusesFormattedForDropdown(state.campuses, state.userProps.user.campusID, state.userProps.user.campusName);
        campuses.unshift(first);
    }
    else {
        const first = { text: state.userProps.user.campusName, key: state.userProps.user.campusID };
        campuses.push(first);
    }

    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        userProps: state.userProps,
        allCampuses: campuses,
        reportData: state.reportData,
        mentors: state.mentors,
        mentees: state.mentees,
        campusContacts: state.campusContacts,
        cbmStandards: state.cbmStandards
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, campusActions, reportsActions, mentorsActions, menteesActions, ajaxActions, adminActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(MentorCompletionReportPage);