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
import * as ajaxActions from '../../actions/ajaxStatusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import Utilities from '../../utilities/utilities';
import LinkFormatter from '../common/formatters/linkFormatter';
import { campusesFormattedForDropdown, teacherFormattedForDropdown } from './../../selectors/selectors';
import { debuglog } from 'util';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

let hasMounted = false;

class MentorActivityLogReportPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            campusID: '',
            CSOEmployeeID: '',
            schoolID: '',
            mentorName: '',
            mentorEmployeeID: '',
            isDisabled: true,
            isSchoolDropdownDisabled: false,
            schoolNameOptions: [],
            schoolMentors: [],
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
        this.onSelectReportStartDate = this.onSelectReportStartDate.bind(this);
        this.onSelectReportEndDate = this.onSelectReportEndDate.bind(this);

        this.runReport = this.runReport.bind(this);
        this.isValidForm = this.isValidForm.bind(this);
    }

    componentDidMount(){
        const role = this.props.userProps.user.role;
        this.setState({campusID: this.props.campusID});
        this.props.actions.clearReportData();
        if(this.props.userProps.user.role == 'Admin'){
            if(this.props.allCampuses.count == 0)
                this.props.actions.loadAllCampuses();
            this.setState({schoolID: 'All', isSchoolDropdownDisabled: false});
        }
        else{
            this.setState({schoolID: this.props.userProps.user.campusID, isSchoolDropdownDisabled: true});
            if(this.props.userProps.user.role == 'Principal' || this.props.userProps.user.role == 'CIC'){
                this.props.actions.loadMentorsByCampus(this.props.userProps.user.campusID)
                .then(mentors => {
                    const first = {text: "--- All Mentors ---", key: "All"};
                    let schoolMentors =  teacherFormattedForDropdown(this.props.mentors);
                    schoolMentors.unshift(first);
                    this.setState({schoolMentors: schoolMentors, mentorEmployeeID: 'All', isMentorDropdownDisabled: false});
                });
            }
            else if(this.props.userProps.user.role == 'Mentor'){
                let schoolMentors = [];
                const me = {text: this.props.userProps.user.fullName, key: this.props.userProps.user.employeeID};
                schoolMentors.push(me);
                this.setState({schoolMentors: schoolMentors, mentorEmployeeID: this.props.userProps.user.employeeID});
            }
        }
        hasMounted = true;
    }

    runReport(){
        if(this.isValidForm() == true){
            let params = { StartDate: Utilities.getODataDate(this.state.reportStartDate), EndDate: Utilities.getODataDate(this.state.reportEndDate), SchoolID: this.state.schoolID, MentorEmployeeID: this.state.mentorEmployeeID};
            this.props.actions.loadMentorActivityLogReport(params);
        }
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

    onSchoolDropdownChanged(item) {
        let isMentorDropdownDisabled = true;
        if(item.key != 'All') isMentorDropdownDisabled = false;
        this.setState({ schoolID: item.key, isDisabled: isMentorDropdownDisabled, mentorName: '', mentorEmployeeID: '' });
        this.props.actions.loadMentorsByCampus(item.key)
        .then(mentors => {
            const first = {text: "--- All Mentors ---", key: "All"};
            let schoolMentors =  teacherFormattedForDropdown(this.props.mentors);
            schoolMentors.unshift(first);
            this.setState({schoolMentors: schoolMentors, mentorEmployeeID: 'All'});
        });
    }

    onMentorDropdownChanged(item) {
        this.setState({ mentorEmployeeID: item.key, mentorName: item.text });
    }

    onSelectReportStartDate(date) {
        this.setState({ reportStartDate: date });
    }

    onSelectReportEndDate(date) {
        this.setState({ reportEndDate: date });
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

    formatDate(date) {
        if (date) {
            let newDate = Utilities.getDateOnly(date);
            return newDate;
        }
        return '';
    }

    lowerCaseFormatter(cell, row) {
        return (
          <span style={{textTransform: "lowercase"}}>{cell}</span>
        );
    }

    dateFormatter(cell, row) {
        let formattedDate = Utilities.getDateOnly(cell);
        if(formattedDate == "12/31/1969") formattedDate = "";
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
        if(this.props.userProps.user.role != 'Admin' && this.state.schoolID != this.props.userProps.user.campusID && this.state.schoolID == ''){
            this.setState({schoolID: this.props.userProps.user.campusID, isSchoolDropdownDisabled: true});
            if(this.props.userProps.user.role == 'Mentor'){
                this.setState({mentorEmployeeID: this.props.userProps.user.employeeID, isMentorDropdownDisabled: true});
            }
        }
        return (
            <IfAnyGranted expected={['Admin','Principal', 'CIC', 'Mentor']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Mentor Activity Log Report" campus={this.props.campusName} />
                        <form className="form-horizontal">
                            <div className="form-group">
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{paddingTop: "8px"}}>School Name</label>
                                <div className="col-md-10 col-lg-10 col-sm-10">
                                    <Dropdown placeHolder="Select School" selectedKey={this.state.schoolID} options={this.props.allCampuses} defaultSelectedKey="All" onChanged={this.onSchoolDropdownChanged} isDisabled={this.state.isSchoolDropdownDisabled} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{paddingTop: "8px"}}>Mentor Name</label>
                                <div className="col-md-10 col-lg-10 col-sm-10">
                                <Dropdown placeHolder="Select a Mentor" options={this.state.schoolMentors} selectedKey={this.state.mentorEmployeeID} onChanged={this.onMentorDropdownChanged} isDisabled={this.state.isMentorDropdownDisabled} />
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
                                    <BootstrapTable data={this.props.reportData} hover condensed pagination options={options} search exportCSV>
                                        <TableHeaderColumn dataField="MentorName" dataSort dataAlign="left" width={"120px"} isKey tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>Mentor Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MentorEmployeeID" dataSort dataAlign="left" width={"100px"} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Mentor Emp. ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MentorElectronicMailAddress" dataSort dataAlign="left" width={"200px"} dataFormat={this.lowerCaseFormatter} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>Mentor Email</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MenteeName" dataSort dataAlign="left" width={"120px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>Mentee Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MenteeEmployeeID" dataSort dataAlign="left" width={"100px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Mentee Emp. ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MenteeElectronicMailAddress" dataSort dataAlign="left" width={"200px"} dataFormat={this.lowerCaseFormatter} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Mentee Email</TableHeaderColumn>
                                        <TableHeaderColumn dataField="NameOfInstitution" dataSort dataAlign="left" width={"200px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>School Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="PSDeptID" dataSort dataAlign="left" width={"100px"}>* PS Dept ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ActivityStartTime" dataSort dataAlign="left" width={"100px"} dataFormat={this.dateFormatter} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Date</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ActivityCode" datasort dataAlign="left" width={"100px"}>Activity</TableHeaderColumn>
                                        <TableHeaderColumn dataField="Duration" dataSort dataAlign="center" width={"100px"} dataFormat={this.dateFormatter} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Duration (mins)</TableHeaderColumn>
                                        <TableHeaderColumn dataField="Participants" datasort dataAlign="left" width={"100px"}tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>Participants</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MentorComments" datasort dataAlign="left" width={"200px"} dataFormat={this.lowerCaseFormatter} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>MentorComments</TableHeaderColumn>
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
                            title: 'Mentor Activity Log Report',
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

MentorActivityLogReportPage.propTypes = {
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
    history: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    let campuses = [];
    if(state.userProps.user.role == 'Admin'){
        const first = {text: "--- All Schools ---", key: "All"};
        campuses = campusesFormattedForDropdown(state.campuses, state.userProps.user.campusID, state.userProps.user.campusName);
        campuses.unshift(first);
    }    
    else{
        const first = {text: state.userProps.user.campusName, key: state.userProps.user.campusID};
        campuses.push(first);
    }
    
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        userProps: state.userProps,
        allCampuses: campuses,
        reportData: state.reportData,
        mentors: state.mentors
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, campusActions, reportsActions, mentorsActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(MentorActivityLogReportPage);