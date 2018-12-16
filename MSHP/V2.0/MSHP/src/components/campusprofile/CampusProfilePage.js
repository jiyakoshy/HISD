import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sharedActions from '../../actions/sharedActions';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
 
import { campusesFormattedForDropdownGeneric, campusesFormattedForDropdown, reportDateYearsFormattedForDropdown, currentYearKey } from './../../selectors/selectors';
import Utilities from '../../utilities/utilities';
 
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import ErrorPage from '../common/ErrorPage';
import { fail } from 'assert';
 
import * as ajaxActions from '../../actions/ajaxStatusActions';
 
import * as enrollmentActions from './../../actions/enrollmentActions';
import IfAnyGranted from 'react-authorization/lib/IfAnyGranted';
import update from 'react-addons-update';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import InputGradeLevelControls from '../enrollment/InputGradeLevelControls';
import * as gradeLevelsActions from '../../actions/gradeLevelsActions';


class CampusProfilePage extends React.Component {
    constructor(props, context) {
        super(props, context);
 
        this.onCampusDropdownChanged = this.onCampusDropdownChanged.bind(this);
        this.onYearsDropdownChanged = this.onYearsDropdownChanged.bind(this);
 
        this.save = this.save.bind(this);
        this.load = this.load.bind(this);
 
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        this.onSavingSucceeds = this.onSavingSucceeds.bind(this);
        this.onSavingFails = this.onSavingFails.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
 
        this.onChangeCapacity = this.onChangeCapacity.bind(this);
        this.onChangeProjection = this.onChangeProjection.bind(this);
        this.editInputs = this.editInputs.bind(this);
        //this.handleClearForm = this.handleClearForm.bind(this);
 
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.cancelToHome = this.cancelToHome.bind(this);
 
        this.state = {
            counterEntries: 0,
            campusID: (this.props.userProps.user.role == 'Campus') ? this.props.campusID : '001',
            campusName: this.props.campusName,
 
            schoolID: (this.props.userProps.user.role == 'Campus') ? this.props.campusID :'',

            isCampusDD_Disabled: false,
            isSubmitDisabled: true,
 
            schoolYear: Utilities.getSchoolYear(),
 
            selectedYear: '',
 
            allReportDates: [...this.props.calendarReportDates],
 
            deleteBtnVisibility: { visibility: "hidden" },
            approveBtnVisibility: { visibility: "hidden" },
            subtext: '',
            dialogAction: '',
            hideDialog: true,
 
            isShow: false,
            capacity: '',
            projection: '',
            snapshot: '',
            updatedBy: '',
            createdBy: '',
            description: '',
 
            profileForm:
                {
                    capacity:
                        {
                            gradeLevel: "none",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        }
                    ,
 
                    projection:
                        {
                            gradeLevel: "none",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        }
 
                }
            , formIsValid: false
            , loading: false
 
        };
    }
 
    componentWillMount() {
        if (this.props.userProps.user.role == 'Campus' || this.props.userProps.user.role == 'Reports') {
            this.setState({ isCampusDD_Disabled: true });
 
        }
        
        if (this.props.userProps.user.role == 'Admin') {
            let jj = 'fdfd';
        }
 
    }


    componentDidMount() {
       const schoolYearEnd = Utilities.getSchoolYearEnd();
    }
 
    onChangeCapacity(e) {
        this.setState({ capacity: e.target.value });

    }
    onChangeProjection(e) {
        this.setState({ projection: e.target.value });

    }
 
    cancel() {
        document.location = '#campusprofile';
    }
 
