import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//actions
import * as mentorsActions from '../../actions/mentorsActions';
import * as campusActions from '../../actions/campusActions';
import * as relationshipsActions from '../../actions/relationshipsActions';
import * as sharedActions from '../../actions/sharedActions';
import * as staffActions from '../../actions/staffActions';
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

import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class ViewMentorProfilePage extends React.Component {

    constructor(props, context) {
        super(props, context);
        const mentorEmpID = this.props.match.params.StaffNaturalKey;
        if(!mentorEmpID){
            this.props.actions.logErrorSuccess('Employee ID not specified.');
            document.location = "#error";
        }
        this.state = {
            isReadOnly: false,
            MentorName: '',
            EmployeeID: '',
            EmailAddress: '',
            Department: '',
            OneSourceTitle: ''
        };
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    componentDidMount() {
        const mentorEmpID = this.props.match.params.StaffNaturalKey; //this.props.match.params.MentorEmployeeID;
        const campusID = this.props.userProps.user.campusID; 
        this.props.actions.loadMentorProfileByEmployeeID(mentorEmpID).then(mentor => this.loadValues());
    }
    loadValues(){
        if(this.props.mentor != null ){
            this.setState({MentorName: this.props.mentor.MentorName, EmployeeID: this.props.mentor.EmployeeID, EmailAddress: this.props.mentor.EmailAddress, 
                           Department: this.props.mentor.Department, OneSourceTitle: this.props.mentor.OneSourceTitle});
        }
            
        
    }

    cancel() {
        document.location = '#mentors';
    }

    okDialog(){
        this.closeDialog(); 
    }    
    
    displayMessage(message, action){
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    showDialog() {
      this.setState({ hideDialog: false });
    }
  
    closeDialog() {
      this.setState({ hideDialog: true });
    }

    render() {
        if(this.props.mentor != null)
        {
            //debugger;
        }
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="View Mentor Profile" campus={this.props.campus} />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <LeaderInfo />
                            <div className="white-box">
                                <form className="form-horizontal" style={{padding: "15px"}}>
                                    <div className="form-group">
                                        <label className="col-md-3 col-lg-3 col-sm-3">Mentor Name</label>
                                        <div className="col-md-9 col-lg-9 col-sm-9">{this.state.MentorName}</div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 col-lg-3 col-sm-3">Employee ID</label>
                                        <div className="col-md-9 col-lg-9 col-sm-9">{this.state.EmployeeID}</div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 col-lg-3 col-sm-3">Email Address</label>
                                        <div className="col-md-9 col-lg-9 col-sm-9">{this.state.EmailAddress}</div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 col-lg-3 col-sm-3">Department</label>
                                        <div className="col-md-9 col-lg-9 col-sm-9">{this.state.Department}</div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 col-lg-3 col-sm-3">One Source Title</label>
                                        <div className="col-md-9 col-lg-9 col-sm-9">{this.state.OneSourceTitle}</div>
                                    </div>


                                    <div className="form-group">
                                        <div className="text-left">
                                            <br />
                                            <PrimaryButton
                                                text="Close"
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
                        title: 'Mentor Profile',
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

ViewMentorProfilePage.propTypes = {
    campusID: PropTypes.string,
    campus: PropTypes.string,
    mentor: PropTypes.object,
    userProps: PropTypes.object,
    cancel: PropTypes.func,
    match: PropTypes.object,
    params: PropTypes.array,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campus: state.userProps.user.campusName,
        userProps: state.userProps,
        mentorEmpID: ownProps.match.params.StaffNaturalKey,
        mentor: state.mentor
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, mentorsActions, campusActions, relationshipsActions,sharedActions,staffActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewMentorProfilePage);

