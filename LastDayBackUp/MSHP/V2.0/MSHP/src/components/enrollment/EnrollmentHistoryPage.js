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
import * as gradeLevelsActions from '../../actions/gradeLevelsActions';

class EnrollmentHistoryPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onCampusDropdownChanged = this.onCampusDropdownChanged.bind(this);
        this.onSchoolYearDropdownChanged = this.onSchoolYearDropdownChanged.bind(this);
        this.state = {
            campusID: this.props.campusID,
            allCampuses: [],
            schoolYear: this.props.schoolYear,
            hiddenEE: false,
            hiddenPK: false,
            hiddenKG: false,
            hidden01: false,
            hidden02: false,
            hidden03: false,
            hidden04: false,
            hidden05: false,
            hidden06: false,
            hidden07: false,
            hidden08: false,
            hidden09: false,
            hidden10: false,
            hidden11: false,
            hidden12: false
        };
    }
    
    // componentWillMount(){
    //     if (this.props.userProps.user.role == 'Campus'){
    //         this.props.actions.loadGradeLevelsByCampusAndYear(this.props.campusID, this.state.schoolYear.substring(5,9)).then(obj => {
    //             let indexEE = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('EE');
    //             let indexPK = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('PK');
    //             let indexKG = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('KG');
    //             let index01 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('01');
    //             let index02 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('02');
    //             let index03 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('03');
    //             let index04 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('04');
    //             let index05 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('05');
    //             let index06 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('06');
    //             let index07 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('07');
    //             let index08 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('08');
    //             let index09 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('09');
    //             let index10 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('10');
    //             let index11 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('11');
    //             let index12 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('12');
    
    //             if (indexEE == -1){
    //                 this.setState({ hiddenEE: true });}
    //             if (indexPK == -1){
    //                 this.setState({ hiddenPK: true });}
    //             if (indexKG == -1){
    //                 this.setState({ hiddenKG: true });}
    //             if (index01 == -1){
    //                 this.setState({ hidden01: true });}
    //             if (index02 == -1){
    //                 this.setState({ hidden02: true });}
    //             if (index03 == -1){
    //                 this.setState({ hidden03: true });}
    //             if (index04 == -1){
    //                 this.setState({ hidden04: true });}
    //             if (index05 == -1){
    //                 this.setState({ hidden05: true });}
    //             if (index06 == -1){
    //                 this.setState({ hidden06: true });}
    //             if (index07 == -1){
    //                 this.setState({ hidden07: true });}
    //             if (index08 == -1){
    //                 this.setState({ hidden08: true });}
    //             if (index09 == -1){
    //                 this.setState({ hidden09: true });}
    //             if (index10 == -1){
    //                 this.setState({ hidden10: true });}
    //             if (index11 == -1){
    //                 this.setState({ hidden11: true });}
    //             if (index12 == -1){
    //                 this.setState({ hidden12: true });}
    //         });
    //     }
    // }

    componentDidMount(){
        this.props.actions.loadCurrentSchoolYear();
        this.props.actions.loadEnrollmentHistoryByCampusProfile(this.state.schoolYear, this.props.campusID );
    }

    onCampusDropdownChanged(item) {
        this.setState({ hiddenEE: false });
        this.setState({ hiddenPK: false });
        this.setState({ hiddenKG: false });
        this.setState({ hidden01: false });
        this.setState({ hidden02: false });
        this.setState({ hidden03: false });
        this.setState({ hidden04: false });
        this.setState({ hidden05: false });
        this.setState({ hidden06: false });
        this.setState({ hidden07: false });
        this.setState({ hidden08: false });
        this.setState({ hidden09: false });
        this.setState({ hidden10: false });
        this.setState({ hidden11: false });
        this.setState({ hidden12: false });
        this.setState({ campusID: item.key });
        this.props.actions.updateUserCampus(item, this.props.schoolYear);
        this.props.actions.loadGradeLevelsByCampusAndYear(item.key, this.state.schoolYear.substring(5,9)).then(obj => {
            let indexEE = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('EE');
            let indexPK = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('PK');
            let indexKG = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('KG');
            let index01 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('01');
            let index02 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('02');
            let index03 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('03');
            let index04 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('04');
            let index05 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('05');
            let index06 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('06');
            let index07 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('07');
            let index08 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('08');
            let index09 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('09');
            let index10 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('10');
            let index11 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('11');
            let index12 = this.props.gradeLevels.map(function (e) { return e.gradeLevel; }).indexOf('12');

            if (indexEE == -1){
                this.setState({ hiddenEE: true });}
            if (indexPK == -1){
                this.setState({ hiddenPK: true });}
            if (indexKG == -1){
                this.setState({ hiddenKG: true });}
            if (index01 == -1){
                this.setState({ hidden01: true });}
            if (index02 == -1){
                this.setState({ hidden02: true });}
            if (index03 == -1){
                this.setState({ hidden03: true });}
            if (index04 == -1){
                this.setState({ hidden04: true });}
            if (index05 == -1){
                this.setState({ hidden05: true });}
            if (index06 == -1){
                this.setState({ hidden06: true });}
            if (index07 == -1){
                this.setState({ hidden07: true });}
            if (index08 == -1){
                this.setState({ hidden08: true });}
            if (index09 == -1){
                this.setState({ hidden09: true });}
            if (index10 == -1){
                this.setState({ hidden10: true });}
            if (index11 == -1){
                this.setState({ hidden11: true });}
            if (index12 == -1){
                this.setState({ hidden12: true });}
        });
        this.props.actions.loadEnrollmentHistoryByCampusProfile(this.state.schoolYear, item.key);
    }
    onSchoolYearDropdownChanged(evt){
        this.setState({ schoolYear: evt.target.value });
        this.props.actions.updateSchoolYear(evt.target.value);
        this.props.actions.loadEnrollmentHistoryByCampusProfile(evt.target.value, this.state.campusID);
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
                    <PageHeader title="Enrollment History" campus={this.props.campusName} />
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
                                
                              <BootstrapTable data={this.props.enrollmentsHistory}
                                tableHeaderClass="eh-bs-headerstyle"
                                options={options}
                                searchPlaceholder= {"Search"}
                                striped hover condensed search exportCSV footer>
                                <TableHeaderColumn width="150px" row="0" dataField="ReportSchedule" dataSort>Report Schedule</TableHeaderColumn>
                                <TableHeaderColumn width="130px" row="0" dataField="InstructionDay" isKey dataSort>Instruction Day</TableHeaderColumn>
                                <TableHeaderColumn width="120px" row="0" dataFormat={this.dateFormatter} dataField="ReportDate" dataSort>Report Date</TableHeaderColumn>
                                <TableHeaderColumn width="50px" row="0" dataField="IEE" hidden={this.state.hiddenEE} dataSort>EE</TableHeaderColumn>
                                <TableHeaderColumn width="50px" row="0" dataField="IPK" hidden={this.state.hiddenPK} dataSort>PK</TableHeaderColumn>
                                <TableHeaderColumn width="50px" row="0" dataField="IKG" hidden={this.state.hiddenKG} dataSort>KG</TableHeaderColumn>
                                <TableHeaderColumn width="50px" row="0" dataField="I01" hidden={this.state.hidden01} dataSort>01</TableHeaderColumn>
                                <TableHeaderColumn width="50px" row="0" dataField="I02" hidden={this.state.hidden02} dataSort>02</TableHeaderColumn>
                                <TableHeaderColumn width="50px" row="0" dataField="I03" hidden={this.state.hidden03} dataSort>03</TableHeaderColumn>
                                <TableHeaderColumn width="50px" row="0" dataField="I04" hidden={this.state.hidden04} dataSort>04</TableHeaderColumn>
                                <TableHeaderColumn width="50px" row="0" dataField="I05" hidden={this.state.hidden05} dataSort>05</TableHeaderColumn>
                                <TableHeaderColumn width="50px" row="0" dataField="I06" hidden={this.state.hidden06} dataSort>06</TableHeaderColumn>
                                <TableHeaderColumn width="50px" row="0" dataField="I07" hidden={this.state.hidden07} dataSort>07</TableHeaderColumn>
                                <TableHeaderColumn width="50px" row="0" dataField="I08" hidden={this.state.hidden08} dataSort>08</TableHeaderColumn>
                                <TableHeaderColumn width="50px" row="0" dataField="I09" hidden={this.state.hidden09} dataSort>09</TableHeaderColumn>
                                <TableHeaderColumn width="50px" row="0" dataField="I10" hidden={this.state.hidden10} dataSort>10</TableHeaderColumn>
                                <TableHeaderColumn width="50px" row="0" dataField="I11" hidden={this.state.hidden11} dataSort>11</TableHeaderColumn>
                                <TableHeaderColumn width="50px" row="0" dataField="I12" hidden={this.state.hidden12} dataSort>12</TableHeaderColumn>
                                <TableHeaderColumn width="120px" row="0" dataField="CreatedBy" dataSort>CreatedBy</TableHeaderColumn>
                                <TableHeaderColumn width="120px" row="0" dataFormat={this.dateFormatter}  dataField="CreatedDate" dataSort>CreatedDate</TableHeaderColumn>
                                <TableHeaderColumn width="120px" row="0" dataField="UpdatedBy" dataSort>UpdatedBy</TableHeaderColumn>
                                <TableHeaderColumn width="120px" row="0" dataFormat={this.dateFormatter} dataField="UpdatedDate" dataSort>UpdatedDate</TableHeaderColumn>
                              </BootstrapTable>
                             
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
    allCampuses: PropTypes.array,
    gradeLevels: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps,
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        enrollmentsHistory: state.enrollmentsHistory,
        schoolYears: state.schoolYears,
        allCampuses: campusesFormattedForDropdownGeneric(state.campuses),
        schoolYear: state.schoolYear,
        gradeLevels: state.gradeLevels
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, campusActions, enrollmentActions, sharedActions, ajaxActions, gradeLevelsActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EnrollmentHistoryPage);
