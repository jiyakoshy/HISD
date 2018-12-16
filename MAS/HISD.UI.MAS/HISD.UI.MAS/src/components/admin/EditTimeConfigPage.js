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

class EditTimeConfigPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        let timeConfigurationID = this.props.match.params.TimeConfigurationID;
        if(!timeConfigurationID){
            this.props.actions.logErrorSuccess('Time Configuration ID not specified.');
            document.location = "#error";
        }

        this.state = {
            schoolYear: '',
            schoolStartDate: null,
            schoolEndDate: null,
            logStartDate: null,
            logEndDate: null,
            firstDayOfWeek: DayOfWeek.Sunday,
            dayPickerStrings: Utilities.getDayPickerStrings()
        };
        this.onChangeSchoolYear = this.onChangeSchoolYear.bind(this);
        this.onSelectLogStartDate = this.onSelectLogStartDate.bind(this);
        this.onSelectLogEndDate = this.onSelectLogEndDate.bind(this);
        this.onSelectSchoolStartDate = this.onSelectSchoolStartDate.bind(this);
        this.onSelectSchoolEndDate = this.onSelectSchoolEndDate.bind(this);

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
        let timeConfigurationID = this.props.match.params.TimeConfigurationID;
        this.props.actions.loadTimeConfig(timeConfigurationID)
        .then(timeConfig => this.loadValues());
    }

    loadValues(){
        if(this.props.timeConfig != null)
            this.setState({timeConfigurationID: this.props.timeConfig.TimeCofigurationID, schoolYear: this.props.timeConfig.SchoolYear.trim(), logStartDate: new Date(Utilities.getDateTime(this.props.timeConfig.LogStartDate)), logEndDate: new Date(Utilities.getDateTime(this.props.timeConfig.LogEndDate)), schoolStartDate: new Date(Utilities.getDateTime(this.props.timeConfig.SchoolStartDate)), schoolEndDate: new Date(Utilities.getDateTime(this.props.timeConfig.SchoolEndDate))});
    }
    
    onSavingSucceeds(){
        this.displayMessage('Time Configuration successfully saved.', 'SAVED');
    }

    save() {
        let timeConfig = {TimeConfigurationID: this.props.timeConfig.TimeConfigurationID, SchoolYear: this.state.schoolYear.trim(), SchoolStartDate: Utilities.convertToSQLDate(this.state.schoolStartDate), SchoolEndDate: Utilities.convertToSQLDate(this.state.schoolEndDate), LogStartDate: Utilities.convertToSQLDate(this.state.logStartDate), LogEndDate: Utilities.convertToSQLDate(this.state.logEndDate)};
        if(this.isValidForm()){
            let promise = this.props.actions.updateTimeConfig(timeConfig);
            promise.then(this.onSavingSucceeds())
            .catch(reason => {
                this.props.actions.ajaxCallError();
                this.setState({ subtext: 'There was a problem saving this time configuration. Operation canceled.', dialogAction: '' });
                this.showDialog();
            });
        }
    }

    isValidForm(){
        let isValid = true;
        if(this.state.schoolYear.trim().length < 4){
            isValid = false;
            this.displayMessage('Error: Invalid School Year. It must contain at least four characters', '');
        }
        else if(this.state.schoolStartDate == null){
            isValid = false;
            this.displayMessage('Error: Invalid School Start Date. A School Start Date must be selected', '');
        }
        else if(this.state.schoolEndDate == null){
            isValid = false;
            this.displayMessage('Error: Invalid School End Date. A School End Date must be selected', '');
        }
        else if(this.state.logStartDate == null){
            isValid = false;
            this.displayMessage('Error: Invalid Activity Log Start Date. An Activity Log Start Date must be selected', '');
        }
        else if(this.state.logEndDate == null){
            isValid = false;
            this.displayMessage('Error: Invalid Activity Log End Date. An Activity Log End Date must be selected', '');
        }else if(this.state.schoolStartDate >= this.state.schoolEndDate){
            isValid = false;
            this.displayMessage('Error: Invalid Dates. School Start Date shoud not be greater than School End Date', '');
        }else if(this.state.schoolStartDate > this.state.logStartDate){
            isValid = false;
            this.displayMessage('Error: Invalid Activity Log Dates. Activity Log Start Date shoud  be in between School Start Date and School End Date.', '');
        }else if(this.state.schoolEndDate < this.state.logStartDate){
            isValid = false;
            this.displayMessage('Error: Invalid Activity Log Dates. Activity Log Start Date shoud  be in between School Start Date and School End Date.', '');
        }else if(this.state.schoolStartDate > this.state.logEndDate){
            isValid = false;
            this.displayMessage('Error: Invalid Activity Log Dates. Activity Log End Date shoud  be in between School Start Date and School End Date.', '');
        }else if(this.state.schoolEndDate < this.state.logEndDate){
            isValid = false;
            this.displayMessage('Error: Invalid Activity Log Dates. Activity Log End Date shoud  be in between School Start Date and School End Date.', '');
        }else if(this.state.logStartDate >= this.state.logEndDate){
            isValid = false;
            this.displayMessage('Error: Invalid Activity Log Dates. Activity Log Start Date shoud not be greater than Activity Log End Date.', '');
        }
        
        return isValid;
    }

    cancel() {
        document.location = '#admin-timeconfig';
    }

    delete(){
        this.setState({ subtext: 'Do you want to delete this time configuration?', dialogAction: 'DELETE' });
        this.showDialog();
    }

    okDialog(){
        this.closeDialog(); 
        if(this.state.dialogAction == 'DELETE')
            this.deleteTimeConfiguration();
        else if(this.state.dialogAction == 'SAVED')
            this.cancel();
    }

    displayMessage(message, action){
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    deleteTimeConfiguration(){
        const timeConfigurationID = this.props.timeConfigurationID;
        let promise = this.props.actions.deleteTimeConfig(timeConfigurationID);
        promise.then((response) => this.displayMessage('Time Configuration successfully deleted.', 'SAVED'))
        .catch(reason => {
            this.props.actions.ajaxCallError();
            this.setState({ subtext: 'There was a problem deleting this time configuration. Operation canceled.', dialogAction: '' });
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

    onSelectLogStartDate(date) {
        this.setState({ logStartDate: date });
    }

    onSelectLogEndDate(date) {
        this.setState({ logEndDate: date });
    }

    onSelectSchoolStartDate(date) {
        this.setState({ schoolStartDate: date });
    }

    onSelectSchoolEndDate(date) {
        this.setState({ schoolEndDate: date });
    }

    onChangeSchoolYear(e) {
         this.setState({schoolYear: e.target.value});
    }

    render() {
        let { firstDayOfWeek } = this.state.firstDayOfWeek;
        let { dayPickerStrings } = this.state.dayPickerStrings;
        const style = { paddingTop: 0 };
        const schoolStartDate = this.state.schoolStartDate;
        const schoolEndDate = this.state.schoolEndDate;
        const logStartDate = this.state.logStartDate;
        const logEndDate = this.state.logEndDate;
        
        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Edit Time Configuration" campus={this.props.campus} />
                        <div className="row">
                            <div className="col-md-8 col-lg-8 col-sm-12">
                                <div className="white-box" style={style}>
                                    <form className="form-horizontal">
                                    <div className="row">
                                            <div className="col-md-12 col-lg-12 col-sm-12 formSectionTitle">School Year</div>
                                        </div>
                                        <div></div>
                                        <div className="form-group">
                                            <label className="col-md-2 col-lg-2 col-sm-2">Start Year</label>
                                            <div className="col-md-10 col-lg-10 col-sm-10"><input id="schoolYear" className="form-control" type="text" value={this.state.schoolYear} onChange={this.onChangeSchoolYear} /></div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-md-2 col-lg-2 col-sm-2">Start Date</label>
                                            <div className="col-md-4 col-lg-4 col-sm-4">
                                                <DatePicker value={schoolStartDate} firstDayOfWeek={firstDayOfWeek} strings={dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectSchoolStartDate} placeholder="Select start date..." />
                                            </div>
                                            <label className="col-md-2 col-lg-2 col-sm-2">End Date</label>
                                            <div className="col-md-4 col-lg-4 col-sm-4">
                                                <DatePicker value={schoolEndDate} firstDayOfWeek={firstDayOfWeek} strings={dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectSchoolEndDate} placeholder="Select end date..." />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12 col-lg-12 col-sm-12 formSectionTitle">Mentor Activity Log</div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-md-2 col-lg-2 col-sm-2">Start Date</label>
                                            <div className="col-md-4 col-lg-4 col-sm-4">
                                                <DatePicker value={logStartDate} firstDayOfWeek={firstDayOfWeek} strings={dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectLogStartDate} placeholder="Select start date..." />
                                            </div>
                                            <label className="col-md-2 col-lg-2 col-sm-2">End Date</label>
                                            <div className="col-md-4 col-lg-4 col-sm-4">
                                                <DatePicker value={logEndDate} firstDayOfWeek={firstDayOfWeek} strings={dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectLogEndDate} placeholder="Select end date..." />
                                            </div>
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
                            title: 'Time Configuration',
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

EditTimeConfigPage.propTypes = {
    campus: PropTypes.string,
    schoolYear: PropTypes.string,
    schoolStartDate: PropTypes.string,
    schoolEndDate: PropTypes.string,
    logStartDate: PropTypes.string,
    logEndDate: PropTypes.string,
    onSelectSchoolStartDate: PropTypes.func,
    onSelectSchoolEndDate: PropTypes.func,
    onSelectLogStartDate: PropTypes.func,
    onSelectLogEndDate: PropTypes.func,
    onChangeSchoolYear: PropTypes.func,
    save: PropTypes.func,
    cancel: PropTypes.func,
    timeConfig: PropTypes.object,
    timeConfigurationID: PropTypes.string,
    match: PropTypes.object,
    params: PropTypes.array,
    userProps: PropTypes.object,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        campus: state.userProps.user.campusName,
        timeConfig: state.timeConfig,
        userProps: state.userProps,
        timeConfigurationID: ownProps.match.params.TimeConfigurationID
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, adminActions, sharedActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTimeConfigPage);