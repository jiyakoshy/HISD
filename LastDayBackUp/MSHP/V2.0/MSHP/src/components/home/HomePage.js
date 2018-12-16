import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as sharedActions from './../../actions/sharedActions';
import * as campusActions from '../../actions/campusActions';
import * as enrollmentActions from '../../actions/enrollmentActions';
import * as calendarsActions from '../../actions/calendarsActions';
import * as annualsetupActions from '../../actions/annualsetupActions';
import * as calendarReportDatesActions from './../../actions/calendarReportDatesActions';
import * as nonReportSchoolActions from '../../actions/nonReportSchoolActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import Utilities from '../../utilities/utilities';
import * as ajaxActions from '../../actions/ajaxStatusActions';

class HomePage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        this.onSavingSucceeds = this.onSavingSucceeds.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.state = {
            schoolYear: this.props.schoolYear,
            newschoolYear: this.props.newschoolYear,
            reportDate: null,
            allcampusCSOs: this.props.allcampusCSOs,
            reportDateID: this.props.defaultReportDateID
        };
        
    }

    componentDidMount(){
        this.props.actions.loadAllSchoolYears();
        this.props.actions.loadCurrentSchoolYear();
        this.props.actions.loadSchoolYearType();
        this.props.actions.loadAllCampuses();
        this.props.actions.loadAllCompareDaySeq(this.props.schoolYear);
    }

    renderShowsTotal(start, to, total) {
        return (
            <p style={{color: 'black'}}>
            From {start} to {to}. Total: {total}&nbsp;&nbsp;
            </p>
        );
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.save();
    }

    save() {
        this.props.actions.loadCalendars(this.props.schoolYear).then(
            calendarobj => {
                let detail={};
                let calendars = this.props.calendars;
                for(let i = 0; i < calendars.length;i++){
                    detail= {};
                    detail.SchoolYear = this.props.schoolYear.substring(5,9) + '-' +  parseInt(parseInt(this.props.schoolYear.substring(5,9)) + 1);
                    detail.CompareDaySeq = parseInt(calendars[i].CompareDaySeq);
                    detail.InstructionDay = parseInt(calendars[i].InstructionDay);
                    if (calendars[i].ReportDate != null){
                    let d = new Date(calendars[i].ReportDate);
                    let year = d.getFullYear();
                    let month = d.getMonth();
                    let day = d.getDate();
                    detail.ReportDate = new Date(year + 1,month, day);
                    }
                    else
                    {
                        detail.ReportDate = null; 
                    }
                    detail.PlanNotes = '';
                    detail.ReportSchedule = calendars[i].ReportSchedule;
                    detail.CreatedDate = new Date();
                    detail.CreatedBy = this.props.userProps.user.fullName;
                    detail.UpdatedDate = new Date();
                    detail.UpdatedBy = this.props.userProps.user.fullName;
                    let promise = this.props.actions.createCalendar(detail);
                    promise.then(
                        this.onSavingSucceeds(detail.SchoolYear)
                    )
                    .catch(reason => {
                        this.props.actions.ajaxCallError();
                        this.setState({ subtext: 'There was a problem creating these calendar values. Operation canceled.', dialogAction: '' });
                        this.showDialog();
                    });
                }
                this.saveOrganizationGroup();
            }
        );
    }

    saveOrganizationGroup(){
        this.props.actions.loadAllSchoolYears();
        this.props.actions.loadCurrentSchoolYear();
        this.props.actions.loadAllCompareDaySeq(this.props.newschoolYear);
        this.props.actions.loadUser();
        this.props.actions.loadCalendarReportDates(this.props.newschoolYear);
        this.props.actions.loadPublicOrganizationGroup().then(
            orgobj => {
                let orggroups = this.props.publicorganizationGroup;
                for(let j = 0; j < orggroups.length; j++){
                    let orgdetail= {};
                    orgdetail.SchoolYear = this.props.newschoolYear;
                    orgdetail.CalendarId = parseInt(this.props.defaultReportDateID) + 1;
                    orgdetail.ShortDescription = orggroups[j].OrgGroupId;
                    orgdetail.Description = orggroups[j].OrganizationGroup;
                    orgdetail.DisplayOrder = parseInt(j) + 1;
                    orgdetail.IsOrganizationGroup = true;
                    let promise = this.props.actions.createOrganizationGroup(orgdetail);
                    promise.then(
                        this.onSavingSucceeds(orgdetail.SchoolYear)
                    )
                    .catch(reason => {
                        this.props.actions.ajaxCallError();
                        this.setState({ subtext: 'There was a problem creating these organization values. Operation canceled.', dialogAction: '' });
                        this.showDialog();
                    });
                }
                this.saveCampusProfile();  
            }
        );
    }

    saveCampusProfile(){
        this.props.actions.loadOrganizationGroup(this.props.newschoolYear).then(
            orggrpobj=>{
            //let orgType = '';
            let allcampuses = this.props.campuses;
            for(let k = 0; k < allcampuses.length; k++){ 
                let filtername = this.props.allcampusCSOs.filter(c => c.EducationOrgNaturalKey == allcampuses[k].EducationOrgNaturalKey);
                if (filtername.length > 0)
                {
                    if (filtername['0'].SchoolManagers){
                        if (filtername['0'].SchoolManagers.Up2Manager){
                            let filterorgname = this.props.allcampusCSOs.filter(c => c.EducationOrgNaturalKey == filtername['0'].SchoolManagers.Up2EducationOrgNaturalKey);
                            if (filterorgname.length > 0)
                            {
                                let filterorgtype = this.props.organizationGroup.filter(o => o.ShortDescription == filterorgname['0'].EducationOrgNaturalKey);
                                if (filterorgtype.length > 0)
                                {
                                    let annualSet = {};
                                    //orgType = filterorgtype['0'].Id;
                                    annualSet.CalendarId = parseInt(filterorgtype['0'].CalendarId);
                                    annualSet.OrganizationGroupId = parseInt(filterorgtype['0'].Id);
                                    annualSet.CampusNumber = allcampuses[k].EducationOrgNaturalKey;
                                    annualSet.Capacity = 0;//annualdetail[i].Capacity;
                                    annualSet.Projection = 0;//annualdetail[i].Projection;
                                    annualSet.Snapshot = 0;//annualdetail[i].Snapshot;
                                    annualSet.CreatedDate = new Date();
                                    annualSet.CreatedBy = 'System';
                                    annualSet.UpdatedDate = new Date();
                                    annualSet.UpdatedBy = 'System';
                                    let promise = this.props.actions.createCampusProfile(annualSet);
                                    promise.then(
                                        this.onSavingSucceeds(this.props.newschoolYear)
                                    )
                                    .catch(reason => {
                                        this.props.actions.ajaxCallError();
                                        this.setState({ subtext: 'There was a problem creating these campus profile values. Operation canceled.', dialogAction: '' });
                                        this.showDialog();
                                    });
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    
    onSavingSucceeds(e) {
        this.setState({ schoolYear: e });
        this.displayMessage('Annual Setup successfully Created.', 'Created');
    }

    displayMessage(message, action) {
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }
    showDialog() {
        this.setState({ hideDialog: false });
    }
    closeDialog() {
        this.setState({ hideDialog: true });
    }
    okDialog() {
        this.closeDialog();
 
        if (this.state.dialogAction == 'SAVED')
            this.cancel();
    }

    render() {
        const options = {
            defaultSortName: 'CampusName',  
            sortOrder: 'asc',
            prePage: 'Prev',
            nextPage: 'Next',
            firstPage: 'First',
            lastPage: 'Last',
            paginationShowsTotal: this.renderShowsTotal
        };
        let styleTitle = {
            fontSize: '20px',
            color: '#458ab6',
            lineHeight: '50px',
            verticalAlign: 'middle'
        };
        let styleMessage = {
            fontSize: '14px',
            color: 'black',
            verticalAlign: 'middle'
        };
        let isDisabled = true;
        if(this.props.userProps.user.role == 'Admin') 
            if (this.props.newschoolYear != this.props.schoolYear){
                isDisabled = false;
            }
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <form onSubmit={this.handleFormSubmit}>
                        <PageHeader title="Home" campus={this.props.campusName} />
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div className="white-box">
                                <label style={styleTitle}>{this.props.campusName}</label>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <label style={styleMessage}>MSHP is a dynamic, user-friendly application designed to support the memberships reporting component of HISD’s enrollments.</label>
                                    <br/><label style={styleMessage}>By drawing information from a number of different data systems.</label>  
                                    <br/><label style={styleMessage}>With the help of MSHP, users can access enrollment data more quickly and easily than ever.</label>  
                                    <br/>
                                    <br/>
                                    <div className={isDisabled ? 'hidden' : ''}><input type="submit"
                                                    className="btn btn-primary float-right"
                                                    value="New SchoolYear Setup"
                                                    disabled={isDisabled} />
                                    </div>


                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

HomePage.propTypes = {
    userProps: PropTypes.object,
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    campuses: PropTypes.array,
    allcampusCSOs: PropTypes.array,
    schoolYear: PropTypes.string, 
    annualsetup: PropTypes.array,
    calendars: PropTypes.array,
    newschoolYear: PropTypes.string,
    handleFormSubmit: PropTypes.func,
    howDialog: PropTypes.func,
    displayMessage: PropTypes.func,
    onSavingSucceeds: PropTypes.func,
    onSavingFails: PropTypes.func,
    cancel: PropTypes.func,
    okDialog: PropTypes.func,
    cancelToHome: PropTypes.func,
    organizationGroup: PropTypes.array,
    publicorganizationGroup: PropTypes.array,
    reportDateID: PropTypes.string,
    calendarReportDates: PropTypes.array,
    defaultReportDateID: PropTypes.string
};

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps,
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        allcampusCSOs: state.campusCSOs,
        campuses: state.campuses,
        schoolYear: state.schoolYear,
        annualsetup: state.annualsetup,
        calendars: state.calendars,
        newschoolYear: state.newschoolYear,
        organizationGroup: state.organizationGroup,
        publicorganizationGroup: state.publicorganizationGroup,
        defaultReportDateID:  Utilities.getMostRecentReportDateID(state.calendarReportDates),
        calendarReportDates: state.calendarReportDates
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, calendarReportDatesActions, calendarsActions, annualsetupActions,enrollmentActions, sharedActions,campusActions,nonReportSchoolActions,ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
