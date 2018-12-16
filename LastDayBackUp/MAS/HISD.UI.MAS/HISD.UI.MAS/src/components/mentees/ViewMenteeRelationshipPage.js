import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//actions
import * as mentorsActions from '../../actions/mentorsActions';
import * as menteesActions from '../../actions/menteesActions';
import * as campusActions from '../../actions/campusActions';
import * as relationshipsActions from '../../actions/relationshipsActions';
import * as sharedActions from '../../actions/sharedActions';
import * as staffActions from '../../actions/staffActions';
import * as adminActions from '../../actions/adminActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
//LeaderInfo
import LeaderInfo from '../common/LeaderInfo';

import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Utilities from '../../utilities/utilities';
import { teacherFormattedForDropdown } from '../../selectors/selectors';
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import 'draft-js-import-html';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';
import Config from '../../api/config';
import Spinner from '../common/Spinner';

class ViewMenteeRelationshipPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        const menteeEmpID = this.props.match.params.StaffNaturalKey;
        if (!menteeEmpID) {
            this.props.actions.logErrorSuccess('Employee ID not specified.');
            document.location = "#error";
        }
        this.state = {
            //agreement actions conditions
            acpChecked: false,
            certificaitonChecked: false,
            acceptedBtnVisibility: { visibility: "hidden" },
            isAgreementHidden: true,
            isMentor: false,
            isPending: false,
            isRelationshipInactive: false,
            // display fields
            MenteeName: '',
            MenteeEmployeeID: '',
            MenteeEmailAddress: '',
            Department: '',
            MenteeOneSourceTitle: '',
            MenteeACP: '',
            MetnorName: '',
            MentorEmailAddress: '',
            MentorAgreement: '',
            MentorAgreementMessage: '',
            code: '',
            // Relationship Info
            MentorMenteeRelationshipID: '',
            // Dialog Messages 
            hideDialog: true,
            dialogAction: '',
            subtext: ''

        };
        this.onStatusDropdownChanged = this.onStatusDropdownChanged.bind(this);
        this.onUpdatingSucceeds = this.onUpdatingSucceeds.bind(this);
        this.onUpdatingFails = this.onUpdatingFails.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        this.onUpdatingRequestFailed = this.onUpdatingRequestFailed.bind(this);

        this.accept = this.accept.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    componentDidMount() {
        const userRole = this.props.userProps.user.role;
        const siteContentCode = "Agreement";
        const menteeEmpID = this.props.match.params.StaffNaturalKey; //this.props.match.params.MenteeEmployeeID;
        const campusID = this.props.userProps.user.campusID;
        this.props.actions.loadMenteeRelationshipProfileByEmployeeID(menteeEmpID).then(mentee => this.loadValues());
        if (userRole == "Mentor") {
            this.props.actions.loadSiteContentByCode(siteContentCode)
                .then(siteContent => {
                    this.setState({ code: this.props.siteContent.value[0].SiteContentCode, MentorAgreementMessage: this.props.siteContent.value[0].SiteContentDescription });
                    this.setState({ isAgreementHidden: !this.state.isAgreementHidden });
                    this.setState({ isMentor: true });
                });
        }
    }

    loadValues() {
        if (this.props.mentee != null && this.props.mentee.MenteeCertificationStatus == "Y")
            this.setState({ certificaitonChecked: true });
        // set ACP and div visibility
        if (this.props.mentee != null && this.props.mentee.MenteeCertificationStatus == "N") {
            this.setState({ acpChecked: true });
            //this.setState({ isHidden: !this.state.isHidden });
        }
        /*if(this.props.relationship != null && this.props.relationship.RelationshipStatus == "Pending")
         this.setState({ deleteBtnVisibility: {visibility: "visible"}});*/
        if (this.props.mentee != null && this.props.mentee.MentorAgreement == "Pending"
            && this.props.userProps.user.role == 'Mentor') {
            this.setState({ acceptedBtnVisibility: { visibility: "visible" } });
            this.setState({ isPending: true });
        }

        if (this.props.mentee.RelationshipStatus == "Inactive") {
            this.setState({ isRelationshipInactive: true });
            this.setState({ acceptedBtnVisibility: { visibility: "hidden" } });
        }

        this.setState({
            MenteeName: this.props.mentee.MenteeName, MenteeEmployeeID: this.props.mentee.MenteeEmployeeID, MenteeEmailAddress: this.props.mentee.MenteeEmailAddress,
            Department: this.props.mentee.Department, MenteeOneSourceTitle: this.props.mentee.MenteeOneSourceTitle, MenteeACP: this.props.mentee.MenteeACP,
            MetnorName: this.props.mentee.MetnorName, MentorEmailAddress: this.props.mentee.MentorEmailAddress, MentorAgreement: this.props.mentee.MentorAgreement,
            MentorMenteeRelationshipID: this.props.mentee.MentorMenteeRelationshipID,
            RelationshipStatus: this.props.mentee.RelationshipStatus
        });
        let relationship = {};
        relationship.RelationshipID = this.props.mentee.MentorMenteeRelationshipID;
        this.props.actions.updateRelationshipRequest(relationship);
    }

    cancel() {
        document.location = '#mentees';
    }

    okDialog() {
        this.closeDialog();
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
        if (this.state.dialogAction == 'UPDATED') {
            this.cancel();
        }
    }

    onStatusDropdownChanged(item) {
        this.setState({ MentorAgreement: item.key });
    }

    onUpdatingRequestFailed() {
        this.props.actions.ajaxCallError();
        this.displayMessage('ERROR: Mentor/Mentee Relationship Mentor Agreement Accept Process FAILED to be Updated. Please contact your System Administrator', 'UPDATED');
    }
    // -------------------- accept block --------------
    onUpdatingSucceeds(response) {

    }

    onUpdatingFails() {
        this.props.actions.ajaxCallError();
        this.displayMessage('Error trying to update Mentor/Mentee Relationship.');
    }

    processAccept() {
        window.open(Config.MentorAcceptanceTask + this.props.taskid, '_blank');
    }
    // -------------------- End of accept block ----------

    accept() {
        //alert('Mentor Agreement Accept is under Construction!');
        // Do Upadate the SharePoint List Row: Mentor Agreement Status and Send Emails
        if (this.state.MentorAgreement == 'Pending') {
            this.processAccept();
        }
    }

    render() {
        let statuses = [{ key: 'Pending', text: 'Pending' }, { key: 'Accepted', text: 'Accept' }, { key: 'Rejected', text: 'Reject' }];
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="View Mentee Relationship Profile" campus={this.props.campus} />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <LeaderInfo />
                        </div>
                    </div>

                    <div className="dashboard-box">
                        <div className="row">
                            <div className="col-md-6 col-lg-6 col-sm-12 pull-center">
                                <div className="white-box">
                                    <h3>Relationship </h3>
                                    {
                                        (this.state.MenteeName != '') ?
                                            (

                                                <form className="form-horizontal" style={{ padding: "5px" }}>
                                                    <div className="form-group">
                                                        <label className="col-md-4 col-lg-4 col-sm-4">Relationship Status</label>
                                                        <div> {this.state.RelationshipStatus == "Inactive" &&
                                                            <div className="col-md-8 col-lg-8 col-sm-8"><p style={{ color: 'black', backgroundColor: "#E9573F", fontWeight: 'bold' }}>{this.state.RelationshipStatus}</p></div>
                                                        }</div>
                                                        <div> {this.state.RelationshipStatus == "Active" &&
                                                            <div className="col-md-8 col-lg-8 col-sm-8"><p style={{ color: 'black', backgroundColor: "#8CC152", fontWeight: 'bold' }}>{this.state.RelationshipStatus}</p></div>
                                                        }</div>
                                                        <div> {this.state.RelationshipStatus == "Pending" &&
                                                            <div className="col-md-8 col-lg-8 col-sm-8"><p style={{ color: 'black', backgroundColor: "yellow", fontWeight: 'bold' }}>{this.state.RelationshipStatus}</p></div>
                                                        }</div>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="col-md-4 col-lg-4 col-sm-4">Mentee Name</label>
                                                        <div className="col-md-8 col-lg-8 col-sm-8">{this.state.MenteeName}</div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-md-4 col-lg-4 col-sm-4">Employee ID</label>
                                                        <div className="col-md-8 col-lg-8 col-sm-8">{this.state.MenteeEmployeeID}</div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-md-4 col-lg-4 col-sm-4">Email Address</label>
                                                        <div className="col-md-8 col-lg-8 col-sm-8">{this.state.MenteeEmailAddress}</div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-md-4 col-lg-4 col-sm-4">Department</label>
                                                        <div className="col-md-8 col-lg-8 col-sm-8">{this.state.Department}</div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-md-4 col-lg-4 col-sm-4">One Source Title</label>
                                                        <div className="col-md-8 col-lg-8 col-sm-8">{this.state.MenteeOneSourceTitle}</div>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="col-md-4 col-lg-4 col-sm-4">Certification Status</label>
                                                        <div className="col-md-8 col-lg-8 col-sm-8">
                                                            <input type="radio" value="Certified" name="radioButton" checked={this.state.certificaitonChecked} /> Certified
                                                    <br />
                                                            <input type="radio" value="ACP" name="radioButton" checked={this.state.acpChecked} /> ACP</div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-md-4 col-lg-4 col-sm-4">Mentor Name</label>
                                                        <div className="col-md-8 col-lg-8 col-sm-8">{this.state.MetnorName}</div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="col-md-4 col-lg-4 col-sm-4">Mentor Email Address</label>
                                                        <div className="col-md-8 col-lg-8 col-sm-8">{this.state.MentorEmailAddress}</div>
                                                    </div>
                                                    <div> {this.state.isMentor && this.state.isPending && !this.state.isRelationshipInactive &&
                                                        <div className="form-group">
                                                            <label className="col-md-4 col-lg-4 col-sm-4">Mentor Agreement</label>
                                                            <div className="col-md-8 col-lg-8 col-sm-8">
                                                                <PrimaryButton text="Accept Mentor Agreement" onClick={this.accept}
                                                                    style={this.state.acceptedBtnVisibility} />
                                                            </div>
                                                        </div>
                                                    }</div>

                                                    <div> {this.state.MentorAgreement === 'Accepted' &&
                                                        <div className="form-group">
                                                            <label className="col-md-4 col-lg-4 col-sm-4">Mentor Agreement</label>
                                                            <div className="col-md-8 col-lg-8 col-sm-8"><p style={{ color: 'black', backgroundColor: "#8CC152", fontWeight: 'bold' }}>{this.state.MentorAgreement}</p></div>
                                                        </div>
                                                    }</div>

                                                    <div> {this.state.MentorAgreement === 'Rejected' &&
                                                        <div className="form-group">
                                                            <label className="col-md-4 col-lg-4 col-sm-4">Mentor Agreement</label>
                                                            <div className="col-md-8 col-lg-8 col-sm-8"><p style={{ color: 'black', backgroundColor: "#FF0000", fontWeight: 'bold' }}>{this.state.MentorAgreement}</p></div>
                                                        </div>
                                                    }</div>
                                                    <div> {!this.state.isMentor && this.state.MentorAgreement === 'Pending' &&
                                                        <div className="form-group">
                                                            <label className="col-md-4 col-lg-4 col-sm-4">Mentor Agreement</label>
                                                            <div className="col-md-8 col-lg-8 col-sm-8"><p style={{ color: 'black', backgroundColor: "yellow", fontWeight: 'bold' }}>{this.state.MentorAgreement}</p></div>
                                                        </div>
                                                    }</div>
                                                    <div> {this.state.isMentor && this.state.isPending && !this.state.isRelationshipInactive &&
                                                        <div className="form-group">
                                                            <div className="col-md-12 col-lg-12 col-sm-12">
                                                                <span style={{ color: 'red' }}>Mentor Agreement is Pending. Please click on Accept Mentor Agreement button to Accept / Reject the relationship.</span>
                                                            </div>
                                                        </div>
                                                    }</div>

                                                    <div className="form-group">
                                                        <div className="text-left">
                                                            <br />
                                                            <PrimaryButton
                                                                text="Close"
                                                                onClick={this.cancel}
                                                            />
                                                            {/* web provision for Mentor Agreement Accept/Reject*/}
                                                            &nbsp;&nbsp;&nbsp;

                                            </div>
                                                    </div>
                                                </form>
                                            ) :
                                            (
                                                <Spinner />
                                            )
                                    }



                                </div>
                            </div>

                            <div className="col-md-6 col-lg-6 col-sm-12">{!this.state.isAgreementHidden &&
                                <div className="white-box-scroll">
                                    <h3>Agreement</h3>
                                    <div dangerouslySetInnerHTML={{ __html: this.state.MentorAgreementMessage }} />
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
                <Dialog
                    hidden={this.state.hideDialog}
                    onDismiss={this.closeDialog}
                    dialogContentProps={{
                        type: DialogType.normal,
                        title: 'Mentee Relationship Profile',
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
        );
    }
}

ViewMenteeRelationshipPage.propTypes = {
    campusID: PropTypes.string,
    campus: PropTypes.string,
    mentee: PropTypes.object,
    siteContent: PropTypes.object,
    //status: PropTypes.bool,
    MentorAgreement: PropTypes.string,
    statuses: PropTypes.array,
    userProps: PropTypes.object,
    cancel: PropTypes.func,
    match: PropTypes.object,
    params: PropTypes.array,
    onStatusDropdownChanged: PropTypes.func,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campus: state.userProps.user.campusName,
        userProps: state.userProps,
        menteeEmpID: ownProps.match.params.StaffNaturalKey,
        mentee: state.mentee,
        siteContent: state.siteContent,
        taskid: state.taskID
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, menteesActions, mentorsActions, campusActions, relationshipsActions, sharedActions, staffActions, adminActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewMenteeRelationshipPage);

