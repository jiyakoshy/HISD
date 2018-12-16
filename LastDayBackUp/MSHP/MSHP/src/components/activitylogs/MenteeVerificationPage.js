import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActions from '../../actions/adminActions';
import * as activityLogsActions from '../../actions/activityLogsActions';
import * as sharedActions from '../../actions/sharedActions';
import * as ajaxStatusActions from '../../actions/ajaxStatusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { verificationCodesFormattedForDropdown } from '../../selectors/selectors';
import Utilities from '../../utilities/utilities';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';
import { debuglog } from 'util';

let hasMounted = false;
class MenteeVerificationPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        const activityLogMenteeID = this.props.match.params.ActivityLogMenteeID;
        if(!activityLogMenteeID){
            this.displayMessage('Error: Activity Log Verification ID not specified.', 'CLOSE');
        }
        this.state = {
            activityStartDate: '',
            verificationCodesOption: [],
            verificationCodeID: 0,
            menteeVerificationStatus: '',
            activityLogMentee: {},
            activityStandards: '',
            activityTools: '',
            menteeComments: '',
            code: '',
            description: '',
            status: '',
            isReadOnly: false,
            hideDialog: true,
            dialogAction: '',
            subtext: ''
        };
        this.onChangeCode = this.onChangeCode.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onStatusDropdownChanged = this.onStatusDropdownChanged.bind(this);
        this.onChangeMenteeComments = this.onChangeMenteeComments.bind(this);
        this.onVerificationCodeDropdownChanged = this.onVerificationCodeDropdownChanged.bind(this);

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.onSavingSucceeds = this.onSavingSucceeds.bind(this);
        this.onSavingFails = this.onSavingFails.bind(this);
        hasMounted = false;
    }

    componentDidMount() {
        this.props.actions.loadVerificationCode()
        .then(verificationCode => {            
            this.setState({verificationCodesOptions: verificationCodesFormattedForDropdown(this.props.verificationCode.MultiChoiceListItems)});
        });

        const menteeEmployeeID = this.props.userProps.user.employeeID;
        const activityLogID = this.props.match.params.ActivityLogID;
        const activityLogMenteeID = this.props.match.params.ActivityLogMenteeID;
        this.props.actions.loadActivityLogByID(activityLogID)
        .then(activityLog => { this.loadValues(); });
        hasMounted = true;
    }

    loadValues(){
        let isReadOnly = false;
        const activityLogMentee = this.getActivityLogMentee();
        const activityTools = this.getActivityTools();
        const activityStandards = this.getActivityStandards();
        if(activityLogMentee.MenteeVerificationStatus != undefined && activityLogMentee.MenteeVerificationStatus != '')
            isReadOnly = true;
        const activityStartDate = Utilities.getDateOnly(this.props.activityLog.ActivityStartTime) + " " + Utilities.getTimeOnly(this.props.activityLog.ActivityStartTime);
        this.setState({activityLogMentee: activityLogMentee, activityTools: activityTools, activityStandards: activityStandards, activityStartDate: activityStartDate, menteeVerificationStatus: activityLogMentee.MenteeVerificationStatus, verificationCodeID: this.props.activityLogMentee.MultiChoiceListItemID, isReadOnly: isReadOnly });
    }

    getActivityLogMentee(){
        let activityLogMentee = {};
        const activityLogMenteeID = this.props.match.params.ActivityLogMenteeID;
        const mentees = this.props.activityLog.Mentees;
        $.each(mentees, function (key,obj) {
            if(obj.ActivityLogMenteeID === activityLogMenteeID){
                activityLogMentee = obj;
                return activityLogMentee;
            }
        });
        return activityLogMentee;
    }

    getActivityTools(){
        let activityTools = '';
        const tools = this.props.activityLog.ActivityToolItems;
        $.each(tools, function (key,obj) {
            activityTools += '<div>- ' + obj.ActivityToolItemName + '</div>';
        });
        return activityTools;
    }

    getActivityStandards(){
        let activityStandards = '';
        const standards = this.props.activityLog.ActivityStandardItems;
        $.each(standards, function (key,obj) {
            activityStandards += '<div>- ' + obj.ActivityStandardItemName + '</div>';
        });
        return activityStandards;
    }

    displayMessage(message, action){
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    processSave(activityCode){
        // if(this.props.activityCode.ActivityCodeName && this.props.activityCode.ActivityCodeName == this.state.code){
        //     this.displayMessage('The activity code name "' + this.state.code + '" already exists.', '');
        // }
        // else{
        //     let newActivityCode = {ActivityCodeID: 0, ActivityCodeName: this.state.code, ActivityCodeDescription: this.state.description, Status: Utilities.getBooleanFromText(this.state.status)};
        //     let savePromise = this.props.actions.createActivityCode(newActivityCode);
        //     savePromise.
        //         then((response) => this.onSavingSucceeds(response)).
        //         catch(error => this.onSavingFails());
        // }
    }

    onSavingSucceeds(response){
        // if(this.props.activityCode.ActivityCodeID > 0){
        //     this.displayMessage('Activity code successfully created.', 'CREATED');
        // }
        // else{
        //     this.onSavingFails();
        // }
    }

    onSavingFails(){
        this.props.actions.ajaxCallError();
        this.displayMessage('Error trying to save activity code.');
    }

    save() {
        let newActivityCode = {ActivityCodeName: this.state.code, ActivityCodeDescription: this.state.description, Status: Utilities.getBooleanFromText(this.state.status)};
        if(this.isValidForm(newActivityCode)){
            let checkIfExistsPromise = this.props.actions.loadActivityCodeByName(newActivityCode.ActivityCodeName);
            checkIfExistsPromise.
                then(() => this.processSave()).
                catch(error => this.displayMessage('Error trying to validate activity code.', ''));
        }
    }

    isValidForm(activityCode){
        let isValid = true;
        if(this.state.code.length < 3){
            isValid = false;
            this.displayMessage('Error: Invalid Activity Code Name. It must contain at least three characters', '');
        }
        else if(this.state.description.length < 3){
            isValid = false;
            this.displayMessage('Error: Invalid Activity Code Description. It must contain at least three characters', '');
        }
        else if(this.state.status == ''){
            isValid = false;
            this.displayMessage('Error: Invalid Status. It must be set to "Active" or "Inactive"', '');
        }
        return isValid;
    }

    cancel() {
        document.location = '#activitylogsmentee';
    }

    onStatusDropdownChanged(item) {
        this.setState({ status: item.key });
    }

    onChangeCode(e) {
         this.setState({code: e.target.value});
    }

    onChangeDescription(e) {
         this.setState({description: e.target.value});
    }
    
    onChangeMenteeComments(e) {
        this.setState({menteeComments: e.target.value});
    }

    onVerificationCodeDropdownChanged(item) {
        this.setState({ verificationCodeID: item.key });
    }

    okDialog(){
        if(this.state.dialogAction == 'CREATED'){
            this.cancel();
        }
        else{
            this.closeDialog();
        }        
    }

    showDialog() {
      this.setState({ hideDialog: false });
    }
  
    closeDialog() {
      this.setState({ hideDialog: true });
    }

    render() {
        let statuses = [{key:'Pending', text:'Pending'}, {key:'Yes', text:'Yes'},{key:'No', text:'No'}];
        if(hasMounted === true)
            return (
                <IfAnyGranted expected={['Admin','Mentee']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                    <div id="page-wrapper" style={{paddingTop: "30px"}}>
                        <div className="container-fluid">
                            <PageHeader title="Activity Log Verification" campus={this.props.campus} />
                            <div className="row">
                                <div className="col-md-12 col-lg-12 col-sm-12">
                                    <div className="white-box" style={{paddingTop: '0'}}>
                                        <form className="form-horizontal">
                                            <div className="row">
                                                <div className="col-md-12 col-lg-12 col-sm-12 formSectionTitle">Activity Log Information</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-md-2 col-lg-2 col-sm-2">Mentor Name</label>
                                                <div className="col-md-4 col-lg-4 col-sm-4">{this.props.activityLog.MentorName}</div>
                                                <label className="col-md-2 col-lg-2 col-sm-2">Mentee(s)</label>
                                                <div className="col-md-4 col-lg-4 col-sm-4">{this.props.activityLog.MenteeNames}</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-md-2 col-lg-2 col-sm-2">Activity Code</label>
                                                <div className="col-md-4 col-lg-4 col-sm-4">{this.props.activityLog.ActivityCodeName}</div>
                                                <label className="col-md-2 col-lg-2 col-sm-2">Activity Code Description</label>
                                                <div className="col-md-4 col-lg-4 col-sm-4">{this.props.activityLog.ActivityCodeDescription}</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-md-2 col-lg-2 col-sm-2">Activity Date</label>
                                                <div className="col-md-4 col-lg-4 col-sm-4">{this.state.activityStartDate}</div>
                                                <label className="col-md-2 col-lg-2 col-sm-2">Activity Duration (Minutes)</label>
                                                <div className="col-md-4 col-lg-4 col-sm-4">{this.props.activityLog.Duration}</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-md-2 col-lg-2 col-sm-2">Activity Standards</label>
                                                <div className="col-md-4 col-lg-4 col-sm-4">{this.state.activityStandards}</div>
                                                <label className="col-md-2 col-lg-2 col-sm-2">Activity Tools</label>
                                                <div className="col-md-4 col-lg-4 col-sm-4">{this.state.activityTools}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 col-lg-12 col-sm-12 formSectionTitle">Mentee Verification Information</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-md-2 col-lg-2 col-sm-2">Verification Code</label>
                                                <div className="col-md-4 col-lg-4 col-sm-4">
                                                    <Dropdown placeHolder="Select a Verification Code" value={this.state.verificationCodeID} options={this.state.verificationCodesOptions} onChanged={this.onVerificationCodeDropdownChanged} readOnly={this.state.isReadOnly} />
                                                </div>
                                                <label className="col-md-2 col-lg-2 col-sm-2">Activity Log Verified</label>
                                                <div className="col-md-4 col-lg-4 col-sm-4">
                                                    <Dropdown placeHolder="Select Verification Status" options={statuses} value={this.state.menteeVerificationStatus} onChanged={this.onStatusDropdownChanged} readOnly={this.state.isReadOnly} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-md-2 col-lg-2 col-sm-2">Mentee Comments</label>
                                                <div className="col-md-10 col-lg-10 col-sm-10"><textarea id="menteeComments" className="form-control" type="" value={this.state.menteeComments} onChange={this.onChangeMenteeComments} maxLength={255} readOnly={this.state.isReadOnly} /></div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 col-lg-12 col-sm-12 text-center">
                                                    <PrimaryButton
                                                        text="Save"
                                                        onClick={this.save}
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
                                title: 'Mentee Verification',
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
        else{
            return (<div />);
        }
    }
}

MenteeVerificationPage.propTypes = {
    campus: PropTypes.string,
    code: PropTypes.string,
    description: PropTypes.string,
    mentorTypes: PropTypes.array,
    status: PropTypes.string,
    statuses: PropTypes.array,
    onMentorTypeDropdownChanged: PropTypes.func,
    onStatusDropdownChanged: PropTypes.func,
    onChangeCode: PropTypes.func,
    onChangeDescription: PropTypes.func,
    save: PropTypes.func,
    cancel: PropTypes.func,
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object,
    match: PropTypes.object,
    params: PropTypes.array,
    verificationCode: PropTypes.object,
    activityLog: PropTypes.object,
    activityLogMentee: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campus: state.userProps.user.campusName,
        code: state.code,
        description: state.description,
        status: state.status,
        activityLog: state.activityLog,
        activityLogMentee: state.activityLogMentee,
        verificationCode: state.verificationCode,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, activityLogsActions, adminActions, sharedActions, ajaxStatusActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenteeVerificationPage);