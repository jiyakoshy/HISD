import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as campusActions from '../../actions/campusActions';
import * as nonReportSchoolActions from '../../actions/nonReportSchoolActions';
import * as detailreportActions from '../../actions/detailreportActions';
import * as enrollmentActions from '../../actions/enrollmentActions';
import * as sharedActions from './../../actions/sharedActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { BootstrapTable, TableHeaderColumn, Grid, Row, Col} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { Dropdown } from 'office-ui-fabric-react';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import Utilities from '../../utilities/utilities';

class DetailReportPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onSchoolYearDropdownChanged = this.onSchoolYearDropdownChanged.bind(this);
        this.onReportDateDropdownChanged = this.onReportDateDropdownChanged.bind(this);
        this.campusFormatter = this.campusFormatter.bind(this);
        this.state = {
            schoolYear: this.props.schoolYear,
            reportDate: null,
            campuses: this.props.allCampuses
        };
    }

    componentWillMount(){
        let reportdate = Utilities.getMostRecentCompareDaySeq([...this.props.calendarReportDates], this.state.schoolYear);
        this.setState({ reportDate: reportdate});
    }

    componentDidMount(){
        this.props.actions.loadAllSchoolYears();
        this.props.actions.loadCurrentSchoolYear();
        this.props.actions.loadAllCompareDaySeq(this.state.schoolYear);
        this.props.actions.loadDetailReports(this.state.schoolYear,this.state.reportDate);
    }
    
    
    onSchoolYearDropdownChanged(evt){
        this.setState({ schoolYear: evt.target.value });
        this.props.actions.updateSchoolYear(evt.target.value);
        let reportdate = Utilities.getMostRecentCompareDaySeq([...this.props.calendarReportDates], evt.target.value);
        this.setState({ reportDate: reportdate});
        this.props.actions.loadAllCompareDaySeq(evt.target.value);
        this.props.actions.loadDetailReports(evt.target.value, reportdate);
    }
    onReportDateDropdownChanged(evt){
        this.setState({ reportDate: evt.target.value });
        this.props.actions.loadDetailReports(this.state.schoolYear,evt.target.value);
    }
    renderShowsTotal(start, to, total) {
        return (
            <p style={{color: 'black'}}>
            From {start} to {to}. Total: {total}&nbsp;&nbsp;
            </p>
        );
    }
    campusFormatter(cell, row) {
        let CampusName = '';
        let filtername = this.state.campuses.filter(c => c.EducationOrgNaturalKey == row.CampusNumber);
        if (filtername)
        {
            CampusName = filtername['0'].NameOfInstitution;
            return CampusName;
        }
        else{
            return '';
        }
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
            defaultSortName: 'CampusNumber',  
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
                    <PageHeader title="Detail Report" campus={this.props.campusName} />
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
                                 data={this.props.detailreport} options={options} searchPlaceholder= {"Search"} pagination striped hover condensed search exportCSV>
                                    <TableHeaderColumn row="0" colSpan="2" dataSort csvHeader="Level" headerAlign="center">Campus</TableHeaderColumn>
                                    <TableHeaderColumn width="50px" row="1" dataField="CampusNumber" isKey dataSort>Id</TableHeaderColumn>
                                    {/* <TableHeaderColumn width="200px" row="1" dataFormat={this.campusFormatter.bind(this)}  dataField="LevelGroup" >Name</TableHeaderColumn> */}
                                    <TableHeaderColumn width="200px" row="1" dataField="CampusName" dataSort>Name</TableHeaderColumn>
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
                                    <TableHeaderColumn width="60px" row="1" dataField="TotalDiff" datasort>Diff++</TableHeaderColumn>
                                    {/* <TableHeaderColumn width="60px" row="1" dataField="LastYearEnrollment" dataFormat={this.diffFormatter.bind(this)}>Diff++</TableHeaderColumn> */}
                                    <TableHeaderColumn row="0" colSpan="2" dataSort csvHeader="Projection" headerAlign="center">Projection</TableHeaderColumn>
                                    <TableHeaderColumn width="100px" row="1" dataField="Projection" dataSort>&nbsp;</TableHeaderColumn>
                                    {/* <TableHeaderColumn width="60px" row="1" dataField="Projection" dataFormat={this.projdiffFormatter.bind(this)}>Diff++</TableHeaderColumn> */}
                                    <TableHeaderColumn width="60px" row="1" dataField="Projdiff" dataSort>Diff++</TableHeaderColumn>
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

DetailReportPage.propTypes = {
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    reportDates: PropTypes.array,
    detailreport: PropTypes.array,
    schoolYears: PropTypes.array,
    schoolYear: PropTypes.string,
    reportDate: PropTypes.string,
    allCampuses: PropTypes.array,
    calendarReportDates: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        campusName: state.userProps.user.campusName,
        reportDates: state.reportDates,
        detailreport: state.detailreport,
        schoolYears: state.schoolYears,
        schoolYear: state.schoolYear,
        reportDate: state.reportDate,
        allCampuses: state.campuses,
        calendarReportDates: state.calendarReportDates
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, campusActions,nonReportSchoolActions, detailreportActions, enrollmentActions, sharedActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailReportPage);
