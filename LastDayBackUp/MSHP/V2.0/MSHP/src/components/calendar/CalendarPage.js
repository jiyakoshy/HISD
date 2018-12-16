import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as enrollmentActions from '../../actions/enrollmentActions';
import * as calendarsActions from '../../actions/calendarsActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { BootstrapTable, TableHeaderColumn, Grid, Row, Col} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import * as sharedActions from './../../actions/sharedActions';
import Utilities from '../../utilities/utilities'; 
import * as ajaxActions from '../../actions/ajaxStatusActions';
import { calendarReportDatesFormattedForDropdown } from './../../selectors/selectors';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import * as nonReportSchoolActions from '../../actions/nonReportSchoolActions';
import * as calendarReportDatesActions from './../../actions/calendarReportDatesActions';

class CalendarPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onSchoolYearDropdownChanged = this.onSchoolYearDropdownChanged.bind(this);
        this.onChangeReportDate = this.onChangeReportDate.bind(this);
        this.onChangePlanNotes = this.onChangePlanNotes.bind(this);
        this.onChangeIDay = this.onChangeIDay.bind(this);
        this.onChangeSchedule = this.onChangeSchedule.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        this.onSavingSucceeds = this.onSavingSucceeds.bind(this);
        this.onSavingFails = this.onSavingFails.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.cancelToHome = this.cancelToHome.bind(this);

        this.state = {
            reportDate: null,
            schoolYear: this.props.schoolYear,
            hidden: false,
            planNotes: '',
            instructionDay: 0,
            reportSchedule: '',
            isSavedNewData: false,
            calendars: this.props.calendars,
            calendardate:'',
            calendarId: ''
        };
    }

    componentWillMount(){
        this.props.actions.clearCalendars();
        this.props.actions.loadCalendars(this.state.schoolYear).then(obj => {
            this.setState({ organizationGroup: [this.props.calendars]});
        });
    }
    componentDidMount(){
        this.props.actions.loadCurrentSchoolYear();
        this.props.actions.loadCalendars(this.state.schoolYear);
    }

    onSchoolYearDropdownChanged(evt){
        this.props.actions.clearCalendars();
        this.setState({ schoolYear: evt.target.value });
        this.props.actions.updateSchoolYear(evt.target.value);
        this.props.actions.loadCalendars(evt.target.value);
    }
    renderShowsTotal(start, to, total) {
        return (
            <p style={{color: 'black'}}>
            From {start} to {to}. Total: {total}&nbsp;&nbsp;
            </p>
        );
    }
    dateFormatter(cell, row) {  
        let formattedDate = Utilities.convertToDate(cell);
        return (formattedDate);
    }
    
    CustomInputFormatterSchedule(cell, row){
        return (
          <div>
            <select className="form-control custom-textbox" defaultValue={cell || ''} onChange={(e) => this.onChangeSchedule(row, e, cell)}>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
            </select>
          </div>
        );
    }

    CustomInputFormatterReportDate(cell, row){
        //let formattedDate = Utilities.convertToJSDate(cell);
        let d = "";
        if (!cell)
        {
            d = "";
        }
        else{
            d = new Date(cell);
        }
        return (
          <div>
            {/* <input type={'text'} className="form-control custom-textbox" defaultValue={formattedDate} onChange={(event) => this.setState({reportDate: event.target.value})} /> */}
            <DatePicker              
                placeholder="select Report date"
                value={d || ''}
                onSelectDate={(e) => this.onChangeReportDate(row, e)}/>
          </div>
        );
    }

    CustomInputFormatterPlanNotes(cell, row){
        return (
          <div>
            <input type={'text'} className="form-control custom-textbox" defaultValue={cell} onChange={(e) => this.onChangePlanNotes(row, e)} />
          </div>
        );
    }

    CustomInputFormatterIDay(cell, row){
        return (
          <div>
            <input type={'text'} className="form-control custom-textbox" defaultValue={cell} onChange={(e) => this.onChangeIDay(row, e)} />
          </div>
        );
    }

    SaveButtonFormatter(cell, row, enumObject, rowIndex) {
        return (
            <div>
                <input type={'button'} className="btn btn-primary" style={{width:50 +'px'}} onClick={() => this.onClickSave(cell, row, rowIndex)} value="Save " />
           </div>
        );
    }

    onClickSave(cell, row, rowIndex){
        if (row.Id == this.state.calendarId){
            if (this.state.calendardate != '')
                {this.setState({ calendardate: this.state.calendardate });}
            else{this.setState({ calendardate: row.ReportDate });}
            if (this.state.planNotes != '')
            {this.setState({ planNotes: this.state.planNotes });}
            else{this.setState({ planNotes: row.PlanNotes });}
            if (this.state.instructionDay != 0)
                {this.setState({ instructionDay:  this.state.instructionDay});}
            else{this.setState({ instructionDay: row.InstructionDay });}
            if (this.state.reportSchedule != '')
            {this.setState({ reportSchedule: this.state.reportSchedule });}
            else{this.setState({ reportSchedule:  row.ReportSchedule});}

            this.save(row, this.state.calendardate, this.state.planNotes, this.state.instructionDay, this.state.reportSchedule);
        }else{
            this.displayMessage('There are no changes to be SAVED at this time.'); 
        }
        
    }
    onChangeReportDate(e, row) {
        this.setState({ calendardate: row });
        if (this.state.planNotes == '')
            {this.setState({ planNotes: row.PlanNotes });}
        if (this.state.instructionDay == 0)
            {this.setState({ instructionDay: row.InstructionDay });}
        if (this.state.reportSchedule == '')
            {this.setState({ reportSchedule: row.ReportSchedule });}

        this.setState({ calendarId: e.Id });
    }

    onChangePlanNotes(e,row) {
        this.setState({ planNotes: row.target.value });
        if (this.state.calendardate == '')
            {this.setState({ calendardate: row.calendardate });}
        if (this.state.instructionDay == 0)
            {this.setState({ instructionDay: row.InstructionDay });}
        if (this.state.reportSchedule == '')
            {this.setState({ reportSchedule: row.ReportSchedule });}
        this.setState({ calendarId: e.Id });
    }

    onChangeIDay(e ,row) {
        if (this.checkValidity(row.target.value)){
            this.setState({ instructionDay: row.target.value });
            this.setState({ calendarId: e.Id });
        }
        else{
            this.displayMessage('Please enter Numerics');   
        }
        if (this.state.calendardate == '')
            {this.setState({ calendardate: row.calendardate });}
        if (this.state.planNotes == '')
            {this.setState({ planNotes: row.PlanNotes });}
        if (this.state.reportSchedule == '')
            {this.setState({ reportSchedule: row.ReportSchedule });}
    }

    onChangeSchedule(e ,row, cell) {
        if (this.state.calendardate == '')
            {this.setState({ calendardate: e.calendardate });}
        if (this.state.planNotes == '')
            {this.setState({ planNotes: e.PlanNotes });}
        if (this.state.instructionDay == 0)
            {this.setState({ instructionDay: e.InstructionDay });}
        this.setState({ reportSchedule: row.target.value });
        this.setState({ calendarId: e.Id });
        
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
    save(e,r,p,i,s) {
        let result = false;
        let Calendar = {
            'Id': e.Id,
            'ReportDate': r,
            'InstructionDay': i,
            'PlanNotes': p,
            'ReportSchedule': s,
            'UpdatedDate': new Date(),
            'UpdatedBy': this.props.userProps.user.fullName
        };


        let promise = this.props.actions.updateCalendar(Calendar);
        promise.then(this.onSavingSucceeds())
            .catch(reason => {
                this.props.actions.ajaxCallError();
                this.setState({ subtext: 'There was a problem updating these Calendar values. Operation canceled.', dialogAction: '' });
                this.showDialog();
            });
            result = true;
            if (result) {
                this.setState({ isSavedNewData: true });
            }
            this.load();
            this.setState({ calendardate: '' });
            this.setState({ planNotes: '' });
            this.setState({ instructionDay: 0 });
            this.setState({ reportSchedule: '' });
            return result;
    }
    
    load() {
        this.props.actions.loadCalendars(this.state.schoolYear).then(obj => {
            this.setState({ organizationGroup: [this.props.calendars]});
        });
    } 

    onSavingSucceeds() {
        this.displayMessage('Calendar values successfully saved.', 'SAVED');
    }

    onSavingFails(comment) {
        this.props.actions.ajaxCallError();
        if (comment && comment.length > 0) {
            this.displayMessage('Save attempted, but ', comment);
        } else {
            this.displayMessage('Error trying to save Profile values.');
        }
    }

    cancel() {
        document.location = '#calendar';
    }
 
    okDialog() {
        this.closeDialog();
        if (this.state.dialogAction == 'SAVED')
            this.cancel();
    }

    cancelToHome(){
        document.location = '#home';
    }

    render() {
        const options = {
            defaultSortName: 'CompareDaySeq',  
            sortOrder: 'asc',
            prePage: 'Prev',
            nextPage: 'Next',
            firstPage: 'First',
            lastPage: 'Last',
            paginationShowsTotal: this.renderShowsTotal
        };
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="Calendar" campus={this.props.campusName} />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <div>
                              <br />
                              <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                    <label className="col-md-2 col-lg-2 col-sm-2">School Year:</label>
                                    <div className=" col-md-4 col-lg-4 col-sm-4">
                                        <select className="form-control custom-textbox" id="schoolyear" value={this.state.schoolYear} onChange={this.onSchoolYearDropdownChanged}>
                                            {this.props.schoolYears}
                                            </select>
                                    </div>
                                <br/> 
                                </div>
                                <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                              <BootstrapTable data={this.props.calendars} className="table table-hover"
                                options={options}
                                striped hover condensed>
                                <TableHeaderColumn row="0" colSpan="1" dataSort csvHeader="Report Schedule" headerAlign="center">&nbsp;</TableHeaderColumn>
                                <TableHeaderColumn width="10%" row="1" dataFormat={this.CustomInputFormatterSchedule.bind(this)} dataField="ReportSchedule" dataSort>Report Schedule</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="Id" hidden={true} isKey dataSort>Id</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="CompareDaySeq" hidden={true}  dataSort>CompareDaySeq</TableHeaderColumn>
                                <TableHeaderColumn row="0" colSpan="2" dataSort csvHeader="SchoolYear" headerAlign="center">{this.state.schoolYear}</TableHeaderColumn>
                                <TableHeaderColumn row="1" width="10%" dataFormat={this.CustomInputFormatterIDay.bind(this)} dataField="InstructionDay" dataSort>InstructionDay</TableHeaderColumn>
                                <TableHeaderColumn row="1" width="15%" dataFormat={this.CustomInputFormatterReportDate.bind(this)} dataField="ReportDate" dataSort>ReportDate</TableHeaderColumn>
                                <TableHeaderColumn row="0" colSpan="1">&nbsp;</TableHeaderColumn>
                                <TableHeaderColumn row="1" width="65%" dataFormat={this.CustomInputFormatterPlanNotes.bind(this)} dataField="PlanNotes" dataSort>Calendar Planning Notes</TableHeaderColumn>
                                <TableHeaderColumn row="0" colSpan="1">&nbsp;</TableHeaderColumn>
                                <TableHeaderColumn row="1" width="5%" dataField="button" dataFormat={this.SaveButtonFormatter.bind(this)}>&nbsp;</TableHeaderColumn>
                              </BootstrapTable>
                              </div> 
                            </div>
                        </div>
                    </div>
                </div>
                <Dialog hidden={this.state.hideDialog} onDismiss={this.closeDialog}
                        dialogContentProps={{ type: DialogType.normal, title: 'Calendar', subText: this.state.subtext }}
                        modalProps={{ isBlocking: true, containerClassName: 'ms-dialogMainOverride'}}>
                        <DialogFooter>
                            <PrimaryButton onClick={this.okDialog} text="Ok" styles={this.state.OkButtonStyle} />
                            <DefaultButton onClick={this.closeDialog} text="Cancel" />
                        </DialogFooter>
                    </Dialog>
            </div>
        );
    }
}

CalendarPage.propTypes = {
    campusName: PropTypes.string,
    userProps: PropTypes.object,
    schoolYear: PropTypes.string,
    schoolYears: PropTypes.array,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    reportDateID: PropTypes.string,
    reportDate: PropTypes.string,
    calendars: PropTypes.array,
    onUpdate: PropTypes.object,
    showDialog: PropTypes.func,
    displayMessage: PropTypes.func,
    onSavingSucceeds: PropTypes.func,
    onSavingFails: PropTypes.func,
    cancel: PropTypes.func,
    okDialog: PropTypes.func,
    cancelToHome: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    return {
        campusName: state.userProps.user.campusName,
        userProps: state.userProps,
        reportDate: state.reportDate,
        schoolYears: state.schoolYears,
        schoolYear: state.schoolYear,
        calendars: state.calendars
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({},calendarReportDatesActions, nonReportSchoolActions, calendarsActions, enrollmentActions, sharedActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarPage);
