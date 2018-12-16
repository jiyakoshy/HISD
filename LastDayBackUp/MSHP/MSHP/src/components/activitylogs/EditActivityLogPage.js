import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as activityLogsActions from '../../actions/activityLogsActions';
import * as mentorsActions from '../../actions/mentorsActions';
import * as menteesActions from '../../actions/menteesActions';
import * as activityMenteesActions from '../../actions/activityMenteesActions';
import * as adminActions from '../../actions/adminActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import 'rc-time-picker/assets/index.css';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { BootstrapTable, TableHeaderColumn, DeleteButton } from 'react-bootstrap-table';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { HoverCard,IExpandingCardProps } from 'office-ui-fabric-react/lib/HoverCard';
import { DetailsList, buildColumns, IColumn, CheckboxVisibility } from 'office-ui-fabric-react/lib/DetailsList';
import { IObjectWithKey, ISelection, Selection, SelectionMode, SelectionZone } from 'office-ui-fabric-react/lib/Selection';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import Utilities from '../../utilities/utilities';
import { teacherFormattedForDropdown, activityCodesFormattedForDropdown, cbmStandardsFormattedForCheckbox, mentoringToolsFormattedForCheckbox } from '../../selectors/selectors';
import { Util } from 'sp-pnp-js/lib/utils/util';
import LeaderInfo from '../common/LeaderInfo';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

let hasMounted = false;

class EditActivityLogPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        let hasMounted = false;
        
        const activityLogID = this.props.match.params.ActivityLogID;
        if(!activityLogID){
            this.displayMessage('Error: Activity ID not specified.', 'CLOSE');
        }
        this.state = {
            campusID: PropTypes.string,
            mentorEmployeeID: '',
            mentorName: '',
            activityCodeID: '',
            firstDayOfWeek: DayOfWeek.Sunday,
            activityDate: null,
            activityTime: null,
            timeSpent: null,
            mentorComments: '',
            mentorsOptions: [],
            menteesOptions: [],
            instructionalOptions: [],
            planningOptions: [],
            professionalOptions: [],
            mentoringToolsOptions: [],
            planningSelection: new Selection({ onSelectionChanged: this.onSelectionChanged }),
            instructionalSelection: new Selection({ onSelectionChanged: this.onSelectionChanged }),
            professionalSelection: new Selection({ onSelectionChanged: this.onSelectionChanged }),
            mentoringToolsSelection: new Selection({ onSelectionChanged: this.onSelectionChanged }),
            dayPickerStrings: Utilities.getDayPickerStrings(),
            hideDialog: true,
            dialogAction: '',
            subtext: ''
        };

        this.onMentorDropdownChanged = this.onMentorDropdownChanged.bind(this);
        this.onMenteeDropdownChanged = this.onMenteeDropdownChanged.bind(this);
        this.onChangeMentorComments = this.onChangeMentorComments.bind(this);

        this.onActivityCodeDropdownChanged = this.onActivityCodeDropdownChanged.bind(this);
        
        this.onSelectActivityDate = this.onSelectActivityDate.bind(this);
        this.onActivityTimeChanged = this.onActivityTimeChanged.bind(this);
        this.onTimeSpentChanged = this.onTimeSpentChanged.bind(this);

        this.addMentee = this.addMentee.bind(this);
        this.deleteMentee = this.deleteMentee.bind(this);
        this.handleDeleteRow = this.handleDeleteRow.bind(this);
        this.createCustomDeleteButton = this.createCustomDeleteButton.bind(this);
        this.loadValues = this.loadValues.bind(this);

        this.setInstructionalSelection = this.setInstructionalSelection.bind(this);
        this.setPlanningSelection = this.setPlanningSelection.bind(this);
        this.setProfessionalSelection = this.setProfessionalSelection.bind(this);
        this.setMentoringToolsSelection = this.setMentoringToolsSelection.bind(this);

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    componentDidMount() {
        this.props.actions.clearActivityLog();
        const campusID = this.props.campusID;
        const timeConfigurationID = this.props.userProps.timeConfigurationID;
        const activityLogID = this.props.match.params.ActivityLogID;
        this.props.actions.loadAllActivityCodes()
        .then(activityCodes => {            
            this.setState({activityCodesOptions: activityCodesFormattedForDropdown(this.props.activityCodes)});
            this.props.actions.loadMentorsInRelationshipsByCampusID(campusID, timeConfigurationID)
            .then(mentors => {
                this.setState({mentorsOptions: teacherFormattedForDropdown(this.props.mentors)});
                this.props.actions.loadAllMentoringTools()
                .then(mentoringTools => {
                    this.setState({mentoringToolsOptions: mentoringToolsFormattedForCheckbox(this.props.mentoringTools) });
                    this.props.actions.loadAllActivityStandards()
                    .then(activityStandards => {
                        if(this.props.activityStandards && this.props.activityStandards.length >= 4){
                            this.setState({
                                instructionalOptions: cbmStandardsFormattedForCheckbox(this.props.activityStandards[1].ActivityStandardItems), 
                                planningOptions: cbmStandardsFormattedForCheckbox(this.props.activityStandards[2].ActivityStandardItems),
                                professionalOptions: cbmStandardsFormattedForCheckbox(this.props.activityStandards[3].ActivityStandardItems) 
                            });
                            this.props.actions.loadActivityLogByID(activityLogID)
                            .then(activityLog => {
                                const mentorEmployeeID = this.props.activityLog.MentorEmployeeID;
                                this.props.actions.createActivityMentees(this.props.activityLog.Mentees);
                                this.props.actions.loadMenteesInActiveRelationshipsByMentorID(mentorEmployeeID, timeConfigurationID)
                                .then(mentees => {
                                    this.setState({menteesOptions: teacherFormattedForDropdown(this.props.mentees)});
                                })
                                .catch(error =>  this.setState({menteesOptions: []}));
                                this.loadValues();
                            })
                            .catch(reason => {
                                this.props.actions.ajaxCallError();
                                this.displayMessage('There was a problem retrieving Activity Log data. Operation canceled. Reason: ' + reason, 'CLOSE');
                            });
                        }
                    })
                    .catch(reason => {
                        this.props.actions.ajaxCallError();
                        this.displayMessage('There was a problem retrieving Activity Standards data. Operation canceled.', 'CLOSE');
                    });
                })
                .catch(reason => {
                    this.props.actions.ajaxCallError();
                    this.displayMessage('There was a problem retrieving Activity Tools data. Operation canceled.', 'CLOSE');
                });
            })
            .catch(reason => {
                this.props.actions.ajaxCallError();
                this.displayMessage('There was a problem retrieving Activity Log mentor data. Operation canceled.', 'CLOSE');
            });
        })
        .catch(reason => {
            this.props.actions.ajaxCallError();
            this.displayMessage('There was a problem retrieving Activity Codes. Operation canceled.', 'CLOSE');
        });
    }

    setProfessionalSelection(){
        let professionalSelection = this.state.professionalSelection;
        let professionalOptions = this.state.professionalOptions;
        let selectedItems = this.props.activityLog.ActivityStandardItems;
        let selectedProps = {};
        professionalOptions.forEach(function(element, index){
            for(let i=0; i < selectedItems.length; i++){
                if(selectedItems[i].ActivityStandardItemID === element.key){
                    selectedProps[index.toString()] = true;
                    break;
                }
            }
        });
        professionalSelection._exemptedIndices = selectedProps;
        this.setState({professionalSelection: professionalSelection});
    }

    setInstructionalSelection(){
        let instructionalSelection = this.state.instructionalSelection;
        let instructionalOptions = this.state.instructionalOptions;
        let selectedItems = this.props.activityLog.ActivityStandardItems;
        let selectedProps = {};
        instructionalOptions.forEach(function(element, index){
            for(let i=0; i < selectedItems.length; i++){
                if(selectedItems[i].ActivityStandardItemID === element.key){
                    selectedProps[index.toString()] = true;
                    break;
                }
            }
        });
        instructionalSelection._exemptedIndices = selectedProps;
        this.setState({instructionalSelection: instructionalSelection});
    }

    setPlanningSelection(){
        let planningSelection = this.state.planningSelection;
        let planningOptions = this.state.planningOptions;
        let selectedItems = this.props.activityLog.ActivityStandardItems;
        let selectedProps = {};
        planningOptions.forEach(function(element, index){
            for(let i=0; i < selectedItems.length; i++){
                if(selectedItems[i].ActivityStandardItemID === element.key){
                    selectedProps[index.toString()] = true;
                    break;
                }
            }
        });
        planningSelection._exemptedIndices = selectedProps;
        this.setState({planningSelection: planningSelection});
    }

    setMentoringToolsSelection(){
        let mentoringToolsSelection = this.state.mentoringToolsSelection;
        let mentoringTools = this.state.mentoringToolsOptions;
        let selectedItems = this.props.activityLog.ActivityToolItems;
        let selectedProps = {};
        mentoringTools.forEach(function(element, index){
            for(let i=0; i < selectedItems.length; i++){
                if(selectedItems[i].ActivityToolItemID === element.key){
                    selectedProps[index.toString()] = true;
                    break;
                }
            }
        });
        mentoringToolsSelection._exemptedIndices = selectedProps;
        this.setState({mentoringToolsSelection: mentoringToolsSelection});
    }

    loadValues(){
        this.setMentoringToolsSelection();
        this.setProfessionalSelection();
        this.setInstructionalSelection();
        this.setPlanningSelection();
        const mentorName = this.props.activityLog.MentorLastSurname + ", " + this.props.activityLog.MentorFirstName;
        //Assigning fields
        let activityDate = new Date(Utilities.getDateTime(this.props.activityLog.ActivityStartTime));
        let time = moment().set({hour: activityDate.getHours(), minute:activityDate.getMinutes(), second:activityDate.getSeconds(), millisecond:activityDate.getMilliseconds()});
        this.setState({ 
            mentorEmployeeID: this.props.activityLog.MentorEmployeeID, 
            mentorName: mentorName,
            activityCodeID: this.props.activityLog.ActivityCodeID,
            activityDate: activityDate,
            activityTime: time,
            timeSpent: this.props.activityLog.TimeSpent,
            mentorComments: this.props.activityLog.MentorComments
        });
        //Activity Code
        hasMounted = true;
    }

    onSelectionChanged() {
        
    }

    getInstructionalItems(){
        let selectedItems = [];
        const itemsIndices = Object.keys(this.state.instructionalSelection._exemptedIndices);
        const allItems = this.state.instructionalSelection._items;
        itemsIndices.forEach(function(element) {
            let index = parseInt(element);
            let item = allItems[index];
            if(item){
                selectedItems.push(item.key);
            }
        });
        return selectedItems;
    }

    getPlanningItems(){
        let selectedItems = [];
        const itemsIndices = Object.keys(this.state.planningSelection._exemptedIndices);
        const allItems = this.state.planningSelection._items;
        itemsIndices.forEach(function(element) {
            let index = parseInt(element);
            let item = allItems[index];
            if(item){
                selectedItems.push(item.key);
            }
        });
        return selectedItems;
    }

    getProfessionalItems(){
        let selectedItems = [];
        const itemsIndices = Object.keys(this.state.professionalSelection._exemptedIndices);
        const allItems = this.state.professionalSelection._items;
        itemsIndices.forEach(function(element) {
            let index = parseInt(element);
            let item = allItems[index];
            if(item){
                selectedItems.push(item.key);
            }
        });
        return selectedItems;
    }

    getMentoringTools(){
        let selectedItems = [];
        const itemsIndices = Object.keys(this.state.mentoringToolsSelection._exemptedIndices);
        const allItems = this.state.mentoringToolsSelection._items;
        itemsIndices.forEach(function(element) {
            let index = parseInt(element);
            let item = allItems[index];
            if(item){
                selectedItems.push(item.ActivityToolItemID);
            }
        });
        return selectedItems;
    }

    getMentees(){
        let mentees = [];
        this.props.activityMentees.forEach(function(element) {
            mentees.push(element.MenteeEmployeeID);
        });
        return mentees;
    }

    getActivityStandards(){
        const instructionalItems = this.getInstructionalItems();
        const planningItems = this.getPlanningItems();
        const professionalItems = this.getProfessionalItems();
        return instructionalItems.concat(planningItems).concat(professionalItems);
    }
    
    isValidForm(){
        let isValid = true;
        const activityToolItems = this.getMentoringTools();
        const activityStandards = this.getActivityStandards();
        if(this.state.activityCodeID == ''){
            isValid = false;
            this.displayMessage('Error: Activity Code not selected.', '');
        }
        else if(this.state.activityDate == ''){
            isValid = false;
            this.displayMessage('Error: Activity Date not selected.', '');
        }
        else if(this.state.activityTime == ''){
            isValid = false;
            this.displayMessage('Error: Activity time not selected.', '');
        }
        else if(this.state.timeSpent == ''){
            isValid = false;
            this.displayMessage('Error: Time spent in the activity not selected.', '');
        }
        else if(!this.props.activityMentees || this.props.activityMentees.length === 0){
            isValid = false;
            this.displayMessage('Error: No mentee(s) selected.', '');
        }
        else if(activityToolItems.length === 0){
            isValid = false;
            this.displayMessage('Error: No activity tools items selected.', '');
        }
        else if(activityStandards.length === 0){
            isValid = false;
            this.displayMessage('Error: No activity standards selected.', '');
        }
        return isValid;
    }

    save() {

        if(this.isValidForm()){
            let activityDate = this.state.activityDate;
            const activityStartTime = activityDate.format('yyyy-MM-dd') + "T" + this.state.activityTime.format('HH') + ":" + this.state.activityTime.format('mm') + ":00-05:00";
            const activityDuration = {hours: parseInt(this.state.timeSpent.format('HH')), minutes: parseInt(this.state.timeSpent.format('mm'))};
            const timeSpent = (activityDuration.hours * 60) + activityDuration.minutes;
            const mentees = this.getMentees();
            const activityToolItems = this.getMentoringTools();
            const activityStandards = this.getActivityStandards();

            let activityLog = {
                ActivityLog: {
                    ActivityLogID: this.props.activityLogID,
                    MentorEmployeeID: this.state.mentorEmployeeID,
                    ActivityCodeID: this.state.activityCodeID,
                    ActivityStartTime: activityStartTime,
                    CreatedBy: this.props.userProps.user.loginId,
                    MentorComments: this.state.mentorComments,
                    TimeConfigurationID: this.props.userProps.timeConfigurationID,
                    CampusID: this.props.campusID,
                    Duration: timeSpent
                },
                ActivityToolItemIDs: activityToolItems,
                ActivityStandardItemIDs: activityStandards,
                ActivityLog_MenteeEmployeeIDs: this.getAddedMentees(),
                ActivityLog_DeletedMenteeEmployeeIDs: this.getDeletedMentees()
            };
            let promise = this.props.actions.updateActivityLog(activityLog);
            promise.then((activityLog) => this.onSavingSucceeds())
            .catch(reason => {
                this.props.actions.ajaxCallError();
                this.displayMessage('There was a problem saving this Activity Log. Operation canceled.', '');
            });
        }
    }

    onSavingSucceeds(){
        this.displayMessage('Activity Log successfully saved.', 'SAVED');
    }

    onSavingFails(){
        this.props.actions.ajaxCallError();
        this.displayMessage('Error trying to save an Activity Log.');
    }

    cancel() {
        document.location = '#activitylogs';
    }

    okDialog(){
        if(this.state.dialogAction == 'CLOSE' || this.state.dialogAction == 'SAVED')
            this.cancel();
        else
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

    onMentorDropdownChanged(item) {
        this.setState({ mentorEmployeeID: item.key, mentorName: item.text });
        const mentorEmployeeID = item.key;
        this.props.actions.loadMenteesInActiveRelationshipsByMentorID(mentorEmployeeID, this.props.userProps.timeConfigurationID)
        .then(mentees => {
            this.setState({menteesOptions: teacherFormattedForDropdown(this.props.mentees)});
        })
        .catch(error =>  this.setState({menteesOptions: []}));
    }

    onMenteeDropdownChanged(item) {
        this.setState({ menteeEmployeeID: item.key, menteeName: item.text });
    }

    onChangeMentorComments(e) {
        this.setState({mentorComments: e.target.value});
    }

    onActivityCodeDropdownChanged(item) {
        this.setState({ activityCodeID: item.key });
    }

    formatDate(date) {
        if (date) {
            let newDate = Utilities.getDateOnly(date);
            return newDate;
        }
        return '';
    }

    onSelectActivityDate(date) {
        this.setState({ activityDate: date });
    }

    onTimeSpentChanged(time) {
        this.setState({ timeSpent: time });
    }

    onActivityTimeChanged(time) {
        this.setState({ activityTime: time });
    }

    addMentee(){
        let activityMentee = {};
        activityMentee.StaffNaturalKey = this.state.menteeEmployeeID;
        activityMentee.MenteeName = this.state.menteeName;
        activityMentee.VerificationStatus = "";
        activityMentee.VerificationCommentDescription = "";
        activityMentee.VerificationCommentCode = "";
        if(activityMentee.StaffNaturalKey == ""){
            this.displayMessage("Mentee not selected.", "");
        }
        else{
            let mentees = this.props.activityMentees;
            const existingMentee = this.isMenteeAdded(activityMentee.StaffNaturalKey);
            if(existingMentee == undefined || existingMentee == null){
                this.props.actions.createNewActivityMentees(activityMentee);
                this.props.actions.loadAllActivityMentees();
                this.setState({menteeEmployeeID: ''});
            }
            else{
                this.displayMessage("Mentee already added.", "");
            }
        }
    }

    deleteMentee(employeeID){
        if(employeeID != ""){
            this.props.actions.deleteNewActivityMentees(employeeID);
        }
    }
    
    isMenteeAdded(employeeID){
        let mentees = this.props.activityMentees;
        return mentees.find(function (obj) { return obj.StaffNaturalKey === employeeID; });
    }

    handleDeleteRow(row) {
        const employeeID = row[0];
        const mentee = this.props.activityMentees.find(o => o.StaffNaturalKey === employeeID);

        if(mentee.VerificationStatus != ""){
            this.displayMessage("Mentee cannot be deleted because of its verification status.", "");
        }
        else if(employeeID != ""){
            this.props.actions.deleteNewActivityMentees(employeeID);
            this.props.actions.loadAllActivityMentees();
        }
    }

    createCustomDeleteButton(onClick){
        return (
          <DeleteButton
            btnText="Delete Mentee"
            btnContextual="btn-primary"
            className="btn-danger"
            btnGlyphicon="glyphicon-trash" />
        );
    }

    onRenderMentoringToolItemColumn(item, index, column){
        const expandingCardProps = {
            renderData: item
        };
        return (
              <HoverCard id="hcMentoringTool" expandingCardProps={expandingCardProps} instantOpenOnClick={false}>
                <div className="HoverCard-item">
                  {item.ActivityToolItemName}
                </div>
              </HoverCard>
        );
    }

    onRenderPlanningItemColumn(item, index, column){
        const expandingCardProps = {
            renderData: item
        };
        return (
              <HoverCard id="hcPlanning" expandingCardProps={expandingCardProps} instantOpenOnClick={false}>
                <div className="HoverCard-item">
                  {item.text}
                </div>
              </HoverCard>
        );
    }

    onRenderInstructionalItemColumn(item, index, column){
        const expandingCardProps = {
            renderData: item
        };
        return (
              <HoverCard id="hcInstructional" expandingCardProps={expandingCardProps} instantOpenOnClick={false}>
                <div className="HoverCard-item">
                  {item.text}
                </div>
              </HoverCard>
        );
    }

    onRenderProfessionalItemColumn(item, index, column){
        const expandingCardProps = {
            renderData: item
        };
        return (
              <HoverCard id="hcProfessional" expandingCardProps={expandingCardProps} instantOpenOnClick={false}>
                <div className="HoverCard-item">
                  {item.text}
                </div>
              </HoverCard>
        );
    }

    buildMyColumns(items){
        return buildColumns(items).filter(column => column.name === 'key');
    }

    getDeletedMentees(){
        let deletedMentees = [];
        const originalMentees = this.props.activityLog.Mentees;
        const currentMentees = this.props.activityMentees;
        for(let i=0; i < originalMentees.length; i++){
            let found = false;
            for(let k=0; k < currentMentees.length; k++){
                if(originalMentees[i].StaffNaturalKey === currentMentees[k].StaffNaturalKey){
                    found = true;
                    break;
                }
            }
            if(found == false){
                deletedMentees.push(originalMentees[i].StaffNaturalKey);
            }
        }
        return deletedMentees;
    }

    getAddedMentees(){
        let addedMentees = [];
        const currentMentees = this.props.activityMentees;
        for(let i=0; i < currentMentees.length; i++){
            addedMentees.push(currentMentees[i].StaffNaturalKey);
        }
        return addedMentees;
    }

    render() {
        let { firstDayOfWeek } = this.state.firstDayOfWeek;
        let { dayPickerStrings } = this.state.dayPickerStrings;
        const defaultDate = moment().set({hour: 0, minute: 0, second: 0, millisecond: 0});
        let defaultTimeSpent = moment().set({hour: 0, minute: 0, second: 0, millisecond: 0});
        const activityCodeID = this.state.activityCodeID;
        const menteesGridOptions = {
            defaultSortName: 'MenteeName',
            sortOrder: 'asc',
            onDeleteRow: this.handleDeleteRow,
            deleteBtn: this.createCustomDeleteButton
        };
        if(this.state.activityCodeID === "" && hasMounted == true){
            //Assigning fields
            let activityDate = new Date(Utilities.getDateTime(this.props.activityLog.ActivityStartTime));
            let time = moment().set({hour: activityDate.getHours(), minute:activityDate.getMinutes(), second:activityDate.getSeconds(), millisecond:activityDate.getMilliseconds()});
            //let timeSpent = Utilities.getTimeSpent(this.props.activityLog.Duration);
            this.setState({ 
                activityCodeID: this.props.activityLog.ActivityCodeID,
                activityDate: activityDate,
                activityTime: time,
                timeSpent: this.state.timeSpent
            });
        }
        const columns = this.buildMyColumns(this.state.instructionalOptions);
            return (
                <IfAnyGranted expected={['Admin', 'Principal', 'CIC']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                    <div id="page-wrapper" style={{paddingTop: "30px"}}>
                        <div className="container-fluid">
                            <PageHeader title="Edit Activity Log Entry" campus={this.props.campus} />
                            <div className="row">
                                <div className="col-md-12 col-lg-8 col-sm-12">
                                    <LeaderInfo />
                                    <div className="white-box">
                                        <form>
                                            <div className="form-group">
                                                <label>Mentor Name</label>
                                                <div>
                                                <input id="mentorName" className="form-control" type="text" value={this.state.mentorName} readOnly maxLength={255} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Activity Code</label>
                                                <div>
                                                    <Dropdown placeHolder="Select an Activity Code" options={this.state.activityCodesOptions} selectedKey={this.state.activityCodeID} onChanged={this.onActivityCodeDropdownChanged} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Activity Date</label>
                                                <div>
                                                    <DatePicker firstDayOfWeek={this.state.firstDayOfWeek} value={this.state.activityDate} strings={this.state.dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectActivityDate} placeholder="Select activity date..." />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Activity Time</label>
                                                <div>
                                                    <TimePicker
                                                        onChange={this.onActivityTimeChanged}
                                                        showSecond={false}
                                                        defaultValue={defaultDate}
                                                        value={this.state.activityTime}
                                                        allowEmpty
                                                        use12Hours
                                                        className="fullWidth"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Time Spent</label>
                                                <div>
                                                    <TimePicker
                                                        onChange={this.onTimeSpentChanged}
                                                        showSecond={false}
                                                        value={this.state.timeSpent}
                                                        defaultValue={defaultTimeSpent}
                                                        allowEmpty
                                                        className="fullWidth"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Mentor Comments</label>
                                                <input id="mentorComments" className="form-control" type="text" value={this.state.mentorComments} onChange={this.onChangeMentorComments} maxLength={255} />
                                            </div>
                                            <div className="form-group">
                                                <form className="form-horizontal">
                                                    <div className="row">
                                                        <div className="col-md-8 col-lg-8 col-sm-8">
                                                            <Dropdown placeHolder="Select a Mentee" options={this.state.menteesOptions} onChanged={this.onMenteeDropdownChanged} selectedKey={this.state.menteeEmployeeID} />
                                                        </div>
                                                        <div className="col-md-4 col-lg-4 col-sm-4">
                                                            <PrimaryButton
                                                                text="Add Mentee"
                                                                onClick={this.addMentee}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12 col-lg-12 col-sm-12">
                                                            <BootstrapTable data={this.props.activityMentees} remote hover condensed pagination 
                                                                options={menteesGridOptions}
                                                                deleteRow selectRow={{mode: 'radio'}}>
                                                                <TableHeaderColumn dataField="StaffNaturalKey" isKey width={'100px'}>Employee ID</TableHeaderColumn>
                                                                <TableHeaderColumn dataField="MenteeName" dataAlign="left">Mentee Name</TableHeaderColumn>
                                                                <TableHeaderColumn dataField="VerificationStatus" dataAlign="left">Status</TableHeaderColumn>
                                                                <TableHeaderColumn dataField="VerificationCommentCode" dataAlign="left">Comments Code</TableHeaderColumn>
                                                                <TableHeaderColumn dataField="VerificationCommentDescription" dataAlign="left">Comments Description</TableHeaderColumn>
                                                            </BootstrapTable>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="form-group">
                                            <div className="row">
                                                    <div className="col-md-12 col-lg-12 col-sm-12 formSectionTitle">Standards</div>
                                                </div>
                                                <div></div>
                                                <div>
                                                    <Pivot>
                                                        <PivotItem linkText="Instructional Practice - Planning">
                                                            <DetailsList
                                                                setKey="set" isHeaderVisible={false}
                                                                selection={this.state.planningSelection}
                                                                items={this.state.planningOptions}
                                                                selectionMode={SelectionMode.multiple}
                                                                columns={columns}
                                                                compact
                                                                selectionPreservedOnEmptyClick
                                                                checkboxVisibility = {CheckboxVisibility.always}
                                                                onRenderItemColumn={this.onRenderPlanningItemColumn}
                                                            />
                                                        </PivotItem>
                                                        <PivotItem linkText="Instructional Practice - Instruction">
                                                            <DetailsList
                                                                setKey="set" isHeaderVisible={false}
                                                                selection={this.state.instructionalSelection}
                                                                items={this.state.instructionalOptions}
                                                                selectionMode={SelectionMode.multiple}
                                                                columns={columns}
                                                                compact
                                                                selectionPreservedOnEmptyClick
                                                                checkboxVisibility = {CheckboxVisibility.always}
                                                                onRenderItemColumn={this.onRenderInstructionalItemColumn}
                                                            />
                                                        </PivotItem>
                                                        <PivotItem linkText="Professional Expectations">
                                                            <DetailsList
                                                                setKey="set" isHeaderVisible={false}
                                                                selection={this.state.professionalSelection}
                                                                items={this.state.professionalOptions}
                                                                selectionMode={SelectionMode.multiple}
                                                                columns={columns} 
                                                                compact
                                                                selectionPreservedOnEmptyClick
                                                                checkboxVisibility = {CheckboxVisibility.always}
                                                                onRenderItemColumn={this.onRenderProfessionalItemColumn}
                                                            />
                                                        </PivotItem>
                                                    </Pivot>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                            <div className="row">
                                                    <div className="col-md-12 col-lg-12 col-sm-12 formSectionTitle">Mentoring Tools</div>
                                                </div>
                                                <div></div>
                                                <div>
                                                    <DetailsList
                                                        setKey="set" isHeaderVisible={false}
                                                        selection={this.state.mentoringToolsSelection}
                                                        items={this.props.mentoringTools}
                                                        selectionMode={SelectionMode.multiple}
                                                        columns={columns}
                                                        compact
                                                        selectionPreservedOnEmptyClick
                                                        checkboxVisibility = {CheckboxVisibility.always}
                                                        onRenderItemColumn={this.onRenderMentoringToolItemColumn}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="text-center">
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
                                title: 'Activity Log',
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

EditActivityLogPage.propTypes = {
    campusID: PropTypes.string,
    campus: PropTypes.string,
    onMentorDropdownChanged: PropTypes.func,
    onMenteeDropdownChanged: PropTypes.func,
    mentors: PropTypes.array,
    mentees: PropTypes.array,
    activityLog: PropTypes.object,
    activityMentees: PropTypes.array,
    activityCodes: PropTypes.array,
    cbmStandards: PropTypes.array,
    activityStandards: PropTypes.array,
    mentoringTools: PropTypes.array,
    instructionalOptions: PropTypes.array,
    activityCodeID: PropTypes.string,
    startDate: PropTypes.string,
    startEndDate: PropTypes.string,
    onSelectStartDate: PropTypes.func,
    onSelectEndDate: PropTypes.func,
    save: PropTypes.func,
    cancel: PropTypes.func,
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object,
    match: PropTypes.object,
    params: PropTypes.array,
    activityLogID: PropTypes.string
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campus: state.userProps.user.campusName,
        mentors: state.mentors,
        mentees: state.mentees,
        activityLog: state.activityLog,
        activityMentees: state.activityMentees,
        activityStandards: state.activityStandards,
        mentoringTools: state.mentoringTools,
        activityCodes: state.activityCodes,
        activityCodeID: state.activityCodeID,
        startDate: state.startDate,
        userProps: state.userProps,
        activityLogID: ownProps.match.params.ActivityLogID
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, activityLogsActions, mentorsActions, menteesActions, activityMenteesActions, adminActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditActivityLogPage);