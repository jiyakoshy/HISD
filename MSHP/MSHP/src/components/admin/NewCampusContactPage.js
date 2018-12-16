import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActions from '../../actions/adminActions';
import * as staffActions from '../../actions/staffActions';
import * as spUserPropsActions from '../../actions/spUserPropsActions';
import * as ajaxStatusActions from '../../actions/ajaxStatusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { teacherFormattedForDropdown, campusesFormattedForDropdown } from '../../selectors/selectors';
import Utilities from '../../utilities/utilities';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class NewCampusContactPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            employeeID: '',
            employeeName: '',
            campusID: '',
            campusName: '',
            isReadOnly: false,
            allCampuses: [],
            campusStaff: [],
            hideDialog: true,
            dialogAction: '',
            subtext: ''
        };
        this.onContactsDropdownChanged = this.onContactsDropdownChanged.bind(this);
        this.onCampusDropdownChanged = this.onCampusDropdownChanged.bind(this);
        this.loadStaffValues = this.loadStaffValues.bind(this);

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.onSavingSucceeds = this.onSavingSucceeds.bind(this);
        this.onSavingFails = this.onSavingFails.bind(this);
    }

    componentDidMount() {
        if(this.props.userProps.user.role == "Principal" || this.props.userProps.user.role == "CIC"){
            let campusOptions = [{ text: this.props.campus, value: this.props.campusID }];
            this.setState({ campusID: this.props.userProps.user.campusID, campusName: this.props.userProps.user.campusName, isReadOnly: true, allCampuses: campusOptions });
            let promise = this.props.actions.loadStaffsByCampusID(this.props.campusID);
            promise.then(staffs => this.loadStaffValues());            
        }
    }

    displayMessage(message, action){
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    onSavingSucceeds(response){          
        this.displayMessage('Campus Contact successfully created.', 'CREATED');
    }
    
    onSavingFails(){
        this.props.actions.ajaxCallError();
        this.displayMessage('Error trying to save Campus Contact.');
    }

    processSave(){
        if(this.props.campusContact && this.props.campusContact.CICEmployeeID == this.state.employeeID){
            this.displayMessage('Campus Contact "' + this.state.employeeName + '" already exists.', '');
        }
        else{
            let newCampusContact = {CampusContactID: 0, CICEmployeeID: this.state.employeeID, CampusID: this.state.campusID, TimeConfigurationID: this.props.userProps.timeConfigurationID};
            let savePromise = this.props.actions.createCampusContact(newCampusContact);
            savePromise.
                then((response) => this.onSavingSucceeds(response)).
                catch(error => this.onSavingFails());
        }
    }

    save() {
        let newCampusContact = {CampusContactID: 0, CICEmployeeID: this.state.employeeID, CampusID: this.state.campusID, TimeConfigurationID: this.props.userProps.timeConfigurationID};
        if(this.isValidForm()){
            let checkIfExistsPromise = this.props.actions.loadCampusContactByCampusIDAndEmployeeID(this.state.campusID, this.state.employeeID, this.props.userProps.timeConfigurationID);
            checkIfExistsPromise.
                then(response => this.processSave()).
                catch(error => this.displayMessage('Error trying to validate Campus Contact.', ''));
        }
    }

    isValidForm(){
        let isValid = true;
        if(this.state.campusName.length == 0){
            isValid = false;
            this.displayMessage('Error: Invalid Campus.', '');
        }
        else if(this.state.employeeName.length == 0){
            isValid = false;
            this.displayMessage('Error: Invalid Employee Name.', '');
        }
        return isValid;
    }

    cancel() {
        let email = {from: 'p00118795@houstonisd.org', to: 'p00118795@houstonisd.org', subject: 'You have been selected as a CIC', body: '<div>Test Email</div>'}
        this.props.actions.sendEmail(email);
        if(this.props.userProps.user.role == "Principal")
            document.location = "#campuscontacts";
        else
            document.location = "#admin-campuscontacts";
    }

    loadStaffValues(){
        this.setState({campusStaff: teacherFormattedForDropdown(this.props.staffs)});
    }

    onCampusDropdownChanged(item) {
        this.setState({ campusID: item.key, campusName: item.text });
        let promise = this.props.actions.loadStaffsByCampusID(item.key);
        promise.then(staffs => this.loadStaffValues());
    }

    onContactsDropdownChanged(item) {
        this.setState({ employeeID: item.key, employeeName: item.text });
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
        return (
            <IfAnyGranted expected={['Admin', 'Principal']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="New Campus Contact" campus={this.props.campus} />
                        <div className="row">
                            <div className="col-md-6 col-lg-6 col-sm-12">
                                <div className="white-box">
                                    <form className="form">
                                        <div className="form-group">
                                            <label>Campus</label>
                                            <Dropdown placeHolder="Select Campus" options={this.props.allCampuses} onChanged={this.onCampusDropdownChanged} selectedKey={this.state.campusID} disabled={this.state.isReadOnly} />
                                        </div>
                                        <div className="form-group">
                                            <label>Contact</label>
                                            <Dropdown placeHolder="Select Contact" options={this.props.campusStaff} onChanged={this.onContactsDropdownChanged} />
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
                            title: 'Campus Contact',
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

NewCampusContactPage.propTypes = {
    campusID: PropTypes.string,
    campus: PropTypes.string,
    campusStaff: PropTypes.array,
    userProps: PropTypes.object,
    allCampuses: PropTypes.array,
    staffs: PropTypes.array,
    campusContact: PropTypes.object,
    onCampusDropdownChanged: PropTypes.func,
    onContactDropdownChanged: PropTypes.func,
    save: PropTypes.func,
    cancel: PropTypes.func,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps,
        campusID: state.userProps.user.campusID,
        campus: state.userProps.user.campusName,
        campusContact: state.campusContact,
        isReadOnly: state.isReadOnly,
        allCampuses: campusesFormattedForDropdown(state.campuses, state.userProps.user.campusID, state.userProps.user.campusName),
        campusStaff: teacherFormattedForDropdown(state.staffs)
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, adminActions, spUserPropsActions, staffActions, ajaxStatusActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCampusContactPage);