import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActions from '../../actions/adminActions';
import * as sharedActions from '../../actions/sharedActions';
import * as staffActions from '../../actions/staffActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { teacherFormattedForDropdown } from '../../selectors/selectors';
import Utilities from '../../utilities/utilities';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class EditCampusContactPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        const employeeID = this.props.match.params.StaffNaturalKey;
        if(!employeeID){
            this.props.actions.logErrorSuccess('Employee ID not specified.');
            document.location = "#error";
        }

        this.state = {
            firstName: '',
            lastSurname: '',
            title: '',
            employeeCampus: '',
            employeeID: '',
            employeeName: '',
            campusID: '',
            campusName: '',
            isReadOnly: false
        };
        this.cancel = this.cancel.bind(this);
        this.loadValues = this.loadValues.bind(this);
        this.loadStaffValues = this.loadStaffValues.bind(this);
        this.delete = this.delete.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        this.onContactsDropdownChanged = this.onContactsDropdownChanged.bind(this);

        this.save = this.save.bind(this);
        this.onSavingSucceeds = this.onSavingSucceeds.bind(this);
        this.onSavingFails = this.onSavingFails.bind(this);
    }

    componentDidMount() {
        const employeeID = this.props.match.params.StaffNaturalKey;
        const campusID = this.props.match.params.EducationOrgNaturalKey;
        const timeConfigurationID = this.props.userProps.timeConfigurationID;
        let promise = this.props.actions.loadStaffsByCampusID(campusID);
        promise.then(staffs => this.loadStaffValues());
        this.props.actions.loadCampusContactByCampusIDAndEmployeeID(campusID, employeeID, timeConfigurationID)
        .then(campusContact => this.loadValues());
    }

    loadValues(){
        if(this.props.campusContact != null){
            const employeeName = this.props.campusContact.LastSurname + ", " + this.props.campusContact.FirstName;
            this.setState({employeeID: this.props.campusContact.StaffNaturalKey, employeeName: employeeName, campusContactID: this.props.campusContact.CampusContactID, firstName: this.props.campusContact.FirstName, lastName: this.props.campusContact.LastSurname, title: this.props.campusContact.JobCodeDescription, employeeCampus: this.props.campusContact.NameOfInstitution});
        }
    }
    
    loadStaffValues(){
        this.setState({campusStaff: teacherFormattedForDropdown(this.props.staffs)});
    }

    cancel() {
        document.location = '#admin-campuscontacts';
    }

    okDialog(){
        this.closeDialog(); 
        if(this.state.dialogAction == 'DELETE')
            this.deleteCampusContact();
        else if(this.state.dialogAction == 'SAVED')
            this.cancel();
    }

    deleteCampusContact(){
        const campusContactID = this.props.campusContact.CampusContactID;
        let promise = this.props.actions.deleteCampusContact(campusContactID);
        promise.then((response) => this.displayMessage('Campus Contact successfully deleted.', 'SAVED'))
        .catch(reason => {
            this.props.actions.ajaxCallError();
            this.setState({ subtext: 'There was a problem deleting this Campus Contact. Operation canceled.', dialogAction: '' });
            this.showDialog();
        });
    }

    onContactsDropdownChanged(item) {
        this.setState({ employeeID: item.key, employeeName: item.text });
    }
    
    delete(){
        this.setState({ subtext: 'Do you want to delete this Campus Contact?', dialogAction: 'DELETE' });
        this.showDialog();
    }

    
    onSavingSucceeds(response){          
        this.displayMessage('Campus Contact successfully updated.', 'SAVED');
    }
    
    onSavingFails(){
        this.props.actions.ajaxCallError();
        this.displayMessage('Error trying to save Campus Contact.');
    }

    processSave(){
        if(this.props.campusContact && this.props.campusContact.StaffNaturalKey == this.state.employeeID){
            this.displayMessage('Campus Contact "' + this.state.employeeName + '" already exists.', '');
        }
        else{
            let campusContact = {CampusContactID: this.state.campusContactID, CICEmployeeID: this.state.employeeID, CampusID: this.props.match.params.EducationOrgNaturalKey, TimeConfigurationID: this.props.userProps.timeConfigurationID};
            let savePromise = this.props.actions.updateCampusContact(campusContact);
            savePromise.
                then((response) => this.onSavingSucceeds(response)).
                catch(error => this.onSavingFails());
        }
    }

    save() {
        const campusContactID = this.props.campusContact.CampusContactID;
        let campusContact = {CampusContactID: this.props.campusContact.CampusContactID, CICEmployeeID: this.state.employeeID, CampusID: this.props.match.params.EducationOrgNaturalKey, TimeConfigurationID: this.props.userProps.timeConfigurationID};
        if(this.isValidForm()){
            let checkIfExistsPromise = this.props.actions.loadCampusContactByCampusIDAndEmployeeID(this.props.match.params.EducationOrgNaturalKey, this.state.employeeID, this.props.userProps.timeConfigurationID);
            checkIfExistsPromise.
                then(response => this.processSave()).
                catch(error => this.displayMessage('Error trying to validate Campus Contact.', ''));
        }
    }

    isValidForm(){
        let isValid = true;
        if(this.state.employeeName.length == 0){
            isValid = false;
            this.displayMessage('Error: Invalid Employee Name.', '');
        }
        else if(this.state.employeeID == this.props.match.params.StaffNaturalKey){
            isValid = false;
            this.displayMessage('Error: Contact name not changed. No need to save campus contact record.', '');
        }
        return isValid;
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
        const style = { paddingTop: 0 };
        
        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Edit Campus Contact (CIC)" campus={this.props.campus} />
                        <div className="row">
                            <div className="col-md-8 col-lg-8 col-sm-12">
                                <div className="white-box">
                                    <form className="form">
                                        <div className="form-group">
                                            <label>Campus</label>
                                            <input id="campus" className="form-control" type="text" value={this.props.campusContact.NameOfInstitution} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label>Contact</label>
                                            <Dropdown placeHolder="Select Contact" options={this.props.campusStaff} selectedKey={this.state.employeeID} onChanged={this.onContactsDropdownChanged} />
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
                                                &nbsp;&nbsp;&nbsp;
                                                <DefaultButton
                                                    text="Delete"
                                                    iconProps={{iconName: "Delete"}}
                                                    onClick={this.delete}
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
                            <PrimaryButton onClick={this.okDialog} text="Ok" styles={this.state.OkButtonStyle} />
                            <DefaultButton onClick={this.closeDialog} text="Cancel" />
                        </DialogFooter>
                    </Dialog>
                </div>
            </IfAnyGranted>
        );
    }
}

EditCampusContactPage.propTypes = {
    campusID: PropTypes.string,
    campus: PropTypes.string,
    firstName: PropTypes.string,
    lastSurName: PropTypes.string,
    title: PropTypes.string,
    employeeCampus: PropTypes.string,
    cancel: PropTypes.func,
    userProps: PropTypes.object,
    campusContact: PropTypes.object,
    campusContactID: PropTypes.string,
    staffs: PropTypes.array,
    campusStaff: PropTypes.array,
    match: PropTypes.object,
    params: PropTypes.array,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campus: state.userProps.user.campusName,
        campusContact: state.campusContact,
        userProps: state.userProps,
        campusContactID: ownProps.match.params.CampusContactID,
        campusStaff: teacherFormattedForDropdown(state.staffs)
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, adminActions, staffActions, sharedActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCampusContactPage);