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

const cellEdit={
	"mode":"click",
	blurToSave: true
};

class CalendarPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onSchoolYearDropdownChanged = this.onSchoolYearDropdownChanged.bind(this);
        this.state = {
            reportDate: null,
            schoolYear: this.props.schoolYear,
            hidden: false
        };
    }
    
    componentDidMount(){
        this.props.actions.loadCurrentSchoolYear();
        this.props.actions.loadCalendars(this.state.schoolYear);
    }

    onSchoolYearDropdownChanged(evt){
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
    
    render() {
        const options = {
            defaultSortName: 'InstructionDay',  
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
                <div className="row bg-title">
                            <div className="col-lg-12 col-md-12 col-sm-12 ">
                                <span>Calendar</span>
                            </div>
                        </div>
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <div>
                              <br />
                              <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                        <label className="col-md-2 col-lg-2 col-sm-2">School Year:</label>
                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                           <select id="schoolyear" value={this.state.schoolYear} onChange={this.onSchoolYearDropdownChanged}>
                                             {this.props.schoolYears}
                                            </select>
                                        </div>
                                </div>
                                <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                              <BootstrapTable data={this.props.calendars}
                                tableHeaderClass="eh-bs-headerstyle"
                                cellEdit={cellEdit} 
                                options={options}
                                searchPlaceholder= {"Search"}
                                striped hover condensed search exportCSV>
                                <TableHeaderColumn row="0" colSpan="1" dataSort csvHeader="Report Schedule" headerAlign="center">&nbsp;</TableHeaderColumn>
                                <TableHeaderColumn width="20%" row="1" dataSort>Report Schedule</TableHeaderColumn>
                                <TableHeaderColumn row="0" dataField="Id" hidden={true} isKey dataSort>Id</TableHeaderColumn>
                                <TableHeaderColumn row="0" colSpan="2" dataSort csvHeader="SchoolYear" headerAlign="center">{this.state.schoolYear}</TableHeaderColumn>
                                <TableHeaderColumn row="1" width="20%" dataField="InstructionDay" dataSort>InstructionDay</TableHeaderColumn>
                                <TableHeaderColumn row="1" width="30%" dataFormat={this.dateFormatter} editable={ { type: 'date' } } dataField="ReportDate" dataSort>ReportDate</TableHeaderColumn>
                                <TableHeaderColumn row="0" colSpan="1"></TableHeaderColumn>
                                <TableHeaderColumn row="1" width="30%" dataField="PlanNotes" dataSort>Calendar Planning Notes</TableHeaderColumn>
                              </BootstrapTable>
                              </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CalendarPage.propTypes = {
    userProps: PropTypes.object,
    schoolYear: PropTypes.string,
    schoolYears: PropTypes.array,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    reportDateID: PropTypes.string,
    reportDate: PropTypes.string,
    calendars: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps,
        reportDate: state.reportDate,
        schoolYears: state.schoolYears,
        schoolYear: state.schoolYear,
        calendars: state.calendars
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({},calendarsActions, enrollmentActions, sharedActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarPage);