    okDialog() {
        this.closeDialog();
 
        if (this.state.dialogAction == 'SAVED')
            this.cancel();
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
    cancelToHome(){
        document.location = '#home';
	}
	

    clearFormState() {
        const updatedProfileForm = {
            ...this.state.profileForm
        };
        for (let inputIdentifier in updatedProfileForm) {
            if (inputIdentifier == 'capacity' || inputIdentifier == 'projection') {
                updatedProfileForm[inputIdentifier].touched = false;
                updatedProfileForm[inputIdentifier].valid = false;
                updatedProfileForm[inputIdentifier].value = 0;
 
            }
 
        }
        this.setState({ profileForm: updatedProfileForm });
    }
 
    save() {
 
        let CampusProfile = {
            'Id': this.props.campusProfile.campusProfileID,
            'Capacity': this.state.capacity,
            'Projection': this.state.projection,
            'UpdatedDate': new Date(),
            'UpdatedBy': this.props.userProps.user.fullName
        };


        let promise = this.props.actions.updateCampusProfile(CampusProfile);
        promise.then(this.onSavingSucceeds())
            .catch(reason => {
                this.props.actions.ajaxCallError();
                this.setState({ subtext: 'There was a problem updating these Enrollment values. Operation canceled.', dialogAction: '' });
                this.showDialog();
            });
        
       
        return true;
    }


    setFormState(profile){
        const updatedProfileForm = {
            ...this.state.profileForm
        };
        for (let inputIdentifier in updatedProfileForm) {
            let updatedFormElement = {
                ...updatedProfileForm[inputIdentifier]
            };
            if (inputIdentifier == 'capacity'){
                updatedFormElement.value = profile.capacity;
            }
            if (inputIdentifier == 'projection'){
                updatedFormElement.value = profile.projection;
            }
            if (inputIdentifier == 'capacity' || inputIdentifier == 'projection'){
                updatedProfileForm[inputIdentifier] = updatedFormElement;
            }
        }
        this.setState({ profileForm: updatedProfileForm});
    }

    editInputs(e) {
        let iv = this._input.current.value;
        let inputIdentifier = e.target.id;
        const updatedProfileForm = {
            ...this.state.profileForm
        };
        const updatedFormElement = {
            ...updatedProfileForm[inputIdentifier]
        };
 
        updatedFormElement.valid = this.checkValidity(e.target.value);
        updatedFormElement.value = updatedFormElement.valid ? parseInt(e.target.value) : 0;
        updatedFormElement.touched = true;
        updatedProfileForm[inputIdentifier] = updatedFormElement;
 
        let formIsValid = true;
        for (let inputIdentifier in updatedProfileForm) {
            if (updatedProfileForm[inputIdentifier].touched) {
                formIsValid = updatedProfileForm[inputIdentifier].valid && formIsValid;
            }
 
        }
 
        this.setState({ profileForm: updatedProfileForm, formIsValid: formIsValid });
 
    }
    checkValidity(value) {
        let isValid = true;
 
        let checkAsString = value.toString().trim();
        isValid = checkAsString !== '' && isValid;
 
        isValid = checkAsString.length >= 1 && isValid;
 
        isValid = checkAsString.length <= 4 && isValid;
 
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid;
 
        return isValid;
    }
    onCampusDropdownChanged(item) {
        this.setState({counterEntries: 1});
        this.clearFormState();
        if (this.props.userProps.user.role !== 'Admin') return;
        this.setState({schoolID: item.key});
        let isShow = false;
 
        // NEXT ONE REFRESHES SO MANY PROPS THAT CHANGE WITH USER'S CAMPUS CHANGE AND ENABLE US TO USE USER.PROPS ACCURATELY
        //this.props.actions.updateUserCampus(item);//now props campus can be used in load
        if (this.state.selectedYear !== ''){
            this.props.actions.loadGradeLevelsByCampusAndYear(item.key, this.state.selectedYear.substring(5,9)).then(obj => {
                });
            this.props.actions.loadCampusProfile(item.key, this.state.selectedYear).then(
                campusProfile => {
                    this.setState(
                        {
                            capacity: this.props.campusProfile.capacity,
                            projection: this.props.campusProfile.projection,
                            snapshot: this.props.campusProfile.snapshot,
                            updatedBy: this.props.campusProfile.updatedBy,
                            createdBy: this.props.campusProfile.createdBy,
                            description: this.props.campusProfile.description
                        }
                    );
                }
            );
            isShow = true;
           
        } else {
            this.setState({
                description: '',
                createdBy: '',
                updatedBy: '',
                snapshot: '',
                projection: '',
                capacity: ''
            });
        }
        if(isShow) this.setState({isShow: true});
 
    }

    onYearsDropdownChanged(item) {
        this.setState({counterEntries: 1});
        this.clearFormState();
        this.setState({ isShow: true });
        this.setState({ selectedYear: item.text });//for this DD item, both key and text = "20xx - 20xx"
        //this.props.actions.loadCampusProfile(this.state.schoolID, item.text);
        this.props.actions.loadGradeLevelsByCampusAndYear(this.state.schoolID, item.text.substring(5,9)).then(
            gradeLevels => {
            });
        this.props.actions.loadCampusProfile(this.state.schoolID, item.text).then(
            campusProfile => {
                this.setState(
                    {
                        capacity: this.props.campusProfile.capacity,
                        projection: this.props.campusProfile.projection,
                        snapshot: this.props.campusProfile.snapshot,
                        updatedBy: this.props.campusProfile.updatedBy,
                        createdBy: this.props.campusProfile.createdBy,
                        description: this.props.campusProfile.description
                    }
                );
            }
        );
        
    }
 
    load() {
 
        this.setState({ isShow: true });
        this.props.actions.loadCampusProfile(this.state.schoolID, this.state.selectedYear).then(
            campusProfile => {
                this.setState(
                    {
                        capacity: this.props.campusProfile.capacity,
                        projection: this.props.campusProfile.projection,
                        snapshot: this.props.campusProfile.snapshot,
                        updatedBy: this.props.campusProfile.updatedBy,
                        createdBy: this.props.campusProfile.createdBy,
                        description: this.props.campusProfile.description
                    }
                    
                );
                const updatedProfileForm = {
                    ...this.state.profileForm
                };
                updatedProfileForm["capacity"].value = this.props.campusProfile.capacity;
                updatedProfileForm["projection"].value = this.props.campusProfile.projection;
                this.setState({ profileForm: updatedProfileForm });
            }
        );
    } 
 
    onSavingSucceeds() {
        this.load();
       
        this.displayMessage('School Profile values successfully saved.', 'SAVED');
        
    }
 
    onSavingFails(comment) {
        this.props.actions.ajaxCallError();
        if (comment && comment.length > 0) {
            this.displayMessage('Save attempted, but ', comment);
        } else {
            this.displayMessage('Error trying to save Profile values.');
        }
 
    }

    handleFormSubmit(e) {
        e.preventDefault();
        //save is the update but returns false if an insert is required instead
        if (this.state.profileForm.formIsValid) {
            this.save();
        } else {
            let comment = 'form is invalid -- check entries.';
            this.onSavingFails(comment);
        }
    }
 
    render() {
        if (this.props.userProps.user.role !== 'Admin' && this.props.userProps.user.role !== 'Campus') return;
        
        let isSubmitDisabled = false;
        
        if (this.props.userProps.user.role == 'Campus') isSubmitDisabled = true;
        if (this.state.schoolID == '') isSubmitDisabled = true;
        let createdDate = null;
        let updatedDate = null;
        let controls = null;
        let button = null;
        let j = 0;
        let myCampusGradeLevels = [...this.props.gradeLevels];
        let isShow = this.state.isShow;
        let campusDD = null;
        let campusDDAdmin = null;
        let save = null;
       let capacity = null;
        let projection = null;
        if (this.props.userProps.user.role == 'Admin') {
            save = (
                <input
                    type="button"
                    className="btn btn-primary float-right"
                    value="Update"
                    onClick={this.save}
                    disabled={isSubmitDisabled}
                />
            );
            if (this.state.counterEntries > 0){
                capacity =  (
                    <div>
                    <input id="capacity" placeholder="Capacity" className="form-control" onChange={this.onChangeCapacity} value={this.state.capacity} type="text" />
                    </div>
                );
                projection = (
                    <div>
                    <input id="projection" placeholder="Projection" className="form-control" onChange={this.onChangeProjection} value={this.state.projection} type="text" />
                    </div>
                );
            }
           
        }
        else {
            
            save = (
                <div></div>
            );
            if (this.state.counterEntries > 0){
                capacity = (
                    <div>{this.props.campusProfile.capacity}</div>
                );
                projection = (
                    <div>{this.props.campusProfile.projection}</div>
                );

            }
            
        }
 
        
        if (isShow) {




            let checkCreatedDate = this.props.campusProfile.createdDate;//replace
            let createdDateValue = checkCreatedDate !== null ? checkCreatedDate : null;//
 
            createdDate = (<div>
 
                {Utilities.getDateOnly(createdDateValue)}
 
            </div>
            );



            let checkUpdatedDate = this.props.campusProfile.updatedDate;//replace
            let updatedDateValue = checkUpdatedDate !== null ? checkUpdatedDate : null; //
 
            updatedDate = (<div >
 
                {Utilities.getDateOnly(updatedDateValue)}
 
            </div>
            );


            let valuesForChildComponent = [];
            for (let i = 0; i < myCampusGradeLevels.length; i++) {
                let newValueForCC = {};
                newValueForCC.gradeLevel = 'I' + myCampusGradeLevels[i].gradeLevel;
                newValueForCC.value = null;


                valuesForChildComponent.push(newValueForCC);
            }
 
            let j = 0;
            controls = null;
            controls = (
 
                <div style={{ 'border': '2px solid #c8c8c8'}}>
                    {valuesForChildComponent.map((gradeData) => {
 
                        return <InputGradeLevelControls
                            key={j++}
                            id={gradeData.gradeLevel}
                            inputGradeLevelData={gradeData}
                            gLStyle={null}
                            passValue={-100}
                        />;
                    })
 
                    }
 
                </div>
            );


        }


        if(this.props.userProps.user.role == 'Admin'){
            campusDDAdmin = (
                <div>
                    <div className="dropDownPageHeader">
                        <b>
                            <Dropdown
                                options={this.props.allCampuses} 
                                placeHolder="Choose a campus first"
                                onChanged={this.onCampusDropdownChanged} 
                                />
                        </b>
                    </div>
                </div>
            );
        } else {
            campusDD = (
                <div>
                    <div className="dropDownPageHeader">
                    <b>
                        <Dropdown options={this.props.allCampuses} 
                                onChanged={this.onCampusDropdownChanged}
                                selectedKey={this.state.schoolID} 
                                disabled={this.state.isCampusDD_Disabled} />
                    </b>
                    </div>    
                </div>    
            );
        }
    

        

        return (
            <IfAnyGranted expected={['Admin', 'Campus']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
 
                <div id="page-wrapper">
                    <div className="container-fluid">
                    <div className="row bg-title">
                            <div className="col-lg-12 col-md-12 col-sm-12 ">
                                <span>School Profiles</span>
                            </div>
                        </div>
 
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div className="white-box">
 
                                    <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                    <label className="col-md-2 col-lg-2 col-sm-2">Campus Name:</label>
                                    <div className=" col-md-4 col-lg-4 col-sm-4">
                                    <Dropdown width="200px" options={this.props.allCampuses} onChanged={this.onCampusDropdownChanged} 
                                        selectedKey={this.state.schoolID} disabled={this.state.isCampusDD_Disabled}/>
                                    </div>
                                    </div>
                                    <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                        <label className="col-md-2 col-lg-2 col-sm-2">School Year:</label>
                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                            <Dropdown 
                                            placeHolder="Choose a School Year"
                                            options={reportDateYearsFormattedForDropdown(this.state.allReportDates)}
                                            
                                            onChanged={this.onYearsDropdownChanged}
 
                                            /> </div>
                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                            




                                        </div>
 
                                    </div>
 
                                    <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Campus Number:</label>
                                        <label className=" col-md-4 col-lg-4 col-sm-4">
 
                                            {this.state.schoolID}
 
                                        </label>
                                    </div>
 
                                    <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Grade Levels:</label>
 
                                    </div>
                                    <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                        <div className="col-md-12 col-lg-12 col-sm-12"  >
                                            {controls}
                                        </div>
 
                                    </div>
 
                                    <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Capacity:</label>
                                        <label className=" col-md-4 col-lg-4 col-sm-4">
 
                                            {capacity}
 
                                        </label>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Projection:</label>
                                        <label className=" col-md-4 col-lg-4 col-sm-4">
 
                                            {projection}
 
                                        </label>
                                    </div>
 
                                    <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Previous Snapshot:</label>
                                        <label className=" col-md-4 col-lg-4 col-sm-4">
 
                                            {this.state.snapshot}
 
                                        </label>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Status:</label>
                                        <label className=" col-md-4 col-lg-4 col-sm-4">
 
                                            {}
 
                                        </label>
                                    </div>
 
                                    <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Type:</label>
                                        <label className=" col-md-4 col-lg-4 col-sm-4">
 
                                            {}
 
                                        </label>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Organization:</label>
                                        <label className=" col-md-4 col-lg-4 col-sm-4">
                                            {this.state.description}
                                        </label>
                                    </div>
 
                                    <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Created By:</label>
                                        <label className=" col-md-4 col-lg-4 col-sm-4">
                                            {this.state.createdBy}
                                        </label>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Created Date:</label>
                                       <label className=" col-md-4 col-lg-4 col-sm-4">
                                            {createdDate}
                                        </label>
                                    </div>
 
                                    <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Update By:</label>
                                        <label className=" col-md-4 col-lg-4 col-sm-4">
                                            {this.state.updatedBy}
                                        </label>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Update Date:</label>
                                        <label className=" col-md-4 col-lg-4 col-sm-4">
                                            {updatedDate}
                                        </label>
                                    </div>
 
                                    <div className="row">
                                        <div className="col-md-2 col-lg-2 col-sm-2">
                                            {save}
                                        </div>
 
                                    </div>
                                </div>
                            </div>
                        </div>
 
                    </div>
                    <Dialog
                        hidden={this.state.hideDialog}
                        onDismiss={this.closeDialog}
                        dialogContentProps={{
                            type: DialogType.normal,
                            title: 'School Profile',
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
 
function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps,
        campuses: state.campuses,
        allCampuses: campusesFormattedForDropdownGeneric(state.campuses),
        allReportDates: reportDateYearsFormattedForDropdown(state.calendarReportDates),
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        gradeLevels: state.gradeLevels,
        calendarReportDates: state.calendarReportDates,
        campusProfile: state.campusProfile
    };
}
 
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, sharedActions, ajaxActions, enrollmentActions, gradeLevelsActions), dispatch) };
}
 
CampusProfilePage.propTypes = {
    title: PropTypes.string,
    userProps: PropTypes.object,
    campuses: PropTypes.array,
    allCampuses: PropTypes.array,
    actions: PropTypes.object,
    schoolYear: PropTypes.string,
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    campusProfile: PropTypes.object,
    gradeLevels: PropTypes.array, 
    calendarReportDates: PropTypes.array,
    allReportDates: PropTypes.array,
    onCampusDropdownChanged: PropTypes.func,
    onYearsDropdownChanged: PropTypes.func,
    save: PropTypes.func,
    load: PropTypes.func,
    showDialog: PropTypes.func,
    displayMessage: PropTypes.func,
    onSavingSucceeds: PropTypes.func,
    onSavingFails: PropTypes.func,
    handleFormSubmit: PropTypes.func,
    handleClearForm: PropTypes.func,
    editInputs: PropTypes.func,
    cancel: PropTypes.func,
    okDialog: PropTypes.func,
    cancelToHome: PropTypes.func
};
 
export default connect(mapStateToProps, mapDispatchToProps)(CampusProfilePage);
