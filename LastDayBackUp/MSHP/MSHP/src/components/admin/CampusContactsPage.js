import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import {bindActionCreators} from 'redux';
import * as campusActions from '../../actions/campusActions';
import * as adminActions from '../../actions/adminActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import ActiveFormatter from '../common/formatters/activeFormatter';
import Utilities from '../../utilities/utilities';
import LinkFormatter from '../common/formatters/linkFormatter';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';
import LeaderInfo from '../common/LeaderInfo';

class CampusContactsPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { campusID: '', visibility: {visibility: "hidden"} };
        this.newCampusContact = this.newCampusContact.bind(this);
        this.viewAllCampusContacts = this.viewAllCampusContacts.bind(this);
    }

    componentDidMount() {
        this.props.actions.loadCampusContactsByCampusID(this.props.userProps.user.campusID);
        this.setState({campusID: this.props.campusID});
        if(this.props.userProps.user.role == 'Admin'){
            this.setState({ visibility: {visibility: "visible"}});
        }
    }

    viewAllCampusContacts(){
        if(this.props.userProps.user.role == "Admin")
            this.props.actions.loadAllCampusContacts();
    }

    newCampusContact(){
        if(this.props.userProps.user.role == "Principal" || this.props.userProps.user.role == "CIC")
            document.location = "#newcampuscontact";
        else
            document.location = "#admin-newcampuscontact";
    }

    lowerCaseFormatter(cell, row) {
        if(cell != null)
            return (<span style={{textTransform: "lowercase"}}>{cell.toLowerCase()}</span>);
        else
            return "";
    }

    
    linkFormatter(cell, row) {
        let url = '#admin-campuscontacts/' + row.StaffNaturalKey + "/" + row.EducationOrgNaturalKey;
        let tooltip = 'Edit "' + row.LastSurname + ", " + row.FirsTName + '" Campus Contact';
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
            this.props.actions.loadCampusContactsByCampusID(this.props.campusID);
            this.setState({campusID: this.props.campusID});
        }
        const options = {
            defaultSortName: 'ContactName',
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
                        <PageHeader title="Campus Contacts" campus={this.props.campus} />
                        <div className="row">
                            <div className="col-md-8 col-lg-8 col-sm-12">
                                <LeaderInfo />
                                <div className="white-box pull-right">
                                    <PrimaryButton
                                        text="New Campus Contact"
                                        onClick={this.newCampusContact}
                                    />
                                    &nbsp;&nbsp;
                                    <PrimaryButton
                                        text="View All Campus Contacts"
                                        onClick={this.viewAllCampusContacts}
                                        style={this.state.visibility}
                                    />
                                    <BootstrapTable data={this.props.campusContacts} hover condensed pagination options={options} search>
                                        <TableHeaderColumn dataField="StaffNaturalKey" dataAlign="center" width={"200px"} dataFormat={this.linkFormatter}>Emp. ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ContactName" dataSort dataAlign="left">Campus Contact Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="NameOfInstitution" dataSort dataAlign="left">Campus Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="CampusContactID" dataSort dataAlign="center" isKey hidden />
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

CampusContactsPage.propTypes = {
    campusID: PropTypes.string,
    campus: PropTypes.string,
    campusContacts: PropTypes.array,
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object,
    visibility: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campus: state.userProps.user.campusName,
        campusContacts: state.campusContacts,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, campusActions, adminActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(CampusContactsPage);