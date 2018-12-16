import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as activityLogsActions from '../../actions/activityLogsActions';
import * as mentorsActions from '../../actions/mentorsActions';
import * as menteesActions from '../../actions/menteesActions';
import * as activityMenteesActions from '../../actions/activityMenteesActions';
import * as spUserPropsActions from '../../actions/spUserPropsActions';
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
import { HoverCard, IExpandingCardProps } from 'office-ui-fabric-react/lib/HoverCard';
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
import CheckBox from '../common/CheckBox';

let hasMounted = false;

class NewActivityLogPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            campusID: PropTypes.string,
            mentorEmployeeID: '',
            mentorName: '',
            activityCodeID: '',
            firstDayOfWeek: DayOfWeek.Sunday,
            activityDate: '',
            activityTime: '',
            timeSpent: '',
            mentorComments: '',
            mentorsOptions: [],
            menteesOptions: [],
            instructionalOptions: [],
            planningOptions: [],
            professionalOptions: [],
            planningSelection: new Selection({ onSelectionChanged: this.onSelectionChanged }),
            instructionalSelection: new Selection({ onSelectionChanged: this.onSelectionChanged }),
            professionalSelection: new Selection({ onSelectionChanged: this.onSelectionChanged }),
            mentoringToolsSelection: new Selection({ onSelectionChanged: this.onSelectionChanged }),
            dayPickerStrings: Utilities.getDayPickerStrings(),
            hideDialog: true,
            dialogAction: '',
            subtext: '',
            selectedActivityStandardsOptions: {},
            selectedMentoringOptions: {},
            selectedPlanningOptions: {},
            cbmTHisMonth: [],
            spUserProps: []
        };


        //this.onMentorDropdownChanged = this.onMentorDropdownChanged.bind(this);
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

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.checkboxActivityStandardsFormat = this.checkboxActivityStandardsFormat.bind(this);
        this.checkboxMentoringFormat = this.checkboxMentoringFormat.bind(this);
        this.selectedActivityStandardItem = this.selectedActivityStandardItem.bind(this);
        this.selectedMetoringItem = this.selectedMetoringItem.bind(this);
    }

    componentDidMount() {
        //get the LoggedIn Mentor Info
        let mentorInfo = this.props.userProps.user;
        const mentorEmployeeID = this.props.userProps.user.staffNaturalKey;
        this.props.actions.clearActivityLog();
        const campusID = this.props.campusID;
        const timeConfigurationID = this.props.userProps.timeConfigurationID;
        this.props.actions.deleteAllActivityMentees();
        this.props.actions.loadAllActivityCodesDropDown()
            .then(activityCodes => {
                this.setState({ activityCodesOptions: activityCodesFormattedForDropdown(this.props.activityCodes) });
            });
        /* -- Mentor List is no longer needed
        this.props.actions.loadMentorsInRelationshipsByCampusID(campusID, timeConfigurationID)
        .then(mentors => {
            this.setState({mentorsOptions: teacherFormattedForDropdown(this.props.mentors)});
        });*/

        this.props.actions.loadAllMentoringTools();
        this.props.actions.loadAllActivityStandards()
            .then(activityStandards => {
                if (this.props.activityStandards && this.props.activityStandards.length >= 4) {
                    this.setState({
                        campusID: campusID,
                        instructionalOptions: cbmStandardsFormattedForCheckbox(this.props.activityStandards[1].ActivityStandardItems),
                        planningOptions: cbmStandardsFormattedForCheckbox(this.props.activityStandards[2].ActivityStandardItems),
                        professionalOptions: cbmStandardsFormattedForCheckbox(this.props.activityStandards[3].ActivityStandardItems)
                    });
                }
            });


        // Load Mentess in a relationship under this mentor 
        this.props.actions.loadMenteesInActiveRelationshipsByMentorID(mentorEmployeeID, this.props.userProps.timeConfigurationID, this.props.userProps.user.campusID)
            .then(mentees => {
                this.setState({ menteesOptions: teacherFormattedForDropdown(this.props.mentees) });
            })
            .catch(error => this.setState({ menteesOptions: [] }));

        this.props.actions.loadAllCBMStandards().then(cbmStandards => {
            if (this.props.cbmStandards.length > 0) {
                let today = new Date();
                let month = today.getMonth() + 1;
                let cbmTHisMonth = this.props.cbmStandards.filter(e => {
                    return (e.Month == month && e.Year == today.getFullYear());
                });
                this.setState({ cbmTHisMonth: cbmTHisMonth });
            }
        }).catch(error => this.setState({ cbmTHisMonth: [] }));

        let spUserPromise = this.props.actions.loadSPUserProps(this.props.userProps.user.loginId);
        spUserPromise.then((response) => {
            this.setState({ spUserProps: [this.props.spUserProps] });
        }).catch(error => this.setState({ spUserProps: [] }));


        hasMounted = true;
    }

    getInstructionalItems() {
        let selectedItems = [];
        const itemsIndices = Object.keys(this.state.instructionalSelection._exemptedIndices);
        const allItems = this.state.instructionalSelection._items;
        itemsIndices.forEach(function (element) {
            let index = parseInt(element);
            let item = allItems[index];
            if (item) {
                selectedItems.push(item.key);
            }
        });
        return selectedItems;
    }

    getPlanningItems() {
        let selectedItems = [];
        const itemsIndices = Object.keys(this.state.planningSelection._exemptedIndices);
        const allItems = this.state.planningSelection._items;
        itemsIndices.forEach(function (element) {
            let index = parseInt(element);
            let item = allItems[index];
            if (item) {
                selectedItems.push(item.key);
            }
        });
        return selectedItems;
    }

    getProfessionalItems() {
        let selectedItems = [];
        const itemsIndices = Object.keys(this.state.professionalSelection._exemptedIndices);
        const allItems = this.state.professionalSelection._items;
        itemsIndices.forEach(function (element) {
            let index = parseInt(element);
            let item = allItems[index];
            if (item) {
                selectedItems.push(item.key);
            }
        });
        return selectedItems;
    }

    getMentoringTools() {
        let selectedItems = [];
        const itemsIndices = Object.keys(this.state.mentoringToolsSelection._exemptedIndices);
        const allItems = this.state.mentoringToolsSelection._items;
        itemsIndices.forEach(function (element) {
            let index = parseInt(element);
            let item = allItems[index];
            if (item) {
                selectedItems.push(item.ActivityToolItemID);
            }
        });
        return selectedItems;
    }

    getMentees() {
        let mentees = [];
        this.props.activityMentees.forEach(function (element) {
            mentees.push(element.MenteeEmployeeID);
        });
        return mentees;
    }

    getActivityStandards(selectedStandards) {
        const activityStandards = Utilities.getAllActivityStandards(selectedStandards);
        return activityStandards;
    }
    isValidForm() {
        let isValid = true;
        const activityToolItems = this.getActivityStandards(this.state.selectedMentoringOptions);
        const activityStandards = this.getActivityStandards(this.state.selectedActivityStandardsOptions);

        let formattedLogStartDate = new Date(Utilities.getDateOnly(this.props.userProps.LogStartDate));
        let formattedLogEndDate = new Date(Utilities.getDateOnly(this.props.userProps.LogEndDate));
        let formattedDate = new Date(Utilities.getDateOnly(this.state.activityDate));

        //return false;
        /*if(this.state.mentorEmployeeID == ""){
            isValid = false;
            this.displayMessage('Error: Mentor not selected.', '');
        }*/
        if (this.state.menteeEmployeeID == "") {
            isValid = false;
            this.displayMessage('Error: Mentee not selected.', '');
        }
        else if (this.state.activityCodeID == '') {
            isValid = false;
            this.displayMessage('Error: Activity Code not selected.', '');
        }
        else if (this.state.activityDate == '') {
            isValid = false;
            this.displayMessage('Error: Activity Date not selected.', '');
        }

        else if (formattedDate < formattedLogStartDate || formattedDate > formattedLogEndDate) {
            isValid = false;
            this.displayMessage('Error: Activity time should be between '+formattedLogStartDate +' and '+ formattedLogEndDate, '');
        }

        else if (this.state.activityTime == '') {
            isValid = false;
            this.displayMessage('Error: Activity time not selected.', '');
        }       

        else if (this.state.timeSpent == '') {
            isValid = false;
            this.displayMessage('Error: Time spent in the activity not selected.', '');
        }
        else if (!this.props.activityMentees || this.props.activityMentees.length === 0) {
            isValid = false;
            this.displayMessage('Error: No mentee(s) selected.', '');
        }
        else if (activityToolItems.length === 0) {
            isValid = false;
            this.displayMessage('Error: No activity tools items selected.', '');
        }
        else if (activityStandards.length === 0) {
            isValid = false;
            this.displayMessage('Error: No activity standards selected.', '');
        }
        return isValid;
    }

    save() {

        if (this.isValidForm()) {
            let activityDate = this.state.activityDate;
            const activityStartTime = activityDate.format('yyyy-MM-dd') + "T" + this.state.activityTime.format('HH') + ":" + this.state.activityTime.format('mm') + ":00-05:00";
            const activityDuration = { hours: parseInt(this.state.timeSpent.format('HH')), minutes: parseInt(this.state.timeSpent.format('mm')) };
            const timeSpent = (activityDuration.hours * 60) + activityDuration.minutes;
            const mentees = this.getMentees();
            const activityToolItems = this.getActivityStandards(this.state.selectedMentoringOptions);
            const activityStandards = this.getActivityStandards(this.state.selectedActivityStandardsOptions);
            let activityLog = {
                ActivityLog: {
                    MentorEmployeeID: this.props.userProps.user.staffNaturalKey, //this.state.mentorEmployeeID,
                    ActivityCodeID: this.state.activityCodeID,
                    ActivityStartTime: activityStartTime,
                    CreatedBy: this.props.userProps.user.loginId,
                    MentorComments: this.state.mentorComments,
                    TimeConfigurationID: this.props.userProps.timeConfigurationID,
                    CampusID: this.state.campusID, ////'104',
                    Duration: timeSpent
                },
                ActivityToolItemIDs: activityToolItems,
                ActivityStandardItemIDs: activityStandards,
                ActivityLog_MenteeEmployeeIDs: mentees
            };
            let promise = this.props.actions.createActivityLog(activityLog);
            promise.then((activityLog) => {

                // this.onSavingSucceeds()
                let today = new Date();
                let month = today.getMonth() + 1;
                let promise = this.props.actions.loadActivityLogentorCountPerMonth(this.props.userProps.user.staffNaturalKey, month, today.getFullYear());
                promise.then((activityLog) => {
                    if (parseInt(this.props.activityLogMentorCountPerMonth) > 0) {
                        if (this.state.cbmTHisMonth.length > 0) {
                            if (this.state.spUserProps.length > 0) {
                                let MentorActivityLog = {};
                                MentorActivityLog.Month = month;
                                MentorActivityLog.Year = today.getFullYear();
                                MentorActivityLog.LogCountNeeded = this.state.cbmTHisMonth[0].NoOfLogs;
                                MentorActivityLog.ActualLogCount = this.props.activityLogMentorCountPerMonth;
                                MentorActivityLog.DaysRemaining = this.state.cbmTHisMonth[0].NoOfDaysRemainingReminder;
                                MentorActivityLog.Mentor = this.state.spUserProps[0].Id;
                                MentorActivityLog.MentorLoginId = this.props.userProps.user.staffNaturalKey;
                                MentorActivityLog.MenteeEmployeeId = mentees[0];
                                // if (parseInt(this.props.activityLogMentorCountPerMonth) > 1) {
                                let savePromise = this.props.actions.updateMentorActivityLog(MentorActivityLog);
                                savePromise.
                                    then((response) => {
                                        this.onSavingSucceeds();
                                    }).
                                    catch(error => {
                                        this.props.actions.ajaxCallError();
                                        this.displayMessage('Activity Log successfully created.SharePoint list not able to update', '');

                                    });
                                //  }
                                /*  else {
                                      let savePromise = this.props.actions.createMentorActivityLog(MentorActivityLog);
                                      savePromise.
                                          then((response) => {
                                              this.onSavingSucceeds();
                                          }).
                                          catch(error => {
                                              this.props.actions.ajaxCallError();
                                              this.displayMessage('Activity Log successfully created.SharePoint list not able to create', '');
  
                                          });
                                  }
                                  */

                            }
                            else {
                                this.displayMessage('Activity Log successfully created.User not present in SharePoint', '');
                            }
                        }
                        else {
                            this.displayMessage('Activity Log successfully created.There is no CBM value', '');
                        }
                    }
                    else {
                        this.displayMessage('Activity Log successfully created.Number of Logs for the Mentor is 0', '');
                    }

                }).catch(reason => {
                    this.props.actions.ajaxCallError();
                    this.displayMessage('Activity log saved in Database but list has some issue . Operation canceled', '');
                });
            })
                .catch(reason => {
                    this.props.actions.ajaxCallError();
                    this.displayMessage('There was a problem saving this Activity Log. Operation canceled.', '');
                });
        }
    }

    onSavingSucceeds() {
        if (this.props.activityLog.value > 0) {
            this.displayMessage('Activity Log successfully created.', 'SAVED');
        }
        else {
            this.onSavingFails();
        }
    }

    onSavingFails() {
        this.props.actions.ajaxCallError();
        this.displayMessage('Error trying to create an Activity Log.');
    }

    cancel() {
        document.location = '#activitylogs';
    }

    okDialog() {
        if (this.state.dialogAction == 'SAVED')
            this.cancel();
        else
            this.closeDialog();
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

    /*onMentorDropdownChanged(item) {
        this.setState({ mentorEmployeeID: item.key, mentorName: item.text });
        const mentorEmployeeID = item.key;
        this.props.actions.loadMenteesInActiveRelationshipsByMentorID(mentorEmployeeID, this.props.userProps.timeConfigurationID, this.props.userProps.user.campusID)
        .then(mentees => {
            this.setState({menteesOptions: teacherFormattedForDropdown(this.props.mentees)});
        })
        .catch(error =>  this.setState({menteesOptions: []}));
    }*/

    onMenteeDropdownChanged(item) {
        this.setState({ menteeEmployeeID: item.key, menteeName: item.text });
    }

    onChangeMentorComments(e) {
        this.setState({ mentorComments: e.target.value });
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

    addMentee() {
        let activityMentee = {};
        activityMentee.MenteeEmployeeID = this.state.menteeEmployeeID;
        activityMentee.MenteeName = this.state.menteeName;
        if (activityMentee.MenteeEmployeeID == "" || activityMentee.MenteeEmployeeID == undefined) {
            this.displayMessage("Mentee not selected.", "");
        }
        else {
            let mentees = this.props.activityMentees;
            const existingMentee = this.isMenteeAdded(activityMentee.MenteeEmployeeID);
            if (existingMentee == undefined || existingMentee == null) {
                this.props.actions.createNewActivityMentees(activityMentee);
                this.props.actions.loadAllActivityMentees();
                // issue
                //this.setState({menteeEmployeeID: ''});
            }
            else {
                this.displayMessage("Mentee already added.", "");
            }
        }
    }

    deleteMentee(employeeID) {
        if (employeeID != "") {
            this.props.actions.deleteNewActivityMentees(employeeID);
        }
    }

    isMenteeAdded(employeeID) {
        let mentees = this.props.activityMentees;
        return mentees.find(function (obj) { return obj.MenteeEmployeeID === employeeID; });
    }

    handleDeleteRow(row) {
        const employeeID = row[0];
        if (employeeID != "") {
            this.props.actions.deleteNewActivityMentees(employeeID);
            this.props.actions.loadAllActivityMentees();
        }
    }

    createCustomDeleteButton(onClick) {
        return (
            <DeleteButton
                btnText="Delete Mentee"
                btnContextual="btn-primary"
                className="btn-danger"
                btnGlyphicon="glyphicon-trash" />
        );
    }

    onRenderMentoringToolItemColumn(item, index, column) {
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

    onRenderPlanningItemColumn(item, index, column) {
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

    onRenderInstructionalItemColumn(item, index, column) {
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

    onRenderProfessionalItemColumn(item, index, column) {
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

    buildMyColumns(items) {
        return buildColumns(items).filter(column => column.name === 'key');
    }

    selectedActivityStandardItem(id, value, obj) {
        this.state.selectedActivityStandardsOptions[id] = value;
        this.setState({ selectedActivityStandardsOptions: this.state.selectedActivityStandardsOptions });
    }

    selectedMetoringItem(id, value, obj) {
        this.state.selectedMentoringOptions[id] = value;
        this.setState({ selectedMentoringOptions: this.state.selectedMentoringOptions });
    }

    checkboxActivityStandardsFormat(cell, row) {
        if (cell in this.state.selectedActivityStandardsOptions) {
            if (this.state.selectedActivityStandardsOptions[cell] == true) {
                return (

                    <CheckBox
                        index={cell}
                        obj={row}
                        defaultChecked='1'
                        callback={this.selectedActivityStandardItem}
                        checked={this.state.selectedActivityStandardsOptions[cell]}
                    />

                );
            } else {
                return (

                    <CheckBox
                        index={cell}
                        obj={row}
                        callback={this.selectedActivityStandardItem}
                        checked={this.state.selectedActivityStandardsOptions[cell]}
                    />
                );
            }

        }
        else {
            return (
                <CheckBox
                    index={cell}
                    obj={row}
                    callback={this.selectedActivityStandardItem}
                    checked={this.state.selectedActivityStandardsOptions[cell]}
                />
            );
        }
    }

    checkboxMentoringFormat(cell, row) {
        return (
            <CheckBox
                index={cell}
                obj={row}
                callback={this.selectedMetoringItem}
                checked={this.state.selectedMentoringOptions[cell]}
            />

        );
    }

    render() {
        /*if(this.state.campusID != this.props.campusID){
            this.props.actions.loadMentorsInRelationshipsByCampusID(this.props.campusID, this.props.userProps.timeConfigurationID)
            .then(mentors => {
                this.setState({mentorsOptions: teacherFormattedForDropdown(this.props.mentors)});
            });
            this.setState({menteesOptions: [], campusID: this.props.campusID});
        }*/
        let { firstDayOfWeek } = this.state.firstDayOfWeek;
        let { dayPickerStrings } = this.state.dayPickerStrings;
        let timeAndDate = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const menteesGridOptions = {
            defaultSortName: 'MenteeName',
            sortOrder: 'asc',
            onDeleteRow: this.handleDeleteRow,
            deleteBtn: this.createCustomDeleteButton
        };
        const columns = this.buildMyColumns(this.state.instructionalOptions);
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="New Activity Log Entry" campus={this.props.campus} />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <div className="white-box">
                                <form>
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
                                    <div className="form-group">
                                        <label>Mentor Name <h5 className="text-muted m-b-0 m-t-0">{this.props.userProps.user.fullName}</h5>
                                        </label>
                                        <div></div>
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
                                                    <BootstrapTable data={this.props.activityMentees} remote hover condensed
                                                        options={menteesGridOptions}
                                                        deleteRow selectRow={{ mode: 'radio' }}>
                                                        <TableHeaderColumn dataField="MenteeEmployeeID" isKey width={'200px'}>EmployeeID</TableHeaderColumn>
                                                        <TableHeaderColumn dataField="MenteeName" dataAlign="left">Mentee Name</TableHeaderColumn>
                                                    </BootstrapTable>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    {/*<div className="form-group">
                                        <label>Mentor Name</label>
                                        <div>{this.props.userProps.user.fullName}</div>
                                        <div>
                                            <Dropdown  ref={(select) => {this.mentorDropDown = select;}} placeHolder="Select a Mentor" options={this.state.mentorsOptions} onChanged={this.onMentorDropdownChanged} />
                                        </div>
                                    </div>*/}
                                    <div className="form-group">
                                        <label>Activity Code</label>
                                        <div>
                                            <Dropdown placeHolder="Select an Activity Code" options={this.state.activityCodesOptions} onChanged={this.onActivityCodeDropdownChanged} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Activity Date</label>
                                        <div>
                                            <DatePicker firstDayOfWeek={this.state.firstDayOfWeek} strings={this.state.dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectActivityDate} placeholder="Select activity date..." />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Activity Time</label>
                                        <div>
                                            <TimePicker
                                                onChange={this.onActivityTimeChanged}
                                                showSecond={false}
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
                                                defaultValue={timeAndDate}
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
                                        <div className="row">
                                            <div className="col-md-12 col-lg-12 col-sm-12 formSectionTitle">Standards</div>
                                        </div>
                                        <div></div>
                                        <div>
                                            <Pivot>
                                                <PivotItem linkText="Instructional Practice - Planning">
                                                    <BootstrapTable data={this.state.planningOptions}>
                                                        <TableHeaderColumn dataField="key" isKey hidden thStyle={{ border: 'hidden', display: 'none' }}>ID</TableHeaderColumn>
                                                        <TableHeaderColumn dataField="key"
                                                            dataFormat={this.checkboxActivityStandardsFormat} width="10px" thStyle={{ border: 'hidden', display: 'none' }} tdStyle={{ border: 'hidden', verticalAlign: 'middle', textAlign: 'center' }}>Select</TableHeaderColumn>
                                                        <TableHeaderColumn dataField="text" dataAlign="left" width="300px" thStyle={{ border: 'hidden', display: 'none' }} tdStyle={{ border: 'hidden' }}>Text</TableHeaderColumn>
                                                    </BootstrapTable>
                                                </PivotItem>
                                                <PivotItem linkText="Instructional Practice - Instruction">
                                                    <BootstrapTable data={this.state.instructionalOptions}>
                                                        <TableHeaderColumn dataField="key" isKey hidden thStyle={{ border: 'hidden', display: 'none' }}>ID</TableHeaderColumn>
                                                        <TableHeaderColumn dataField="key"
                                                            dataFormat={this.checkboxActivityStandardsFormat} width="10px" thStyle={{ border: 'hidden', display: 'none' }} tdStyle={{ border: 'hidden', verticalAlign: 'middle', textAlign: 'center' }}>Select</TableHeaderColumn>
                                                        <TableHeaderColumn dataField="text" dataAlign="left" width="300px" thStyle={{ border: 'hidden', display: 'none' }} tdStyle={{ border: 'hidden' }}>Text</TableHeaderColumn>
                                                    </BootstrapTable>
                                                </PivotItem>
                                                <PivotItem linkText="Professional Expectations">
                                                    <BootstrapTable data={this.state.professionalOptions}>
                                                        <TableHeaderColumn dataField="key" isKey hidden thStyle={{ border: 'hidden', display: 'none' }}>ID</TableHeaderColumn>
                                                        <TableHeaderColumn dataField="key" dataFormat={this.checkboxActivityStandardsFormat} width="10px" thStyle={{ border: 'hidden', display: 'none' }} tdStyle={{ border: 'hidden', verticalAlign: 'middle', textAlign: 'center' }}>Select</TableHeaderColumn>
                                                        <TableHeaderColumn dataField="text" dataAlign="left" width="300px" thStyle={{ border: 'hidden', display: 'none' }} tdStyle={{ border: 'hidden' }}>Text</TableHeaderColumn>
                                                    </BootstrapTable>
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
                                            <BootstrapTable data={this.props.mentoringTools}>
                                                <TableHeaderColumn dataField="ActivityToolItemID" isKey hidden thStyle={{ border: 'hidden', display: 'none' }}>ID</TableHeaderColumn>
                                                <TableHeaderColumn dataField="ActivityToolItemID" dataFormat={this.checkboxMentoringFormat} width="10px" thStyle={{ border: 'hidden', display: 'none' }} tdStyle={{ border: 'hidden', verticalAlign: 'middle', textAlign: 'center' }}>Select</TableHeaderColumn>
                                                <TableHeaderColumn dataField="ActivityToolItemName" dataAlign="left" width="300px" thStyle={{ border: 'hidden', display: 'none' }} tdStyle={{ border: 'hidden' }}>Text</TableHeaderColumn>
                                            </BootstrapTable>
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
        );
    }
}

NewActivityLogPage.propTypes = {
    campusID: PropTypes.string,
    campus: PropTypes.string,
    //onMentorDropdownChanged: PropTypes.func,
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
    activityLogMentorCountPerMonth: PropTypes.string,
    spUserProps: PropTypes.object
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
        activityLogMentorCountPerMonth: state.activityLogMentorCountPerMonth,
        cbmStandards: state.cbmStandards,
        spUserProps: state.spUserProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, activityLogsActions, spUserPropsActions, mentorsActions, menteesActions, activityMenteesActions, adminActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewActivityLogPage);