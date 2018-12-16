import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as campusActions from '../../actions/campusActions';
import * as enrollmentActions from '../../actions/enrollmentActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { BootstrapTable, TableHeaderColumn, Grid, Row, Col} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import * as sharedActions from './../../actions/sharedActions';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { campusesFormattedForDropdown, campusesFormattedForDropdownGeneric } from './../../selectors/selectors';
import Utilities from '../../utilities/utilities'; 
import * as ajaxActions from '../../actions/ajaxStatusActions';

class EnrollmentHistoryPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onCampusDropdownChanged = this.onCampusDropdownChanged.bind(this);
        this.onSchoolYearDropdownChanged = this.onSchoolYearDropdownChanged.bind(this);
        this.state = {
            campusID: this.props.campusID,
            allCampuses: [],
            schoolYear: this.props.schoolYear,
            hidden: false
        };
    }
    
    componentDidMount(){
        this.props.actions.loadCurrentSchoolYear();
        this.props.actions.loadEnrollmentHistoryByCampusProfile(this.state.schoolYear, this.props.campusID );
    }

    onCampusDropdownChanged(item) {
        this.setState({ campusID: item.key });
        this.props.actions.updateUserCampus(item, this.props.schoolYear);
        this.props.actions.loadEnrollmentHistoryByCampusProfile(this.props.schoolYear, item.key);
    }
    onSchoolYearDropdownChanged(evt){
        this.setState({ schoolYear: evt.target.value });
        this.props.actions.updateSchoolYear(evt.target.value);
        this.props.actions.loadEnrollmentHistoryByCampusProfile(evt.target.value, this.props.campusID);
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
        let selectedKey = '';
        if(this.props.userProps && this.props.userProps.user)
            selectedKey = this.props.userProps.user.campusID;
        let isDisabled = true;
        if(this.props.userProps.user.role == 'Admin') isDisabled = false;
        if((!selectedKey || selectedKey == '') && (this.props.allCampuses.length > 0)) selectedKey = this.props.allCampuses[0].key;
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                <div className="row bg-title">
                            <div className="col-lg-12 col-md-12 col-sm-12 ">
                                <span>Enrollment History</span>
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
                                            {/* <Dropdown id="schoolyear" value={this.state.schoolYear} onChange={this.onSchoolYearDropdownChanged} options= {this.props.schoolYears} /> */}
                                    </div>
                                </div>
                                <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                                        <label className="col-md-2 col-lg-2 col-sm-2">Campus Name:</label>
                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                            <Dropdown options={this.props.allCampuses} onChanged={this.onCampusDropdownChanged} selectedKey={this.state.campusID} disabled={isDisabled}
                                            placeHolder="Select Campus"/>
                                    </div>
                                </div>
                                <div className="row" style={{ 'marginBottom': '15px', 'marginTop': '8px' }}>
                              <BootstrapTable data={this.props.enrollmentsHistory}
                                tableHeaderClass="eh-bs-headerstyle"
                                options={options}
                                searchPlaceholder= {"Search"}
                                striped hover condensed search exportCSV>
                                <TableHeaderColumn row="0" colSpan="1" dataSort csvHeader="Report Schedule" headerAlign="center">&nbsp;</TableHeaderColumn>
                                <TableHeaderColumn width="120px" row="1" dataSort>Report Schedule</TableHeaderColumn>
                                <TableHeaderColumn row="0" colSpan="2" dataSort csvHeader="SchoolYear" headerAlign="center">{this.state.schoolYear}</TableHeaderColumn>
                                <TableHeaderColumn width="120px" row="1" dataField="InstructionDay" isKey dataSort>Instruction Day</TableHeaderColumn>
                                <TableHeaderColumn width="120px" row="1" dataFormat={this.dateFormatter} dataField="ReportDate" dataSort>Report Date</TableHeaderColumn>
                                <TableHeaderColumn row="0" colSpan="15" dataSort csvHeader="Grade Level" headerAlign="center">Grade Level</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="IEE" dataSort>EE</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="IPK" dataSort>PK</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="IKG" dataSort>KG</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="I01" dataSort>01</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="I02" dataSort>02</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="I03" dataSort>03</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="I04" dataSort>04</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="I05" dataSort>05</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="I06" dataSort>06</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="I07" dataSort>07</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="I08" dataSort>08</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="I09" dataSort>09</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="I10" dataSort>10</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="I11" dataSort>11</TableHeaderColumn>
                                <TableHeaderColumn row="1" dataField="I12" dataSort>12</TableHeaderColumn>
                                <TableHeaderColumn width="100px" row="1" dataField="CreatedBy" dataSort>CreatedBy</TableHeaderColumn>
                                <TableHeaderColumn width="100px" row="1" dataFormat={this.dateFormatter}  dataField="CreatedDate" dataSort>CreatedDate</TableHeaderColumn>
                                <TableHeaderColumn width="100px" row="1" dataField="UpdatedBy" dataSort>UpdatedBy</TableHeaderColumn>
                                <TableHeaderColumn width="100px" row="1" dataFormat={this.dateFormatter} dataField="UpdatedDate" dataSort>UpdatedDate</TableHeaderColumn>
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

EnrollmentHistoryPage.propTypes = {
    userProps: PropTypes.object,
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    schoolYear: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    enrollmentsHistory: PropTypes.array,
    schoolYears: PropTypes.array,
    allCampuses: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps,
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        enrollmentsHistory: state.enrollmentsHistory,
        schoolYears: state.schoolYears,
        allCampuses: campusesFormattedForDropdownGeneric(state.campuses),
        schoolYear: state.schoolYear
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, campusActions, enrollmentActions, sharedActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EnrollmentHistoryPage);
