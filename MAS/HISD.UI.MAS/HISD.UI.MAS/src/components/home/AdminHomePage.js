import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//actions
import * as campusActions from '../../actions/campusActions';
import * as relationshipsActions from '../../actions/relationshipsActions';
import * as adminActions from '../../actions/adminActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import * as activityLogsActions from '../../actions/activityLogsActions';

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

class AdminHomePage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            campusID: '',
            pendingRelations: '',
            activeRelations: '',
            inactiveRelations: '',
            totalRelations: '',
            topRelationshipsCampuses: [],
            campusesNOCampusContact: ''
        };
    }
    componentDidMount() {
        //const role = this.props.userProps.user.role;
        this.setState({ campusID: this.props.campusID });

        ////New relationship status pie chart//////
        this.props.actions.loadAllRelationshipsCountByStatus(this.props.userProps.timeConfigurationID, 'All');

        //relationship status
        //  this.props.actions.loadAllRelationshipsStatusSummary(this.props.userProps.timeConfigurationID)
        //   .then(relationship => this.loadValues());
        //Mentor Aggrement acceptence
        //  this.props.actions.loadMentorAgreementAcceptenceSummary(this.props.userProps.timeConfigurationID)
        // .then(mentor => this.loadMentorAgreementValues());
        //Using MAS
        //   this.props.actions.loadCampusesCountUsingMAS(this.props.userProps.timeConfigurationID)
        //  .then(campus => this.loadCampusesCountValues());
        //top 5 relationships campuses 
        this.props.actions.loadTopRelationshipsCampuses(this.props.userProps.timeConfigurationID)
            .then(relationships => this.loadTopRelationshipsCampuesValues());

        //CIC assigned
        this.props.actions.loadAllCampusesWithCampusContact(this.props.userProps.timeConfigurationID)
            .then(campusesWithCampusContact => this.loadCampusesWithCampusContactValues());
        this.setState({ campusesNOCampusContact: (this.props.campusesWithCampusContact.length) });

        //------------------- Activity Logs ------------------------
        this.props.actions.clearActivityLog();
        this.props.actions.loadAllActivityLogs()
            .then(activityLogs => this.loadActivityLogVaules());
        this.props.actions.getMentorAgreementDetails(this.props.userProps.timeConfigurationID);

    }
    //---------------------- Activity Logs ---------------------
    loadActivityLogVaules() {
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
    }

    //---------------------- Relationships ---------------------
    loadTopRelationshipsCampuesValues() {
        //USING THE PROPS VALUES
        if (this.props.topCampusesOnRelationShip.length > 0) {
            let topCampusArray = [];

            this.props.topCampusesOnRelationShip.map(a1 => {
                this.props.campuses.map(b1 => {
                    if (a1.Campus == b1.EducationOrgNaturalKey) {
                        let topCampusObject = {
                            "key": b1.NameOfInstitution,
                            "keyValue": a1.keyValue
                        };
                        topCampusArray.push(topCampusObject);

                    }
                });
            });
            this.setState({
                'topRelationshipsCampuses': topCampusArray
            });


        }
        else {
            this.setState({
                'topRelationshipsCampuses': []
            });
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

    loadMentorAgreementValues() {
        if (this.props.mentor != null) {
            this.setState({
                mentorsNOAgreementAccepted: this.props.mentor.totalCount
            });
        }
        else {
            this.setState({
                mentorsNOAgreementAccepted: 0
            });
        }
    }
    loadCampusesCountValues() {
        if (this.props.campus != null) {
            this.setState({
                campusesUsingMAS: this.props.campus.totalCount
            });
        }
        else {
            this.setState({
                campusesUsingMAS: 0
            });
        }
    }

    loadCampusesWithCampusContactValues() {
        if (this.props.campusesWithCampusContact != null) {
            this.setState({
                campusesWithCICCount: this.props.campusesWithCampusContact.length
            });
        }
        else {
            this.setState({
                campusesWithCICCount: 0
            });
        }
    }

    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'black' }}>
                From {start} to {to}, totals is {total}&nbsp;&nbsp;
      </p>
        );
    }
    render() {
        // relationship status summary for dashboard
        if (this.state.campusID != this.props.campusID) {

            //CIC assigned
            this.props.actions.loadAllCampusesWithCampusContact(this.props.userProps.timeConfigurationID);
            if (this.props.campusesWithCampusContact != null) {
                this.setState({
                    campusesWithCICCount: this.props.campusesWithCampusContact.length
                });
            }
            else {
                this.setState({
                    campusesWithCICCount: 0
                });
            }
            this.setState({ campusesNOCampusContact: (this.props.campusesWithCampusContact.length) });
            //-------------------- Activity Logs ---------------
            this.props.actions.clearActivityLog();
            this.props.actions.loadAllActivityLogs();
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
        }//end of if
        // welcome Message
        let msg;
        if (this.props.userProps && this.props.userProps.homePage && this.props.userProps.homePage.content)
            msg = this.props.userProps.homePage.content;
        else
            msg = "Admin - Welcome Message Content Place Holder.";

        const mentorsAcceptedCount = (this.props.mentorAgreement && this.props.mentorAgreement.MentorsAgreementPendingCount) || '0';

        const totalRelationsCount = this.props.relationship.TotalRelationshipsCount;
        const pendingRelationsCount = this.props.relationship.PendingRelationships || '0';
        let activeRelationsCount = '';
        let inactiveRelationsCount = '';
        let pendingRelationsCountChart = '';
        if (this.props.relationship.ActiveRelationships) {
            activeRelationsCount = ((this.props.relationship.ActiveRelationships / totalRelationsCount) * 100).toFixed(1);
        }
        if (this.props.relationship.InactivRelationships) {
            inactiveRelationsCount = ((this.props.relationship.InactivRelationships / totalRelationsCount) * 100).toFixed(1);
        }
        if (this.props.relationship.PendingRelationships) {
            pendingRelationsCountChart = ((this.props.relationship.PendingRelationships / totalRelationsCount) * 100).toFixed(1);
        }
        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Home" campus={this.props.campusName} />
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
                                        <h2 className="m-t-0 m-b-0 font-light counter">{totalRelationsCount} <span className="text-muted m-b-0 m-t-0" style={{fontSize: '13px', fontWeight: '400'}}>Relationship Records exists</span></h2>
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
                                        <h2>Top 3 campuses with the most relationships</h2>
                                        <div className="row row-in">
                                            <BarChart data={this.state.topRelationshipsCampuses} />

                                        </div>
                                        <div> {this.props.relationships.length > 0 && this.props.relationships[0].RelationshipsCount &&
                                            <div className="row row-in">

                                            </div>
                                        }</div>
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
                                                            <h2 className="m-t-0 m-b-5 font-light counter">
                                                            {mentorsAcceptedCount}  
                                                            </h2>
                                                            <h5 className="text-muted m-b-0 m-t-0">Mentors without agreement accepted</h5>
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
                                                        <div> {this.props.campusesWithCampusContact.length > 0 &&
                                                            <div className="cell text-left">
                                                                <h2 className="m-t-0 m-b-5 font-light">{this.props.campuses.length - this.props.campusesWithCampusContact.length}</h2>
                                                                <h5 className="text-muted m-b-0 m-t-0">Campuses dont have a CIC assigned</h5>
                                                            </div>
                                                        }</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="col-sm-6 col-xs-12 col-md-6 col-lg-6">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="white-box">
                                                <div className="bar-widget">
                                                    <div className="table-box">
                                                        <div className="cell text-left">
                                                            <h2 className="m-t-0 m-b-5 font-light counter">{(this.state.activityMinutesCount / 60).toFixed(0)} hours {this.state.activityMinutesCount % 60} minutes</h2>
                                                            <h5 className="text-muted m-b-0 m-t-0">Spent by mentors this month</h5>
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
                                                            <h2 className="m-t-0 m-b-5 font-light counter">{((this.state.activityVerifiedCount / this.state.activityLogsCount) * 100).toFixed(2)}%</h2>
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
                                                            <h2 className="m-t-0 m-b-5 font-light">{this.state.campusesUsingMAS}</h2>
                                                            <h5 className="text-muted m-b-0 m-t-0">Campuses using the program</h5>
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

AdminHomePage.propTypes = {
    message: PropTypes.string,
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    userProps: PropTypes.object,
    history: PropTypes.object,
    campuses: PropTypes.array,
    campusesWithCampusContact: PropTypes.array,
    relationship: PropTypes.object,
    relationships: PropTypes.array,
    mentor: PropTypes.object,
    campus: PropTypes.object,
    activityLog: PropTypes.object,
    activityLogs: PropTypes.array,
    topCampusesOnRelationShip: PropTypes.array

};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        campuses: state.campuses,
        campusesWithCampusContact: state.campusesWithCampusContact,
        userProps: state.userProps,
        relationship: state.relationship,
        relationships: state.relationships,
        mentor: state.mentor,
        campus: state.campus,
        activityLog: state.activityLog,
        activityLogs: state.activityLogs,
        topCampusesOnRelationShip: state.topCampusesOnRelationShip,
        mentorAgreement: state.activityType.mentorAgreement
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, activityLogsActions, relationshipsActions, adminActions, campusActions, ajaxActions), dispatch) };
}


export default connect(mapStateToProps, mapDispatchToProps)(AdminHomePage);
