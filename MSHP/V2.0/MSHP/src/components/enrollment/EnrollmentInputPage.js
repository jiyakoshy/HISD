import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sharedActions from '../../actions/sharedActions';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { campusesFormattedForDropdownGeneric, calendarReportDatesFormattedForDropdown } from './../../selectors/selectors';
import Utilities from '../../utilities/utilities';
import * as enrollmentActions from '../../actions/enrollmentActions';
import * as enrollmentInputActions from '../../actions/enrollmentInputActions';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import ErrorPage from '../common/ErrorPage';
import { fail } from 'assert';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import InputGradeLevelControls from '../enrollment/InputGradeLevelControls';
import * as gradeLevelsActions from '../../actions/gradeLevelsActions';
import IfAnyGranted from 'react-authorization/lib/IfAnyGranted';
import update from 'react-addons-update';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import _ from 'lodash';

class EnrollmentInputPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onCampusDropdownChanged = this.onCampusDropdownChanged.bind(this);
        this.onReportDatesDropdownChanged = this.onReportDatesDropdownChanged.bind(this);
        this.save = this.save.bind(this);
        this.load = this.load.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        this.onSavingSucceeds = this.onSavingSucceeds.bind(this);
        this.onSavingFails = this.onSavingFails.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.onHandleChangeChildComponent = this.onHandleChangeChildComponent.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.cancelToHome = this.cancelToHome.bind(this);

        this.state = {
            counterEntries: 0,
            campusID: (this.props.userProps.user.role == 'Campus') ? this.props.campusID : '001',
            campusName: (this.props.userProps.user.role == 'Campus') ? this.props.campusName : 'Austin High School',
            schoolYear: Utilities.getSchoolYear(),
            schoolID: (this.props.userProps.user.role == 'Campus') ? this.props.campusID :'',
            currentEnrollment: {},
            campusEnrollmentID: 0,
            allReportDates: [...this.props.calendarReportDates],
            reportDateID: this.props.defaultReportDateID,
            reportDate: null,
            enrollments: [],
            enrollment: {},
            indexEnrollment: -1,
            reportDates: [],
            deleteBtnVisibility: { visibility: "hidden" },
            approveBtnVisibility: { visibility: "hidden" },
            subtext: '',
            dialogAction: '',
            hideDialog: true,
            calendarID: 0,
            renderActiveGradesCounts: [],
            isCampusDD_Disabled: false,
            campusProfileID: this.props.campusProfile.campusProfileID,
            isSubmitDisabled: true,
            maxCalendarID: null,
            isSavedNewData: false,
            gradeLevelForm:
                {
                    IEE:
                        {
                            gradeLevel: "IEE",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        }
                    ,

                    IPK:
                        {
                            gradeLevel: "IPK",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        }
                    ,

                    IKG:
                        {
                            gradeLevel: "IKG",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        }
                    ,

                    I01:
                        {
                            gradeLevel: "I01",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        }
                    ,

                    I02:
                        {
                            gradeLevel: "I02",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        }
                    ,

                    I03:
                        {
                            gradeLevel: "I03",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        }
                    ,

                    I04:
                        {
                            gradeLevel: "I04",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        }
                    ,

                    I05:
                        {
                            gradeLevel: "I05",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        }
                    ,

                    I06:
                        {
                            gradeLevel: "I06",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        }
                    ,

                    I07:
                        {
                            gradeLevel: "I07",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        },

                    I08:
                        {
                            gradeLevel: "I08",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        }
                    ,

                    I09:
                        {
                            gradeLevel: "I09",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        }
                    ,

                    I10:
                        {
                            gradeLevel: "I10",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        },

                    I11:
                        {
                            gradeLevel: "I11",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        }
                    ,

                    I12:
                        {
                            gradeLevel: "I12",
                            placeholder: "count",
                            touched: false,
                            valid: false,
                            value: 0
                        }

                }
            , formIsValid: false
            , loading: false
            , insertedPK: 0
        };
        
    }


    componentWillMount() {
        if (this.props.userProps.user.role == 'Campus' || this.props.userProps.user.role == 'Reports') this.setState({ isCampusDD_Disabled: true });
        if (this.state.counterEntries !== 0) return;
        if (typeof this.state.renderActiveGradesCounts !== 'undefined' && this.state.renderActiveGradesCounts.length > 0) return;
        this.setState({counterEntries: 1});
        let renderActiveGradesCounts = [];
        let indexEnrollment = -1;
        let schoolYear = '';
        let schoolYearEnd = '';
        let enrollments = [];
        let calendarID = parseInt(this.state.reportDateID);
		let theReportDate = Utilities.getMostRecentReportDate([...this.props.calendarReportDates]);
        this.setState({ reportDateID: this.props.defaultReportDateID, reportDate: theReportDate});
        schoolYear = Utilities.getSchoolYearFromReportDate(Utilities.getDateOnly(theReportDate));//
        schoolYearEnd = schoolYear.substring(5,9);
        this.setState({ schoolYear: schoolYear });
        this.setState({ schoolYearEnd: schoolYearEnd });
        let schoolID = this.props.campusID;
        if (schoolYear.length == 0 || !schoolID || schoolID.length == 0) return;//gfm add msg
        this.props.actions.loadGradeLevelsByCampusAndYear(schoolID, schoolYearEnd).then(obj => {
        });
        //ENROLLMENT
        this.props.actions.loadAllEnrollmentsByYearCampus(schoolID, schoolYear).then(obj => {
            enrollments = [...this.props.enrollments];
            let indexEnrollment = enrollments.map(function (e) { return e.CalendarID; }).indexOf(calendarID);
            if (indexEnrollment > -1) {
                let theEnrollment = enrollments[indexEnrollment];
                renderActiveGradesCounts = Utilities.ShapeData(this.props.gradeLevels, theEnrollment);
            } else {
                renderActiveGradesCounts = this.ShapeDataNoEnrollment(this.props.gradeLevels);
            }
             // 1 console
             this.setState({ renderActiveGradesCounts: renderActiveGradesCounts });
             this.setFormStateFromRenderActiveGradesCounts(renderActiveGradesCounts);
        });
        
        this.props.actions.loadCampusProfile(schoolID, schoolYear).then(
            campusProfile => {
                this.setState(
                    {
                        campusProfileID: this.props.campusProfile.campusProfileID
                    }
                );
            }
        );
    }

    componentDidMount() {
       const schoolYearEnd = Utilities.getSchoolYearEnd();
       if (typeof this.state.renderActiveGradesCounts == 'undefined' || this.state.renderActiveGradesCounts.length == 0){
               let promise = this.props.actions.loadGradeLevelsByCampusAndYear(this.state.schoolID, schoolYearEnd);
               promise.then(gradeLevels => {
               })
               .catch(reason => {
                   this.props.actions.ajaxCallError();
               }); 
       }
   }

    cancel() {
        document.location = '#enrollmentinput';
    }
    cancelToHome(){
        document.location = '#home';
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

    onCampusDropdownChanged(item) {
        let enrollments = [];
        if (this.props.userProps.user.role !== 'Admin') return;
        let reportDateID = this.state.reportDateID;
        let schoolID = this.state.campusID;
        this.setState({ schoolID: item.key });
        this.clearFormState();
        this.props.actions.clearEnrollments();
        this.setState({renderActiveGradesCounts: []});
        let renderActiveGradesCounts = [];
        this.props.actions.loadGradeLevelsByCampusAndYear(item.key, Utilities.getSchoolYearEnd()).then(obj => {
        });
        this.props.actions.loadAllEnrollmentsByYearCampus(item.key, this.state.schoolYear).then(obj => {
            enrollments = [...this.props.enrollments];
            let indexEnrollment = enrollments.map(function (e) { return e.CalendarID; }).indexOf(parseInt(reportDateID));
            if (indexEnrollment > -1) {
                let theEnrollment = enrollments[indexEnrollment];
                renderActiveGradesCounts = Utilities.ShapeData(this.props.gradeLevels, theEnrollment);
            } else {
                renderActiveGradesCounts = this.ShapeDataNoEnrollment(this.props.gradeLevels);
            }
             this.setState({ renderActiveGradesCounts: renderActiveGradesCounts });
             this.setFormStateFromRenderActiveGradesCounts(renderActiveGradesCounts);
        });
        this.props.actions.loadCampusProfile(item.key, this.state.schoolYear).then(campusProfile => {
            }
        );
    }

    ShapeDataNoEnrollment(gradeLevels) {
        let returnArray = [];
        let j = 0;
        let shortEnrollments = [];
        for (let i = 0; i < gradeLevels.length; i++) {
            let theGL = 'I' + gradeLevels[i].gradeLevel;
            let newEnrollment = {};
            newEnrollment.key = j++;
            newEnrollment.gradeLevel = theGL + '_' + '0';
            newEnrollment.campusEnrollmentID = 0;
            newEnrollment.value = 0;
            newEnrollment.valid = false;
            newEnrollment.touched = false;
            shortEnrollments.push(newEnrollment);
        }
        return shortEnrollments;
    }
	
    onReportDatesDropdownChanged(item) {
        let renderActiveGradesCounts = [];
        let indexEnrollment = -1;
        let schoolYear = '';
        let schoolYearEnd = '';
        let enrollments = [];
        let calendarID = parseInt(item.key);
        this.setState({ reportDateID: item.key, reportDate: item.text });
        this.clearFormState();
        if (this.state.isSavedNewData) {
            this.setState({ isSavedNewData: false });
            this.props.actions.clearEnrollments();
        }
        
        schoolYear = Utilities.getSchoolYearFromReportDate(item.text);//this.state.allReportDates[indexOfCalRepDate].SchoolYear;
        schoolYearEnd = schoolYear.substring(5,9);
        this.setState({ schoolYear: schoolYear });
        this.setState({ schoolYearEnd: schoolYearEnd });
        let schoolID = this.state.schoolID;
        if (schoolYear.length == 0 || !schoolID || schoolID.length == 0) return;//gfm add msg
        this.props.actions.loadGradeLevelsByCampusAndYear(schoolID, schoolYearEnd).then(obj => {
        });
        
        this.props.actions.loadAllEnrollmentsByYearCampus(schoolID, schoolYear).then(obj => {
            enrollments = [...this.props.enrollments];
            let reportDateID = item.key;
            let indexEnrollment = enrollments.map(function (e) { return e.CalendarID; }).indexOf(parseInt(reportDateID));
            if (indexEnrollment > -1) {
                let theEnrollment = enrollments[indexEnrollment];
                renderActiveGradesCounts = Utilities.ShapeData(this.props.gradeLevels, theEnrollment);
            } else {
                renderActiveGradesCounts = this.ShapeDataNoEnrollment(this.props.gradeLevels);
            }
             this.setState({ renderActiveGradesCounts: renderActiveGradesCounts });
             this.setFormStateFromRenderActiveGradesCounts(renderActiveGradesCounts);
        });
        
        this.props.actions.loadCampusProfile(schoolID, schoolYear).then(
            campusProfile => {
                this.setState(
                    {
                        campusProfileID: this.props.campusProfile.campusProfileID
                    }
                );
            }
        );
    }


    onHandleChangeChildComponent(e) {
        e.preventDefault();
        let inputIdentifier = e.target.id;
        const updatedOrderForm = {
            ...this.state.gradeLevelForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };

        updatedFormElement.valid = this.checkValidity(e.target.value);
        updatedFormElement.value = updatedFormElement.valid ? parseInt(e.target.value) : 0;
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            if (updatedOrderForm[inputIdentifier].touched) {
                formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
            }
        }
        this.setState({ gradeLevelForm: updatedOrderForm, formIsValid: formIsValid });
    }

    setFormStateFromRenderActiveGradesCounts(renderActiveGradesCounts){
        let GL = '';
        const updatedOrderForm = {
            ...this.state.gradeLevelForm
        };
        for(let i = 0; i < renderActiveGradesCounts.length;i++){
            GL = renderActiveGradesCounts[i].gradeLevel.substring(0,3);
            let updatedFormElement = {
                ...updatedOrderForm[GL]
            };
            updatedFormElement.value = renderActiveGradesCounts[i].value;
            updatedOrderForm[GL] = updatedFormElement;
        }
        this.setState({ gradeLevelForm: updatedOrderForm});
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

    clearFormState() {
        const updatedOrderForm = {
            ...this.state.gradeLevelForm
        };
        for (let inputIdentifier in updatedOrderForm) {
            if (inputIdentifier.length == 3) {//avoid other gradeLevelForm top-level properties
                updatedOrderForm[inputIdentifier].touched = false;
                updatedOrderForm[inputIdentifier].valid = false;
                updatedOrderForm[inputIdentifier].value = 0;
            }
        }
        updatedOrderForm.insertedPK = 0;
        this.setState({ gradeLevelForm: updatedOrderForm });
    }


    save() {
       
        let formIsValid = this.state.formIsValid;
        if (!formIsValid) this.onSavingFails();
        let campusEnrollmentID = 0;
        let campusProfileID = 0;
        let enrollment = {};
        let result = false;
        let uiValue = 0;
        let uiID = '';
        let total;
        let indexOfEnrollment = -1;
        let pkForUpdate = 0;
        let isDynamicUpdate = false;
        let enrollmentFromService = {};
        let match = false;
        let priorCalendarID = 0;
        let currentCalendarID = 0;
        let flagDontSave = true;
        const updatedOrderForm = {
            ...this.state.gradeLevelForm
        };

        let enrollments = this.props.enrollments;
        const date = new Date();//will immediately be patched or posted to db
        const reportDateID = this.state.reportDateID;//FOR ADMIN COULD THEORETICALLY BE ANY DATE
        const calendarID = parseInt(reportDateID);//THE CALENDARID OF THIS RECORD MIGHT NOT BE DEFAULT REPORT DAE
        if (Array.isArray(enrollments)) {
            for (let i = 0; i < enrollments.length; i++) {
                currentCalendarID = enrollments[i].CalendarID;
                if (calendarID === currentCalendarID) match = true;//THERE IS AN ENROLLMENT IN CAMPUS' ENROLLMENTS ARRAY FOR DROPDOWN DATE CHOSEN
                if (currentCalendarID > priorCalendarID) {
                    priorCalendarID = currentCalendarID;
                }
            }
        }
        const maxCalendarID = priorCalendarID;
        let isInsert = true;
        if (match) isInsert = false;//current report date corresponds to one which is in enrollments array
        if (updatedOrderForm.insertedPK > 0) {// the insertedPK in state is zeroed out upon campus or reportdate change (dropdown)
            isInsert = false;
            pkForUpdate = updatedOrderForm.insertedPK;
            isDynamicUpdate = true;
        }

        if (this.state.campusProfileID == 0 || this.props.campusProfile == 'undefined' || this.props.campusProfile.campusProfileID < 1){
            if (this.state.schoolID !== ''){
             this.props.actions.loadCampusProfile(this.state.schoolID, Utilities.getSchoolYear()).then(
                 campusProfile => {
                     campusProfileID = this.props.campusProfile.campusProfileID;
                     this.setState(
                         {
                             campusProfileID: this.props.campusProfile.campusProfileID
                         }
                     );
                 }
             );
         }}

        if (!isInsert) {
            
            indexOfEnrollment = enrollments.map(function (e) { return e.CalendarID; }).indexOf(calendarID);
            if (indexOfEnrollment > -1) {
                enrollmentFromService = enrollments[indexOfEnrollment];
                campusEnrollmentID = enrollmentFromService.CampusEnrollmentID;
            } else if (isDynamicUpdate) {
                campusEnrollmentID = pkForUpdate;
            }
            enrollment.Id = campusEnrollmentID;
            let priorValue = 0;
            flagDontSave = true;
            for (let inputIdentifier in updatedOrderForm) {
                if (inputIdentifier.length == 3) {//avoid other gradeLevelForm top-level properties
                    if (updatedOrderForm[inputIdentifier].touched) {
                        uiValue = updatedOrderForm[inputIdentifier].value;
                        if (uiValue > 0) flagDontSave = false;
                        enrollment[inputIdentifier] = uiValue;
                    }
                } 
            }

            if (flagDontSave) return;//also add message gfm
            enrollment.UpdatedBy = this.props.userProps.user.fullName;
            enrollment.UpdatedDate = date;
            let promise = this.props.actions.updateEnrollment(enrollment);
            promise.then(this.onSavingSucceeds())
                .catch(reason => {
                    this.props.actions.ajaxCallError();
                    this.setState({ subtext: 'There was a problem updating these Enrollment values. Operation canceled.', dialogAction: '' });
                    this.showDialog();
                });
            result = true;
        }
        
        if (isInsert) {
            uiValue = 0;
            uiID = '';
            total = 0;
            enrollment.CampusProfileId = this.props.campusProfile.campusProfileID;//touched 7/14 //this.state.campusProfileID;//determined by school and year
            enrollment.CalendarId = calendarID;
            flagDontSave = true;
            for (let inputIdentifier in updatedOrderForm) {
                if (inputIdentifier.length == 3) {//avoid other gradeLevelForm top-level properties   
                    uiValue = updatedOrderForm[inputIdentifier].value;
                    if (uiValue > 0) flagDontSave = false;
                    uiID = inputIdentifier;
                    enrollment[uiID] = uiValue;//// CRITICAL!!!!
                }
            }
            if (flagDontSave) {
                return;//also add message gfm
            }

            enrollment.CreatedDate = date;
            enrollment.CreatedBy = this.props.userProps.user.fullName;
            enrollment.UpdatedDate = date;
            enrollment.UpdatedBy = this.props.userProps.user.fullName;
            let promise = this.props.actions.createCampusEnrollment(enrollment);
            promise.then(res => {
                let enrollment = this.props.enrollment;
                updatedOrderForm.insertedPK = enrollment.Id;
                this.setState({ gradeLevelForm: updatedOrderForm });
                this.onSavingSucceeds();
            })
                .catch(reason => {
                    this.props.actions.ajaxCallError();
                    this.setState({ subtext: 'There was a problem inserting these Enrollment values. Operation canceled.', dialogAction: '' });
                    this.showDialog();
                });
            result = true;
        }

        if (result) {
            this.setState({ isSavedNewData: true });
        }
        this.load();
        return result;
    }

    load() {
        let enrollments = [];
        if (this.props.userProps.user.role !== 'Admin') return;
        let reportDateID = this.state.reportDateID;
        this.props.actions.clearEnrollments();
        this.setState({renderActiveGradesCounts: []});
        let renderActiveGradesCounts = [];
        this.props.actions.loadAllEnrollmentsByYearCampus(this.state.schoolID, Utilities.getSchoolYear()).then(obj => {
            enrollments = [...this.props.enrollments];
            let indexEnrollment = enrollments.map(function (e) { return e.CalendarID; }).indexOf(parseInt(reportDateID));
            if (indexEnrollment > -1) {
                let theEnrollment = enrollments[indexEnrollment];
                renderActiveGradesCounts = Utilities.ShapeData(this.props.gradeLevels, theEnrollment);
               
            } else {
                renderActiveGradesCounts = this.ShapeDataNoEnrollment(this.props.gradeLevels);
            }
             this.setState({ renderActiveGradesCounts: renderActiveGradesCounts });
             this.setFormStateFromRenderActiveGradesCounts(renderActiveGradesCounts);
        });
    }

    onSavingSucceeds() {
        this.displayMessage('Enrollment values successfully saved.', 'SAVED');
    }

    onSavingFails() {
        this.props.actions.ajaxCallError();
        this.displayMessage('Error trying to save Enrollment values.  Check validity of entries.');
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.save();
    }

    render() {
        let renderActiveGradesCounts = [];
        let indexOfInterest = -1;
        let createdBy = null;
        let updatedBy = null;
        let createdDate = null;
        let updatedDate = null;
        let controls = null;
        let inputEE = null;
        let inputPK = null;
        let inputKG = null;
        let input01 = null;
        let input02 = null;
        let input03 = null;
        let input04 = null;
        let input05 = null;
        let input06 = null;
        let input07 = null;
        let input08 = null;
        let input09 = null;
        let input10 = null;
        let input11 = null;
        let input12 = null;
        let populateArray = [];
        let isSubmitDisabled = false;
        let campusDD = null;
        let j = 0;
        let valuesForChildComponent = [];
        let showMaxCalID = null;
        if (typeof this.state.renderActiveGradesCounts !== 'undefined' && this.state.renderActiveGradesCounts.length > 0) {	//here build gradeLevelForm from shapedata output OR prepare in a better way inside ShapeData

            let indexEE = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('EE');
        if (indexEE > -1 ){
            let trimmedLevel = 'EE';
                    inputEE = (
                        
                        <div className="dispin">
                            <div>
                            </div>
                            <div>
                                <span id = "levels">
                                <label style={{paddingright: 1}}>{trimmedLevel}:</label>
                                </span>
                                    <div><span className="ggspan">
                                    <input 
                                        type="number"
                                        style={{width: '50px'}}
                                        value={this.state.gradeLevelForm["IEE"].value}
                                        id="IEE"
                                        onChange={this.onHandleChangeChildComponent}

                                    />
                                    </span>
                                    </div>
                            </div>
                        </div>
                        
                    );
                 }

                 
                 let indexPK = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('PK');
                if (indexPK > -1 ){
                     let trimmedLevel = 'PK';
                     
                     
                    inputPK = (
                        <div className="dispin">
                            <div>
                            </div>
                            <div>
                                <span id = "levels">
                                <label style={{paddingright: 1}}>{trimmedLevel}:</label>
                                </span>
                                    <div><span className="ggspan">
                                    <input 
                                        type="number"
                                        style={{width: '50px'}}
                                        value={this.state.gradeLevelForm["IPK"].value}
                                        id="IPK"
                                        onChange={this.onHandleChangeChildComponent}

                                    />
                                    </span>
                                    </div>
                            </div>
                        </div>
                    );
                 }

                
                 
                 let indexKG = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('KG');
                 
                 if (indexKG > -1 ){
                     let trimmedLevel = 'KG';
                     
                     
                    inputKG = (
                        <div className="dispin">
                            <div>
                            </div>
                            <div>
                                <span id = "levels">
                                <label style={{paddingright: 1}}>{trimmedLevel}:</label>
                                </span>
                                    <div><span className="ggspan">
                                    <input 
                                        type="number"
                                        style={{width: '50px'}}
                                        value={this.state.gradeLevelForm["IKG"].value}
                                        id="IKG"
                                        onChange={this.onHandleChangeChildComponent}

                                    />
                                    </span>
                                    </div>
                            </div>
                        </div>
                    );
                 }

                                
                
                let index01 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('01');
                
                if (index01 > -1 ){
                     let trimmedLevel = '1';
                     
                    input01 = (
                        <div className="dispin">
                            <div>
                            </div>
                            <div>
                                <span id = "levels">
                                <label style={{paddingright: 1}}>{trimmedLevel}:</label>
                                </span>
                                    <div><span className="ggspan">
                                    <input 
                                        type="number"
                                        style={{width: '50px'}}
                                        value={this.state.gradeLevelForm["I01"].value}
                                        id="I01"
                                        onChange={this.onHandleChangeChildComponent}

                                    />
                                    </span>
                                    </div>
                            </div>
                        </div>
                    );
                 }

                 
                let index02 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('02');
                
                if (index02 > -1 ){
                     let trimmedLevel = '2';
                     
                    input02 = (
                        <div className="dispin">
                            <div>
                            </div>
                            <div>
                                <span id = "levels">
                                <label style={{paddingright: 1}}>{trimmedLevel}:</label>
                                </span>
                                    <div><span className="ggspan">
                                    <input 
                                        type="number"
                                        style={{width: '50px'}}
                                        value={this.state.gradeLevelForm["I02"].value}
                                        id="I02"
                                        onChange={this.onHandleChangeChildComponent}

                                    />
                                    </span>
                                    </div>
                            </div>
                        </div>
                    );
                 }


                 
                let index03 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('03');
                
                if (index03 > -1 ){
                    let trimmedLevel = '3';
                    
                   input03 = (
                       <div className="dispin">
                           <div>
                           </div>
                           <div>
                               <span id = "levels">
                               <label style={{paddingright: 1}}>{trimmedLevel}:</label>
                               </span>
                                   <div><span className="ggspan">
                                   <input 
                                       type="number"
                                       style={{width: '50px'}}
                                       value={this.state.gradeLevelForm["I03"].value}
                                       id="I03"
                                       onChange={this.onHandleChangeChildComponent}

                                   />
                                   </span>
                                   </div>
                           </div>
                       </div>
                   );
                }


                
                let index04 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('04');
                
                if (index04 > -1 ){
                    let trimmedLevel = '4';
                    
                   input04 = (
                       <div className="dispin">
                           <div>
                           </div>
                           <div>
                               <span id = "levels">
                               <label style={{paddingright: 1}}>{trimmedLevel}:</label>
                               </span>
                                   <div><span className="ggspan">
                                   <input 
                                       type="number"
                                       style={{width: '50px'}}
                                       value={this.state.gradeLevelForm["I04"].value}
                                       id="I04"
                                       onChange={this.onHandleChangeChildComponent}

                                   />
                                   </span>
                                   </div>
                           </div>
                       </div>
                   );
                }
				
				
                let index05 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('05');
                
                if (index05 > -1 ){
                    let trimmedLevel = '5';
                    
                   input05 = (
                       <div className="dispin">
                           <div>
                           </div>
                           <div>
                               <span id = "levels">
                               <label style={{paddingright: 1}}>{trimmedLevel}:</label>
                               </span>
                                   <div><span className="ggspan">
                                   <input 
                                       type="number"
                                       style={{width: '50px'}}
                                       value={this.state.gradeLevelForm["I05"].value}
                                       id="I05"
                                       onChange={this.onHandleChangeChildComponent}

                                   />
                                   </span>
                                   </div>
                           </div>
                       </div>
                   );
                }
				
				
				
                let index06 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('06');
                
                if (index06 > -1 ){
                    let trimmedLevel = '6';
                    
                    
                   input06 = (
                       <div className="dispin">
                           <div>
                           </div>
                           <div>
                               <span id = "levels">
                               <label style={{paddingright: 1}}>{trimmedLevel}:</label>
                               </span>
                                   <div><span className="ggspan">
                                   <input 
                                       type="number"
                                       style={{width: '50px'}}
                                       value={this.state.gradeLevelForm["I06"].value}
                                       id="I06"
                                       onChange={this.onHandleChangeChildComponent}

                                   />
                                   </span>
                                   </div>
                           </div>
                       </div>
                   );
                }
				
				
				
                let index07 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('07');
                
                if (index07 > -1 ){
                    let trimmedLevel = '7';
                    
                   input07 = (
                       <div className="dispin">
                           <div>
                           </div>
                           <div>
                               <span id = "levels">
                               <label style={{paddingright: 1}}>{trimmedLevel}:</label>
                               </span>
                                   <div><span className="ggspan">
                                   <input 
                                       type="number"
                                       style={{width: '50px'}}
                                       value={this.state.gradeLevelForm["I07"].value}
                                       id="I07"
                                       onChange={this.onHandleChangeChildComponent}

                                   />
                                   </span>
                                   </div>
                           </div>
                       </div>
                   );
                }
				
				
				
                let index08 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('08');
                
                if (index08 > -1 ){
                    let trimmedLevel = '8';
                    
                    
                   input08 = (
                       <div className="dispin">
                           <div>
                           </div>
                           <div>
                               <span id = "levels">
                               <label style={{paddingright: 1}}>{trimmedLevel}:</label>
                               </span>
                                   <div><span className="ggspan">
                                   <input 
                                       type="number"
                                       style={{width: '50px'}}
                                       value={this.state.gradeLevelForm["I08"].value}
                                       id="I08"
                                       onChange={this.onHandleChangeChildComponent}

                                   />
                                   </span>
                                   </div>
                           </div>
                       </div>
                   );
                }


                
                let index09 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('09');

                if (index09 > -1 ){
                    let trimmedLevel = '9';
                    
                    
                   input09 = (
                       <div className="dispin">
                           <div>
                           </div>
                           <div>
                               <span id = "levels">
                               <label style={{paddingright: 1}}>{trimmedLevel}:</label>
                               </span>
                                   <div><span className="ggspan">
                                   <input 
                                       type="number"
                                       style={{width: '50px'}}
                                       value={this.state.gradeLevelForm["I09"].value}
                                       id="I09"
                                       onChange={this.onHandleChangeChildComponent}

                                   />
                                   </span>
                                   </div>
                           </div>
                       </div>
                   );
                }

                
                let index10 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('10');
                
                if (index10 > -1 ){
                    let trimmedLevel = '10';
                    
                   input10 = (
                       <div className="dispin">
                           <div>
                           </div>
                           <div>
                               <span id = "levels">
                               <label style={{paddingright: 1}}>{trimmedLevel}:</label>
                               </span>
                                   <div><span className="ggspan">
                                   <input 
                                       type="number"
                                       style={{width: '50px'}}
                                       value={this.state.gradeLevelForm["I10"].value}
                                       id="I10"
                                       onChange={this.onHandleChangeChildComponent}

                                   />
                                   </span>
                                   </div>
                           </div>
                       </div>
                   );
                }

                
                let index11 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('11');
                
                if (index11 > -1 ){
                    let trimmedLevel = '11';
                    
                    input11 = (
                       <div className="dispin">
                           <div>
                           </div>
                           <div>
                               <span id = "levels">
                               <label style={{paddingright: 1}}>{trimmedLevel}:</label>
                               </span>
                                   <div><span className="ggspan">
                                   <input 
                                       type="number"
                                       style={{width: '50px'}}
                                       value={this.state.gradeLevelForm["I11"].value}
                                       id="I11"
                                       onChange={this.onHandleChangeChildComponent}

                                   />
                                   </span>
                                   </div>
                           </div>
                       </div>
                   );
                }


                
                let index12 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('12');
                
                if (index12 > -1 ){
                    let trimmedLevel = '12';
                   
                    input12 = (
                      <div className="dispin">
                          <div>
                          </div>
                          <div>
                              <span id = "levels">
                              <label style={{paddingright: 1}}>{trimmedLevel}:</label>
                              </span>
                                  <div><span className="ggspan">
                                  <input 
                                      type="number"
                                      style={{width: '50px'}}
                                      value={this.state.gradeLevelForm["I12"].value}
                                      id="I12"
                                      onChange={this.onHandleChangeChildComponent}

                                  />
                                  </span>
                                  </div>
                          </div>
                      </div>
                  );
               }

                let checkCreatedBy = this.state.renderActiveGradesCounts[0].createdBy;
                let createdByValue = checkCreatedBy !== null ? checkCreatedBy : null;// must be replaced w/ equiv of foundEnrollment.CreatedBy


                createdBy = (
                    <div>
                        {createdByValue}
                    </div>
                );

                let checkCreatedDate = this.state.renderActiveGradesCounts[0].createdDate;
                let createdDateValue = checkCreatedDate !== null ? checkCreatedDate : null;//replace with equiv of foundEnrollment.CreatedDate

                createdDate = (<div>
                    {Utilities.getDateOnly(createdDateValue)}
                </div>
                );

                let checkUpdatedBy = this.state.renderActiveGradesCounts[0].updatedBy;
                let updatedByValue = checkUpdatedBy !== null ? checkUpdatedBy : null; //replaces foundEnrollment.UpdatedBy

                updatedBy = (<div >

                    {updatedByValue}

                </div>
                );


                let checkUpdatedDate = this.state.renderActiveGradesCounts[0].updatedDate;
                let updatedDateValue = checkUpdatedDate !== null ? checkUpdatedDate : null; //replaces foundEnrollment.UpdatedDate

                updatedDate = (<div >

                    {Utilities.getDateOnly(updatedDateValue)}

                </div>
                );
                 
    } else {
        const updatedOrderForm = {
            ...this.state.gradeLevelForm
        };
            
        for (let i = 0; i < this.props.gradeLevels.length; i++) {
            let newValueForCC = {};
            newValueForCC.gradeLevel = 'I' + this.props.gradeLevels[i].gradeLevel;
            newValueForCC.value = 0;
            newValueForCC.valid = false;
            newValueForCC.touched = false;
            valuesForChildComponent.push(newValueForCC);
        }
        
        let x = {view: 'notnull'};//just any obnject
        controls = (
            <div>
                {valuesForChildComponent.map((gradeData) => {

                    return <InputGradeLevelControls
                        key={j++}
                        id={gradeData.gradeLevel}
                        inputGradeLevelData={gradeData}
                        change={this.onHandleChangeChildComponent}
                        passValue={this.state.gradeLevelForm[gradeData.gradeLevel].value}
                        gLStyle={x}
                    />;
                })

                }

            </div>
        );
    }

let isDefaultReportDate = (this.state.reportDateID === this.props.defaultReportDateID);
if (this.props.userProps.user.role == 'Campus' && !isDefaultReportDate) isSubmitDisabled = true;
if (this.state.schoolID == '') isSubmitDisabled = true;


        return (
            <IfAnyGranted expected={['Admin', 'Campus']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
            <div id="page-wrapper">
                <div className="container-fluid">
                    <form onSubmit={this.handleFormSubmit}>
                        <div className="row bg-title">
                            <div className="col-lg-12 col-md-12 col-sm-12 ">
                                <span>Enrollment Input</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div>
                                    <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Campus Name:</label>
                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                        <Dropdown width="200px" options={this.props.allCampuses} onChanged={this.onCampusDropdownChanged} 
                                            selectedKey={this.state.schoolID} disabled={this.state.isCampusDD_Disabled}
                                            placeHolder="Select Campus"/>
                                        </div>
                                    </div>
                                    <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Report Date:</label>
                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                        <Dropdown options={Utilities.getCalendarReportDatesByYearForDD(this.state.allReportDates, this.state.schoolYear)}
                                                                selectedKey={this.state.reportDateID}
                                                                onChanged={this.onReportDatesDropdownChanged}
                                                                />
                                        </div>
                                    </div>
                                    <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Campus Number:</label>
                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                            <label>{this.state.schoolID}</label>
                                        </div>
                                    </div>
                                    <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                        <label  className="col-md-2 col-lg-2 col-sm-2">Grade Levels:</label>
                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                            {controls}
                                            <div className="row">
                                                <div className="column">{inputEE}</div> 
                                                <div className="column">{inputPK}</div>
                                                <div className="column">{inputKG}</div>
                                                <div className="column">{input01}</div>
                                                <div className="column">{input02}</div>
                                                <div className="column">{input03}</div> 
                                                <div className="column">{input04}</div>
                                                <div className="column">{input05}</div>
                                                <div className="column">{input06}</div>
                                                <div className="column">{input07}</div>
                                                <div className="column">{input08}</div>
                                                <div className="column">{input09}</div>
                                                <div className="column">{input10}</div>
                                                <div className="column">{input11}</div>
                                                <div className="column">{input12}</div>
                                            </div>
                                       </div>
                                    </div>
                                    <div  className="col-lg-12 col-md-12 col-sm-12 hidden-xs">
                                        <label className="p-r-10"><b>Created By:</b><label className="p-r-10">
                                                            {createdBy}
                                                        </label>
                                        </label> &nbsp;&nbsp;<label className="p-r-10"><b>Created Date:</b><label className="p-r-10">
                                                            {createdDate}
                                                    </label>
                                        </label>&nbsp;&nbsp;<label className="p-r-10"><b>Updated By:</b> <label className="p-r-10">
                                                        {updatedBy}
                                                    </label>
                                        </label>&nbsp;&nbsp;<label className="p-r-10"><b>Updated Date:</b><label className="p-r-10">
                                                        {updatedDate}
                                                    </label>
                                        </label>
                                    </div>
                                    <br/><br/><br/>
                                    <div  className="col-lg-12 col-md-12 col-sm-12 hidden-xs">
                                        <input type="submit"
                                                className="btn btn-primary float-right"
                                                value="Save"
                                                disabled={isSubmitDisabled} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <Dialog
                    hidden={this.state.hideDialog}
                    onDismiss={this.closeDialog}
                    dialogContentProps={{
                        type: DialogType.normal,
                        title: 'Enrollment Input',
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
        allReportDates: calendarReportDatesFormattedForDropdown(state.calendarReportDates),
        defaultReportDateID:  Utilities.getMostRecentReportDateID(state.calendarReportDates),
        reportDate: state.reportDate,
        enrollments: state.enrollments,
        enrollment: state.enrollment,
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        gradeLevels: state.gradeLevels,
        calendarReportDates: state.calendarReportDates,
        campusProfile: state.campusProfile
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, sharedActions, enrollmentActions,enrollmentInputActions, ajaxActions, gradeLevelsActions), dispatch) };
}

EnrollmentInputPage.propTypes = {
    title: PropTypes.string,
    userProps: PropTypes.object,
    campuses: PropTypes.array,
    allCampuses: PropTypes.array,
    actions: PropTypes.object,
    schoolYear: PropTypes.string,
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    reportDateID: PropTypes.string,
    reportDate: PropTypes.string,
    allReportDates: PropTypes.array,
    enrollments: PropTypes.array,
    gradeLevels: PropTypes.array,
    enrollment: PropTypes.object,
    calendarReportDates: PropTypes.array,
    maxCalendarID: PropTypes.number,
    campusEnrollmentID: PropTypes.number,
    //onCampusDropdownChanged: PropTypes.func,
    save: PropTypes.func,
    load: PropTypes.func,
    showDialog: PropTypes.func,
    displayMessage: PropTypes.func,
    onSavingSucceeds: PropTypes.func,
    onSavingFails: PropTypes.func,
    handleFormSubmit: PropTypes.func,
    onHandleChangeChildComponent: PropTypes.func,
    handleClearForm: PropTypes.func,
    defaultReportDateID: PropTypes.string,
    onReportDatesDropdownChanged: PropTypes.func,
    cancel: PropTypes.func,
    okDialog: PropTypes.func,
    campusProfileID: PropTypes.number,
    campusProfile: PropTypes.object,
    cancelToHome: PropTypes.func

};

export default connect(mapStateToProps, mapDispatchToProps)(EnrollmentInputPage);