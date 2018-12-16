import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as campusActions from '../../actions/campusActions';
import * as nonReportSchoolActions from '../../actions/nonReportSchoolActions';
import * as summaryreportActions from '../../actions/summaryreportActions';
import * as enrollmentActions from '../../actions/enrollmentActions';
import * as sharedActions from './../../actions/sharedActions';
import * as calendarReportDatesActions from './../../actions/calendarReportDatesActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { BootstrapTable, TableHeaderColumn, Grid, Row, Col} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { Dropdown } from 'office-ui-fabric-react';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import Utilities from '../../utilities/utilities';

class SummaryReportPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onSchoolYearDropdownChanged = this.onSchoolYearDropdownChanged.bind(this);
        this.onReportDateDropdownChanged = this.onReportDateDropdownChanged.bind(this);
        this.state = {
            schoolYear: this.props.schoolYear,
            reportDate: null
        };
    }

    componentWillMount(){
        this.props.actions.loadCalendarReportDates(this.state.schoolYear);
        let reportdate = Utilities.getMostRecentCompareDaySeq([...this.props.calendarReportDates], this.state.schoolYear);
        this.setState({ reportDate: reportdate});
    }
    
    componentDidMount(){
        this.props.actions.loadAllSchoolYears();
        this.props.actions.loadCurrentSchoolYear();
        this.props.actions.loadAllCompareDaySeq(this.state.schoolYear);
        this.props.actions.loadsummaryReports(this.state.schoolYear,this.state.reportDate);
        
    }
    onSchoolYearDropdownChanged(evt){
        this.setState({ schoolYear: evt.target.value });
        this.props.actions.updateSchoolYear(evt.target.value);
        let reportdate = Utilities.getMostRecentCompareDaySeq([...this.props.calendarReportDates], evt.target.value);
        this.setState({ reportDate: reportdate});
        this.props.actions.loadsummaryReports(evt.target.value, reportdate);
        this.props.actions.loadAllCompareDaySeq(evt.target.value);
    }
    onReportDateDropdownChanged(evt){
        this.setState({ reportDate: evt.target.value });
        this.props.actions.loadsummaryReports(this.state.schoolYear,evt.target.value);
    }

    diffFormatter(cell, row) {
        let difference = '';
        difference = row.Total - row.LastYearEnrollment;
        if (difference)
        {
            return difference;
        }
        else{
            return '';
        }
    }

    projdiffFormatter(cell, row) {
        let difference = '';
        difference = row.Total - row.Projection;
        if (difference)
        {
            return difference;
        }
        else{
            return '';
        }
    }

    render() {
        const options = {
            defaultSortName: 'LevelGroupID',  
            sortOrder: 'asc'
        };
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="Summary Report" campus={this.props.campusName} />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <div>
                                <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                    <label className="col-md-2 col-lg-2 col-sm-2">School Year:</label>
                                    <div className=" col-md-4 col-lg-4 col-sm-4">
                                        <select className="form-control custom-textbox"  id="schoolyear" value={this.state.schoolYear} onChange={this.onSchoolYearDropdownChanged}>
                                            {this.props.schoolYears}
                                        </select>
                                    </div>
                                </div>
                                <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                    <label className="col-md-2 col-lg-2 col-sm-2">Report Date:</label>
                                    <div className=" col-md-4 col-lg-4 col-sm-4">
                                        <select className="form-control custom-textbox"  id="reportDate" value={this.state.reportDate} onChange={this.onReportDateDropdownChanged}>>
                                            {this.props.reportDates}
                                        </select>
                                    </div>
                                </div>
                               
                                    <BootstrapTable 
                                        tableHeaderClass="eh-bs-headerstyle" 
                                        data={this.props.summaryreport} 
                                        searchPlaceholder= {"Search"} striped hover condensed search exportCSV footer>
                                        <TableHeaderColumn row="0" colSpan="1" dataSort csvHeader="Level" headerAlign="center">&nbsp;</TableHeaderColumn>
                                        <TableHeaderColumn width="120px" row="1" dataField="LevelGroup" isKey>&nbsp;</TableHeaderColumn>
                                        <TableHeaderColumn row="0" colSpan="15" dataSort csvHeader="Grade Level" headerAlign="center">Grade Level</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="1" dataField="IEE" dataSort>EE</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="1" dataField="IPK" dataSort>PK</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="1" dataField="IKG" dataSort>KG</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="1" dataField="I01" dataSort>01</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="1" dataField="I02" dataSort>02</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="1" dataField="I03" dataSort>03</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="1" dataField="I04" dataSort>04</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="1" dataField="I05" dataSort>05</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="1" dataField="I06" dataSort>06</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="1" dataField="I07" dataSort>07</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="1" dataField="I08" dataSort>08</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="1" dataField="I09" dataSort>09</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="1" dataField="I10" dataSort>10</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="1" dataField="I11" dataSort>11</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="1" dataField="I12" dataSort>12</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="1" dataField="LevelGroupID" hidden dataSort>LevelGroupID</TableHeaderColumn>
                                        <TableHeaderColumn width="50px" row="0" colSpan="1" dataSort csvHeader="Capacity" headerAlign="center">Capacity</TableHeaderColumn>
                                        <TableHeaderColumn width="80px" row="1" dataField="Capacity" dataSort>&nbsp;</TableHeaderColumn>
                                        <TableHeaderColumn row="0" colSpan="3" dataSort csvHeader="Membership YOY change" headerAlign="center">Membership YOY change</TableHeaderColumn>
                                        <TableHeaderColumn width="120px" row="1" dataField="Total" dataSort>Current Year</TableHeaderColumn>
                                        <TableHeaderColumn width="120px" row="1" dataField="LastYearEnrollment" dataSort>Previous Year</TableHeaderColumn>
                                        <TableHeaderColumn width="60px" row="1" dataField="LastYearEnrollment" dataFormat={this.diffFormatter.bind(this)}>Diff++</TableHeaderColumn>
                                        <TableHeaderColumn row="0" colSpan="2" dataSort csvHeader="Projection" headerAlign="center">Projection</TableHeaderColumn>
                                        <TableHeaderColumn width="100px" row="1" dataField="Projection" dataSort>&nbsp;</TableHeaderColumn>
                                        <TableHeaderColumn width="60px" row="1" dataField="Projection" dataFormat={this.projdiffFormatter.bind(this)}>Diff++</TableHeaderColumn>
                                        <TableHeaderColumn row="0" colSpan="1" dataSort csvHeader="Snapshot" headerAlign="center">Prev SnapShot</TableHeaderColumn>
                                        <TableHeaderColumn width="130px" row="1" dataField="PrevSnapshot" dataSort>&nbsp;</TableHeaderColumn>
                                    </BootstrapTable>  
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

SummaryReportPage.propTypes = {
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    reportDates: PropTypes.array,
    summaryreport: PropTypes.array,
    schoolYears: PropTypes.array,
    schoolYear: PropTypes.string,
    reportDate: PropTypes.string,
    calendarReportDates: PropTypes.array

};

function mapStateToProps(state, ownProps) {
    return {
        campusName: state.userProps.user.campusName,
        reportDates: state.reportDates,
        summaryreport: state.summaryreport,
        schoolYears: state.schoolYears,
        schoolYear: state.schoolYear,
        reportDate: state.reportDate,
        calendarReportDates: state.calendarReportDates
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, calendarReportDatesActions,campusActions, nonReportSchoolActions,summaryreportActions, enrollmentActions,sharedActions,ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(SummaryReportPage);
