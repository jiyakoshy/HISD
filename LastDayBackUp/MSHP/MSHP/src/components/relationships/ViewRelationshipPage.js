import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as relationshipsActions from '../../actions/relationshipsActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Utilities from '../../utilities/utilities';
import { teacherFormattedForDropdown } from '../../selectors/selectors';


class ViewRelationshipPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            menteeStartDate: '',
            menteeEndDate: '',
            approvalDate: '',
            deleteBtnVisibility: {visibility: "hidden"},
            approveBtnVisibility: {visibility: "hidden"},
            hideDialog: true,
            dialogAction: '',
            subtext: ''
        };
        this.formatDate = this.formatDate.bind(this);
        this.approve = this.approve.bind(this);
        this.delete = this.delete.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    componentDidMount() {
        const relationshipID = this.props.match.params.MentorMenteeRelationshipID;
        if(!relationshipID){
            this.props.actions.logErrorSuccess('Mentor/Mentee Relationship ID not specified.');
            document.location = "#error";
        }
        else{
            this.props.actions.loadRelationshipByID(relationshipID)
            .then(relationship => this.loadValues());
        }
    }

    loadValues(){
        if(this.props.relationship != null && this.props.relationship.RelationshipStatus == "Pending")
            this.setState({ deleteBtnVisibility: {visibility: "visible"}});
        
        if(this.props.relationship != null && this.props.relationship.RelationshipStatus == "Pending"  && this.props.relationship.MentorAgreement == "Accepted" && this.props.userProps.user.role == 'Principal')
            this.setState({ approveBtnVisibility: {visibility: "visible"}});

        this.setState({menteeStartDate: this.formatDate(this.props.relationship.MenteeLatestHireDate), menteeEndDate: this.formatDate(this.props.relationship.MenteeEndDateInRelationship), approvalDate: this.formatDate(this.props.relationship.ApprovalDate), relationshipStartDate: this.formatDate(this.props.relationship.RelationshipStartDate), relationshipEndDate: this.formatDate(this.props.relationship.RelationshipEndDate)});
    }

    displayMessage(message, action){
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    cancel() {
        document.location = "#relationships";
    }

    okDialog(){
        if(this.state.dialogAction == 'DELETED'){
            this.cancel();
        }
        else if(this.state.dialogAction == 'DELETE'){
            this.deleteRelationship();
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

    approve(){
        alert('Under Construction!')
    }

    delete(){
        this.setState({ subtext: 'Do you want to delete this Mentor/Mentee Relationship?', dialogAction: 'DELETE' });
        this.showDialog();
    }

    deleteRelationship(){
        let promise = this.props.actions.deleteRelationship(this.props.relationshipID);
        promise.then(() => this.displayMessage('Mentor/Mentee Relationship successfully deleted.', 'DELETED'))
        .catch(reason => {
            this.props.actions.ajaxCallError();
            this.displayMessage('There was a problem deleting Mentor/Mentee Relationship. Operation canceled.', '');
        });
    }

    formatDate(date) {
        let formattedDate = Utilities.getDateOnly(date);
        if(formattedDate == "12/31/1969") formattedDate = "";
        return (formattedDate);
    }

    render() {
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="View Mentor/Mentee Relationship" campus={this.props.campus} />
                    <div className="row">
                        <div className="col-md-12 col-lg-8 col-sm-12">
                            <div className="white-box">
                                <form className="form-horizontal" style={{padding: "15px"}}>
                                    <div className="form-group">
                                        <label className="col-md-2 col-lg-2 col-sm-2">Mentor Name</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">{this.props.relationship.MentorName}</div>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Mentor Employee ID</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">{this.props.relationship.MentorEmployeeID}</div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-2 col-lg-2 col-sm-2">Mentee Name</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">{this.props.relationship.MenteeName}</div>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Mentee Employee ID</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">{this.props.relationship.MenteeEmployeeID}</div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-2 col-lg-2 col-sm-2">Mentee Start Date</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">{this.state.menteeStartDate}</div>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Mentee End Date</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">{this.state.menteeEndDate}</div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-2 col-lg-2 col-sm-2">Relationship Status</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">{this.props.relationship.RelationshipStatus}</div>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Principal Approval</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">{this.props.relationship.PrincipalApproval}</div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-2 col-lg-2 col-sm-2">Mentor Agreement</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">{this.props.relationship.MentorAgreement}</div>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Approval Date</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">{this.state.approvalDate}</div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-2 col-lg-2 col-sm-2">Relationship Start Date</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">{this.state.relationshipStartDate}</div>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Relationship End Date</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">{this.state.relationshipEndDate}</div>
                                    </div>
                                    <div className="form-group">
                                        <div className="text-center">
                                            <br />
                                            <PrimaryButton
                                                text="Approve"
                                                onClick={this.approve}
                                                style={this.state.approveBtnVisibility}
                                            />
                                            &nbsp;&nbsp;&nbsp;
                                            <PrimaryButton
                                                text="Close"
                                                onClick={this.cancel}
                                            />
                                            &nbsp;&nbsp;&nbsp;
                                            <DefaultButton
                                                text="Delete"
                                                iconProps={{iconName: "Delete"}}
                                                onClick={this.delete}
                                                style={this.state.deleteBtnVisibility}
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
    params: PropTypes.array
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
    return { actions: bindActionCreators(Object.assign({}, relationshipsActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewRelationshipPage);