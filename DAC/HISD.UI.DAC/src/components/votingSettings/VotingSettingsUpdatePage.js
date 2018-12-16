import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as campusActions from '../../actions/campusActions';
import * as votingSettingsAction from '../../actions/votingSettingsAction';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import 'rc-time-picker/assets/index.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import Utilities from '../../utilities/utilities';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import ErrorPage from '../common/ErrorPage';

class VotingSettingsUpdatePage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {

            cnStartDate: null,
            cnStartTime: null,
            cnEndDate: null,
            cnEndTime: null,
            vsStartDate: null,
            vsStartTime: null,
            vsEndDate: null,
            vsEndTime: null,
            raStartDate: null,
            raStartTime: null,
            firstDayOfWeek: DayOfWeek.Sunday,
            dayPickerStrings: Utilities.getDayPickerStrings(),
            hideDialog: true,
            dialogAction: '',
            subtext: ''

        };
        this.onCNStartTimeChanged = this.onCNStartTimeChanged.bind(this);
        this.onSelectCNStartDate = this.onSelectCNStartDate.bind(this);
        this.onCNEndTimeChanged = this.onCNEndTimeChanged.bind(this);
        this.onSelectCNEndDate = this.onSelectCNEndDate.bind(this);

        this.onVSStartTimeChanged = this.onVSStartTimeChanged.bind(this);
        this.onSelectVSStartDate = this.onSelectVSStartDate.bind(this);
        this.onVSEndTimeChanged = this.onVSEndTimeChanged.bind(this);
        this.onSelectVSEndDate = this.onSelectVSEndDate.bind(this);

        this.onRAStartTimeChanged = this.onRAStartTimeChanged.bind(this);
        this.onSelectRAStartDate = this.onSelectRAStartDate.bind(this);

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    componentDidMount() {
        let timeVotingStartTime = null;
        let timeVotingEndTime = null;
        let timeResultStartTime = null;
        let timeCandidateNomineeStartTime = null;
        let timeCandidateNomineeEndTime = null;

        if (this.props.votingStartTime !== null)
            timeVotingStartTime = moment().set({ hour: moment.duration(this.props.votingStartTime).hours(), minute: moment.duration(this.props.votingStartTime).minutes(), second: moment.duration(this.props.votingStartTime).seconds(), millisecond: moment.duration(this.props.votingStartTime).milliseconds() });

        if (this.props.votingEndTime !== null)
            timeVotingEndTime = moment().set({ hour: moment.duration(this.props.votingEndTime).hours(), minute: moment.duration(this.props.votingEndTime).minutes(), second: moment.duration(this.props.votingEndTime).seconds(), millisecond: moment.duration(this.props.votingEndTime).milliseconds() });

        if (this.props.resultStartTime !== null)
            timeResultStartTime = moment().set({ hour: moment.duration(this.props.resultStartTime).hours(), minute: moment.duration(this.props.resultStartTime).minutes(), second: moment.duration(this.props.resultStartTime).seconds(), millisecond: moment.duration(this.props.resultStartTime).milliseconds() });


        if (this.props.candidateNomineeStartTime !== null)
            timeCandidateNomineeStartTime = moment().set({ hour: moment.duration(this.props.candidateNomineeStartTime).hours(), minute: moment.duration(this.props.candidateNomineeStartTime).minutes(), second: moment.duration(this.props.candidateNomineeStartTime).seconds(), millisecond: moment.duration(this.props.candidateNomineeStartTime).milliseconds() });

        if (this.props.candidateNomineeEndTime !== null) {
            timeCandidateNomineeEndTime = moment().set({ hour: moment.duration(this.props.candidateNomineeEndTime).hours(), minute: moment.duration(this.props.candidateNomineeEndTime).minutes(), second: moment.duration(this.props.candidateNomineeEndTime).seconds(), millisecond: moment.duration(this.props.candidateNomineeEndTime).milliseconds() });

        }
        this.setState({
            vsStartDate: (this.props.votingStartDate !== null) ? new Date(Utilities.getDateTime(this.props.votingStartDate)) : null,
            vsEndDate: (this.props.votingEndDate !== null) ? new Date(Utilities.getDateTime(this.props.votingEndDate)) : null,
            cnStartDate: (this.props.candidateNomineeStartDate !== null) ? new Date(Utilities.getDateTime(this.props.candidateNomineeStartDate)) : null,
            cnEndDate: (this.props.candidateNomineeEndDate !== null) ? new Date(Utilities.getDateTime(this.props.candidateNomineeEndDate)) : null,
            raStartDate: (this.props.resultStartDate !== null) ? new Date(Utilities.getDateTime(this.props.resultStartDate)) : null,
            vsStartTime: timeVotingStartTime,
            vsEndTime: timeVotingEndTime,
            raStartTime: timeResultStartTime,
            cnStartTime: timeCandidateNomineeStartTime,
            cnEndTime: timeCandidateNomineeEndTime

        });
    }

    onCNStartTimeChanged(time) {
        this.setState({ cnStartTime: time });
    }
    onSelectCNStartDate(date) {
        this.setState({ cnStartDate: date });
    }
    onCNEndTimeChanged(time) {
        this.setState({ cnEndTime: time });
    }
    onSelectCNEndDate(date) {
        this.setState({ cnEndtDate: date });
    }

    onVSStartTimeChanged(time) {
        this.setState({ vsStartTime: time });
    }
    onSelectVSStartDate(date) {
        this.setState({ vsStartDate: date });
    }
    onVSEndTimeChanged(time) {
        this.setState({ vsEndTime: time });
    }
    onSelectVSEndDate(date) {
        this.setState({ vsEndDate: date });
    }

    onRAStartTimeChanged(time) {
        this.setState({ raStartTime: time });
    }
    onSelectRAStartDate(date) {
        this.setState({ raStartDate: date });
    }
    isValidForm() {

        let isValid = true;
        if (this.state.cnStartDate == null || this.state.cnStartDate == "") {
            isValid = false;
            this.displayMessage('Error: Candidate Nominee Start Date not selected.', '');
        }
        else if (this.state.cnStartTime == null || this.state.cnStartTime == '') {
            isValid = false;
            this.displayMessage('Error: Candidate Nominee Start Time not selected.', '');
        }
        else if (this.state.cnEndDate == null || this.state.cnEndDate == '') {
            isValid = false;
            this.displayMessage('Error: Candidate Nominee End Date not selected.', '');
        }
        else if (this.state.cnEndTime == null || this.state.cnEndTime == '') {
            isValid = false;
            this.displayMessage('Error: Candidate Nominee End Time not selected.', '');
        }
        else if (this.state.vsStartDate == null || this.state.vsStartDate == '') {
            isValid = false;
            this.displayMessage('Error: Voting Start Date not selected.', '');
        }
        else if (this.state.vsStartTime == null || this.state.vsStartTime == '') {
            isValid = false;
            this.displayMessage('Error: Voting Start Time not selected.', '');
        }
        else if (this.state.vsEndDate == null || this.state.vsEndDate == '') {
            isValid = false;
            this.displayMessage('Error: Voting End Date not selected.', '');
        }
        else if (this.state.vsEndTime == null || this.state.vsEndTime == '') {
            isValid = false;
            this.displayMessage('Error: Voting End Time not selected.', '');
        }
        else if (this.state.raStartDate == null || this.state.raStartDate == '') {
            isValid = false;
            this.displayMessage('Error: Results Avaialable Start Date not selected.', '');
        }
        else if (this.state.raStartTime == null || this.state.raStartTime == '') {
            isValid = false;
            this.displayMessage('Error: Results Avaialable Start Time not selected.', '');
        }

        return isValid;
    }
    save() {

        if (this.isValidForm()) {
            let cnStartDate = this.state.cnStartDate;
            const CandidateNomineeStartDate = moment(cnStartDate).format('YYYY-MM-DD');
            let cnStartTime = moment(this.state.cnStartTime, 'HH:mm A').diff(moment().startOf('day'), 'seconds');
            const CandidateNomineeStartTime = moment.duration(cnStartTime, 'seconds').toISOString();

            let cnEndDate = this.state.cnEndDate;
            const CandidateNomineeEndDate = moment(cnEndDate).format('YYYY-MM-DD');
            let cnEndTime = moment(this.state.cnEndTime, 'HH:mm A').diff(moment().startOf('day'), 'seconds');
            const CandidateNomineeEndTime = moment.duration(cnEndTime, 'seconds').toISOString();

            let vsStartDate = this.state.vsStartDate;
            const VotingSettingStartDate = moment(vsStartDate).format('YYYY-MM-DD');
            let vsStartTime = moment(this.state.vsStartTime, 'HH:mm A').diff(moment().startOf('day'), 'seconds');
            const VotingSettingStartTime = moment.duration(vsStartTime, 'seconds').toISOString();

            let vsEndDate = this.state.vsEndDate;
            const VotingSettingEndDate = moment(vsEndDate).format('YYYY-MM-DD');
            let vsEndTime = moment(this.state.vsEndTime, 'HH:mm A').diff(moment().startOf('day'), 'seconds');
            const VotingSettingEndTime = moment.duration(vsEndTime, 'seconds').toISOString();

            let raStartDate = this.state.raStartDate;
            const ResultAvailabilityStartDate = moment(raStartDate).format('YYYY-MM-DD');
            let raStartTime = moment(this.state.raStartTime, 'HH:mm A').diff(moment().startOf('day'), 'seconds');
            const ResultAvailabilityStartTime = moment.duration(raStartTime, 'seconds').toISOString();

            let votingSettings = {
                CandidateNomineeSettingsStartDate: CandidateNomineeStartDate,
                CandidateNomineeSettingsStartTime: CandidateNomineeStartTime,
                CandidateNomineeSettingsEndDate: CandidateNomineeEndDate,
                CandidateNomineeSettingsEndTime: CandidateNomineeEndTime,
                VotingStartDate: VotingSettingStartDate,
                VotingStartTime: VotingSettingStartTime,
                VotingEndDate: VotingSettingEndDate,
                VotingEndTime: VotingSettingEndTime,
                ResultsAvailableStartDate: ResultAvailabilityStartDate,
                ResultsAvailableStartTime: ResultAvailabilityStartTime,
                SchoolYear: this.props.schoolYear,
                UpdatedBy: this.props.userProps.user.loginId,
                VotingSettingID: this.props.votingSettingID,
                IsActive: true
            };
            let promise = this.props.actions.updateVotingSettings(votingSettings);
            promise.then((votingSettings) => this.onSavingSucceeds())
                .catch(reason => {
                    this.props.actions.ajaxCallError();
                    this.displayMessage('There was a problem saving this Voting Settings. Operation canceled.', '');
                });

        }
    }

    onSavingSucceeds() {
        if (this.props.votingSettings !== undefined || this.props.votingSettings != 0) {
            this.displayMessage('All the Dates successfully created.', 'CREATED');
            this.cancel();
        }
        else {
            this.onSavingFails();
        }
    }

    onSavingFails() {
        this.props.actions.ajaxCallError();
        this.displayMessage('Error trying to create all the Votings Settings.');
    }
    cancel() {
      document.location = '#votingsettings';
    }

    okDialog() {
        if (this.state.dialogAction == 'SAVED')
            this.cancel();
        else
            this.closeDialog();
    }
    displayMessage(message, action) {
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    showDialog() {
        this.setState({ hideDialog: false });
    }

    closeDialog() {
        this.setState({ hideDialog: true });
    }
    formatDate(date) {
        if (date) {
            let newDate = Utilities.getDateOnly(date);
            return newDate;
        }
        return '';
    }
    render() {
        const vsStartDate = this.state.vsStartDate;
        const vsEndDate = this.state.vsEndDate;
        const cnStartDate = this.state.cnStartDate;
        const cnEndDate = this.state.cnEndDate;
        const raStartDate = this.state.raStartDate;
        let { firstDayOfWeek } = this.state.firstDayOfWeek;
        let { dayPickerStrings } = this.state.dayPickerStrings;
        const defaultVsStartTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const defaultVsEndTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const defaultRaStartTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const defaultCnStartTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const defaultCnEndTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="Dashboard" schoolYear={this.props.schoolYear} showSchoolDropDown="No" />

                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <div className="white-box">
                                <form className="form-horizontal">
                                    <div className="row">
                                        <label className="VotingSettingsInnerHeader col-md-12 col-lg-12 col-sm-12 formSectionTitle">Candidate Nominee Settings</label>

                                    </div>
                                    <div className="row">
                                        <label className="col-md-2 col-lg-2 col-sm-2">Start Date:</label>
                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                            <DatePicker value={cnStartDate} formatDate={this.formatDate} onSelectDate={this.onSelectCNStartDate} placeholder="Select start date..." />
                                        </div>

                                        <label className=" col-md-2 col-lg-2 col-sm-2">Start Time:</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">

                                            <TimePicker
                                                onChange={this.onCNStartTimeChanged}
                                                showSecond={false}
                                                defaultValue={defaultCnStartTime}
                                                value={this.state.cnStartTime}
                                                allowEmpty
                                                use12Hours
                                                className="fullWidth"
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-md-2 col-lg-2 col-sm-2">End Date:</label>
                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                            <DatePicker value={cnEndDate} formatDate={this.formatDate}
                                                onSelectDate={this.onSelectCNEndDate}
                                                placeholder="Select end date..." />
                                        </div>

                                        <label className=" col-md-2 col-lg-2 col-sm-2">End Time:</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">

                                            <TimePicker
                                                onChange={this.onCNEndTimeChanged}
                                                showSecond={false}
                                                defaultValue={defaultCnEndTime}
                                                value={this.state.cnEndTime}
                                                allowEmpty
                                                use12Hours
                                                className="fullWidth"
                                            />
                                        </div>
                                    </div>


                                    <div className="row">
                                        <label className=" VotingSettingsInnerHeader col-md-12 col-lg-12 col-sm-12 formSectionTitle">
                                            Voting Period</label>

                                    </div>
                                    <div className="row">
                                        <label className="col-md-2 col-lg-2 col-sm-2">Start Date:
                                        </label>
                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                            <DatePicker
                                                value={vsStartDate}
                                                firstDayOfWeek={firstDayOfWeek}
                                                strings={dayPickerStrings}
                                                formatDate={this.formatDate}
                                                onSelectDate={this.onSelectVSStartDate}
                                                placeholder="Select start date..." />
                                        </div>

                                        <label className=" col-md-2 col-lg-2 col-sm-2">Start Time:</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">

                                            <TimePicker
                                                onChange={this.onVSStartTimeChanged}
                                                showSecond={false}
                                                defaultValue={defaultVsStartTime}
                                                value={this.state.vsStartTime}
                                                allowEmpty
                                                use12Hours
                                                className="fullWidth"
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-md-2 col-lg-2 col-sm-2">End Date:</label>

                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                            <DatePicker
                                                value={vsEndDate}
                                                firstDayOfWeek={firstDayOfWeek}
                                                strings={dayPickerStrings}
                                                formatDate={this.formatDate}
                                                onSelectDate={this.onSelectVSEndDate}
                                                placeholder="Select start date..." />
                                        </div>

                                        <label className=" col-md-2 col-lg-2 col-sm-2">End Time:</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">

                                            <TimePicker
                                                onChange={this.onVSEndTimeChanged}
                                                showSecond={false}
                                                defaultValue={defaultVsEndTime}
                                                value={this.state.vsEndTime}
                                                allowEmpty
                                                use12Hours
                                                className="fullWidth"
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <label className="VotingSettingsInnerHeader col-md-12 col-lg-12 col-sm-12 formSectionTitle">
                                            Results Available</label>

                                    </div>
                                    <div className="row">
                                        <label className="col-md-2 col-lg-2 col-sm-2">Start Date:</label>
                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                            <DatePicker formatDate={this.formatDate}
                                                value={raStartDate}
                                                onSelectDate={this.onSelectRAStartDate}
                                                placeholder="Select start date..." />
                                        </div>

                                        <label className=" col-md-2 col-lg-2 col-sm-2">Start Time:</label>
                                        <div className="col-md-4 col-lg-4 col-sm-4">

                                            <TimePicker
                                                onChange={this.onRAStartTimeChanged}
                                                showSecond={false}
                                                defaultValue={defaultRaStartTime}
                                                value={this.state.raStartTime}
                                                allowEmpty
                                                use12Hours
                                                className="fullWidth"
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className=" col-md-2 col-lg-2 col-sm-2">
                                            <PrimaryButton
                                                text="Update"
                                                onClick={this.save}
                                            />

                                        </div>
                                    </div>


                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <Dialog
                    hidden={this.state.hideDialog}
                    onDismiss={this.closeDialog}
                    dialogContentProps={{
                        type: DialogType.normal,
                        title: 'Activity Log',
                        subText: this.state.subtext
                    }}
                    modalProps={{
                        isBlocking: true,
                        containerClassName: 'ms-dialogMainOverride'
                    }}
                >
                    <DialogFooter>
                        <PrimaryButton onClick={this.okDialog} text="Ok" styles={this.state.OkButtonStyle} />
                        <DefaultButton onClick={this.closeDialog} text="Cancel" />
                    </DialogFooter>
                </Dialog>
            </div>
        );
    }

}

VotingSettingsUpdatePage.propTypes = {
    votingSettings: PropTypes.array,
    schoolYear: PropTypes.string,
    votingStartDate: PropTypes.string,
    votingEndDate: PropTypes.string,
    candidateNomineeStartDate: PropTypes.string,
    candidateNomineeEndDate: PropTypes.string,
    resultStartDate: PropTypes.string,
    onSelectVSStartDate: PropTypes.func,
    onSelectVSEndDate: PropTypes.func,
    vsStartDate: PropTypes.string,
    vsEndDate: PropTypes.string,
    save: PropTypes.func

};
function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campus: state.userProps.user.campusName,
        userProps: state.userProps,
        votingSettings: state.votingSettings
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, votingSettingsAction, ajaxActions), dispatch) };
}
export default connect(mapStateToProps, mapDispatchToProps)(VotingSettingsUpdatePage);