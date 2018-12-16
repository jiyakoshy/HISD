import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import {bindActionCreators} from 'redux';
import * as campusAction from '../../actions/campusActions';
import * as adminActions from '../../actions/adminActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import Utilities from '../../utilities/utilities';
import LinkFormatter from '../common/formatters/linkFormatter';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class MenteesEndDatesPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { campusID: '', visibility: {visibility: "hidden"} };
        this.newMenteeEndDate = this.newMenteeEndDate.bind(this);
        this.viewAllMenteesEndDates = this.viewAllMenteesEndDates.bind(this);
    }

    componentDidMount() {
        this.props.actions.loadMenteesEndDatesByCampusID(this.props.userProps.user.campusID);
        this.setState({campusID: this.props.campusID});
        if(this.props.userProps.user.role == 'Admin'){
            this.setState({ visibility: {visibility: "visible"}});
        }
       
    }

    viewAllMenteesEndDates(){
        if(this.props.userProps.user.role == "Admin")
            this.props.actions.loadAllMenteesEndDates();
    }

    newMenteeEndDate(){
        if(this.props.userProps.user.role == "Principal" || this.props.userProps.user.role == "CIC")
            document.location = "#newcampuscontact";
        else
            document.location = "#admin-newmenteeenddate";
    }

    lowerCaseFormatter(cell, row) {
        if(cell != null)
            return (<span style={{textTransform: "lowercase"}}>{cell.toLowerCase()}</span>);
        else
            return "";
    }

    dateFormatter(cell, row) {
        let formattedDate = Utilities.getDateOnly(cell);
        return (formattedDate);
    }

    linkFormatter(cell, row) {
        let url = '#admin-menteesenddates/' + row.StaffNaturalKey;
        let tooltip = 'Edit "' + cell.trim() + '" Mentee End Date';
        return (
          <LinkFormatter url={url} description={cell} tooltip={tooltip} />
        );
    }

    renderShowsTotal(start, to, total) {
        return (
          <p style={{color: 'black'}}>
            From {start} to {to}. Total: {total}&nbsp;&nbsp;
          </p>
        );
    }
    
    render() {
        if(this.state.campusID != this.props.campusID){
            this.props.actions.loadMenteesEndDatesByCampusID(this.props.campusID);
            this.setState({campusID: this.props.campusID});
        }
        const options = {
            defaultSortName: 'MenteeName',
            sortOrder: 'asc',
            prePage: 'Prev',
            nextPage: 'Next',
            firstPage: 'First',
            lastPage: 'Last',
            paginationShowsTotal: this.renderShowsTotal
        };
        return (
            <IfAnyGranted expected={['Admin','Principal', 'CIC']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Mentees End Dates" campus={this.props.campus} />
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div className="white-box pull-right">
                                    <PrimaryButton
                                        text="View All Mentees End Dates"
                                        onClick={this.viewAllMenteesEndDates}
                                        style={this.state.visibility}
                                    />
                                    <BootstrapTable data={this.props.menteesEndDates} hover condensed pagination options={options} search>
                                        <TableHeaderColumn dataField="StaffNaturalKey" dataAlign="left" dataFormat={this.linkFormatter}>Emp. ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MenteeName" dataSort dataAlign="left">Mentee Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="JobCodeDescription" dataSort dataAlign="left">Title</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MenteeEndDate" dataSort dataAlign="center" dataFormat={this.dateFormatter}>Mentorship End Date</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ElectronicMailAddress" dataSort dataAlign="left" dataFormat={this.lowerCaseFormatter}>E-mail Address</TableHeaderColumn>
                                        <TableHeaderColumn dataField="EducationOrgNaturalKey" dataSort dataAlign="center">Campus ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="NameOfInstitution" dataSort dataAlign="left">Campus Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MenteeEndDateID" dataAlign="center" isKey hidden />
                                    </BootstrapTable>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </IfAnyGranted>
        );
    }
}

MenteesEndDatesPage.propTypes = {
    campusID: PropTypes.string,
    campus: PropTypes.string,
    menteesEndDates: PropTypes.array,
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object,
    visibility: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campus: state.userProps.user.campusName,
        menteesEndDates: state.menteesEndDates,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, adminActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenteesEndDatesPage);