import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as applicationAdminActions from '../../actions/applicationAdminActions';
import * as campusActions from '../../actions/campusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import MessagePage from '../common/MessagePage';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import Utilities from '../../utilities/utilities';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';
import * as AdminConstants from '../../constants/constant';

class AdministrationPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.selectedStartDate = this.selectedStartDate.bind(this);
        this.saveWaiversSettings = this.saveWaiversSettings.bind(this);
        this.selectedEndDate = this.selectedEndDate.bind(this);
        this.onChangedStartTime = this.onChangedStartTime.bind(this);
        this.onChangedEndTime = this.onChangedEndTime.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.copyWaivers = this.copyWaivers.bind(this);
        this.state = {
            startDate: '',
            endDate: '',
            hideDialog: true,
            dialogAction: ''
        };
    }

    formatDate(date) {
        if (date) {
            let newDate = Utilities.getDateOnly(date);
            return newDate;
        }
        return '';
    }


    componentDidMount() {
        this.props.actions.getCurrentSchoolYearAction().then(() => {
            this.props.actions.waiverSettingsAction(this.props.startYear).then(() => {
                const { startDate, endDate, enrollmentStartTime, enrollmentEndTime, startYear, endYear, settingsID, isPost } = this.props;
                const adminStartDate = startDate && new Date(Utilities.getDateTime(startDate));
                const adminEndDate = endDate && new Date(Utilities.getDateTime(endDate));
                let enrollmentStTime = null;
                let enrollmentEdTime = null;

                if (enrollmentStartTime !== null)
                    enrollmentStTime = Utilities.getTimeOnly(this.props.enrollmentStartTime);
                if (enrollmentEndTime !== null)
                    enrollmentEdTime = Utilities.getTimeOnly(this.props.enrollmentEndTime);

                this.setState({
                    startDate: adminStartDate || '',
                    endDate: adminEndDate || '',
                    enrollmentStTime: enrollmentStTime,
                    enrollmentEdTime: enrollmentEdTime
                });
            });

        });
    }
    selectedStartDate(date) {
        if (date) {
            this.setState({ startDate: date });
        }
    }

    selectedEndDate(date) {
        if (date) {
            this.setState({ endDate: date });
        }
    }

    onChangedStartTime(time) {
        this.setState({ enrollmentStTime: time });
    }

    onChangedEndTime(time) {
        this.setState({ enrollmentEdTime: time });
    }

    isValidEnrollmentDates() {
        let isValid = true;

        if (this.state.startDate == null || this.state.startDate == "") {
            isValid = false;
            this.displayMessage('Error: Enrollment Dates', 'Enrollment Start Date not selected.');
            return isValid;
        }

        if (this.state.endDate == null || this.state.endDate == "") {
            isValid = false;
            this.displayMessage('Error: Enrollment Dates', 'Enrollment End Date not selected.');
            return isValid;
        }

        if (this.state.enrollmentStTime == null || this.state.enrollmentStTime == "") {
            isValid = false;
            this.displayMessage('Error: Enrollment Time', 'Enrollment Start Time not selected.');
            return isValid;
        }

        if (this.state.enrollmentEdTime == null || this.state.enrollmentEdTime == "") {
            isValid = false;
            this.displayMessage('Error: Enrollment Time', 'Enrollment End Time not selected.');
            return isValid;
        }

        if (this.state.startDate > this.state.endDate) {
            isValid = false;
            this.displayMessage('Error: Enrollment Dates', 'Enrollment Start Date shoud not be greater than Enrollment End Date');
            return isValid;
        }
        if (this.state.startDate >= this.state.endDate) {
            if (this.state.enrollmentStTime > this.state.enrollmentEdTime) {
                isValid = false;
                this.displayMessage('Error: Enrollment Time', 'Enrollment Start Date and Enrollment End Dates are equal. So, Enrollment Start Time shoud not be greater than Enrollment End Time');
                return isValid;
            }
        }

        return isValid;
    }
    copyWaivers() {
        const { startYear, endYear, isPost, settingsID } = this.props;
        const { startDate, endDate, enrollmentStTime, enrollmentEdTime } = this.state;

        this.props.actions.copyWaiversAction(startYear, endYear).then(data => {
            const settingsPayload = Utilities.copyWaiversSettingsPayload(startYear, endYear);

            if (isPost && !settingsID) {
                this.props.actions.postWaiverSettingsAction(settingsPayload, startYear);
            } else {
                this.props.actions.patchWaiverSettingsAction(settingsPayload, settingsID, startYear);
            }
            this.displayMessage(AdminConstants.COPY_WAIVER_HEADING, AdminConstants.COPY_WAIVER_MESSAGE, AdminConstants.DIALOG_CREATED);
            this.props.actions.waiverSettingsAction(startYear);
        });
    }

    saveWaiversSettings() {
        const { startYear, endYear, isPost, settingsID } = this.props;
        const { startDate, endDate, enrollmentStTime, enrollmentEdTime } = this.state;

        if (this.isValidEnrollmentDates()) {
            const settingsPayload = Utilities.getSettingsPayload(startDate, endDate, enrollmentStTime, enrollmentEdTime, startYear, endYear);
            if (isPost && !settingsID) {
                this.props.actions.postWaiverSettingsAction(settingsPayload, startYear);
                this.displayMessage(AdminConstants.ENROLLMENT_HEADING, AdminConstants.ENROLLMENT_CREATED_MESSAGE, AdminConstants.DIALOG_CREATED);
            } else {
                this.props.actions.patchWaiverSettingsAction(settingsPayload, settingsID, startYear);
                this.displayMessage(AdminConstants.ENROLLMENT_HEADING, AdminConstants.ENROLLMENT_UPDATED_MESSAGE, AdminConstants.DIALOG_UPDATED);
            }
            this.props.actions.waiverSettingsAction(this.props.startYear);
        }

    }
    cancel() {
    }
    okDialog() {
        if (this.state.dialogAction == 'SAVED')
            this.cancel();
        else
            this.closeDialog();
    }
    displayMessage(title, message, action) {
        this.setState({ title: title, subtext: message, dialogAction: action });
        this.showDialog();
    }
    showDialog() {
        this.setState({ hideDialog: false });
    }
    closeDialog() {
        this.setState({ hideDialog: true });
    }
    render() {
        const defaultDate = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const { startYear, endYear, isCopyWaiver } = this.props;
        const prevStartYear = startYear - 1;
        const prevEndYear = endYear - 1;

        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title={AdminConstants.APPLICATION_ADMINISTRATION_PAGE} />
                        <label className="col-sm-12 col-form-label formSectionTitle" style={{ fontSize: '16px' }}>Open Enrollment</label>                        
                        <div className="white-box">
                            <form>
                                <div className="form-group row">
                                    <div className="col-sm-2">
                                        <label>Start Date</label>
                                        <div>
                                            <DatePicker
                                                value={this.state.startDate}
                                                formatDate={this.formatDate}
                                                onSelectDate={this.selectedStartDate}
                                                placeholder="Select Start Date"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-sm-2">
                                        <label>Start Time</label>
                                        <div>
                                            <TimePicker onChange={this.onChangedStartTime} showSecond={false} value={this.state.enrollmentStTime} use12Hours />
                                        </div>
                                    </div>
                                    <div className="col-sm-2">
                                        <label>End Date</label>
                                        <div>
                                            <DatePicker
                                                value={this.state.endDate}
                                                formatDate={this.formatDate}
                                                onSelectDate={this.selectedEndDate}
                                                placeholder="Select end date..."
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-2">
                                        <label>End Time</label>
                                        <div>
                                            <TimePicker onChange={this.onChangedEndTime} showSecond={false} value={this.state.enrollmentEdTime} use12Hours />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-6 col-md-2 pull-right">
                                        <PrimaryButton text="Save" onClick={this.saveWaiversSettings} />
                                    </div>
                                </div>
                            </form>
                            <Dialog
                                hidden={this.state.hideDialog}
                                onDismiss={this.closeDialog}
                                dialogContentProps={{
                                    type: DialogType.normal,
                                    title: this.state.title,
                                    subText: this.state.subtext
                                }}
                                modalProps={{
                                    isBlocking: true,
                                    containerClassName: 'ms-dialogMainOverride'
                                }}>
                                <DialogFooter>
                                    <PrimaryButton onClick={this.okDialog} text="Ok" styles={this.state.OkButtonStyle} />
                                </DialogFooter>
                            </Dialog>
                        </div>
                        <label className="col-sm-12 col-form-label formSectionTitle" style={{ fontSize: '16px' }}>Copy Waivers</label>
                        <div className="white-box">
                            <div className="form-group row">
                                <ul>
                                    <li>Copy the waivers from the previous school year {prevStartYear}/{prevEndYear} to the current school year {startYear}/{endYear}.</li>
                                    <br />
                                    <li>If waivers have already been copied to the current school year {startYear}/{endYear}, you will not be able to copy them again. </li>
                                </ul>
                                <div className="col-xs-6 col-md-2 pull-right">
                                    <PrimaryButton text="Copy" disabled={isCopyWaiver} onClick={this.copyWaivers} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </IfAnyGranted>
        );
    }
}

AdministrationPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    campuses: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        startDate: state.applicationAdminReducer.EnrollmentStartDate,
        endDate: state.applicationAdminReducer.EnrollmentEndDate,
        enrollmentStartTime: state.applicationAdminReducer.EnrollmentStartTime,
        enrollmentEndTime: state.applicationAdminReducer.EnrollmentEndTime,
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        campuses: state.campuses.schoolDetails,
        principalName: state.userProps.user.principalName,
        startYear: state.campuses.userStartYear,
        endYear: state.campuses.userEndYear,
        settingsID: state.applicationAdminReducer.settingsID,
        isPost: state.applicationAdminReducer.isPost,
        isCopyWaiver: state.applicationAdminReducer.isCopyWaiver,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, campusActions, applicationAdminActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdministrationPage);
