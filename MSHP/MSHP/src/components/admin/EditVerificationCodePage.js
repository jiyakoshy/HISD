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

class EditVerificationCodePage extends React.Component {

    constructor(props, context) {
        super(props, context);
        const multiChoiceListItemID = this.props.match.params.MultiChoiceListItemID;
        if(!multiChoiceListItemID){
            this.props.actions.logErrorSuccess('Verification code ID not specified.');
            document.location = "#error";
        }
        
        this.state = {
            description: '',
            isNew: true,
            hideDialog: true,
            dialogAction: '',
            subtext: ''
        };
        this.onChangeDescription = this.onChangeDescription.bind(this);
      
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.delete = this.delete.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        this.onSavingSucceeds = this.onSavingSucceeds.bind(this);
    }

    componentDidMount(){
        const multiChoiceListItemID = this.props.match.params.MultiChoiceListItemID;
        this.props.actions.loadVerificationCodeDetails(multiChoiceListItemID);
    }

    onSavingSucceeds(){
        this.displayMessage('Activity code successfully saved.', 'SAVED');
    }

    save() {
        const multiChoiceListItemID = this.props.match.params.MultiChoiceListItemID;
        let verificationCodeDetails = {MultiChoiceListItemID: multiChoiceListItemID, MultiChoiceListItemDescription: this.state.description.trim()}; 
        if(this.isValidForm()){
            let promise = this.props.actions.updateVerificationCodeDetails(verificationCodeDetails);
            promise.then(() => this.onSavingSucceeds())
            .catch(reason => {
                this.props.actions.ajaxCallError();
                this.setState({ subtext: 'There was a problem saving this verification code details. Operation canceled.', dialogAction: '' });
                this.showDialog();
            });
        }
    }

    isValidForm(){
        let isValid = true;
        if(this.state.description.length < 3){
            isValid = false;
            this.displayMessage('Error: Invalid Verification Code Description. It must contain at least three characters', '');
        }
        
        return isValid;
    }

    cancel() {
        document.location = '#admin-verificationcodes';
    }

    delete(){
        this.setState({ subtext: 'Do you want to delete this Verification Code?', dialogAction: 'DELETE' });
        this.showDialog();
    }

    okDialog(){
        this.closeDialog();  
        if(this.state.dialogAction == 'DELETE')
            this.deleteVerificationCode();
        else if(this.state.dialogAction == 'SAVED')
            this.cancel();  
    }

    deleteVerificationCode(){
        const multiChoiceListItemID = this.props.match.params.MultiChoiceListItemID;
        let promise = this.props.actions.deleteVerificationCodeDetails(multiChoiceListItemID);
        promise.then(() => this.displayMessage('Verification Code successfully deleted.', 'SAVED'))
        .catch(reason => {
            this.props.actions.ajaxCallError();
            this.displayMessage('There was a problem deleting this verification code. Operation canceled.', '');
        });
    }

    displayMessage(message, action){
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    showDialog() {
      this.setState({ hideDialog: false });
    }
  
    closeDialog() {
      this.setState({ hideDialog: true });
    }

    onStatusDropdownChanged(item) {
        this.setState({status: item.key});
    }

    onChangeDescription(e) {
        this.setState({description: e.target.value});
    }

    render() {
        const multiChoiceListItemID = this.props.match.params.MultiChoiceListItemID;
        if(this.state.isNew == true && this.state.description === '' && this.props.verificationCodeDetails.MultiChoiceListItemDescription != undefined && multiChoiceListItemID == this.props.verificationCodeDetails.MultiChoiceListItemID){
            this.setState({description: this.props.verificationCodeDetails.MultiChoiceListItemDescription});
            this.setState({isNew: false});
        }
        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Verification Code" campus={this.props.campus} />
                        <div className="row">
                            <div className="col-md-8 col-lg-8 col-sm-12">
                                <div className="white-box">
                                    <form className="form">
                                        <div className="form-group">
                                            <label>Code</label>
                                            <input id="code" className="form-control" type="text" value={this.props.verificationCodeDetails.MultiChoiceListItemCode} readOnly />
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
                            title: 'Verification Code',
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

EditVerificationCodePage.propTypes = {
    campus: PropTypes.string,
    code: PropTypes.string,
    description: PropTypes.string,
    onStatusDropdownChanged: PropTypes.func,
    onChangeDescription: PropTypes.func,
    save: PropTypes.func,
    cancel: PropTypes.func,
    actions: PropTypes.object.isRequired,
    verificationCodeDetails: PropTypes.object,
    match: PropTypes.object,
    params: PropTypes.array,
    userProps: PropTypes.object,
    multiChoiceListItemID: PropTypes.string
};

function mapStateToProps(state, ownProps) {
    return {
        campus: state.userProps.user.campusName,
        multiChoiceListItemID: ownProps.match.params.MultiChoiceListItemID,
        verificationCodeDetails: state.verificationCodeDetails,
        userProps: state.userProps,
        description: state.activityCode.ActivityCodeDescription
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, adminActions, sharedActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditVerificationCodePage);