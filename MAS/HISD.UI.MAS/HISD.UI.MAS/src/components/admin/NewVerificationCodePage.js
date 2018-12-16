import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as adminActions from '../../actions/adminActions';
import * as sharedActions from '../../actions/sharedActions';
import * as ajaxStatusActions from '../../actions/ajaxStatusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import Utilities from '../../utilities/utilities';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class NewVerificationCodePage extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            code: '',
            description: '',
            hideDialog: true,
            dialogAction: '',
            subtext: ''
        };
        this.onChangeCode = this.onChangeCode.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.onSavingSucceeds = this.onSavingSucceeds.bind(this);
        this.onSavingFails = this.onSavingFails.bind(this);
    }
    
    componentDidMount(){
        this.props.actions.loadVerificationCode();
    }

    displayMessage(message, action){
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    processSave(){
        const code = this.state.code;
        if(this.isVerificationCodeExists(code) == true){
            this.displayMessage('The verification code "' + code + '" already exists.', '');
        }
        else{
            let newVerificationCode = {MultiChoiceListID: this.props.verificationCode.MultiChoiceListID, MultiChoiceListItemCode: this.state.code.trim(), MultiChoiceListItemDescription: this.state.description.trim(), Status: true};
            let savePromise = this.props.actions.createVerificationCodeDetails(newVerificationCode);
            savePromise.
                then((response) => this.onSavingSucceeds(response)).
                catch(error => this.onSavingFails());
        }
    }

    isVerificationCodeExists(code){
        let exists = false;
        const codes = this.props.verificationCode.MultiChoiceListItems;
        codes.forEach(function(element) {
            if(element.MultiChoiceListItemCode === code){
                exists = true;
                return exists;
            }
        }, this);
        return exists;
    }

    onSavingSucceeds(response){
        if(this.props.verificationCodeDetails.MultiChoiceListItemID > 0){
            this.displayMessage('Verification code successfully created.', 'CREATED');
        }
        else{
            this.onSavingFails();
        }
    }

    onSavingFails(){
        this.props.actions.ajaxCallError();
        this.displayMessage('Error trying to save activity code.');
    }

    save() {
        let newVerificationCode = {MultiChoiceListID: this.props.verificationCode.MultiChoiceListID, MultiChoiceListItemCode: this.state.code.trim(), MultiChoiceListItemDescription: this.state.description.trim(), Status: true};
        if(this.isValidForm()){
            let checkIfExistsPromise = this.props.actions.loadVerificationCode();
            checkIfExistsPromise.
                then(() => this.processSave()).
                catch(error => this.displayMessage('Error trying to validate verification code.', ''));
        }
    }

    isValidForm(){
        let isValid = true;
        if(this.state.code.length < 3){
            isValid = false;
            this.displayMessage('Error: Invalid Verification Code. It must contain at least three characters', '');
        }
        else if(this.state.description.length < 3){
            isValid = false;
            this.displayMessage('Error: Invalid Verification Code Description. It must contain at least three characters', '');
        }
        return isValid;
    }

    cancel() {
        document.location = '#admin-verificationcodes';
    }

    onStatusDropdownChanged(item) {
        this.setState({ status: item.key });
    }

    onChangeCode(e) {
         this.setState({code: e.target.value});
    }

    onChangeDescription(e) {
         this.setState({description: e.target.value});
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
        let mentorTypes = [{key:'All',text:'All'}, {key:'ABRAZO', text:'ABRAZO'}, {key:'Campus', text: 'Campus'}];
        let statuses = [{key:'Active', text:'Active'},{key:'Inactive', text:'Inactive'}];
        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="New Verification Code" campus={this.props.campus} />
                        <div className="row">
                            <div className="col-md-8 col-lg-8 col-sm-12">
                                <div className="white-box">
                                    <form className="form">
                                        <div className="form-group">
                                            <label>Code</label>
                                            <input id="code" className="form-control" type="text" value={this.state.code} onChange={this.onChangeCode} maxLength={50} />
                                        </div>
                                        <div className="form-group">
                                            <label>Description</label>
                                            <input id="description" className="form-control" type="text" value={this.state.description} onChange={this.onChangeDescription} maxLength={255} />
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
                            title: 'Verification Code',
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

NewVerificationCodePage.propTypes = {
    campus: PropTypes.string,
    code: PropTypes.string,
    description: PropTypes.string,
    mentorTypes: PropTypes.array,
    status: PropTypes.string,
    statuses: PropTypes.array,
    onMentorTypeDropdownChanged: PropTypes.func,
    onStatusDropdownChanged: PropTypes.func,
    onChangeCode: PropTypes.func,
    onChangeDescription: PropTypes.func,
    save: PropTypes.func,
    cancel: PropTypes.func,
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object,
    verificationCode: PropTypes.object,
    verificationCodeDetails: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campus: state.userProps.user.campusName,
        code: state.code,
        description: state.description,
        status: state.status,
        verificationCode: state.verificationCode,
        verificationCodeDetails: state.verificationCodeDetails,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, adminActions, sharedActions, ajaxStatusActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewVerificationCodePage);