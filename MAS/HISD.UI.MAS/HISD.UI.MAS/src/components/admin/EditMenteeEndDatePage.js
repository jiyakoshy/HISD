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
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import Utilities from '../../utilities/utilities';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class EditMenteeEndDatePage extends React.Component {

    constructor(props, context) {
        super(props, context);
        const employeeID = this.props.match.params.StaffNaturalKey;
        if(!employeeID){
            this.props.actions.logErrorSuccess('Employee ID not specified.');
            document.location = "#error";
        }

        this.state = {
            firstName: '',
            lastSurname: '',
            title: '',
            menteeCampus: '',
            menteeEndDate: null,
            firstDayOfWeek: DayOfWeek.Sunday,
            dayPickerStrings: Utilities.getDayPickerStrings()
        };
        this.onSelectEndDate = this.onSelectEndDate.bind(this);
        
        this.save = this.save.bind(this);
        this.onSavingSucceeds = this.onSavingSucceeds.bind(this);
        this.cancel = this.cancel.bind(this);
        this.loadValues = this.loadValues.bind(this);
        this.delete = this.delete.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
    }

    componentDidMount() {
        const employeeID = this.props.match.params.StaffNaturalKey;
        this.props.actions.loadMenteeEndDateByEmployeeID(employeeID)
        .then(menteeEndDate => this.loadValues());
    }

    loadValues(){
        if(this.props.menteeEndDate != null)
            this.setState({menteeEndDateID: this.props.menteeEndDate.MenteeEndDateID, firstName: this.props.menteeEndDate.FirstName, lastName: this.props.menteeEndDate.LastSurname, title: this.props.menteeEndDate.JobCodeDescription, endDate: new Date(Utilities.getDateTime(this.props.menteeEndDate.MenteeEndDate)), menteeCampus: this.props.menteeEndDate.NameOfInstitution});
    }
    
    onSavingSucceeds(){
        this.displayMessage('Mentee End Date record successfully saved.', 'SAVED');
    }

    save() {
        let menteeEndDate = {MenteeEndDateID: this.props.menteeEndDate.MenteeEndDateID, MenteeEndDateTime: Utilities.convertToSQLDate(this.state.endDate)};
        if(this.isValidForm()){
            let promise = this.props.actions.updateMenteeEndDate(menteeEndDate);
            promise.then(this.onSavingSucceeds())
            .catch(reason => {
                this.props.actions.ajaxCallError();
                this.setState({ subtext: 'There was a problem saving this Mentee End Date record. Operation canceled.', dialogAction: '' });
                this.showDialog();
            });
        }
    }

    isValidForm(){
        let isValid = true;
        if(this.state.endDate == null){
            isValid = false;
            this.displayMessage('Error: Invalid Mentee End Date. A Mentee End Date must be selected', '');
        }
        return isValid;
    }

    cancel() {
        document.location = '#admin-menteesenddates';
    }

    delete(){
        this.setState({ subtext: 'Do you want to delete this Mentorship End Date record?', dialogAction: 'DELETE' });
        this.showDialog();
    }

    okDialog(){
        this.closeDialog(); 
        if(this.state.dialogAction == 'DELETE')
            this.deleteMenteeEndDate();
        else if(this.state.dialogAction == 'SAVED')
            this.cancel();
    }

    displayMessage(message, action){
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    deleteMenteeEndDate(){
        const menteeEndDateID = this.props.menteeEndDate.MenteeEndDateID;
        let promise = this.props.actions.deleteMenteeEndDate(menteeEndDateID);
        promise.then((response) => this.displayMessage('Mentorship End Date record successfully deleted.', 'SAVED'))
        .catch(reason => {
            this.props.actions.ajaxCallError();
            this.setState({ subtext: 'There was a problem deleting this mentorship end date record. Operation canceled.', dialogAction: '' });
            this.showDialog();
        });
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

    onSelectEndDate(date) {
        this.setState({ endDate: date });
    }

    render() {
        let { firstDayOfWeek } = this.state.firstDayOfWeek;
        let { dayPickerStrings } = this.state.dayPickerStrings;
        const style = { paddingTop: 0 };
        const endDate = this.state.endDate;
        
        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Edit Mentee End Date" campus={this.props.campus} />
                        <div className="row">
                            <div className="col-md-8 col-lg-8 col-sm-12">
                                <div className="white-box">
                                    <form className="form">
                                        <div className="form-group">
                                            <label>First Name</label>
                                            <input id="firstName" className="form-control" type="text" value={this.props.menteeEndDate.FirstName} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label>Last Name</label>
                                            <input id="lastName" className="form-control" type="text" value={this.props.menteeEndDate.LastSurname} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label>Title</label>
                                            <input id="title" className="form-control" type="text" value={this.props.menteeEndDate.JobCodeDescription} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label>Campus</label>
                                            <input id="campus" className="form-control" type="text" value={this.props.menteeEndDate.NameOfInstitution} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label>Mentorship End Date</label>
                                            <DatePicker value={endDate} firstDayOfWeek={firstDayOfWeek} strings={dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectEndDate} placeholder="Select end date..." />
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
                                                &nbsp;&nbsp;&nbsp;
                                                <DefaultButton
                                                    text="Delete"
                                                    iconProps={{iconName: "Delete"}}
                                                    onClick={this.delete}
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
                            title: 'Mentee End Date',
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

EditMenteeEndDatePage.propTypes = {
    campusID: PropTypes.string,
    campus: PropTypes.string,
    firstName: PropTypes.string,
    lastSurName: PropTypes.string,
    title: PropTypes.string,
    menteeCampus: PropTypes.string,
    endDate: PropTypes.string,
    onSelectMenteeEndDate: PropTypes.func,
    save: PropTypes.func,
    cancel: PropTypes.func,
    menteeEndDate: PropTypes.object,
    menteeEndDateID: PropTypes.string,
    match: PropTypes.object,
    params: PropTypes.array,
    userProps: PropTypes.object,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campus: state.userProps.user.campusName,
        menteeEndDate: state.menteeEndDate,
        userProps: state.userProps,
        menteeEndDateID: ownProps.match.params.MenteeEndDateID
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, adminActions, sharedActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditMenteeEndDatePage);