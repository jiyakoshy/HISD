import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as relationshipsActions from '../../actions/relationshipsActions';
import * as sharedActions from '../../actions/sharedActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import * as spUserPropsActions from '../../actions/spUserPropsActions';

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
import If from '../common/If';

//LeaderInfo
import LeaderInfo from '../common/LeaderInfo';

class ViewRelationshipPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            // display fields 
            menteeStartDate: '',
            menteeEndDate: '',
            approvalDate: '',
            relationshipStartDate: '',
            relationshipEndDate: '',
            mentorName: '',
            menteeName: '',
            mentorEmployeeID: '',
            menteeEmployeeID: '',
            melationshipStatus: '',
            principalApproval: '',
            mentorAgreement: '',
            // handles visiblity 
            isPrincipal: false,
            isCIC: false,
            isApprovalPending: false,
            isAdmin: false,
            isRelationshipPending: true,
            isRelationshipInactive: false,
            isMentorAccepted: false,
            isApprovalActionChecked: false,
            isRelationshipActionChecked: false,
            showPrincipalActionOptions: false,

            // handles actions 
            updateBtnVisibility: { visibility: "hidden" },
            hideDialog: true,
            dialogAction: '',
            subtext: ''
        };
        this.onApprovalStatusDropdownChanged = this.onApprovalStatusDropdownChanged.bind(this);
        this.onRelationshipStatusDropdownChanged = this.onRelationshipStatusDropdownChanged.bind(this);
        this.handleActionOptionChanged = this.handleActionOptionChanged.bind(this);
        this.processUpdate = this.processUpdate.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.update = this.update.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    componentDidMount() {
        const relationshipID = this.props.match.params.MentorMenteeRelationshipID;
        if (!relationshipID) {
            this.props.actions.logErrorSuccess('Mentor/Mentee Relationship ID not specified.');
            document.location = "#error";
        }
        else {
            this.props.actions.loadRelationshipByID(relationshipID)
                .then(relationship => this.loadValues());
        }
    }

    loadValues() {
        if (this.props.relationship != null && this.props.relationship.RelationshipStatus != "Inactive")
            this.setState({ updateBtnVisibility: { visibility: "visible" } });

        // user: CIC: NO action on Approval; Relationship Status ==> ???
        if (this.props.userProps.user.role == 'CIC') {
            this.setState({ isCIC: true });
            if (this.props.relationship.RelationshipStatus == "Inactive") {
                this.setState({ isRelationshipInactive: true });
            }
        }

        // user: Principal: Actions on Approval; Relationship Status ==> ???
        if (this.props.userProps.user.role == 'Principal') {
            this.setState({ isPrincipal: true });
            if (this.props.relationship.RelationshipStatus != "Inactive") {
                if (this.props.relationship.MentorAgreement == "Accepted") {
                    if (this.props.relationship.PrincipalApproval == "Pending") {
                        // active both approval and relationship status actions
                        this.setState({ isApprovalActionChecked: true });
                        this.setState({ showPrincipalActionOptions: true });
                        this.setState({ isApprovalPending: true });
                        this.setState({ isMentorAccepted: true });
                    }
                    if (this.props.relationship.PrincipalApproval != "Pending") {
                        // only relationship status action
                        this.setState({ isApprovalActionChecked: true });
                        this.setState({ showPrincipalActionOptions: false });
                    }
                }

                if (this.props.relationship.MentorAgreement == "Pending") {
                    // active only relationship status action   (same for CIC/Admin/Principal)
                    this.setState({ showPrincipalActionOptions: false });
                    this.setState({ isMentorAccepted: false });
                }
            }

            if (this.props.relationship.RelationshipStatus == "Inactive") {
                this.setState({ isRelationshipInactive: true });
            }
        }
        // user: Admin
        if (this.props.userProps.user.role == 'Admin') {
            this.setState({ isAdmin: true });
            if (this.props.relationship.RelationshipStatus == "Inactive") {
                this.setState({ isRelationshipInactive: true });
            }
        }
        this.setState({
            menteeStartDate: this.formatDate(this.props.relationship.MenteeLatestHireDate),
            menteeEndDate: this.formatDate(this.props.relationship.MenteeEndDate),
            approvalDate: this.formatDate(this.props.relationship.ApprovalDate),
            relationshipStartDate: this.formatDate(this.props.relationship.RelationshipStartDate),
            relationshipEndDate: this.formatDate(this.props.relationship.RelationshipEndDate),
            mentorName: this.props.relationship.MentorName, menteeName: this.props.relationship.MenteeName,
            mentorEmployeeID: this.props.relationship.MentorEmployeeID, menteeEmployeeID: this.props.relationship.MenteeEmployeeID,
            relationshipStatus: this.props.relationship.RelationshipStatus, principalApproval: this.props.relationship.PrincipalApproval,
            mentorAgreement: this.props.relationship.MentorAgreement
        });
    }

    displayMessage(message, action) {
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    cancel() {
        document.location = "#relationships";
    }

    okDialog() {
        if (this.state.dialogAction == 'DELETED') {
            this.cancel();
        }
        else if (this.state.dialogAction == 'DELETE') {
            this.deleteRelationship();
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
        if (this.state.dialogAction == 'UPDATED') {
            this.cancel();
        }
    }
    // radio button event handler 
    handleActionOptionChanged(changeEvent) {
        if (changeEvent.target.value == "approvalAction") {
            this.setState({ isApprovalActionChecked: true });
            this.setState({ isRelationshipActionChecked: false });
        }
        if (changeEvent.target.value == "relationshipAction") {
            this.setState({ isApprovalActionChecked: false });
            this.setState({ isRelationshipActionChecked: true });
        }
    }

    onApprovalStatusDropdownChanged(item) {
        this.setState({ principalApproval: item.key });
    }

    onRelationshipStatusDropdownChanged(item) {
        this.setState({ relationshipStatus: item.key });
    }
    // -------------------- accept block --------------
    onUpdatingSucceeds(response) {
        this.props.actions.loadRelationshipByID(this.props.match.params.MentorMenteeRelationshipID)
            .then(relationship => {
                this.loadValues();
                this.displayMessage('Mentor/Mentee Relationship successfully updated.', '');
                let relationshiprequest = {};
                relationshiprequest.RelationshipID = this.props.match.params.MentorMenteeRelationshipID;
                relationshiprequest.WebServiceURL = process.env.REST_URL;
                relationshiprequest.PrincipalApproval = this.state.principalApproval;
                relationshiprequest.RelationshipStatus = this.state.relationshipStatus;

                 if (this.props.userProps.user.role == "Principal") {
                    if (this.state.principalApproval != this.props.relationship.PrincipalApproval) {
                        //call SP List Update for prinicpalApproval method
                        let requestPromise = this.props.actions.updatePrincipalApprovalRequest(relationshiprequest);
                        requestPromise.then(() => this.displayMessage('Your action on Principal Approval has been updated && Mentor/Mentee Relationship is been Processed...', 'UPDATED'))
                            .catch(error => this.onUpdatingRequestFailed());
                    }
                    if (this.state.relationshipStatus != this.props.relationship.RelationshipStatus) {
                        // call SP List Update for relationship method
                        let requestPromise = this.props.actions.updateRelationStatusRequest(relationshiprequest);
                        requestPromise.then(() => this.displayMessage('Your action on Relationship Status Change has been updated && Mentor/Mentee Relationship is been Processed...', 'UPDATED'))
                            .catch(error => this.onUpdatingRequestFailed());
                    }
                }

                else {
                    // Admin/CIC
                    //call SP List Update for relationship method 
                    let requestPromise = this.props.actions.updateRelationStatusRequest(relationshiprequest);
                    requestPromise.then(() => this.displayMessage('Your action on Relationship Status Change has been updated && Mentor/Mentee Relationship is been Processed...', 'UPDATED'))
                        .catch(error => this.onUpdatingRequestFailed());
                }
            }
            );

    }

    processUpdate() {
        // relationship id:(MentorMenteeRelationshipID) to update 
        let relationship = {
            MentorMenteeRelationshipID: this.props.match.params.MentorMenteeRelationshipID,
            /*MentorEmployeeID: this.props.relationship.MentorEmployeeID, 
            MenteeEmployeeID: this.props.relationship.MenteeEmployeeID,  
            MentorAgreement: this.props.relationship.MentorAgreement, 
            CampusID: this.props.relationship.EducationOrgNaturalKey,*/
            RelationshipStatus: this.state.relationshipStatus,
            PrincipalApproval: this.state.principalApproval
        };
       let updatePromise = this.props.actions.updateRelationship(relationship);
        updatePromise.then((response) => this.onUpdatingSucceeds(response)).
            catch(error => {
               this.onUpdatingFails();
            });
    }

    onUpdatingFails() {
        this.props.actions.ajaxCallError();
        this.displayMessage('Error trying to update Mentor/Mentee Relationship.');
    }

    onUpdatingRequestFailed() {
        this.props.actions.ajaxCallError();
        this.displayMessage('ERROR: Mentor/Mentee Relationship Principal Approval/Relationship Status Change Process FAILED to be Updated. Please contact your System Administrator', 'UPDATED');
    }

    update() {
         if ((this.props.userProps.user.role == 'CIC' || this.props.userProps.user.role == 'Admin')
            && this.state.relationshipStatus == 'Pending') {
            alert('Opps..! Update triggers only selection of Status: Inactive');
        }
        // Role: Principal ==> action allowed for both Principal Approval and Relationship Status
        else if (this.props.userProps.user.role == 'Principal' &&
            (this.state.principalApproval == 'Pending' && this.state.relationshipStatus == 'Pending')) {
            alert('Opps..! Update triggers only selection as Accept Or Reject');
        }
        else {
            this.processUpdate();
        }
    }

    delete() {
        this.setState({ subtext: 'Do you want to delete this Mentor/Mentee Relationship?', dialogAction: 'DELETE' });
        this.showDialog();
    }

    deleteRelationship() {
        let promise = this.props.actions.deleteRelationship(this.props.relationshipID);
        promise.then(() => this.displayMessage('Mentor/Mentee Relationship successfully deleted.', 'DELETED'))
            .catch(reason => {
                this.props.actions.ajaxCallError();
                this.displayMessage('There was a problem deleting Mentor/Mentee Relationship. Operation canceled.', '');
            });
    }

    formatDate(date) {
        let formattedDate = Utilities.getDateOnly(date);
        if (formattedDate == "12/31/1969") formattedDate = "";
        return (formattedDate);
    }

    principalApprovalFormat(){
        if(this.state.principalApproval == ''){
            return 'Pending';
        }else { return this.state.principalApproval;}
    }


    render() {
        // dropdowns
        let approvalStatuses = [{ key: 'Pending', text: 'Pending' }, { key: 'Approved', text: 'Approve' }, { key: 'Declined', text: 'Decline' }];
        let relationshipStatuses = [{ key: 'Inactive', text: 'Inactive' }];
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="View Mentor/Mentee Relationship" campus={this.props.campus} />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <LeaderInfo />
                            <div className="white-box">
                                <form className="form-horizontal" style={{ padding: "15px" }}>
                                    <div className="form-group">
                                        <label className="col-md-3 col-lg-3 col-sm-3">Mentor Name </label>
                                        <div className="col-md-9 col-lg-9 col-sm-9">{this.state.mentorName}</div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 col-lg-3 col-sm-3">Mentor Employee ID</label>
                                        <div className="col-md-4 col-lg-4 col-sm-9">{this.state.mentorEmployeeID}</div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 col-lg-3 col-sm-3">Mentee Name</label>
                                        <div className="col-md-9 col-lg-9 col-sm-9">{this.state.menteeName}</div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 col-lg-3 col-sm-3">Mentee Employee ID</label>
                                        <div className="col-md-9 col-lg-9 col-sm-9">{this.state.menteeEmployeeID}</div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 col-lg-3 col-sm-3">Mentee Start Date</label>
                                        <div className="col-md-9 col-lg-9 col-sm-9">{this.state.menteeStartDate}</div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 col-lg-3 col-sm-3">Mentee End Date</label>
                                        <div className="col-md-3 col-lg-3 col-sm-3">{Utilities.getFormattedDate(this.state.menteeStartDate)}</div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 col-lg-3 col-sm-3">Mentor Agreement</label>
                                        <div className="col-md-9 col-lg-9 col-sm-9">{this.state.mentorAgreement}</div>
                                    </div>
                                    {/* role: CIC,
                                    - No action on Princiapl Approval
                                    - Mentor Acceptance: YES/NO ==> Princiapl approval as static value
                                    - Relatinship Status -???
                                    <div> {this.state.isCIC && !this.state.isRelationshipInactive &&
                                        <div className="form-group">
                                            <label className="col-md-3 col-lg-3 col-sm-3">Principal Approval</label>
                                            <div className="col-md-9 col-lg-9 col-sm-9">{this.state.principalApproval}</div>
                                        </div>
                                    }</div>

                                    { role: Admin,
                                    - No action on Princiapl Approval
                                    - Mentor Acceptance: YES/NO ==> Princiapl approval as static value
                                    - Relatinship Status -???
                                    <div> {this.state.isAdmin && !this.state.isRelationshipInactive &&
                                        <div className="form-group">
                                            <label className="col-md-3 col-lg-3 col-sm-3">Principal Approval</label>
                                            <div className="col-md-9 col-lg-9 col-sm-9">{this.state.principalApproval}</div>
                                        </div>
                                    }</div>*/}

                                    {/* role: CIC/Principal/Admin,
                                    - Inactive Relationship: "ALL ACTIONS ARE FREEZED FOR EVERYONE"
                                    - No action on Princiapl Approval when Relationship Status == Inactive*/}
                                    <div> {(this.state.isAdmin || this.state.isCIC || this.state.isPrincipal)
                                        && this.state.isRelationshipInactive &&
                                        <div className="form-group">
                                            <label className="col-md-3 col-lg-3 col-sm-3">Principal Approval</label>
                                            <If test={!this.state.principalApproval}>
                                                <div className="col-md-9 col-lg-9 col-sm-9">Pending</div>
                                            </If>
                                            <If test={this.state.principalApproval}>
                                                <div className="col-md-9 col-lg-9 col-sm-9">{this.state.principalApproval}</div>
                                            </If>
                                        </div>
                                    }</div>

                                    {/* role: CIC/Admin,
                                    - No action on Princiapl Approval when Relationship Status != Inactive*/}
                                    <div> {(this.state.isAdmin || this.state.isCIC)
                                        && !this.state.isRelationshipInactive &&
                                        <div className="form-group">
                                            <label className="col-md-3 col-lg-3 col-sm-3">Principal Approval</label>
                                            <If test={!this.state.principalApproval}>
                                                <div className="col-md-9 col-lg-9 col-sm-9">Pending</div>
                                            </If>
                                            <If test={this.state.principalApproval}>
                                                <div className="col-md-9 col-lg-9 col-sm-9">{this.state.principalApproval}</div>
                                            </If>
                                        </div>
                                    }</div>                                                                 
                                    {/* role: principal, 
                                    - Mentor Acceptance: NO ==> PENDING as static value</P> 
                                    - Principal Approval: Approved/Declined ==> no action on Princiapl approval*/}
                                    <div> {this.state.isPrincipal && !this.state.isRelationshipInactive
                                        && !this.state.isMentorAccepted && !this.state.isApprovalPending &&
                                        <div className="form-group">
                                            <label className="col-md-3 col-lg-3 col-sm-3">Principal Approval</label>
                                            <If test={!this.state.principalApproval}>
                                                <div className="col-md-9 col-lg-9 col-sm-9">Pending</div>
                                            </If>
                                            <If test={this.state.principalApproval}>
                                                <div className="col-md-9 col-lg-9 col-sm-9">{this.state.principalApproval}</div>
                                            </If>
                                        </div>
                                    }</div>

                                    {/* role: principal, 
                                    - Mentor Acceptance: YES, Princiapl Approval:PENDING ==> show the dropdown 
                                    - RelationshipStatus: Inactive ==> No action is allowed }
                                    <div> {this.state.isPrincipal && !this.state.isRelationshipInactive
                                           && this.state.isMentorAccepted && this.state.isApprovalPending  &&
                                        <div className="form-group">
                                            <label className="col-md-3 col-lg-3 col-sm-3">Principal Approval</label>
                                            <div>
                                                <Dropdown placeHolder="Select a Status" options={approvalStatuses} onChanged={this.onApprovalStatusDropdownChanged} selectedKey={this.state.principalApproval} />
                                            </div>
                                        </div>
                                    }</div>*/}

                                    <div> {this.state.isPrincipal && !this.state.isRelationshipInactive
                                        && this.state.isApprovalPending && this.state.showPrincipalActionOptions &&
                                        <div className="form-group">
                                            <label className="col-md-3 col-lg-3 col-sm-3">Actions</label>
                                            <div className="col-md-9 col-lg-9 col-sm-9">
                                                <input type="radio" value="approvalAction" name="radioButton" checked={this.state.isApprovalActionChecked} onChange={this.handleActionOptionChanged} /> Principal Approval
                                            <br />
                                                <input type="radio" value="relationshipAction" name="radioButton" checked={this.state.isRelationshipActionChecked} onChange={this.handleActionOptionChanged} /> Relationship Status</div>
                                        </div>
                                    }</div>

                                    {/* role: principal, 
                                    - Mentor Acceptance: YES, Princiapl Approval:PENDING ==> show the dropdown 
                                    - RelationshipStatus: Inactive ==> No action is allowed */}
                                    <div> {this.state.isPrincipal && !this.state.isRelationshipInactive
                                        && this.state.isApprovalPending && this.state.isMentorAccepted && this.state.isApprovalActionChecked &&
                                        <div className="form-group">
                                            <label className="col-md-3 col-lg-3 col-sm-3">Principal Approval</label>
                                            <div>
                                                <Dropdown placeHolder="Select a Status" options={approvalStatuses} onChanged={this.onApprovalStatusDropdownChanged} selectedKey={this.state.principalApproval} />
                                            </div>
                                        </div>
                                    }</div>

                                    <div> {this.state.approvalDate != '' &&
                                        <div className="form-group">
                                            <label className="col-md-3 col-lg-3 col-sm-3">Approval Date</label>
                                            <div className="col-md-9 col-lg-9 col-sm-9">{this.state.approvalDate}</div>
                                        </div>
                                    }</div>

                                    <div className="form-group">
                                        <label className="col-md-3 col-lg-3 col-sm-3">Relationship Start Date</label>
                                        <div className="col-md-9 col-lg-9 col-sm-9">{this.state.relationshipStartDate}</div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 col-lg-3 col-sm-3">Relationship End Date</label>
                                        <div className="col-md-9 col-lg-9 col-sm-9">{this.state.relationshipEndDate}</div>
                                    </div>

                                    {/* role: Admin/Principal/CIC, 
                                    - Mentor Acceptance: NO/YES, Princiapl Approval:Pending/Accepted/Rejected
                                    - RelationshipStatus  == Inactive ==> show static Relationship status - no aciotn is allowed */}
                                    <div> {(this.state.isAdmin || this.state.isPrincipal || this.state.isCIC)
                                        && !this.state.isRelationshipInactive &&
                                        <div className="form-group">
                                            <label className="col-md-3 col-lg-3 col-sm-3">Current Relationship Status</label>
                                            <div className="col-md-9 col-lg-9 col-sm-9"><p style={{ color: 'black', backgroundColor: "#8CC152", fontWeight: 'bold' }}>{this.state.relationshipStatus}</p></div>
                                        </div>
                                    }</div>


                                    {/* role: Admin/Principal/CIC, 
                                    - Mentor Acceptance: NO/YES, Princiapl Approval:Pending/Accepted/Rejected
                                    - RelationshipStatus  == Inactive ==> show static Relationship status - no aciotn is allowed */}
                                    <div> {(this.state.isAdmin || this.state.isPrincipal || this.state.isCIC)
                                        && this.state.isRelationshipInactive &&
                                        <div className="form-group">
                                            <label className="col-md-3 col-lg-3 col-sm-3">Current Relationship Status</label>
                                            <div className="col-md-9 col-lg-9 col-sm-9"><p style={{ color: 'black', backgroundColor: "#E9573F", fontWeight: 'bold' }}>{this.state.relationshipStatus}</p></div>
                                        </div>
                                    }</div>

                                    {/* role: Admin/CIC, 
                                    - Mentor Acceptance: NO/YES, Princiapl Approval:Pending/Accepted/Rejected
                                    - RelationshipStatus  != Inactive ==> show dropdown slections and aciotn is allowed */}
                                    <div> {(this.state.isAdmin || this.state.isCIC)
                                        && !this.state.isRelationshipInactive &&
                                        <div className="form-group">
                                            <label className="col-md-3 col-lg-3 col-sm-3">Relationship Status</label>
                                            <div>
                                                <Dropdown placeHolder="Select for Inactivation" options={relationshipStatuses} onChanged={this.onRelationshipStatusDropdownChanged} selectedKey={this.state.relationshipStatus} />
                                            </div>
                                        </div>
                                    }</div>

                                    {/* role: Admin/Principal/CIC, 
                                    - Mentor Acceptance: NO/YES, Princiapl Approval:Pending/Accepted/Rejected
                                    - RelationshipStatus  != Inactive ==> show dropdown slections and aciotn is allowed */}
                                    <div> {this.state.isPrincipal && !this.state.isRelationshipInactive
                                        && !this.state.isMentorAccepted &&
                                        <div className="form-group">
                                            <label className="col-md-3 col-lg-3 col-sm-3">Relationship Status</label>
                                            <div>
                                                <Dropdown placeHolder="Select for Inactivation" options={relationshipStatuses} onChanged={this.onRelationshipStatusDropdownChanged} selectedKey={this.state.relationshipStatus} />
                                            </div>
                                        </div>
                                    }</div>



                                    {/* role: Admin/Principal/CIC, 
                                    - Mentor Acceptance: NO/YES, Princiapl Approval:Pending/Accepted/Rejected
                                    - RelationshipStatus  != Inactive ==> show dropdown slections and aciotn is allowed */}
                                    <div> {this.state.isPrincipal && !this.state.isRelationshipInactive
                                        && this.state.isRelationshipActionChecked &&
                                        <div className="form-group">
                                            <label className="col-md-3 col-lg-3 col-sm-3">Relationship Status</label>
                                            <div>
                                                <Dropdown placeHolder="Select for Inactivation" options={relationshipStatuses} onChanged={this.onRelationshipStatusDropdownChanged} selectedKey={this.state.relationshipStatus} />
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
                                            &nbsp;&nbsp;&nbsp;
                                            <PrimaryButton
                                                text="Update"
                                                onClick={this.update}
                                                style={this.state.updateBtnVisibility}
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
        );
    }
}

ViewRelationshipPage.propTypes = {
    campusID: PropTypes.string,
    campus: PropTypes.string,
    relationshipID: PropTypes.string,
    relationship: PropTypes.object,
    userProps: PropTypes.object,
    cancel: PropTypes.func,
    actions: PropTypes.object.isRequired,
    match: PropTypes.object,
    params: PropTypes.array,
    onApprovalStatusDropdownChanged: PropTypes.func,
    onRelationshipStatusDropdownChanged: PropTypes.func,
    updateRelationship: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campus: state.userProps.user.campusName,
        userProps: state.userProps,
        relationshipID: ownProps.match.params.MentorMenteeRelationshipID,
        relationship: state.relationship
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, relationshipsActions, ajaxActions, sharedActions, spUserPropsActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewRelationshipPage);