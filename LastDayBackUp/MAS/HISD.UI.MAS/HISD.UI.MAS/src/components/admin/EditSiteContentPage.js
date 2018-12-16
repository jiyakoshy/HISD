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
import { stateToHTML } from 'draft-js-export-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import Utilities from '../../utilities/utilities';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';
import Config from '../../api/config';
import { setup, sp, SPRequestExecutorClient, Web, EmailProperties } from "sp-pnp-js";
import jspdf from 'jspdf';

class EditSiteContentPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        let siteContentID = this.props.match.params.SiteContentID;
        if (!siteContentID) {
            this.props.actions.logErrorSuccess('Site Content ID not specified.');
            document.location = "#error";
        }

        this.state = {
            code: '',
            content: EditorState.createEmpty(),
            hideDialog: true,
            dialogAction: '',
            subtext: '',
            deleteVisible: "none",
            uploadVisible: "none"
        };
        this.onEditorStateChange = this.onEditorStateChange.bind(this);

        this.save = this.save.bind(this);
        this.onSavingSucceeds = this.onSavingSucceeds.bind(this);
        this.cancel = this.cancel.bind(this);
        this.delete = this.delete.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        this.accept = this.accept.bind(this);
        this.printSave = this.printSave.bind(this);
    }

    componentDidMount() {
        let siteContentID = this.props.match.params.SiteContentID;
        this.props.actions.loadSiteContent(siteContentID)
            .then(siteContent => {
                const blocksFromHTML = convertFromHTML(this.props.siteContent.SiteContentDescription);
                const content = ContentState.createFromBlockArray(
                    blocksFromHTML.contentBlocks,
                    blocksFromHTML.entityMap
                );
                this.setState({ code: this.props.siteContent.SiteContentCode, content: EditorState.createWithContent(content) });
                if (this.props.siteContent.SiteContentCode == 'Agreement')
                    this.setState({ deleteVisible: 'none', uploadVisible: "inline" });
                else
                    this.setState({ deleteVisible: 'inline', uploadVisible: "none" });
            });
    }

    onChangeCode(e) {
        this.setState({ code: e.target.value });
    }

    onEditorStateChange(newContent) {
        this.setState({ content: newContent });
    }

    onSavingSucceeds() {
        if (this.props.siteContent.SiteContentCode == 'Agreement') {
            const editorState = this.state.content;
            const allContent = editorState.getCurrentContent();
            const html = stateToHTML(allContent).replace('“', "").replace('/"', "").replace('”', "").replace("’", "").replace("”", "").replace("“", "");


            let doc = new jspdf();

            let specialElementHandlers = {
                '#editor': function (element, renderer) {
                    return true;
                }
            };

            doc.fromHTML(html, 15, 15, {
                'width': 170,
                'elementHandlers': specialElementHandlers
            });

            let blob = new Blob();
            blob = doc.output('blob');
            var file = new File([blob], "Mentor Agreement.pdf");
            const siteUrl = Config.SiteURL;
            const url = window.location.origin;
            let web = sp.crossDomainWeb(url, siteUrl);
            if (file != undefined || file != null) {

                web.getFolderByServerRelativeUrl(Config.PDFLibrary).
                    files.add(file.name, file, true).then((result) => {
                        let t = 'ff';
                    });
            }

            this.displayMessage('Site Content successfully saved.', 'SAVED');
        }
        else {
            this.displayMessage('Site Content successfully saved.', 'SAVED');
        }

    }

    save() {
        const editorState = this.state.content;
        const allContent = editorState.getCurrentContent();
        const html = stateToHTML(allContent);
        let siteContent = { SiteContentID: this.props.siteContent.SiteContentID, SiteContentCode: this.state.code, SiteContentDescription: html };
        if (this.isValidForm(siteContent)) {
            let promise = this.props.actions.updateSiteContent(siteContent);
            promise.then(this.onSavingSucceeds())
                .catch(reason => {
                    this.props.actions.ajaxCallError();
                    this.setState({ subtext: 'There was a problem saving the site content. Operation canceled.', dialogAction: '' });
                    this.showDialog();
                });
        }
    }

    isValidForm(siteContent) {
        let isValid = true;

        return isValid;
    }

    cancel() {
        document.location = '#admin-sitecontent';
    }

    delete() {
        this.setState({ subtext: 'Do you want to delete this site content?', dialogAction: 'DELETE' });
        this.showDialog();
    }

    okDialog() {
        this.closeDialog();
        if (this.state.dialogAction == 'DELETE')
            this.deleteSiteContent();
        else if (this.state.dialogAction == 'SAVED')
            this.cancel();
    }

    deleteSiteContent() {
        let promise = this.props.actions.deleteSiteContent(this.props.siteContentID);
        promise.then(() => this.displayMessage('Site Content page successfully deleted.', 'SAVED'))
            .catch(reason => {
                this.props.actions.ajaxCallError();
                this.setState({ subtext: 'There was a problem deleting the site content. Operation canceled.', dialogAction: '' });
                this.showDialog();
            });
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


    accept() {
        window.open(Config.EmailLibrary, '_blank');
    }

    // let specialElementHandlers = {
    //     '#editor': function (element, renderer) {
    //         return true;
    //     }
    // };

    printSave() {
        let pdf = new jspdf();
        let test = this.state.code;
        const editorState = this.state.content;
        const allContent = editorState.getCurrentContent();
        const html = stateToHTML(allContent).replace('“',"").replace('/"',"").replace('”',"").replace("’","").replace("”","").replace("“","");
        let specialElementHandlers = {
            '#editor': function (element, renderer) {
                return true;
            }
        };
        pdf.fromHTML(html, 15, 15, {
            'width': 170
            // 'elementHandlers': specialElementHandlers
        });
        pdf.save("download.pdf");
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
                                            <label>Role</label>
                                            <input id="code" className="form-control" type="text" value={this.state.code} onChange={this.onChangeCode} maxLength={255} disabled />
                                        </div>
                                        <div className="form-group">
                                            <label>Content</label>
                                            <Editor
                                                editorState={editorState}
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                onEditorStateChange={this.onEditorStateChange}
                                                editorStyle={{ border: "1px solid #f4f4f4", height: "300px" }}
                                            />
                                        </div>
                                        <div id='editor'></div>

                                        <br /><br />
                                        <div className="row">
                                            <div className="col-md-12 col-lg-12 col-sm-12 text-center">
                                                {/*} <PrimaryButton text="Test450" onClick={this.printSave} />*/}

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
                                                    style={{ "display": this.state.deleteVisible }}
                                                    iconProps={{ iconName: "Delete" }}
                                                    onClick={this.delete}
                                                />
                                                &nbsp;&nbsp;&nbsp;
                                                <PrimaryButton
                                                    style={{ "display": this.state.uploadVisible }}
                                                    text="Upload Agreement as PDF"
                                                    onClick={this.accept}
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

EditSiteContentPage.propTypes = {
    campus: PropTypes.string,
    code: PropTypes.string,
    content: PropTypes.string,
    onCodeChanged: PropTypes.func,
    save: PropTypes.func,
    printSave: PropTypes.func,
    cancel: PropTypes.func,
    actions: PropTypes.object.isRequired,
    siteContent: PropTypes.object,
    match: PropTypes.object,
    params: PropTypes.array,
    userProps: PropTypes.object,
    siteContentID: PropTypes.string
};

function mapStateToProps(state, ownProps) {
    return {
        campus: state.userProps.user.campusName,
        siteContentID: ownProps.match.params.SiteContentID,
        userProps: state.userProps,
        siteContent: state.siteContent
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, adminActions, sharedActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSiteContentPage);