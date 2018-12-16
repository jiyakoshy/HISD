import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sharedActions from '../../actions/sharedActions';


import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Link, IndexLink } from 'react-router-dom';
import { campusesFormattedForDropdownGeneric, campusesFormattedForDropdown, calendarReportDatesFormattedForDropdown, enrollmentsMaxCalendarID } from './../../selectors/selectors';
import Utilities from '../../utilities/utilities';
import * as enrollmentActions from '../../actions/enrollmentActions';
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
        //this.handleClearForm = this.handleClearForm.bind(this);
        this.onHandleChangeChildComponent = this.onHandleChangeChildComponent.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.cancelToHome = this.cancelToHome.bind(this);



        this.state = {
            counterEntries: 0,
            campusID: (this.props.userProps.user.role == 'Campus') ? this.props.CampusID : '001',
            campusName: (this.props.userProps.user.role == 'Campus') ? this.props.campusName : 'Austin High School',

            schoolYear: Utilities.getSchoolYear(),
            schoolID: (this.props.userProps.user.role == 'Campus') ? this.props.CampusID :'',

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
            renderActiveGradesCounts: [],//Utilities.PreShapeData(this.props.gradeLevels,parseInt(this.props.defaultReportDateID),this.props.enrollments),
            //renderActiveGradesCounts: [],
            
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
            //additional top-level properties' string length should avoid length 3 since they're iterated repeatedly
            , formIsValid: false
            , loading: false
            , insertedPK: 0

        };
        
    }


    componentWillMount() {
        if (this.props.userProps.user.role == 'Campus' || this.props.userProps.user.role == 'Reports') this.setState({ isCampusDD_Disabled: true });
        if (this.state.counterEntries !== 0) return;
        if (typeof this.state.renderActiveGradesCounts !== 'undefined' && this.state.renderActiveGradesCounts.length > 0) return;
        

        //Following is the case where Campus User is loading page for first time for a date that has no data.
        //very similar to 'onReportDatesDropdown' except no dropdowns have been touched yet by user
        this.setState({counterEntries: 1});
        let renderActiveGradesCounts = [];
        let indexEnrollment = -1;
        
        let schoolYear = '';
        let schoolYearEnd = '';
        let enrollments = [];
        let calendarID = parseInt(this.state.reportDateID);
		let theReportDate = Utilities.getMostRecentReportDate([...this.props.calendarReportDates]);
        this.setState({ reportDateID: this.props.defaultReportDateID, reportDate: theReportDate});
        //this.clearFormState();

               
        //REPORT
        
        console.log('reportDateID as integer ----', calendarID);
        
        schoolYear = Utilities.getSchoolYearFromReportDate(Utilities.getDateOnly(theReportDate));//
        schoolYearEnd = schoolYear.substring(5,9);
        this.setState({ schoolYear: schoolYear });
        this.setState({ schoolYearEnd: schoolYearEnd });
        
        //CAMPUS
        let schoolID = this.props.CampusID;
        if (schoolYear.length == 0 || !schoolID || schoolID.length == 0) return;//gfm add msg
        //GRADE LEVEL
        this.props.actions.loadGradeLevelsByCampusAndYear(schoolID, schoolYearEnd).then(obj => {
            console.log('this.props.gradeLevels.length---',this.props.gradeLevels.length);
            console.log('this.props.gradeLevels---', this.props.gradeLevels);
        });
        
        //ENROLLMENT
        this.props.actions.loadAllEnrollmentsByYearCampus(schoolID, schoolYear).then(obj => {
            
            enrollments = [...this.props.enrollments];
            console.log('enrollments----', enrollments);
            
            //find it but don't retrieve it
            let indexEnrollment = enrollments.map(function (e) { return e.CalendarID; }).indexOf(calendarID);
            
            //SHAPE
            if (indexEnrollment > -1) {
                console.log('the indexEnrollment in onReportsDropdown is---------------', indexEnrollment);
                                
                let theEnrollment = enrollments[indexEnrollment];
                renderActiveGradesCounts = Utilities.ShapeData(this.props.gradeLevels, theEnrollment);
                
                console.log('renderActiveGradesCounts----------', this.state.renderActiveGradesCounts);
                
            } else {
                renderActiveGradesCounts = this.ShapeDataNoEnrollment(this.props.gradeLevels);
            }
             // 1 console
             this.setState({ renderActiveGradesCounts: renderActiveGradesCounts });
             this.setFormStateFromRenderActiveGradesCounts(renderActiveGradesCounts);
            
        });
        
        
        
        this.props.actions.loadCampusProfile(schoolID, schoolYear).then(
            campusProfile => {
                console.log('FROM LINE 494 onReportDatesDropdownChanged IN EIP, this.props.campusProfile----', this.props.campusProfile);
                this.setState(
                    {
                        campusProfileID: this.props.campusProfile.campusProfileID
                        
                    }
                );
            }
        );
        


    }

    componentDidMount() {
        //this.props.gradeLevels could be holding diff GLs from current school
       //so reset using current year...and campus having this.state.schoolID should appear in campus dropdown
       const schoolYearEnd = Utilities.getSchoolYearEnd();
       console.log('this.state.schoolID AT in didmount----------------',this.state.schoolID);
       console.log('schoolYearEnd AT in didmount----------------',schoolYearEnd);
       
       console.log('this.state.schoolID AT in didmount----------------',this.state.schoolID);
       console.log('this.props.gradLevels AT in didmount----------------',this.props.gradeLevels);
       console.log('this.state.renderActiveGradesCounts  AT in didmount----------------',this.state.renderActiveGradesCounts);

       if (typeof this.state.renderActiveGradesCounts == 'undefined' || this.state.renderActiveGradesCounts.length == 0){
               let promise = this.props.actions.loadGradeLevelsByCampusAndYear(this.state.schoolID, schoolYearEnd);
               promise.then(gradeLevels => {

                   console.log('completed loadGradeLevelsByCampusAndYear call AT in didmount', gradeLevels);
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
        //let reportDateID = this.props.defaultReportDateID;
        //this.setState({ reportDateID: reportDateID });
        let reportDateID = this.state.reportDateID;
        this.setState({ schoolID: item.key });
        this.clearFormState();
        this.props.actions.clearEnrollments();
        this.setState({renderActiveGradesCounts: []});
        let renderActiveGradesCounts = [];
        //IF NEW CAMPUS, THEN IT WAS SET BY ADMIN

              
        //since reportDateID was set to defaultReportDateID above, we are current year for now
        this.props.actions.loadGradeLevelsByCampusAndYear(item.key, Utilities.getSchoolYearEnd()).then(obj => {
        //2console
        });
        
        //E
        this.props.actions.loadAllEnrollmentsByYearCampus(item.key, Utilities.getSchoolYear()).then(obj => {
            
            enrollments = [...this.props.enrollments];
            //1 console
            
            //find it but don't retrieve it
            let indexEnrollment = enrollments.map(function (e) { return e.CalendarID; }).indexOf(parseInt(reportDateID));
            //S
            if (indexEnrollment > -1) {
                //1 console    
                let theEnrollment = enrollments[indexEnrollment];
                renderActiveGradesCounts = Utilities.ShapeData(this.props.gradeLevels, theEnrollment);
                
               
            } else {
                renderActiveGradesCounts = this.ShapeDataNoEnrollment(this.props.gradeLevels);
            }
             // 1 console
             this.setState({ renderActiveGradesCounts: renderActiveGradesCounts });
             this.setFormStateFromRenderActiveGradesCounts(renderActiveGradesCounts);
        });
        
        //any save while user using this campus will need to use a correct campusProfileID
        //this.props.actions.loadCampusProfile(item.key, Utilities.getSchoolYear());
        //7/14
        //GFM Utilities.getSchoolYear() IS NOT GENERAL ENOUGH FOR CASE OF PRIOR YEARS BUT HERE WE ARE NOT CERTAIN THAT WE HAVE A report date
        // ALSO, loadAllEnrollmentsByYearCampus ABOVE USES Utilities.getSchoolYear()
        // ALSO, EnrollmentInputPage in BRD is for current year only
        this.props.actions.loadCampusProfile(item.key, Utilities.getSchoolYear()).then(
            campusProfile => {
                console.log('LINE 391 CampusDD WHERE CAMPUSPROFILE RETRIEVED, this.props.campusProfile.campusProfileID----', this.props.campusProfile.campusProfileID);
                /* this.setState(
                    {
                        campusProfileID: this.props.campusProfile.campusProfileID}
                ); */
            }
        );
    }

    ShapeDataNoEnrollment(gradeLevels) {
        console.log("First gradeLevels---", gradeLevels);
        
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
    
        console.log("Last ShapeData Array---", shortEnrollments);
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
        
        //REPORT
        
        console.log('reportDateID as integer ----', calendarID);
        
        schoolYear = Utilities.getSchoolYearFromReportDate(item.text);//this.state.allReportDates[indexOfCalRepDate].SchoolYear;
        schoolYearEnd = schoolYear.substring(5,9);
        this.setState({ schoolYear: schoolYear });
        this.setState({ schoolYearEnd: schoolYearEnd });
        //}
        //CAMPUS
        let schoolID = this.state.schoolID;
        if (schoolYear.length == 0 || !schoolID || schoolID.length == 0) return;//gfm add msg
        //GRADE LEVEL
        this.props.actions.loadGradeLevelsByCampusAndYear(schoolID, schoolYearEnd).then(obj => {
            console.log('this.props.gradeLevels.length---',this.props.gradeLevels.length);
            console.log('this.props.gradeLevels---', this.props.gradeLevels);
        });
        
        //ENROLLMENT
        this.props.actions.loadAllEnrollmentsByYearCampus(schoolID, schoolYear).then(obj => {
            
            enrollments = [...this.props.enrollments];
            console.log('enrollments----', enrollments);
            let reportDateID = item.key;
            //find it but don't retrieve it
            let indexEnrollment = enrollments.map(function (e) { return e.CalendarID; }).indexOf(parseInt(reportDateID));
            
            //SHAPE
            if (indexEnrollment > -1) {
                console.log('the indexEnrollment in onReportsDropdown is---------------', indexEnrollment);
                                
                let theEnrollment = enrollments[indexEnrollment];
                renderActiveGradesCounts = Utilities.ShapeData(this.props.gradeLevels, theEnrollment);
                
                console.log('renderActiveGradesCounts----------', this.state.renderActiveGradesCounts);
                
            } else {
                renderActiveGradesCounts = this.ShapeDataNoEnrollment(this.props.gradeLevels);
            }
             // 1 console
             this.setState({ renderActiveGradesCounts: renderActiveGradesCounts });
             this.setFormStateFromRenderActiveGradesCounts(renderActiveGradesCounts);
            
        });
        
        
        
        this.props.actions.loadCampusProfile(schoolID, schoolYear).then(
            campusProfile => {
                console.log('FROM LINE 494 onReportDatesDropdownChanged IN EIP, this.props.campusProfile----', this.props.campusProfile);
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
        //let changeItem = {gradeLevel: e.target.id, newValue: e.target.value, touched: true, valid: false};

        let inputIdentifier = e.target.id;

        const updatedOrderForm = {
            ...this.state.gradeLevelForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };


        updatedFormElement.valid = this.checkValidity(e.target.value);
        updatedFormElement.value = updatedFormElement.valid ? parseInt(e.target.value) : 0;
        console.log('updatedFormElement.value ------------',updatedFormElement.value);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        //should not check every grade because not every grade is touched

        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            if (updatedOrderForm[inputIdentifier].touched) {
                formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
            }

        }
        this.setState({ gradeLevelForm: updatedOrderForm, formIsValid: formIsValid });

        //this.setState({ ownerName: e.target.value }, () => console.log('name:', this.state.ownerName));
    }


    //7/1
    setFormStateFromRenderActiveGradesCounts(renderActiveGradesCounts){
        let GL = '';
        //let updatedFormElement = {};

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
        //set all these back leaving identifier (gradeLevel) alone 
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
        //NOTE SPELLING OF THESE PRIMARY KEY COLUMNS IS REQUIRED (ON LEFT SIDE OF = SIGN)
        //UNTIL CHANGED BY SERVICE
        // enrollment.Id = campusEnrollmentID;
        // enrollment.CampusProfileId = this.props.userProps.user.campusProfileID;
        //enrollment.CalendarId = calendarID;
        //
        //
        //SINCE CAMPUS USER IS ALMOST ALWAYS GOING TO BE COMING IN TO INSERT/EDIT THE DEFAULTREPORTDATEID
        //SOME SIMPLIFICATIONS ARE POSSIBLE
        //BUT ADMIN CAN COME IN WITH ANY CALENDARID
        //THE CASE OF USER HAVING JUST ENTERED DEFAULTREPORTDATE DATA FOR FIRST TIME AND NOW IS RE-SAVING
        //MEANS CALENDARID MAY NOT BE IN props.enrollments BUT JUST GOT STORED IN STATE A FEW SECONDS PRIOR
        //SO CALENDARID OF THIS RECORD MUST BE COMPARED TO STATE VALUE

        let formIsValid = this.state.formIsValid;
        if (!formIsValid) this.onSavingFails();

        let campusEnrollmentID = 0;
        //let calendarID = 0;
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
            console.log('isDynamicUpdate = true, pkForUpdate is ' + pkForUpdate);
        }

        if (this.state.campusProfileID == 0 || this.props.campusProfile == 'undefined' || this.props.campusProfile.campusProfileID < 1){
            if (this.state.schoolID !== ''){
             this.props.actions.loadCampusProfile(this.state.schoolID, Utilities.getSchoolYear()).then(
                 campusProfile => {
                     console.log('WITHIN EIP SAVE this.props.campusProfile----', this.props.campusProfile);
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
            //updatedOrderForm is only ever modified in isInsert = true code
            console.log('it is an UPDATE');
            //only 2 possibilities: it is a match to existing table row or it is a isDynamicUpdate
            // the isDynamicUpdate if record that was just INSERTED is being immediately edited by user in case REDUX has not reported back the pk of new record
            
            indexOfEnrollment = enrollments.map(function (e) { return e.CalendarID; }).indexOf(calendarID);
            if (indexOfEnrollment > -1) {
                enrollmentFromService = enrollments[indexOfEnrollment];
                campusEnrollmentID = enrollmentFromService.CampusEnrollmentID;
                console.log('campusEnrollmentID to be updated by enrollments.map ---------', campusEnrollmentID);
            } else if (isDynamicUpdate) {
                campusEnrollmentID = pkForUpdate;
                console.log('campusEnrollmentID to be updated by pkForUpdate which is ---------', pkForUpdate);
            } else {
                console.log('UNABLE to identify  a campusEnrollmentID to use FOR UPDATE');
            }
            enrollment.Id = campusEnrollmentID;

            // a record already exists with the specified calendarID, making current save an update rather than insert
            //an indexOfEnrollment might not be found if enrollments do not reflect a very recent insert
            //if so, these will be unavailable:
            //                          1) total = enrollmentFromService['Total'];
            //                          2) priorValue = enrollmentFromService[uiID];
            //                          3) campusEnrollmentID = enrollmentFromService.CampusEnrollmentID;
            //
            // 1 and 2 are tolerable but not having 3) is a problem for patch


            let priorValue = 0;

            flagDontSave = true;
            for (let inputIdentifier in updatedOrderForm) {
                if (inputIdentifier.length == 3) {//avoid other gradeLevelForm top-level properties
                    if (updatedOrderForm[inputIdentifier].touched) {
                        //formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
                        uiValue = updatedOrderForm[inputIdentifier].value;
                        if (uiValue > 0) flagDontSave = false;
                        enrollment[inputIdentifier] = uiValue;
                       
                        console.log('DID USE inputIdentifier  -----', inputIdentifier);

                    }
                } else {
                    console.log('un-used inputIdentifiers------ ', inputIdentifier);
                }


            }

            if (flagDontSave) return;//also add message gfm
            console.log('passed empty values check-----------------');
            enrollment.UpdatedBy = this.props.userProps.user.fullName;
            enrollment.UpdatedDate = date;
            //enrollment.Total = total;//do later
            //console.log("Test start----",enrollment);
            let promise = this.props.actions.updateEnrollment(enrollment);
            console.log('saving to enrollment.id = ---------------- ', enrollment.Id);
            promise.then(this.onSavingSucceeds())
                .catch(reason => {
                    this.props.actions.ajaxCallError();
                    this.setState({ subtext: 'There was a problem updating these Enrollment values. Operation canceled.', dialogAction: '' });
                    this.showDialog();
                });


            result = true;
        }


        
        if (isInsert) {
            console.log('it is an INSERT');
           

            uiValue = 0;
            uiID = '';
            total = 0;
            console.log('before assigning this.props.campusProfile.campusProfileID to enrollment-------------- ', this.props.campusProfile.campusProfileID);
            enrollment.CampusProfileId = this.props.campusProfile.campusProfileID;//touched 7/14 //this.state.campusProfileID;//determined by school and year
            console.log('ASSIGNED TO enrollment.CampusProfileId WHOSE VAL = -------------', enrollment.CampusProfileId);

            enrollment.CalendarId = calendarID;

            flagDontSave = true;
            
            for (let inputIdentifier in updatedOrderForm) {
                //touched and untouched values are part of insert...untouched are zero in gradeLevelForm
                if (inputIdentifier.length == 3) {//avoid other gradeLevelForm top-level properties   
                    uiValue = updatedOrderForm[inputIdentifier].value;
                    if (uiValue > 0) flagDontSave = false;
                    uiID = inputIdentifier;

                    enrollment[uiID] = uiValue;//// CRITICAL!!!!

                }
            }
            if (flagDontSave) {
                console.log('EXITING EARLY, NO NON-ZERO VALUES OBSERVED  = -------------- ', enrollment[uiID]);
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
                console.log("SUccess------", enrollment);
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
        //save is the update but returns false if an insert is required instead
        this.save();


        console.log('handleFormSubmit');
        //there may not be many use cases for next line---need to determine
        //this.handleClearForm(e);
    }

    

    render() {

        //if ( this.props.userProps.user.role == 'Reports') return <div/>;
        
        console.log('EIP -- this.props.userProps.user.role-------------', this.props.userProps.user.role);
        console.log('EIP -- this.props.userProps.user.isChoseSchool-------------', this.props.userProps.user.isChoseSchool);
        //console.log('EIP -- this.state.counterEntries-------------', this.state.counterEntries);
        /* if (this.props.userProps.user.role !== 'Admin' && this.props.userProps.user.role !== 'Campus') return;
        if (this.props.userProps.user.role == 'Admin'){
            if (this.props.userProps.user.isChoseSchool === false){
                //place message here or at HomePage/PageHeader gfm
                this.cancelToHome();
                
                } 
        } */
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
        
        //let isDisabled = true;
        let isSubmitDisabled = false;
        let campusDD = null;
        let j = 0;
        let valuesForChildComponent = [];

        
        let showMaxCalID = null;
        
        
                if (typeof this.state.renderActiveGradesCounts !== 'undefined' && this.state.renderActiveGradesCounts.length > 0) {	//here build gradeLevelForm from shapedata output OR prepare in a better way inside ShapeData
        
                 let indexEE = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('EE');
          console.log(indexEE);
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
                 console.log(indexPK);
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


                //renderActiveGradesCounts = ShapeData(this.props.gradeLevels, theEnrollment);
                // console.log('renderActiveGradesCounts---', this.props.gradeLevels);
                //   what if no enrollments since new date?
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



                

        console.log('this.state.renderActiveGradesCounts--------------', this.state.renderActiveGradesCounts);

                 
    } else {
        //there is nothing in this.state.renderActiveGradesCounts
        const updatedOrderForm = {
            ...this.state.gradeLevelForm
        };
        //this.props.gradeLevels could be holding diff GLs from current school
        //so componentDidMount updates the props.gradeLevels
        
            
        for (let i = 0; i < this.props.gradeLevels.length; i++) {
            let newValueForCC = {};
            newValueForCC.gradeLevel = 'I' + this.props.gradeLevels[i].gradeLevel;
            console.log('newValueForCC.gradeLevel-------------------',newValueForCC.gradeLevel);
            newValueForCC.value = 0;
            //next two not necessary
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

    if(this.props.userProps.user.role == 'Admin'){
        campusDD = (
            <div>
                <div className="dropDownPageHeader pull-right">
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
                <div className="dropDownPageHeader pull-right">
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
   



//controls whether Save btn visible....adequate to change isSubmitDisabled here only?
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
                                    <span className="page-title-custom">Enrollment Input</span>


                                    {campusDD}
                                </div>
                            </div>


                            <div className="form-group row ggResetWidth col-md-12 col-lg-8 col-sm-12">

                                <div>
                                    <table className="ggusers">

                                        <tbody>
                                            <tr>
                                                <td>

                                                </td>
                                                <th></th>
                                                <td>

                                                </td>
                                            </tr>
                                            <tr>
                                                <td>

                                                </td>
                                                <th></th>
                                                <td>

                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="form-group gg3">
                                                        <label className="p-r-10" >Report Date:</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="form-group gg3">
                                                        <div className="p-r-20 ggFixWidth">
                                                            <Dropdown options={Utilities.getCalendarReportDatesByYearForDD(this.state.allReportDates, Utilities.getSchoolYear())}
                                                                selectedKey={this.state.reportDateID}
                                                                onChanged={this.onReportDatesDropdownChanged}

                                                            />



                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-center">
                                                        
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="form-group  gg3">
                                                        <label className="p-r-10"><b>Campus Number:</b></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="form-group  gg3">
                                                        <label className="p-r-10">
                                                            {this.state.schoolID}
                                                        </label>

                                                    </div>
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>


                                <p></p>
                                <div className="ggGradeLevel">
                                    <p><label className="p-r-10"><b>Grade Levels</b>
                                    </label>
                                    </p>
                                </div>
                                <div>
                                </div>
                                <div>
                                    {controls}
                                </div>     
                                <div>
                                    {inputEE}
                                    {inputPK}
                                    {inputKG}
                                    {input01}
                                    {input02}
                                    {input03}
                                    {input04}
                                    {input05}
                                    {input06}
                                    {input07}
                                    {input08}
                                    {input09}
                                    {input10}
                                    {input11}
                                    {input12}
                            </div>   
                                
                                <div className="clear gg3">

                                    <table className="ggusers">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="form-group  gg3">
                                                        <input
                                                            type="submit"
                                                            className="btn btn-primary float-right"
                                                            value="Save"
                                                            disabled={isSubmitDisabled}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="form-group  gg3">
                                                    </div>
                                                </td>
                                                <td>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="form-group  gg3">
                                                        <label className="p-r-10"><b>Created By:</b></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="form-group  gg3">
                                                        <label className="p-r-10">
                                                            {createdBy}
                                                        </label>
                                                    </div>
                                                </td>
                                                <td>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="form-group  gg3">
                                                        <label className="p-r-10"><b>Created Date:</b>
                                                        </label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="form-group  gg3">
                                                        <label className="p-r-10">
                                                            {createdDate}
                                                        </label>
                                                    </div>
                                                </td>
                                                <td>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="form-group  gg3">
                                                        <label className="p-r-10"><b>Updated By:</b></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="form-group  gg3">
                                                        <label className="p-r-10">
                                                            {updatedBy}
                                                        </label>
                                                    </div>
                                                </td>
                                                <td>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="form-group  gg3">
                                                        <label className="p-r-10"><b>Updated Date:</b>
                                                        </label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="form-group  gg3">
                                                        <label className="p-r-10">
                                                            {updatedDate}
                                                        </label>
                                                    </div>
                                                </td>
                                                <td>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
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
        //allCampuses: campusesFormattedForDropdown(state.campuses, state.userProps.user.campusID, state.userProps.user.campusName),
        allCampuses: campusesFormattedForDropdownGeneric(state.campuses),
        allReportDates: calendarReportDatesFormattedForDropdown(state.calendarReportDates),

        

        //reportDateID: state.userProps.user.defaultReportDateID,
        defaultReportDateID:  Utilities.getMostRecentReportDateID(state.calendarReportDates),
        reportDate: state.reportDate,

        enrollments: state.enrollments,
        enrollment: state.enrollment,

        CampusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        gradeLevels: state.gradeLevels,
        calendarReportDates: state.calendarReportDates,

        //not yet exists in redux
        //maxCalendarID: enrollmentsMaxCalendarID(state.enrollments),

        //campusProfileID: state.userProps.user.campusProfileID,
        campusProfile: state.campusProfile
        

    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, sharedActions, enrollmentActions, ajaxActions, gradeLevelsActions), dispatch) };
}

EnrollmentInputPage.propTypes = {
    title: PropTypes.string,
    userProps: PropTypes.object,
    campuses: PropTypes.array,
    allCampuses: PropTypes.array,
    actions: PropTypes.object,
    schoolYear: PropTypes.string,
    CampusID: PropTypes.string,

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

    onCampusDropdownChanged: PropTypes.func,
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