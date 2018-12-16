import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActions from '../../actions/adminActions';
import * as sharedActions from '../../actions/sharedActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import Utilities from '../../utilities/utilities';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class EditCBMStandardPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        const cbmStandardID = this.props.match.params.CBMStandardID;
        if (!cbmStandardID) {
            this.props.actions.logErrorSuccess('CBM Standard ID not specified.');
            document.location = "#error";
        }

        this.state = {
            year: 0,
            noOfLogs: 0,
            monthOrder: 0,
            NoOfDaysReminder : 0,
            hideDialog: true,
            dialogAction: '',
            subtext: ''
        };
        this.onChangeYear = this.onChangeYear.bind(this);
        this.onChangeNoOfLogs = this.onChangeNoOfLogs.bind(this);
        this.onChangeMonthOrder = this.onChangeMonthOrder.bind(this);
        this.onChangeNoOfDaysReminder = this.onChangeNoOfDaysReminder.bind(this);        
        this.loadValues = this.loadValues.bind(this);

        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        this.onSavingSucceeds = this.onSavingSucceeds.bind(this);

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount() {
        const cbmStandardID = this.props.match.params.CBMStandardID;
        this.props.actions.loadCBMStandard(cbmStandardID)
            .then(cbmStandard => this.loadValues());
    }

    loadValues() {
        if (this.props.cbmStandard != null)
            this.setState({ cbmStandardID: this.props.cbmStandard.CBMStandardID, month: this.props.cbmStandard.MonthName, year: this.props.cbmStandard.Year, noOfLogs: this.props.cbmStandard.NoOfLogs, monthOrder: this.props.cbmStandard.MonthOrder , NoOfDaysReminder : this.props.cbmStandard.NoOfDaysRemainingReminder  });
    }

    onSavingSucceeds() {
        this.displayMessage('CBM Standard successfully saved.', 'SAVED');
    }

    cancel() {
        document.location = '#admin-cbmstandards';
    }

    save() {
        let cbmStandard = { CBMStandardID: this.props.match.params.CBMStandardID, Year: this.state.year, NoOfLogs: this.state.noOfLogs, MonthOrder: this.state.monthOrder ,NoOfDaysRemainingReminder : this.state.NoOfDaysReminder };
        if (this.isValidForm()) {
            let promise = this.props.actions.updateCBMStandard(cbmStandard);
            promise.then(() => this.onSavingSucceeds())
                .catch(reason => {
                    this.props.actions.ajaxCallError();
                    this.setState({ subtext: 'There was a problem saving this CBM Standard. Operation canceled.', dialogAction: '' });
                    this.showDialog();
                });
        }
    }

    isValidForm() {
        let isValid = true;
        if (this.state.noOfLogs.length === 0 || this.state.noOfLogs < 0) {
            isValid = false;
            this.displayMessage('Error: Invalid Number of Logs. ', '');
        }
        else if (this.state.monthOrder.length === 0 || this.state.monthOrder < 1) {
            isValid = false;
            this.displayMessage('Error: Invalid Month Order. ', '');
        }
        else if (this.state.NoOfDaysReminder.length === 0 || this.state.NoOfDaysReminder < 1) {
            isValid = false;
            this.displayMessage('Error: Invalid No Of Days Reminder. ', '');
        }
        return isValid;
    }

    okDialog() {
        if (this.state.dialogAction == 'SAVED')
            this.cancel();
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

    onChangeYear(e) {
        this.setState({ year: e.target.value });
    }

    onChangeNoOfLogs(e) {
        this.setState({ noOfLogs: e.target.value });
    }

    onChangeMonthOrder(e) {
        this.setState({ monthOrder: e.target.value });
    }
    onChangeNoOfDaysReminder(e){
        this.setState({ NoOfDaysReminder: e.target.value });
    }

    render() {
        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Edit CBM Standard Month" campus={this.props.campus} />
                        <div className="row">
                            <div className="col-md-6 col-lg-6 col-sm-12">
                                <div className="white-box">
                                    <form className="form">
                                        <div className="form-group">
                                            <label>Month</label>
                                            <input id="month" className="form-control" type="text" value={this.props.cbmStandard.MonthName} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label>Year</label>
                                            <input id="year" className="form-control" type="numbdf" value={this.state.year} onChange={this.onChangeYear} maxLength={4} />
                                        </div>
                                        <div className="form-group">
                                            <label>No. of Logs</label>
                                            <input id="noOfLogs" className="form-control" type="number" value={this.state.noOfLogs} onChange={this.onChangeNoOfLogs} maxLength={3} />
                                        </div>
                                        <div className="form-group" style={{"display" : "none"}}>
                                            <label>Month Order</label>
                                            <input id="monthOrder" className="form-control" type="number" value={this.state.monthOrder} onChange={this.onChangeMonthOrder} maxLength={2} />
                                        </div>
                                        <div className="form-group">
                                            <label>Number of Days Remaining for Reminder</label>
                                            <input id="NoOfDaysReminder" className="form-control" type="number" value={this.state.NoOfDaysReminder} onChange={this.onChangeNoOfDaysReminder} maxLength={2} />
                                        </div>
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
                            title: 'CBM Standard',
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
            </IfAnyGranted>
        );
    }
}

EditCBMStandardPage.propTypes = {
    campus: PropTypes.string,
    onChangeNoOfLogs: PropTypes.func,
    onChangeMonthOrder: PropTypes.func,
    save: PropTypes.func,
    cancel: PropTypes.func,
    cbmStandard: PropTypes.object,
    match: PropTypes.object,
    params: PropTypes.array,
    userProps: PropTypes.object,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        campus: state.userProps.user.campusName,
        userProps: state.userProps,
        cbmStandard: state.cbmStandard
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, adminActions, sharedActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCBMStandardPage);