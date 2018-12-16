import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as campusActions from '../../actions/campusActions';
import * as annualsetupActions from '../../actions/annualsetupActions';
import * as enrollmentActions from '../../actions/enrollmentActions';
import * as sharedActions from './../../actions/sharedActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { BootstrapTable, TableHeaderColumn, Grid, Row, Col} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { Dropdown } from 'office-ui-fabric-react';
import * as ajaxActions from '../../actions/ajaxStatusActions';
const cellEdit={
	"mode":"click",
	blurToSave: true
};

class AnnualSetupPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onSchoolYearDropdownChanged = this.onSchoolYearDropdownChanged.bind(this);
        this.state = {
            schoolYear: this.props.schoolYear,
            reportDate: 1
        };
    }

    componentDidMount(){
        this.props.actions.loadAllSchoolYears();
        this.props.actions.loadCurrentSchoolYear();
        this.props.actions.loadAnnualSetUp(this.state.schoolYear,this.state.reportDate);
    }
    
    onSchoolYearDropdownChanged(evt){
        this.setState({ schoolYear: evt.target.value });
        this.props.actions.updateSchoolYear(evt.target.value);
        this.props.actions.loadAnnualSetUp(evt.target.value, this.state.reportDate);
    }
    renderShowsTotal(start, to, total) {
        return (
            <p style={{color: 'black'}}>
            From {start} to {to}. Total: {total}&nbsp;&nbsp;
            </p>
        );
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
                    <PageHeader title="Annual Setup" campus={this.props.campusName} />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <div>
                                <div className="col-lg-12 col-md-12 col-sm-12 hidden-xs">
                                    <label>School Year:&nbsp;&nbsp;<b><select id="schoolyear" value={this.state.schoolYear} onChange={this.onSchoolYearDropdownChanged}>
                                            {this.props.schoolYears}
                                            </select></b>
                                    </label>
                                <br/> <br/>
                                </div>
                                <div className="col-md-12 col-lg-12 col-sm-12">
                                    <BootstrapTable 
                                    tableHeaderClass="eh-bs-headerstyle"
                                    cellEdit={cellEdit} data={this.props.annualsetup} 
                                    options={options} searchPlaceholder= {"Search"} 
                                    pagination striped hover condensed search exportCSV>
                                        <TableHeaderColumn row="0" colSpan="6" dataSort csvHeader="SchoolYear" headerAlign="center">{this.state.schoolYear}</TableHeaderColumn>
                                        <TableHeaderColumn row="1" editable={false} isKey dataField="CampusNumber" dataSort>Campus ID</TableHeaderColumn>
                                        <TableHeaderColumn row="1" editable={false} dataSort>Campus Name</TableHeaderColumn>
                                        <TableHeaderColumn row="1" editable={false} dataSort>CSO</TableHeaderColumn>
                                        <TableHeaderColumn row="1" editable={false} dataField="LevelGroup" dataSort>Type</TableHeaderColumn>
                                        <TableHeaderColumn row="1" editable dataField="Projection" dataSort>Projection</TableHeaderColumn>
                                        <TableHeaderColumn row="1" editable dataField="Capacity" dataSort>Capacity</TableHeaderColumn>
                                        <TableHeaderColumn row="1" editable dataField="PrevSnapshot" dataSort>Snapshot</TableHeaderColumn>
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

AnnualSetupPage.propTypes = {
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    annualsetup: PropTypes.array,
    schoolYears: PropTypes.array,
    schoolYear: PropTypes.string
};

function mapStateToProps(state, ownProps) {
    return {
        campusName: state.userProps.user.campusName,
        annualsetup: state.annualsetup,
        schoolYears: state.schoolYears,
        schoolYear: state.schoolYear
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, campusActions, annualsetupActions, enrollmentActions, sharedActions,ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnualSetupPage);
