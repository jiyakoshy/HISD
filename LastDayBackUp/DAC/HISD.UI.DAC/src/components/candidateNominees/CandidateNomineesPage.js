import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as campusActions from '../../actions/campusActions';
import * as locationsActions from '../../actions/locationsActions';
import * as candidateTypesActions from '../../actions/candidateTypesActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import 'rc-time-picker/assets/index.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import TimePicker from 'rc-time-picker';
import Utilities from '../../utilities/utilities';
import CentralOfficeCandidateNominees from './CentralOfficeCandidateNominees';
import CampusCandidateNominees from './CampusCandidateNominees';
import ErrorPageDAC from '../common/ErrorPageDAC';
import moment from 'moment';

class CandidateNomineesPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            currentView: 'Central Office',
            candidateNomineeStartDate: null,
            candidateNomineeStartTime: null,
            candidateNomineeEndDate: null,
            candidateNomineeEndTime: null,
            votingSettingID: null,
            locations: null,
            candidateTypes: null
        };

    }

    componentWillMount() {
        this.props.actions.loadLocations()
            .then(locations => this.fillLocations());

        this.props.actions.loadCandidateTypes()
            .then(candidateTypes => this.fillCandidateTypes());
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.campusName == "Central Office" || nextProps.campusName == "") {
            this.setState({ currentView: "Central Office" });
        }
        else {
            this.setState({ currentView: "Campus" });
        }

    }

    fillLocations() {
        this.setState({ locations: this.props.locations });
    }
    fillCandidateTypes() {
        this.setState({ candidateTypes: this.props.candidateTypes });
    }


    render() {
        let votingSettingAvaialable = false;
        let votingStartDate;
        let votingStartTime;
        let votingEndDate;
        let votingEndTime;
        let resultStartDate;
        let resultStartTime;
        let candidateNomineeStartDate;
        let candidateNomineeStartTime;
        let candidateNomineeEndDate;
        let candidateNomineeEndTime;
        let votingSettingID = 0;
        let role = this.props.role;
        let userProperties = this.props.userProps;

        if (this.props.votingSettings) {
            votingSettingAvaialable = true;
            this.props.votingSettings.map(
                function (item) {
                    votingStartDate = item.VotingStartDate;
                    votingStartTime = item.VotingStartTime;
                    votingEndDate = item.VotingEndDate;
                    votingEndTime = item.VotingEndTime;
                    resultStartDate = item.ResultsAvailableStartDate;
                    resultStartTime = item.ResultsAvailableStartTime;
                    candidateNomineeStartDate = item.CandidateNomineeSettingsStartDate;
                    candidateNomineeStartTime = item.CandidateNomineeSettingsStartTime;
                    candidateNomineeEndDate = item.CandidateNomineeSettingsEndDate;
                    candidateNomineeEndTime = item.CandidateNomineeSettingsEndTime;
                    votingSettingID = item.VotingSettingID;

                }
            );
        }

        if (votingSettingAvaialable && votingSettingID != 0 &&
            this.state.candidateTypes && this.state.candidateTypes != null
            && this.state.candidateTypes != undefined
            && this.state.locations && this.state.locations != null && this.state.locations != undefined
            && role && role != null && role != undefined) {

            if (candidateNomineeStartDate != null && candidateNomineeStartDate != '' && candidateNomineeStartDate != undefined &&
                candidateNomineeEndDate != null && candidateNomineeEndDate != '' && candidateNomineeEndDate != undefined) {

                let currentDate = new Date();
                let startDate = new Date(Utilities.getDateTime(candidateNomineeStartDate));
                let endDate = new Date(Utilities.getDateTime(candidateNomineeEndDate));

                let startDateTime = moment(startDate)
                    .hour(moment.duration(candidateNomineeStartTime).hours())
                    .minute(moment.duration(candidateNomineeStartTime).minutes());

                let endDateTime = moment(endDate)
                    .hour(moment.duration(candidateNomineeEndTime).hours())
                    .minute(moment.duration(candidateNomineeEndTime).minutes());

                if (moment(currentDate) > startDateTime && moment(currentDate) < endDateTime) {
                    if (role == "Admin") {
                        if (userProperties.user.campusName == "Central Office")
                            return (
                                <CentralOfficeCandidateNominees votingSettingID={votingSettingID}
                                    locations={this.state.locations} candidateTypes={this.state.candidateTypes} />
                            );
                        else
                            return (
                                <CampusCandidateNominees votingSettingID={votingSettingID}
                                    locations={this.state.locations} candidateTypes={this.state.candidateTypes} />
                            );
                    }
                    else if ((role == "Principal") || (role == "SC")) {
                        if (userProperties.user.campusName == "Central Office")
                            return (
                                <ErrorPageDAC errorMsg="No campuses are available for the current Principal role." />

                            );
                        else
                            return (
                                <CampusCandidateNominees votingSettingID={votingSettingID}
                                    locations={this.state.locations} candidateTypes={this.state.candidateTypes} campusID={this.props.userProps.user.campusID} />
                            );
                    }
                }
                else {
                    return (
                        <ErrorPageDAC errorMsg="Current Date is not between Candidate Nomination Start Date and End Date of current School Year" />

                    );
                }
            }
            else {
                return (
                    <ErrorPageDAC errorMsg="2 Candidate Nomination Start Date and End Date not defined for current School Year" />
                );
            }
        }
        else {
            return (
                <div></div>
            );
        }


    }
}

CandidateNomineesPage.propTypes = {

    userProps: PropTypes.object,
    campusName: PropTypes.string,
    votingSettings: PropTypes.array,
    locations: PropTypes.array,
    candidateTypes: PropTypes.array,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {

        userProps: state.userProps,
        campusName: state.userProps.user.campusName,
        role: state.userProps.user.role,
        votingSettings: state.votingSettings,
        locations: state.locations,
        candidateTypes: state.candidateTypes
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, locationsActions, candidateTypesActions, ajaxActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CandidateNomineesPage);