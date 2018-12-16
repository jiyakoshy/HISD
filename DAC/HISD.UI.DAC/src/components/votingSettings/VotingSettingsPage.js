import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as campusActions from '../../actions/campusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import 'rc-time-picker/assets/index.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import Utilities from '../../utilities/utilities';
import VotingSettingsNewPage from './VotingSettingsNewPage';
import VotingSettingsUpdatePage from './VotingSettingsUpdatePage';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';



class VotingSettingsPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }





    render() {
        let schoolYear;
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

        if (this.props.userProps.schoolYearDescription)
            schoolYear = this.props.userProps.schoolYearDescription;
        else
            schoolYear = "";

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

        if (votingSettingAvaialable && votingSettingID != 0)
            return (
                <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>

                    <VotingSettingsUpdatePage schoolYear={schoolYear} votingStartDate={votingStartDate}
                        votingStartTime={votingStartTime} votingEndDate={votingEndDate} votingEndTime={votingEndTime}
                        resultStartDate={resultStartDate} resultStartTime={resultStartTime} candidateNomineeStartDate={candidateNomineeStartDate}
                        candidateNomineeStartTime={candidateNomineeStartTime} candidateNomineeEndDate={candidateNomineeEndDate}
                        candidateNomineeEndTime={candidateNomineeEndTime} votingSettingID={votingSettingID} />);
        
                </IfAnyGranted>);

        else
            return (
                <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <VotingSettingsNewPage schoolYear={schoolYear} />
                </IfAnyGranted>);

    }
}

VotingSettingsPage.propTypes = {

    userProps: PropTypes.object,
    votingSettings: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {

        userProps: state.userProps,
        votingSettings: state.votingSettings
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(campusActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(VotingSettingsPage);
