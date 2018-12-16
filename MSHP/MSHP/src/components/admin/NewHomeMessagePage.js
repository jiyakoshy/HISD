import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActions from '../../actions/adminActions';
import * as sharedActions from '../../actions/sharedActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';

import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import 'draft-js-import-html';
import  {stateToHTML} from 'draft-js-export-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import Utilities from '../../utilities/utilities';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class NewHomeMessagePage extends React.Component {

    constructor(props, context) {
        super(props, context);
        
        this.state = {
            role: '',
            startDate: null, 
            endDate: null,
            content: EditorState.createEmpty(),
            hideDialog: true,
            dialogAction: '',
            subtext: '',
            dayPickerStrings: Utilities.getDayPickerStrings(),
            firstDayOfWeek: DayOfWeek.Sunday
        };
        this.onRoleDropdownChanged = this.onRoleDropdownChanged.bind(this);
        this.onSelectStartDate = this.onSelectStartDate.bind(this);
        this.onSelectEndDate = this.onSelectEndDate.bind(this);
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
      
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
    }

    onEditorStateChange(newContent) {
        this.setState({content: newContent});
    }
    
    onSelectStartDate(date) {
        this.setState({ startDate: date });
    }

    onSelectEndDate(date) {
        this.setState({ endDate: date });
    }

    onRoleDropdownChanged(item) {
        this.setState({ role: item.key });
    }

    processSave(){
        if(this.props.homeMessage.HomeMessageRole){
            this.displayMessage('Home message for role "' + this.props.homeMessage.HomeMessageRole + '" already exists.', '');
        }
        else{
            const editorState = this.state.content;
            const allContent = editorState.getCurrentContent();
            const html = stateToHTML(allContent);
            let newHomeMessage = {HomeMessageRole: this.state.role, StartDate: Utilities.convertToSQLDate(this.state.startDate)+'T00:00:00-06:00', EndDate: Utilities.convertToSQLDate(this.state.endDate)+'T00:00:00-06:00', HomeMessageContent: html};
            let savePromise = this.props.actions.createHomeMessage(newHomeMessage);
            savePromise.
                then((response) => this.onSavingSucceeds(response)).
                catch(error => this.onSavingFails());
        }
    }

    onSavingSucceeds(response){
        if(this.props.homeMessage.HomeMessageID > 0){
            this.displayMessage('Home Message successfully created.', 'CREATED');
        }
        else{
            this.onSavingFails();
        }
    }

    onSavingFails(){
        this.props.actions.ajaxCallError();
        this.displayMessage('Error trying to create home message.');
    }

    save() {
        if(this.isValidForm()){
            let checkIfExistsPromise = this.props.actions.loadHomeMessageByRoleWithoutDates(this.state.role);
            checkIfExistsPromise.
                then(() => this.processSave()).
                catch(error => this.displayMessage('Error trying to validate home message.', ''));
        }
    }

    isValidForm(){
        let isValid = true;
        if(this.state.role == ''){
            isValid = false;
            this.displayMessage('Error: Invalid User Role. A User Role must be selected', '');
        }
        else if(this.state.startDate == null){
            isValid = false;
            this.displayMessage('Error: Invalid Start Date. A Start Date must be selected', '');
        }
        else if(this.state.endDate == null){
            isValid = false;
            this.displayMessage('Error: Invalid End Date. A End Date must be selected', '');
        }
        return isValid;
    }

    cancel() {
        document.location = '#admin-homemessages';
    }

    okDialog(){
        if(this.state.dialogAction == 'CREATED'){
            this.cancel();
        }
        else{
            this.closeDialog();
        }
    }

    showDialog() {
      this.setState({ hideDialog: false });
    }
  
    closeDialog() {
      this.setState({ hideDialog: true });
    }

    displayMessage(message, action){
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
        const roles = [{text:'Admin', key: 'Admin'}, {text:'Principal', key: 'Principal'}, {text:'CIC', key: 'CIC'}, {text:'Mentor', key: 'Mentor'}, {text:'Mentee', key: 'Mentee'}, {text:'Maintenance', key: 'Maintenance'}, {text:'All', key: 'All'}];
        const editorState = this.state.content;
        const startDate = this.state.startDate;
        const endDate = this.state.endDate;
        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Home Message" campus={this.props.campus} />
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div className="white-box">
                                    <form className="form">
                                        <div className="form-group">
                                            <label>Role</label>
                                            <Dropdown options={roles} onChanged={this.onRoleDropdownChanged} selectedKey={this.state.role} />
                                        </div>
                                        <div className="form-group">
                                            <label>Start Date</label>
                                            <DatePicker value={startDate} firstDayOfWeek={this.state.firstDayOfWeek} strings={this.state.dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectStartDate} placeholder="Select start date..." />
                                        </div>
                                        <div className="form-group">
                                            <label>End Date</label>
                                            <DatePicker value={endDate} firstDayOfWeek={this.state.firstDayOfWeek} strings={this.state.dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectEndDate} placeholder="Select end date..." />
                                        </div>
                                        <div className="form-group">
                                            <label>Content</label>
                                            <Editor
                                                editorState={editorState}
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                onEditorStateChange ={this.onEditorStateChange}
                                                editorStyle={{border:"1px solid #f4f4f4", height:"300px"}}
                                                />
                                        </div>
                                        <br /><br />
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
                            title: 'Home Message',
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

NewHomeMessagePage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(NewHomeMessagePage);