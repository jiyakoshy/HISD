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
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import Utilities from '../../utilities/utilities';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class NewSiteContentPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            code: '',
            content: EditorState.createEmpty(),
            hideDialog: true,
            dialogAction: '',
            subtext: ''
        };
        this.onChangeCode = this.onChangeCode.bind(this);
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
    }

    onChangeCode(e) {
        this.setState({code: e.target.value});
    }

    onEditorStateChange(newContent) {
        this.setState({content: newContent});
    }

    processSave(){
        if(this.props.siteContent.SiteContentCode){
            this.displayMessage('Site Content page with code "' + this.props.siteContent.SiteContentCode + '" already exists.', '');
        }
        else{
            const editorState = this.state.content;
            const allContent = editorState.getCurrentContent();
            const html = stateToHTML(allContent);
            let newSiteContent = {SiteContentCode: this.state.code, SiteContentDescription: html};
            let savePromise = this.props.actions.createSiteContent(newSiteContent);
            savePromise.
                then((response) => this.onSavingSucceeds()).
                catch(error => this.onSavingFails());
        }
    }

    onSavingSucceeds(){
        if(this.props.siteContent.SiteContentID > 0){
            this.displayMessage('Site Content page successfully created.', 'CREATED');
        }
        else{
            this.onSavingFails();
        }
    }

    onSavingFails(){
        this.props.actions.ajaxCallError();
        this.displayMessage('Error trying to create Site Content page.');
    }

    
    save() {
        if(this.isValidForm()){
            let checkIfExistsPromise = this.props.actions.loadSiteContentByCode(this.state.code);
            checkIfExistsPromise.
                then(() => this.processSave()).
                catch(error => this.displayMessage('Error trying to validate Site Content page.', ''));
        }
    }

    isValidForm(){
        let isValid = true;
        if(this.state.code.length < 3){
            isValid = false;
            this.displayMessage('Error: Invalid Site Content Code. A Site Content Code must be at least 3 characters long.', '');
        }
        return isValid;
    }

    displayMessage(message, action){
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    cancel() {
        document.location = '#admin-sitecontent';
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

    render() {
        const editorState = this.state.content;
        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Site Content" campus={this.props.campus} />
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div className="white-box">
                                    <form className="form">
                                        <div className="form-group">
                                            <label>Code</label>
                                            <input id="code" className="form-control" type="text" value={this.state.code} onChange={this.onChangeCode} maxLength={255} />
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
                            title: 'Site Content',
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

NewSiteContentPage.propTypes = {
    campus: PropTypes.string,
    code: PropTypes.string,
    content: PropTypes.string,
    onCodeChanged: PropTypes.func,
    save: PropTypes.func,
    cancel: PropTypes.func,
    actions: PropTypes.object.isRequired,
    siteContent: PropTypes.object,
    match: PropTypes.object,
    params: PropTypes.array,
    siteContentID: PropTypes.string,
    userProps: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campus: state.userProps.user.campusName,
        siteContentID: ownProps.match.params.SiteContentID,
        siteContent: state.siteContent,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, adminActions, sharedActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewSiteContentPage);