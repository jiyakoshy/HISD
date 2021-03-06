import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActions from '../../../actions/adminActions';
import * as sharedActions from '../../../actions/sharedActions';
import * as ajaxActions from '../../../actions/ajaxStatusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../../common/PageHeader';
import _ from 'lodash';
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import Utilities from '../../../utilities/utilities';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../../common/ErrorPage';

class NewActivityStandardPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            activityName: '',
            startDate: null,
            endDate: null,
            hideDialog: true,
            dialogAction: '',
            subtext: '',
            dayPickerStrings: Utilities.getDayPickerStrings(),
            firstDayOfWeek: DayOfWeek.Sunday,
            activityGroupId: ''
        };
        this.onChangeActivityName = this.onChangeActivityName.bind(this);
        this.onSelectStartDate = this.onSelectStartDate.bind(this);
        this.onSelectEndDate = this.onSelectEndDate.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
    }

    componentDidMount() {
        this.setState({ activityGroupId: this.props.match.params.ActivityGroupID });
    }

    onSelectStartDate(date) {
        this.setState({ startDate: date });
    }

    onSelectEndDate(date) {
        this.setState({ endDate: date });
    }

    onChangeActivityName(e) {
        this.setState({ activityName: e.target.value });
    }

    save() {
        if (this.isValidForm()) {
            const payload = {
                ActivityStandardItemName: this.state.activityName,
                ActivityStandardGroupID: this.state.activityGroupId,
                EffectiveStartDate: Utilities.convertToSQLDate(new Date()) + 'T00:00:00-06:00',
                EffectiveEndDate: Utilities.convertToSQLDate(new Date()) + 'T00:00:00-06:00'
            };
            this.props.actions.createActivityStandard(payload).then(() => {
                this.displayMessage('New activity standard  has been created successfully', 'SAVED');
            }).catch(error => {
                this.displayMessage('Error trying to validate activity standard.', '');
            });
        }
    }

    isValidForm() {
        let isValid = true;
        if (this.state.activityName == '') {
            isValid = false;
            this.displayMessage('Error: Invalid Activity Standard Name', '');
        }
        // else if (this.state.startDate == null || this.state.startDate == '') {
        //     isValid = false;
        //     this.displayMessage('Error: Invalid Start Date. A Start Date must be selected', '');
        // }
        // else if (this.state.endDate == null || this.state.endDate == '') {
        //     isValid = false;
        //     this.displayMessage('Error: Invalid End Date. A End Date must be selected', '');
        // }
        // else if (this.state.startDate >= this.state.endDate) {
        //     isValid = false;
        //     this.displayMessage('Error: Start Date shoud not be greater than End Date');
        //     return isValid;
        // }
        return isValid;
    }

    onSavingSucceeds() {
        this.displayMessage('New Activity standard  has been created successfully', 'SAVED');
    }

    cancel() {
        const activityGroupID = this.props.match.params.ActivityGroupID;
        if (activityGroupID == 4) {
            document.location = '#admin-professionalexpectation';
        } else if (activityGroupID == 3) {
            document.location = '#admin-instructionalInstruction';
        } else {
            document.location = '#admin-instructionplanning';
        }
    }

    okDialog() {
        if (this.state.dialogAction == 'SAVED') {
            this.cancel();
        }
        else {
            this.closeDialog();
        }
    }

    showDialog() {
        this.setState({ hideDialog: false });
    }

    closeDialog() {
        this.setState({ hideDialog: true });
    }

    displayMessage(message, action) {
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    formatDate(date) {
        if (date) {
            let newDate = Utilities.getDateOnly(date);
            return newDate;
        }
        return '';
    }

    render() {
        const roles = [{ text: 'Admin', key: 'Admin' }, { text: 'Principal', key: 'Principal' }, { text: 'CIC', key: 'CIC' }, { text: 'Mentor', key: 'Mentor' }, { text: 'Mentee', key: 'Mentee' }, { text: 'Maintenance', key: 'Maintenance' }, { text: 'All', key: 'All' }];
        const editorState = this.state.content;
        //const startDate = this.state.startDate;
        //const endDate = this.state.endDate;
        const activityGroupID = this.props.match.params.ActivityGroupID;
        let title = '';

        if (activityGroupID == 4) {
            title = 'New Professional Expectation Standard'
        } else if (activityGroupID == 3) {
            title = 'New Instructional Practice - Instruction Standard'
        } else {
            title = 'New Instructional Practice - Planning Standard';
        }
        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title={title} campus={this.props.campus} />
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div className="white-box">
                                    <form className="form">
                                        <div className="form-group">
                                            <label>Activity Standard Name</label>
                                            <div>
                                                <textarea rows="2" className="form-control" onChange={this.onChangeActivityName} value={this.state.activityName}></textarea>
                                            </div>
                                        </div>
                                       {/*} <div className="form-group">
                                            <label>Start Date</label>
                                            <DatePicker value={startDate} firstDayOfWeek={this.state.firstDayOfWeek} strings={this.state.dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectStartDate} placeholder="Select start date..." />
                                        </div>
                                        <div className="form-group">
                                            <label>End Date</label>
                                            <DatePicker value={endDate} firstDayOfWeek={this.state.firstDayOfWeek} strings={this.state.dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectEndDate} placeholder="Select end date..." />
                                        </div>
        <br /><br />*/}
                                        <div className="row">
                                            <div className="col-md-12 col-lg-12 col-sm-12 text-center">
                                                <PrimaryButton
                                                    text="Save"
                                                    onClick={this.save}
                                                />
                                                &nbsp;&nbsp;&nbsp;
                                                <PrimaryButton
                                                    text="Cancel"
                                                    onClick={this.cancel}
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
                            title: 'Activity Standards',
                            subText: this.state.subtext
                        }}
                        modalProps={{
                            isBlocking: true,
                            containerClassName: 'ms-dialogMainOverride'
                        }}
                    >
                        <DialogFooter>
                            <PrimaryButton onClick={this.okDialog} text="Ok" />
                            <DefaultButton onClick={this.closeDialog} text="Cancel" />
                        </DialogFooter>
                    </Dialog>
                </div>
            </IfAnyGranted>
        );
    }
}

NewActivityStandardPage.propTypes = {
    campus: PropTypes.string,
    role: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    content: PropTypes.string,
    onRoleChanged: PropTypes.func,
    onSelectStartDate: PropTypes.func,
    onSelectEndDate: PropTypes.func,
    onChange: PropTypes.func,
    save: PropTypes.func,
    cancel: PropTypes.func,
    actions: PropTypes.object.isRequired,
    homeMessage: PropTypes.object,
    match: PropTypes.object,
    params: PropTypes.array,
    homeMessageID: PropTypes.string,
    userProps: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campus: state.userProps.user.campusName,
        homeMessageID: ownProps.match.params.HomeMessageID,
        homeMessage: state.homeMessage,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, adminActions, sharedActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewActivityStandardPage);