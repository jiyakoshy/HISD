import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//actions
import * as relationshipsActions from '../../actions/relationshipsActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import * as mentorsActions from '../../actions/mentorsActions';
import * as menteesActions from '../../actions/menteesActions';
import * as spUserPropsActions from '../../actions/spUserPropsActions';
import * as adminActions from '../../actions/adminActions';
import * as campusActions from '../../actions/campusActions';

import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Utilities from '../../utilities/utilities';
import { teacherFormattedForDropdownLoginID } from '../../selectors/selectors';
import moment from 'moment';
import LeaderInfo from '../common/LeaderInfo';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';
import { stateFromHTML } from 'draft-js-import-html';

class NewRelationshipPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            campusID: '',
            mentorName: '',
            mentorLoginID: '',
            mentorSPID: 0,
            menteeLoginID: '',
            menteeName: '',
            menteeEmployeeID: '',
            menteeSPID: 0,
            principalSPID: 0,
            startDate: null,
            schoolEndDate: null,
            cicSPID: 0,
            /* For testing purposes */
            principalName: '',
            principalLoginID: '',
            cicName: '',
            cicLoginID: '',
            /******* */
            hideDialog: true,
            dialogAction: '',
            subtext: '',
            approvalDisable: false
        };
        this.formatDate = this.formatDate.bind(this);
        this.onMentorDropdownChanged = this.onMentorDropdownChanged.bind(this);
        this.onMenteeDropdownChanged = this.onMenteeDropdownChanged.bind(this);

        /* For testing purposes -- UNNESSESARY CODE BLOCK
        this.onPrincipalDropdownChanged = this.onPrincipalDropdownChanged.bind(this);
        this.onCICDropdownChanged = this.onCICDropdownChanged.bind(this);
        */

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.onSavingSucceeds = this.onSavingSucceeds.bind(this);
        this.onSavingFails = this.onSavingFails.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        this.onTeacherDropDownChangedFailed = this.onTeacherDropDownChangedFailed.bind(this);
        this.onGetPrincipalFailed = this.onGetPrincipalFailed.bind(this);
        this.onGetPrincipalSucceeded = this.onGetPrincipalSucceeded.bind(this);
        this.onCreatingRequestFailed = this.onCreatingRequestFailed.bind(this);
        this.formatDate = this.formatDate.bind(this);
    }

    /*formatDate(theDate){
        if(theDate != null)
            return theDate.format('MM/DD/YYYY');
        else
            return "";
    }*/

    formatDate(date) {
        if (date) {
            let newDate = Utilities.getDateOnly(date);
            return newDate;
        }
        return '';
    }

    componentDidMount() {
        let campusID = this.props.campusID;
        //today: let campusID = "104"; //"10001094";//For testing purposes
        let startDate = moment();
        //let endDate = moment().add('years', 1); 
        // relationship end date should be read from configured value
        //let timeConfigurationID = this.props.match.params.TimeConfigurationID;
        let timeConfigurationID = 1;
        this.props.actions.loadTimeConfig(timeConfigurationID)
            .then(timeConfig => this.loadValues());
        this.setState({ campusID: this.props.campusID, startDate: startDate });
        this.props.actions.loadMentorsByCampus(campusID);
        this.props.actions.loadMenteesByCampus(campusID);
        // added action for already exist mentee
        this.props.actions.loadAlreadyExistMenteesByCampus(campusID);

        const principalLoginID = this.props.userProps.user.principalLoginID;
        const principalName = this.props.userProps.user.principalName;
        let principalPromise = this.props.actions.loadSPUserProps(principalLoginID);
        principalPromise.then((response) => this.onGetPrincipalSucceeded())
            .catch(error => this.onGetPrincipalFailed());
        /*- Raju: let cicPromise = this.props.actions.loadCampusContactsByCampusID(this.props.campusID);
        cicPromise.then(cics => this.loadCICValues());*/
    }
    //time config for default school EndDate
    loadValues() {
        if (this.props.timeConfig != null)
            this.setState({ timeConfigurationID: this.props.timeConfig.TimeCofigurationID, schoolYear: this.props.timeConfig.SchoolYear.trim(), schoolStartDate: new Date(Utilities.getDateTime(this.props.timeConfig.SchoolStartDate)), schoolEndDate: new Date(Utilities.getDateTime(this.props.timeConfig.SchoolEndDate)) });
    }
    /* Raju:  load cic information 
    loadCICValues(){
        this.setState({campusCICs: teacherFormattedForDropdown(this.props.cics)});
    } */
    onGetPrincipalSucceeded() {
        let campusID = this.props.campusID;
        //today: let campusID = "104";//For testing purposes
        this.setState({ principalSPID: this.props.spUserProps.Id });
        let ccPromise = this.props.actions.loadCampusContactsByCampusID(campusID);
        ccPromise.then(campusContacts => {
            if (this.props.campusContacts.length > 0) {
                const cicInfo = this.props.campusContacts[0];
                if (cicInfo.LoginId && cicInfo.LoginId != "") {
                    let cicSPUserPromise = this.props.actions.loadSPUserProps(cicInfo.LoginId);
                    cicSPUserPromise.then((response) => {
                        this.setState({ cicSPID: this.props.spUserProps.Id });
                        // Make cicSPID as an arrary - may includes multiple cicSPId/s
                    })
                        .catch(error => this.props.actions.ajaxCallError());
                }
            }
        })
            .catch(error => alert(error));
    }

    onGetPrincipalFailed() {
        const principalName = this.props.userProps.user.principalName;
        this.props.actions.ajaxCallError();
        /****** Commented out for testing purposes - You have to change the collection in the Mentees Dropdown settings ***/
        //this.displayMessage('A new Mentor/Mentee Relationship cannot be created. Principal "' + principalName + '" not assigned or not available in SharePoint', 'CREATED');

    }

    onCreatingRequestFailed() {
        this.props.actions.ajaxCallError();
        this.displayMessage('ERROR: Mentor/Mentee Relationship Approval Process FAILED to be start. Please contact your System Administrator', 'CREATED');
    }

    displayMessage(message, action) {
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    onSavingSucceeds(response) {
        this.displayMessage('Mentor/Mentee Relationship successfully created.', '');

        let comp = this.state.mentorLoginID.split('|');
        const mentorEmployeeID = comp[1];
        let relationship = {};
        relationship.RelationshipID = this.props.relationship.MentorMenteeRelationshipID;
        relationship.MentorName = this.state.mentorName;
        relationship.MentorId = this.state.mentorSPID;
        relationship.MenteeName = this.state.menteeName;
        relationship.MenteeId = this.state.menteeSPID;
        relationship.PrincipalName = this.props.userProps.user.principalName;
        relationship.PrincipalId = this.state.principalSPID;
        relationship.WebServiceURL = process.env.REST_URL;
        relationship.MenteeEmployeeID = this.state.menteeEmployeeID;
        relationship.CampusID = this.props.campusID;
        relationship.TimeConfigurationID = this.props.userProps.timeConfigurationID;
        relationship.CICId = this.state.cicSPID;
        relationship.MentorEmployeeID = mentorEmployeeID;
        let requestPromise = this.props.actions.createRelationshipRequest(relationship);
        requestPromise.then(() => this.displayMessage('Mentor/Mentee Relationship Approval Process Started.', 'CREATED'))
            .catch(error => this.onCreatingRequestFailed());
    }

    onSavingFails() {
        this.props.actions.ajaxCallError();
        this.displayMessage('Error trying to save Mentor/Mentee Relationship.');
    }

    processSave() {
        if (this.props.relationship && this.props.relationship.MentorLoginID == this.state.mentorLoginID && this.props.relationship.MenteeLoginID == this.state.menteeLoginID) {
            this.displayMessage('Mentor/Mentee Relationship already exists.', '');
        }
        else {
            let comp = this.state.mentorLoginID.split('|');
            const mentorEmployeeID = comp[1];
            comp = this.state.menteeLoginID.split('|');
            const menteeEmployeeID = comp[1];
            let newRelationship = {
                MentorMenteeRelationshipID: 0, MentorEmployeeID: mentorEmployeeID, MenteeEmployeeID: menteeEmployeeID,
                TimeConfigurationID: this.props.userProps.timeConfigurationID, RelationshipStatus: 'Pending',
                PrincipalApproval: '', MentorAgreement: 'Pending', ApprovalDate: null, CampusID: this.props.campusID,
                CreatedBy: this.props.userProps.user.loginId,
                RelationshipEndDate: Utilities.convertToSQLDateTime(this.state.schoolEndDate)
            };
            let savePromise = this.props.actions.createRelationship(newRelationship);
            savePromise.
                then((response) => this.onSavingSucceeds(response)).
                catch(error => this.onSavingFails());
        }
    }

    save() {
        if (this.isValidForm()) {
            this.setState({approvalDisable: true});
            let comp = this.state.mentorLoginID.split('|');
            const mentorEmployeeID = comp[1];
            comp = this.state.menteeLoginID.split('|');
            const menteeEmployeeID = comp[1];
            let checkIfExistsPromise = this.props.actions.loadRelationshipByMentorAndMentee(mentorEmployeeID, menteeEmployeeID, this.props.userProps.timeConfigurationID);
            checkIfExistsPromise.
                then(response => this.processSave()).
                catch(error => this.displayMessage('Error trying to validate Mentor/Mentee Relationship.', ''));
        }
    }

    isValidForm() {
        let isValid = true;
        if (this.state.mentorLoginID == '' || this.state.mentorSPID == 0) {
            isValid = false;
            this.displayMessage('Error: Invalid Mentor.', '');
        }
        else if (this.state.menteeLoginID == '' || this.state.menteeSPID == 0) {
            isValid = false;
            this.displayMessage('Error: Invalid Mentee.', '');
        }
        else if (this.state.mentorLoginID == this.state.menteeLoginID) {
            isValid = false;
            this.displayMessage('Error: Mentor and Mentee cannot be the same.', '');
        }
        return isValid;
    }

    cancel() {
        document.location = "#relationships";
    }

    onMentorDropdownChanged(item) {
        this.setState({ mentorLoginID: item.key });
        let comp = item.key.split('|');
        const mentorLoginID = comp[0];
        this.props.actions.loadSPUserProps(mentorLoginID)
            .then((response) => this.setState({ mentorName: item.text, mentorSPID: this.props.spUserProps.Id, mentorEmployeeID: comp[1] }))
            .catch(error => this.onTeacherDropDownChangedFailed('mentor'));
    }

    /* For testing purposes  - UNNECESSARY CODE BLOCK 
    onPrincipalDropdownChanged(item) {
        this.setState({ principalLoginID: item.key });
        let comp = item.key.split('|');
        const principalLoginID = comp[0];
        this.props.actions.loadSPUserProps(principalLoginID)
        .then((response) => this.setState({ principalName: item.text, principalSPID: this.props.spUserProps.Id }))
        .catch(error => this.onTeacherDropDownChangedFailed('principal'));
    }*/

    /* For testing purposes  - UNNECESSARY CODE BLOCK
    onCICDropdownChanged(item) {
        this.setState({ cicLoginID: item.key });
        let comp = item.key.split('|');
        const cicLoginID = comp[0];
        this.props.actions.loadSPUserProps(cicLoginID)
        .then((response) => this.setState({ cicName: item.text, cicSPID: this.props.spUserProps.Id }))
        .catch(error => this.onTeacherDropDownChangedFailed('cic'));
    }*/

    onMenteeDropdownChanged(item) {
        this.setState({ menteeLoginID: item.key, menteeEmployeeName: item.text });
        let comp = item.key.split('|');
        const menteeLoginID = comp[0];
        this.props.actions.loadSPUserProps(menteeLoginID)
            .then((response) => this.setState({ menteeName: item.text, menteeSPID: this.props.spUserProps.Id, menteeEmployeeID: comp[1] }))
            .catch(error => this.onTeacherDropDownChangedFailed('mentee'));
    }

    onTeacherDropDownChangedFailed(teacherType) {
        this.props.actions.ajaxCallError();
        this.displayMessage('Invalid ' + teacherType + ' or not available in SharePoint', '');
    }

    okDialog() {
        if (this.state.dialogAction == 'CREATED') {
            this.cancel();
        }
        else {
            this.closeDialog();
        }
    }

    showDialog() {
        this.setState({ hideDialog: false });
    }

    closeDialog() {
        this.setState({ hideDialog: true });
        if (this.state.dialogAction == 'CREATED') {
            this.cancel();
        }
    }

    render() {

        if (this.state.campusID != this.props.campusID) {
            let campusID = this.props.campusID;
            //today: let campusID = "104"; //For testing purposes
            this.props.actions.loadMentorsByCampus(campusID);
            this.props.actions.loadMenteesByCampus(campusID);
            this.setState({ campusID: this.props.campusID });
        }
        let mentorsOptions = teacherFormattedForDropdownLoginID(this.props.mentors);
        let filteredMentees =  this.props.alreadyExistMentees && this.props.mentees && Utilities.getFilteredMentees(this.props.mentees, this.props.alreadyExistMentees);
        let menteesOptions = teacherFormattedForDropdownLoginID(filteredMentees);


        //testing: let menteesOptions = teacherFormattedForDropdownLoginID(this.props.mentors);
        let principalInfo = [{ key: '00118794', text: 'Rezaul Raju' }];
        let principalOptions = teacherFormattedForDropdownLoginID(principalInfo);
        let cicOptions = teacherFormattedForDropdownLoginID(this.props.campusContacts);

        return (
            <IfAnyGranted expected={['Admin', 'Principal', 'CIC']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="New Mentor/Mentee Relationship" campus={this.props.campus} />
                        <div className="row">
                            <div className="col-md-12 col-lg-9 col-sm-12">
                                <LeaderInfo />
                                <div className="white-box">
                                    <form className="form" style={{ padding: "15px" }}>
                                        <div className="form-group">
                                            <label>Mentor Name</label>
                                            <Dropdown placeHolder="Select a Mentor" options={mentorsOptions} onChanged={this.onMentorDropdownChanged} />
                                        </div>
                                        <div className="form-group">
                                            <label>Mentor Employee ID</label>
                                            <input id="mentorEmployeeID" className="form-control" type="text" value={this.state.mentorEmployeeID} maxLength={255} disabled />
                                        </div>
                                        <div className="form-group">
                                            <label>Mentee Name</label>
                                            <Dropdown placeHolder="Select a Mentee" options={menteesOptions} onChanged={this.onMenteeDropdownChanged} />
                                        </div>
                                        <div className="form-group">
                                            <label>Mentee Employee ID</label>
                                            <input id="menteeEmployeeID" className="form-control" type="text" value={this.state.menteeEmployeeID} maxLength={255} disabled />
                                        </div>
                                        {/*<div className="form-group">
                                            <label>Principal</label>
                                            <Dropdown placeHolder="Select a Principal" options={principalOptions} onChanged={this.onPrincipalDropdownChanged} />
                                        </div>
                                        <div className="form-group">
                                            <label>CIC</label>
                                            <Dropdown placeHolder="Select a CIC" options={cicOptions} onChanged={this.onCICDropdownChanged} />
                                        </div>*/}
                                        <div className="form-group">
                                            <label>Relationship Start Date</label>
                                            <input id="startDate" className="form-control" type="text" value={this.formatDate(this.state.startDate)} maxLength={255} disabled />
                                        </div>
                                        <div className="form-group">
                                            <label>Relationship End Date</label>
                                            <input id="startDate" className="form-control" type="text" value={this.formatDate(this.state.schoolEndDate)} maxLength={255} disabled />
                                        </div>
                                        <div className="form-group">
                                            <div className="text-left">
                                                <br />
                                                <PrimaryButton
                                                    text="Start Approval Process"
                                                    onClick={this.save} disabled={this.state.approvalDisable}
                                                />
                                                &nbsp;&nbsp;&nbsp;
                                                    <PrimaryButton
                                                    text="Cancel"
                                                    onClick={this.cancel}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Dialog
                        hidden={this.state.hideDialog}
                        onDismiss={this.closeDialog}
                        dialogContentProps={{
                            type: DialogType.normal,
                            title: 'Mentor/Mentee Relationship',
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

NewRelationshipPage.propTypes = {
    campusID: PropTypes.string,
    campus: PropTypes.string,
    onMentorDropdownChanged: PropTypes.func,
    onMenteeDropdownChanged: PropTypes.func,
    mentors: PropTypes.array,
    mentees: PropTypes.array,
    cics: PropTypes.array,
    campusCICs: PropTypes.array,
    campusContacts: PropTypes.array,
    timeConfig: PropTypes.object,
    timeConfigurationID: PropTypes.string,
    mentorEmployeeID: PropTypes.string,
    menteeEmployeeID: PropTypes.string,
    relationship: PropTypes.object,
    userProps: PropTypes.object,
    spUserProps: PropTypes.object,
    save: PropTypes.func,
    cancel: PropTypes.func,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campus: state.userProps.user.campusName,
        mentors: state.mentors,
        mentees: state.mentees,
        campusContacts: state.campusContacts,
        userProps: state.userProps,
        spUserProps: state.spUserProps,
        relationship: state.relationship,
        timeConfig: state.timeConfig,
        alreadyExistMentees: state.mentee.alreadyExistMentees
        //campusCICs: teacherFormattedForDropdown(state.cics)
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, relationshipsActions, spUserPropsActions, mentorsActions, menteesActions, adminActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewRelationshipPage);