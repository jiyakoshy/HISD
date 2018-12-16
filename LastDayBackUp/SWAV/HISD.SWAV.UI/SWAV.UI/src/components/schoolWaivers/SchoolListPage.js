import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as campusActions from '../../actions/campusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import MessagePage from '../common/MessagePage';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import LinkFormatter from '../common/formatters/linkFormatter';
import * as waiversConstants from '../../constants/constant';
import Utilities from '../../utilities/utilities';

class SchoolListPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            campusDrpdwn : ''
        };
    }

    componentDidMount() {
        this.props.actions.getCurrentSchoolYearAction().then(() => {
            //this.props.actions.loadAllCampuses().then(() => {
            this.props.actions.waiverSettingsAction(this.props.currentYear);
            this.props.actions.loadAllSchools(this.props.currentYear);
            const { startDate, endDate, enrollmentStartTime, enrollmentEndTime, userRole } = this.props;
            const isCheckBoxDisabled = Utilities.checkWaiversEditPermission(startDate, endDate, enrollmentStartTime, enrollmentEndTime, userRole);
            this.props.actions.editWaiversPermissionAction(isCheckBoxDisabled);
            //});            
            // if (this.props.userRole == 'Principal') {
            //     this.props.actions.loadCampusesByManager(this.props.userProps.user.staffNaturalKey).then(() => {
            //         this.props.actions.waiverSettingsAction(this.props.currentYear);
            //         this.props.actions.loadAllSchools(this.props.currentYear);
            //         const { startDate, endDate, enrollmentStartTime, enrollmentEndTime, userRole } = this.props;
            //         const isCheckBoxDisabled = Utilities.checkWaiversEditPermission(startDate, endDate, enrollmentStartTime, enrollmentEndTime, userRole);
            //         this.props.actions.editWaiversPermissionAction(isCheckBoxDisabled);
            //     });
            // }
            if (this.props.userRole == 'Admin') {
                this.setState({
                    campusDrpdwn: 'Hide'
                });
            } else {
                this.setState({
                    userRoleTest: 'Show'
                });
            }

        })
    }

    linkFormatter(cell, row) {
        const status = row.WaiverStatusID;
        const tooltip = waiversConstants.TOOL_TIP;
        let url;
        if (status === waiversConstants.WAIVERS_SAVED_STATUS || status === waiversConstants.WAIVERS_SUBMITTED_CONSTANTS) {
            url = '#SavedWaiverDescription/' + row.OrganizationCode + '/' + row.NameOfInstitution;
        } else {
            url = '#waiverDescription/' + row.OrganizationCode + '/' + row.NameOfInstitution;
        }
        return (
            <LinkFormatter url={url} description={row.NameOfInstitution} tooltip={tooltip} />
        );
    }

    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'black' }}>
                From {start} to {to}. Total: {total}&nbsp;&nbsp;
            </p>
        );
    }

    render() {
        const options = {
            defaultSortName: 'WaiverStatusID',
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
                    <PageHeader title="School List" adminSchoolPage={this.state.campusDrpdwn} />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <div className="white-box">
                                <BootstrapTable data={this.props.campuses} hover striped condensed pagination options={options} search>
                                    <TableHeaderColumn dataField="OrganizationCode" hidden={true} isKey dataAlign="left" width={"100px"}>ID</TableHeaderColumn>
                                    <TableHeaderColumn dataField="NameOfInstitution" dataFormat={this.linkFormatter} dataSort dataAlign="left" thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }} tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>School Name</TableHeaderColumn>
                                    <TableHeaderColumn dataField="WaiverStatusID" dataSort dataAlign="left" tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>Status</TableHeaderColumn>
                                </BootstrapTable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

SchoolListPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    campuses: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        campuses: state.campuses.schoolDetails,
        principalName: state.userProps.user.principalName,
        currentYear: state.campuses.userStartYear,
        startDate: state.applicationAdminReducer.EnrollmentStartDate,
        endDate: state.applicationAdminReducer.EnrollmentEndDate,
        enrollmentStartTime: state.applicationAdminReducer.EnrollmentStartTime,
        enrollmentEndTime: state.applicationAdminReducer.EnrollmentEndTime,
        userRole: state.userProps.user.role
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(campusActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(SchoolListPage);
