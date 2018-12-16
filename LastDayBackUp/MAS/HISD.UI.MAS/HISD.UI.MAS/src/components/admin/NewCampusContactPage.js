import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActions from '../../actions/adminActions';
import * as staffActions from '../../actions/staffActions';
import * as spUserPropsActions from '../../actions/spUserPropsActions';
import * as sharedActions from '../../actions/sharedActions';
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
import Config from './../../api/config';

class NewCampusContactPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            employeeID: '',
            employeeName: '',
            employeeEmail: '',
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
        this.props.actions.loadCampusContactsByCampusID(this.props.userProps.user.campusID);
        this.setState({ campusID: this.props.userProps.user.campusID, isReadOnly: true });
        if (this.props.userProps.user.role == "Principal" || this.props.userProps.user.role == "CIC") {
            let campusOptions = [{ text: this.props.campus, value: this.props.campusID }];
            this.setState({ campusName: this.props.userProps.user.campusName, allCampuses: campusOptions });
            // let promise = this.props.actions.loadStaffsByCampusID(this.props.campusID);
            // promise.then(staffs => this.loadStaffValues());
        }
        let promise = this.props.actions.loadStaffsByCampusID(this.props.userProps.user.campusID);
        promise.then(staffs => this.loadStaffValues());
    }

    displayMessage(message, action) {
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    onSavingSucceeds(response) {
        this.displayMessage('CIC successfully created.', 'CREATED');
    }

    onSavingFails() {
        this.props.actions.ajaxCallError();
        this.displayMessage('Error trying to save CIC.');
    }

    processSave() {
        /*if(this.props.campusContacts){
            for(let i=0; i<this.props.campusContacts.length; i++){
                if(this.props.campusContacts[i].StaffNaturalKey == this.state.employeeID){
                    this.displayMessage('CIC "' + this.state.employeeName + '" already exists.', '');
                }
            }
            //if(this.props.campusContacts && this.props.campusContact.CICEmployeeID == this.state.employeeID){
            //this.displayMessage('CIC "' + this.state.employeeName + '" already exists.', '');
            //}
        } */
        //else{  then((response) => this.onSavingSucceeds(response)).
        let newCampusContact = { CampusContactID: 0, CICEmployeeID: this.state.employeeID, CampusID: this.state.campusID, TimeConfigurationID: this.props.userProps.timeConfigurationID };
        let CICEmailTo=this.state.employeeEmail;
        if (Config.ShowCICEmailCustomValue) {
            CICEmailTo = Config.CICEmailForTest;
        }
        else {
            CICEmailTo = this.state.employeeEmail;
        }
        let savePromise = this.props.actions.createCampusContact(newCampusContact);
        savePromise.
            then((response) => {
                let sendEmail = this.props.actions.sendEmailCIC({
                    "Body": Config.CICEMailBody,
                    //"To": this.state.employeeEmail,
                    "To": CICEmailTo,//"P00126549@houstonisd.org,P00126358@houstonisd.org,VBOLAGAM@houstonisd.org",
                    "Subject": "CIC Assignment"
                });
                sendEmail.
                    then((response) => this.onSavingSucceeds(response)).
                    catch(error => this.onSavingFails());
            }).
            catch(error => this.onSavingFails());
        //}
    }

    save() {
        let newCampusContact = { CampusContactID: 0, CICEmployeeID: this.state.employeeID, CampusID: this.state.campusID, TimeConfigurationID: this.props.userProps.timeConfigurationID };
        if (this.isValidForm()) {
            let checkIfExistsPromise = this.props.actions.loadCampusContactByCampusIDAndEmployeeID(this.state.campusID, this.state.employeeID, this.props.userProps.timeConfigurationID);
            checkIfExistsPromise.
                then(response => this.processSave()).
                catch(error => this.displayMessage('Error trying to validate CIC.', ''));
        }
    }

    isValidForm() {
        let isValid = true;
        if (this.props.campus.length == 0) {
            isValid = false;
            this.displayMessage('Error: Invalid Campus.', '');
        }
        else if (this.state.employeeName.length == 0) {
            isValid = false;
            this.displayMessage('Error: Invalid Employee Name.', '');
        }
        else if (this.props.campusContacts) {
            for (let i = 0; i < this.props.campusContacts.length; i++) {
                if (this.props.campusContacts[i].StaffNaturalKey == this.state.employeeID) {
                    isValid = false;
                    this.displayMessage('CIC "' + this.state.employeeName + '" already exists.', '');
                    break;
                }
            }
        }
        return isValid;
    }

    cancel() {
        if (this.props.userProps.user.role == "Principal")
            document.location = "#campuscontacts";
        else
            document.location = "#admin-campuscontacts";
    }

    loadStaffValues() {
        if (this.props.staffs !== undefined) {
            this.setState({ campusStaff: teacherFormattedForDropdown(this.props.staffs) });
        }
    }

    onCampusDropdownChanged(item) {
        this.setState({ campusID: item.key, campusName: item.text });
        let promise = this.props.actions.loadStaffsByCampusID(item.key);
        promise.then(staffs => this.loadStaffValues());
    }

    onContactsDropdownChanged(item) {
        this.setState({ employeeID: item.key, employeeName: item.text });
        let EmployeeDetails;
        if (this.props.staffs) {
            EmployeeDetails = this.props.staffs.filter(element => {
                return (element.StaffNaturalKey == item.key);
            });
        }
        if (EmployeeDetails.length > 0) {
            this.setState({ employeeEmail: EmployeeDetails[0].ElectronicMailAddress });
        }

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
    }

    render() {
        return (
            <IfAnyGranted expected={['Admin', 'Principal']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="New CIC" isDropDownDisabled={true} campus={this.props.campus} />
                        <div className="row">
                            <div className="col-md-6 col-lg-6 col-sm-12">
                                <div className="white-box">
                                    <form className="form">
                                        <div className="form-group">
                                            <label>Campus</label>
                                            <input id="campus" className="form-control" type="text" value={this.props.campus} readOnly />
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
                            title: 'CIC',
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
    campusContacts: PropTypes.array,
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
        campusContacts: state.campusContacts,
        isReadOnly: state.isReadOnly,
        staffs: state.staffs,
        allCampuses: campusesFormattedForDropdown(state.campuses, state.userProps.user.campusID, state.userProps.user.campusName),
        campusStaff: teacherFormattedForDropdown(state.staffs)
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, adminActions, spUserPropsActions, staffActions, ajaxStatusActions, sharedActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCampusContactPage);