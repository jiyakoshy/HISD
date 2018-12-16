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

class EditHomeMessagePage extends React.Component {

    constructor(props, context) {
        super(props, context);
        let homeMessageID = this.props.match.params.HomeMessageID;
        if(!homeMessageID){
            this.props.actions.logErrorSuccess('Home Message ID not specified.');
            document.location = "#error";
        }
        
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
        this.onSavingSucceeds = this.onSavingSucceeds.bind(this);
        this.cancel = this.cancel.bind(this);
        this.delete = this.delete.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
    }

    componentDidMount() {
        let homeMessageID = this.props.match.params.HomeMessageID;
        this.props.actions.loadHomeMessage(homeMessageID)
        .then(homeMessage => {
            const blocksFromHTML = convertFromHTML(this.props.homeMessage.HomeMessageContent);
            const content = ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap
            );
            this.setState({role: this.props.homeMessage.HomeMessageRole, startDate: this.props.homeMessage.StartDate, endDate: this.props.homeMessage.EndDate, content: EditorState.createWithContent(content)});
        });
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
    
    onSavingSucceeds(){
        this.displayMessage('Home Message successfully saved.', 'SAVED');
    }

    save() {
        const editorState = this.state.content;
        const allContent = editorState.getCurrentContent();
        const html = stateToHTML(allContent);
        let homeMessage = {HomeMessageID: this.props.homeMessage.HomeMessageID, HomeMessageRole: this.state.role, StartDate: Utilities.convertToSQLDate(this.state.startDate), EndDate: Utilities.convertToSQLDate(this.state.endDate), HomeMessageContent: html};
        if(this.isValidForm()){
            let promise = this.props.actions.updateHomeMessage(homeMessage);
            promise.then(this.onSavingSucceeds())
            .catch(reason => {
                this.props.actions.ajaxCallError();
                this.setState({ subtext: 'There was a problem saving the home message. Operation canceled.', dialogAction: '' });
                this.showDialog();
            });
        }
    }

    isValidForm(){
        let isValid = true;
        if(this.state.startDate == null){
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

    delete(){
        this.setState({ subtext: 'Do you want to delete this home message?', dialogAction: 'DELETE' });
        this.showDialog();
    }

    okDialog(){
        this.closeDialog(); 
        if(this.state.dialogAction == 'DELETE')
            this.deleteHomeMessage();
        else if(this.state.dialogAction == 'SAVED')
            this.cancel();
    }

    displayMessage(message, action){
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    deleteHomeMessage(){
        let promise = this.props.actions.deleteHomeMessage(this.props.homeMessageID);
        promise.then(() => this.displayMessage('Home Message successfully deleted.', 'SAVED'))
        .catch(reason => {
            this.props.actions.ajaxCallError();
            this.setState({ subtext: 'There was a problem deleting the Home Message. Operation canceled.', dialogAction: '' });
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
                                            <Dropdown options={roles} onChanged={this.onRoleDropdownChanged} selectedKey={this.state.role} isDisabled />
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

EditHomeMessagePage.propTypes = {
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
    userProps: PropTypes.object,
    homeMessageID: PropTypes.string
};

function mapStateToProps(state, ownProps) {
    return {
        campus: state.userProps.user.campusName,
        homeMessageID: ownProps.match.params.HomeMessageID,
        userProps: state.userProps,
        homeMessage: state.homeMessage
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, adminActions, sharedActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditHomeMessagePage);