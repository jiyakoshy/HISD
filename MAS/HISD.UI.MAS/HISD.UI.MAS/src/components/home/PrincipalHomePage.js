import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//actions
import * as campusActions from '../../actions/campusActions';
import * as relationshipsActions from '../../actions/relationshipsActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import * as activityLogsActions from '../../actions/activityLogsActions';
import * as staffActions from '../../actions/staffActions';
import * as adminActions from '../../actions/adminActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import LeaderInfo from '../common/LeaderInfo';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';
import HomePage from './HomePage';
import MessagePage from '../common/MessagePage';
import PieChart from '../charts/PieChart';
import BarChart from '../charts/BarChart';
import Utilities from '../../utilities/utilities';

let hasMounted = false;
class PrincipalHomePage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            campusID: '',
            pendingRelations: '',
            activeRelations: '',
            inactiveRelations: '',
            totalRelations: '',
            menteeActivitiesTotalRecords: []
        };
    }

    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'black' }}>
                From {start} to {to}, totals is {total}&nbsp;&nbsp;
      </p>
        );
    }

    componentDidMount() {
        //const role = this.props.userProps.user.role;
        this.props.actions.loadCurrentTimeConfig();
        this.props.actions.loadStaffsByCampusID(this.props.campusID).then(() => {
            const startData = Utilities.getCustomDateFormat(this.props.timeConfigs[0].SchoolStartDate);
            const endDate = Utilities.getCustomDateFormat(this.props.timeConfigs[0].SchoolEndDate);
            this.props.actions.loadAllMenteeActivities(this.props.campusID, this.props.userProps.timeConfigurationID, this.props.staffs, startData, endDate);
        });
        this.setState({ campusID: this.props.campusID });
        this.props.actions.loadAllRelationshipsCountByStatus(this.props.userProps.timeConfigurationID, this.props.campusID);
        //  this.props.actions.loadRelationshipStatusSummaryByCampusID(this.props.campusID, this.props.userProps.timeConfigurationID)
        //   .then(relationship => this.loadValues());

        //------------------- Activity Logs ------------------------
        this.props.actions.clearActivityLog();
        this.props.actions.loadActivityLogsByCampusID(this.props.campusID, this.props.userProps.timeConfigurationID)
            .then(activityLogs => this.loadActivityLogVaules());

    }
    //---------------------- Activity Logs ---------------------
    loadActivityLogVaules() {
        hasMounted = true;
        if (this.props.activityLogs != "") {
            //total activity Summary 
            let totalActivitySessions = [];

            let minutesCount = 0;
            let verifiedCount = 0;
            let perRelationLogCout = 0;
            for (let i = 0; i < this.props.activityLogs.length; i++) {
                minutesCount += parseInt(this.props.activityLogs[i].Duration) * (this.props.activityLogs[i].Mentees.length);
                //verification status count 
                for (let j = 0; j < this.props.activityLogs[i].Mentees.length; j++) {
                    perRelationLogCout++;
                    if (this.props.activityLogs[i].Mentees[j].VerificationStatus == "Yes") {
                        verifiedCount++;
                    }
                    // process Mentee Session and Build List of Activities for a campus 
                    let menteeSession = {};
                    menteeSession.ActivityLogMenteeID = this.props.activityLogs[i].Mentees[j].ActivityLogMenteeID;
                    menteeSession.MenteeID = this.props.activityLogs[i].Mentees[j].StaffNaturalKey;
                    menteeSession.MenteeName = this.props.activityLogs[i].Mentees[j].FirstName + " " + this.props.activityLogs[i].Mentees[j].LastSurname;
                    menteeSession.TotalActivitiesCount = 32;
                    menteeSession.ActivityCompletedCount = 1;

                    if (totalActivitySessions.findIndex(x => x.MenteeID === menteeSession.MenteeID) === -1) {
                        totalActivitySessions.push(menteeSession);
                    }

                    else {
                        let menteeIndex = totalActivitySessions.findIndex(x => x.MenteeID === menteeSession.MenteeID);
                        totalActivitySessions[menteeIndex].ActivityCompletedCount = totalActivitySessions[menteeIndex].ActivityCompletedCount + 1;
                    }
                }
            }
            this.setState({ activityLogsCount: perRelationLogCout });
            this.setState({ activityMinutesCount: minutesCount });
            this.setState({ activityVerifiedCount: verifiedCount });
            //store the list(all mentee activites) in state array  
            this.setState({ menteeActivitiesTotalRecords: totalActivitySessions });
        }
        else {
            this.setState({ activityLogsCount: 0 });
            this.setState({ activityMinutesCount: 0 });
            this.setState({ activityVerifiedCount: 0 });
        }
    }

    loadValues() {
        if (this.props.relationship != null) {
            this.setState({
                pendingRelations: this.props.relationship.pendingCount,
                activeRelations: this.props.relationship.activeCount,
                inactiveRelations: this.props.relationship.inactiveCount,
                totalRelations: this.props.relationship.totalCount
            });
        }
        else {
            this.setState({
                pendingRelations: 0,
                activeRelations: 0,
                inactiveRelations: 0,
                totalRelations: 0
            });
        }
    }
    render() {
        // relationship status summary for dashboard
        if (this.state.campusID != this.props.campusID && hasMounted == true) {
            //this.props.actions.loadRelationshipStatusSummaryByCampusID(this.props.campusID, this.props.userProps.timeConfigurationID);
            /*if (this.props.relationship != null) {
                this.setState({
                    pendingRelations: this.props.relationship.pendingCount,
                    activeRelations: this.props.relationship.activeCount,
                    inactiveRelations: this.props.relationship.inactiveCount,
                    totalRelations: this.props.relationship.totalCount
                });
            }
            else {
                this.setState({
                    pendingRelations: 0,
                    activeRelations: 0,
                    inactiveRelations: 0,
                    totalRelations: 0
                });
            }*/
            //-------------------- Activity Logs ---------------
            this.props.actions.clearActivityLog();
            this.props.actions.loadActivityLogsByCampusID(this.props.campusID, this.props.userProps.timeConfigurationID);
            if (this.props.activityLogs != "") {
                let minutesCount = 0;
                let verifiedCount = 0;
                let perRelationLogCout = 0;
                for (let i = 0; i < this.props.activityLogs.length; i++) {
                    minutesCount += parseInt(this.props.activityLogs[i].Duration) * (this.props.activityLogs[i].Mentees.length);
                    //verification status count 
                    for (let j = 0; j < this.props.activityLogs[i].Mentees.length; j++) {
                        perRelationLogCout++;
                        if (this.props.activityLogs[i].Mentees[j].VerificationStatus == "Yes") {
                            verifiedCount++;
                        }
                    }
                }
                this.setState({ activityLogsCount: perRelationLogCout });
                this.setState({ activityMinutesCount: minutesCount });
                this.setState({ activityVerifiedCount: verifiedCount });
            }
            else {
                this.setState({ activityLogsCount: 0 });
                this.setState({ activityMinutesCount: 0 });
                this.setState({ activityVerifiedCount: 0 });
            }
            this.setState({ campusID: this.props.campusID });
        }
        // welcome Message
        let msg;
        if (this.props.userProps && this.props.userProps.homePage && this.props.userProps.homePage.content)
            msg = this.props.userProps.homePage.content;
        else
            msg = "Principal/CIC - Welcome Message Content Place Holder.";

        let options = {};

        const totalRelationsCount = this.props.relationship.TotalRelationshipsCount;
        const pendingRelationsCount = this.props.relationship.PendingRelationships || '0';
        let activeRelationsCount = '';
        let inactiveRelationsCount = '';
        let pendingRelationsCountChart = '';
        if (this.props.relationship.ActiveRelationships) {
            activeRelationsCount = ((this.props.relationship.ActiveRelationships / totalRelationsCount) * 100).toFixed(2);
        }
        if (this.props.relationship.InactivRelationships) {
            inactiveRelationsCount = ((this.props.relationship.InactivRelationships / totalRelationsCount) * 100).toFixed(2);
        }
        if (this.props.relationship.PendingRelationships) {
            pendingRelationsCountChart = ((this.props.relationship.PendingRelationships / totalRelationsCount) * 100).toFixed(2);
        }
        return (
            <IfAnyGranted expected={['Principal', 'CIC']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Home" campus={this.props.campusName} />
                        {/*<div className="row">
                            <LeaderInfo />
                        </div> <br />*/}
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div className="white-box">
                                    <h3>Welcome at Mentor Activity System(MAS)</h3>
                                    <div dangerouslySetInnerHTML={{ __html: msg }} />
                                </div>
                            </div>
                        </div>

                        {/* dasboard div*/}
                        <div className="dashboard-box">
                            <h3>Dashboard</h3>

                            <div className="row">
                                <div className="col-md-6 col-lg-6 col-sm-12 pull-center">
                                    <div className="white-box">
                                        <h2>Relationships Status</h2>
                                        <h2 className="m-t-0 m-b-0 font-light counter">{totalRelationsCount} <span className="text-muted m-b-0 m-t-0" style={{ fontSize: '13px', fontWeight: '400' }}>Relationship Records exists</span></h2>
                                        <div className="pull-center">
                                            <PieChart data={[
                                                { key: 'Pending Relationships', keyValue: pendingRelationsCountChart },
                                                { key: 'Inactive Relationships', keyValue: inactiveRelationsCount },
                                                { key: 'Active Relationships', keyValue: activeRelationsCount }
                                            ]} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-sm-12">
                                    <div className="white-box">
                                        <h2>Total activities by Mentees</h2>
                                        <div className="row row-in">
                                            <BootstrapTable data={this.props.activityMenteeLogs} maxHeight="350px" striped hover condensed options={options}>
                                                <TableHeaderColumn dataField="StaffNaturalKey" isKey hidden>ID</TableHeaderColumn>
                                                <TableHeaderColumn dataField="MentorName" dataAlign="left"
                                                    thStyle={{ backgroundColor: '#458ab6', color: '#ffffff' }}>Mentor</TableHeaderColumn>
                                                <TableHeaderColumn dataField="MenteeName" dataAlign="left"
                                                    thStyle={{ backgroundColor: '#458ab6', color: '#ffffff' }}>Mentee</TableHeaderColumn>
                                                <TableHeaderColumn dataField="totalActivityCount" dataAlign="center"
                                                    thStyle={{ backgroundColor: '#458ab6', color: '#ffffff' }}>Total Activities</TableHeaderColumn>
                                                <TableHeaderColumn dataField="CompletedActivitiesCount" dataAlign="center"
                                                    thStyle={{ backgroundColor: '#458ab6', color: '#ffffff' }}>Completed</TableHeaderColumn>
                                                <TableHeaderColumn dataField="PercentageCount" dataAlign="center"
                                                    thStyle={{ backgroundColor: '#458ab6', color: '#ffffff' }}>Percentage</TableHeaderColumn>
                                            </BootstrapTable>
                                        </div>


                                    </div>
                                </div>
                            </div>

                            <div className="row">


                                <div className="col-sm-6 col-xs-12 col-md-6 col-lg-6">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="white-box">
                                                <div className="bar-widget">
                                                    <div className="table-box">
                                                        <div className="cell text-left">
                                                            <h2 className="m-t-0 m-b-5 font-light counter">
                                                                {pendingRelationsCount}
                                                            </h2>
                                                            <h5 className="text-muted m-b-0 m-t-0">Relationships pending for approval</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/*<div className="col-lg-12">
                                            <div className="white-box">
                                                <div className="bar-widget">
                                                    <div className="table-box">
                                                        <div className="cell text-left">
                                                            <h2 className="m-t-0 m-b-5 font-light">11%</h2>
                                                            <h5 className="text-muted m-b-0 m-t-0">Mentors with complete logs</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>*/}
                                    </div>
                                </div>

                                <div className="col-sm-6 col-xs-12 col-md-6 col-lg-6">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="white-box">
                                                <div className="bar-widget">
                                                    <div className="table-box">
                                                        <div className="cell text-left">
                                                            {this.state.activityLogsCount != 0 &&
                                                                <h2 className="m-t-0 m-b-5 font-light counter">{((this.state.activityVerifiedCount / this.state.activityLogsCount) * 100).toFixed(2)}%</h2>
                                                            }
                                                            {this.state.activityLogsCount == 0 &&
                                                                <h2 className="m-t-0 m-b-5 font-light counter">0.0%</h2>
                                                            }
                                                            <h5 className="text-muted m-b-0 m-t-0">Activities verified by mentees</h5>
                                                        </div>
                                                        <div className="cell text-right">
                                                            <div id="sparkline1"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="white-box">
                                                <div className="bar-widget">
                                                    <div className="table-box">
                                                        <div className="cell text-left">
                                                            <h2 className="m-t-0 m-b-5 font-light counter">{(this.state.activityMinutesCount / 60).toFixed(0)}: {this.state.activityMinutesCount % 60}</h2>
                                                            <h5 className="text-muted m-b-0 m-t-0">Hours spent by mentors this month</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div> {/* end of Dashboard Div */}
                    </div>
                </div>
            </IfAnyGranted>
        );
    }
}

PrincipalHomePage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    userProps: PropTypes.object,
    campuses: PropTypes.array,
    relationship: PropTypes.object,
    activityLogs: PropTypes.array,
    staffs: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        campuses: state.campuses,
        userProps: state.userProps,
        relationship: state.relationship,
        activityLogs: state.activityLogs,
        staffs: state.staffs,
        activityMenteeLogs: state.activityType.activitiesMenteeLogs,
        timeConfigs: state.timeConfig.value
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, activityLogsActions, adminActions, relationshipsActions, campusActions, ajaxActions, staffActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PrincipalHomePage);
