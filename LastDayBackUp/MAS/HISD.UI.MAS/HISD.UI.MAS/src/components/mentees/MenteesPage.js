import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import {bindActionCreators} from 'redux';
import * as campusActions from '../../actions/campusActions';
import * as menteesActions from '../../actions/menteesActions';
import * as spUserPropsActions from '../../actions/spUserPropsActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import * as adminActions from '../../actions/adminActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import ActiveFormatter from '../common/formatters/activeFormatter';
import Utilities from '../../utilities/utilities';
import LeaderInfo from '../common/LeaderInfo';
import LinkFormatter from '../common/formatters/linkFormatter';

import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class MenteesPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { campusID: ''};
    }

    componentDidMount() {
        const userRole = this.props.userProps.user.role;
        //const userEmployeeID = this.props.userProps.user.employeeID;
        const userStaffNaturalKey = this.props.userProps.user.staffNaturalKey;
        const userTimeConfigurationID = this.props.userProps.timeConfigurationID;
        if (userRole == "Mentor"){
            this.props.actions.loadMenteesInActiveRelationshipsByMentorID(userStaffNaturalKey , userTimeConfigurationID, this.props.userProps.user.campusID);
        }
        else{
            this.props.actions.loadMenteesInActiveRelationshipsByCampusID(this.props.userProps.user.campusID, userTimeConfigurationID);
        }
        this.props.actions.loadCampusContactsByCampusID(this.props.userProps.user.campusID);
        this.setState({campusID: this.props.campusID});
        this.setState({currentUserRole: this.props.userProps.user.role});
    }

    activeFormatter(cell, row) {
        let value = cell == 'Y' ? true : false;
        return (
          <ActiveFormatter active={value} />
        );
    }

    lowerCaseFormatter(cell, row) {
        return (
          <span style={{textTransform: "lowercase"}}>{cell}</span>
        );
    }

    renderShowsTotal(start, to, total) {
        return (
          <p style={{color: 'black'}}>
            From {start} to {to}. Total: {total}&nbsp;&nbsp;
          </p>
        );
    }

    linkFormatter(cell, row) {
        let url = '#mentees/' + row.StaffNaturalKey; // + "/" + row.MentorAgreement;
        let tooltip = 'View Mentee Relationship Details';
            return (
                <LinkFormatter url={url} description="View/Action" tooltip={tooltip} />
            );
    }

    render() {
        if(this.state.campusID != this.props.campusID){
            if(this.props.userProps.user.role == "Mentor"){
                this.props.actions.loadMenteesInActiveRelationshipsByMentorID(this.props.userProps.user.staffNaturalKey , this.props.userProps.timeConfigurationID, this.props.userProps.user.campusID);
            }
            else{
                this.props.actions.loadMenteesInActiveRelationshipsByCampusID(this.props.campusID);
            }
            this.props.actions.loadCampusContactsByCampusID(this.props.campusID);
            this.setState({campusID: this.props.campusID});
        }
        const options = {
            defaultSortName: 'FullName',
            sortOrder: 'asc',
            prePage: 'Prev',
            nextPage: 'Next',
            firstPage: 'First',
            lastPage: 'Last',
            paginationShowsTotal: this.renderShowsTotal
        };
        return (
            <IfAnyGranted expected={['Admin', 'Principal', 'CIC', 'Mentor']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="Mentee Relationships" campus={this.props.campus} />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <LeaderInfo />
                            <div className="white-box">
                                <BootstrapTable data={this.props.mentees} hover condensed pagination options={options} search>
                                    <TableHeaderColumn dataField="StaffNaturalKey"  dataAlign="left" dataFormat={this.linkFormatter}>View/Action</TableHeaderColumn>
                                    <TableHeaderColumn dataField="StaffNaturalKey"  dataAlign="left">Employee ID</TableHeaderColumn>
                                    <TableHeaderColumn dataField="FullName" dataSort dataAlign="left" thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Mentee Name</TableHeaderColumn>
                                    <TableHeaderColumn dataField="StaffNaturalKey"  dataAlign="center" isKey hidden />
                                        
                                    {/*<TableHeaderColumn dataField="JobCodeDescription" dataSort dataAlign="left" tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Title</TableHeaderColumn>
                                    <TableHeaderColumn dataField="ACP" dataSort dataAlign="left" tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>ACP</TableHeaderColumn>
                                    <TableHeaderColumn dataField="CertificationStatus" dataSort dataAlign="center" dataFormat={this.activeFormatter} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Certification Status</TableHeaderColumn>
                                    <TableHeaderColumn dataField="ElectronicMailAddress" dataSort dataAlign="left" dataFormat={this.lowerCaseFormatter} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>E-mail Address</TableHeaderColumn>*/}
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

MenteesPage.propTypes = {
    campusID: PropTypes.string,
    StaffNaturalKey: PropTypes.string,
    campus: PropTypes.string,
    mentees: PropTypes.array,
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        StaffNaturalKey: state.userProps.user.StaffNaturalKey,
        campus: state.userProps.user.campusName,
        mentees: state.mentees,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, campusActions, menteesActions, adminActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenteesPage);