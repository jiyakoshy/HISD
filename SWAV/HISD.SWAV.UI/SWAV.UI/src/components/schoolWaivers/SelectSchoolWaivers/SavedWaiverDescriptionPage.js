import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as waiversActions from '../../../actions/waiversActions';
import * as waiverRequestFormActions from '../../../actions/waiverRequestFormActions';
import * as customWaiversActions from '../../../actions/customWaiversActions';
import { hashHistory } from 'react-router-dom';
import { HashRouter, Route } from 'react-router-dom';
import PageHeader from '../../common/PageHeader';
import MessagePage from '../../common/MessagePage';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import LinkFormatter from '../../common/formatters/linkFormatter';
import ActiveFormatter from '../../common/formatters/activeFormatter';
import If from '../../common/If';
import SavedListStructure from '../../schoolWaivers/ListStructure/SavedListStructure';
import Utilities from '../../../utilities/utilities';
import _ from 'lodash';
import Modal from 'react-modal';
import { MODAL_STYLES, DELETE_MODAL_STYLES, FINALIZE_MODAL_TEXT, SDMC_APPROVED, FACULTY_APPROVED, EMAIL_VALIDATION } from '../../../constants/constant';
import CommomDialogModal from '../../common/CommonModal/CommomDialogModal';
import FillSdmcInformation from '../../WaiverRequestDetailsForm/FillSdmcInformation';
import FillSsoInformation from '../../WaiverRequestDetailsForm/FillSsoInformation';
import SuccessConfirmationDialogModal from '../../common/CommonModal/SuccessConfirmationDialogModal';
import * as waiversConstants from '../../../constants/constant';


class WaiverDescriptionPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.callBackAddAction = this.callBackAddAction.bind(this);
        this.callBackUpdateCustomWaiver = this.callBackUpdateCustomWaiver.bind(this);
        this.callBackDeleteCustomWaiver = this.callBackDeleteCustomWaiver.bind(this);
        this.callBackCustomWaiverAction = this.callBackCustomWaiverAction.bind(this);
        this.addCustomWaiverCallBack = this.addCustomWaiverCallBack.bind(this);
        this.resetSchoolWaivers = this.resetSchoolWaivers.bind(this);
        this.editWavierCallBack = this.editWavierCallBack.bind(this);
        this.toggleAddModal = this.toggleAddModal.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.getFinalizeCallBack = this.getFinalizeCallBack.bind(this);
        this.toggleFinalizeModal = this.toggleFinalizeModal.bind(this);
        this.finalizeModalCallBack = this.finalizeModalCallBack.bind(this);
        this.sdmcModalCallBack = this.sdmcModalCallBack.bind(this);
        this.sdmcToggleeModal = this.sdmcToggleeModal.bind(this);
        this.facultyToggleModal = this.facultyToggleModal.bind(this);
        this.sdmcDetailsModalCallBack = this.sdmcDetailsModalCallBack.bind(this);
        this.sdmcDetailsToggleModal = this.sdmcDetailsToggleModal.bind(this);
        this.ssoDetailsModalCallBack = this.ssoDetailsModalCallBack.bind(this);
        this.ssoDetailsToggleModal = this.ssoDetailsToggleModal.bind(this);
        this.facultyModalCallBack = this.facultyModalCallBack.bind(this);
        this.successModal = this.successModal.bind(this);
        this.state = {
            selectedWaivers: [],
            showCustomWaiverModal : false,
            showEditModal : false,
            editModalDetails : '',
            showCustomFinalizeModal : false,
            sdmcModal: false,
            facultyModal: false,
            sdmcDetailsModal: false,
            sdmcDetails: '',
            ssoDetailsModal: false,
            showSuccessModal: false
        };
    }

    addCustomWaiverCallBack(){
        this.setState({ showCustomWaiverModal: true });
    }
    //Reset All Submitted School Waivers......
    resetSchoolWaivers(){
        const { campusNumber, startYear, campusName} = this.props;
        this.props.actions.resetSchoolWaiversAction(startYear, campusNumber).then(() => {
            this.props.history.push('/waiverDescription/' + campusNumber + '/' + campusName);
        }).catch(reason => {
            this.displayMessage('Error: Reset Waivers', 'There was a problem with resetting the School Waivers. Operation canceled. Please try again.');
        });
    }

    toggleFinalizeModal(value){
        this.setState({ showCustomFinalizeModal : value});
        const {campusNumber, campusName, status, formList, customSchoolWaivers} = this.props;
        if(!_.isEmpty(customSchoolWaivers) && _.isEmpty(formList)){
            this.setState({ sdmcModal : true});
        }else{
            this.props.history.push('/addWaiverRequestDetailsForm/general/' + campusNumber + '/' + campusName + '/' + status);
        }
    }

    finalizeModalCallBack(){
        const {campusNumber, campusName, status} = this.props;
        this.props.history.push('/addWaiverRequestDetailsForm/custom/' + campusNumber + '/' + campusName + '/' + status);
    }

    getFinalizeCallBack(){
        const {campusNumber, startYear, campusName, status, customSchoolWaivers, formList} = this.props;
        if(!_.isEmpty(customSchoolWaivers)){
          this.setState({ showCustomFinalizeModal : true});
        }else if(_.isEmpty(customSchoolWaivers) && _.isEmpty(formList)){
            this.setState({ sdmcModal: true });           
        }else{
            this.props.history.push('/addWaiverRequestDetailsForm/general/' + campusNumber + '/' + campusName + '/' + status);
        }
    }

    toggleAddModal(value) {
        this.setState({ showCustomWaiverModal: value });
        this.setState({ showEditModal: false });

    }

    editWavierCallBack(data){
        this.setState({ showEditModal: true, editModalDetails: data });
    }

    toggleEditModal(value) {
        this.setState({ showEditModal: value });
        this.setState({ showCustomWaiverModal: false });
    
    }

    successModal(val){
        const { campusNumber, campusName } = this.props.match.params;
        this.setState({ showSuccessModal : val});
        this.props.history.push('/SavedWaiverDescription/' + campusNumber + '/' + campusName);
    }
    
    sdmcModalCallBack() {
        this.setState({ sdmcModal: false });
        this.setState({ sdmcDetailsModal: true });
    }

    sdmcToggleeModal(value) {
        this.setState({ sdmcModal: value });
    }


    sdmcDetailsModalCallBack(data) {
        if(this.isValidSDMCDetails(data)){
            this.setState({ sdmcDetails: data });
            this.sdmcDetailsToggleModal(false);
            this.facultyToggleModal(true);
        }
    }

    sdmcDetailsToggleModal(value) {
        this.setState({ sdmcDetailsModal: value });
    }

    facultyModalCallBack() {
        this.setState({ facultyModal: false });
        this.setState({ ssoDetailsModal: true });
    }

    facultyToggleModal(value) {
        this.setState({ facultyModal: value });
    }

    ssoDetailsToggleModal(value) {
        this.setState({ ssoDetailsModal: value });
    }

    ssoDetailsModalCallBack() {
        const { ID, campusName } = this.props.match.params;
        const { currentYear } = this.props;
        const { sdmcDetails } = this.state;
        this.props.actions.finalizeWaiverRequestAction(ID, currentYear).then(()=>{
        this.props.actions.getSWAVAdminLoginIDAction(campusName);
        this.props.actions.addSDMCDetailsAction(ID, sdmcDetails);
        this.props.actions.updateAllActions(ID, currentYear, { ID, campusName });
        this.setState({ ssoDetailsModal : false, showSuccessModal : true});
        //this.props.history.push('/SavedWaiverDescription/' + ID + '/' + campusName);
        //this.ssoDetailsToggleModal(false);
        });       
    }

    componentDidMount() {
        const schoolYear = this.props.currentYear;
        const { ID, campusName } = this.props.match.params;
        this.props.actions.clearAction();
        this.props.actions.updateAllActions(ID, schoolYear, { ID, campusName }).then(()=>{
            this.props.actions.getAddRequestDetails(ID, schoolYear, 'gerneral');
            this.props.actions.getSSODetails(ID);
            this.props.actions.getSUPDetails(ID);
        });
    }
    showDialog() {
        this.setState({ hideDialog: false });
    }

    closeDialog() {
        this.setState({ hideDialog: true });
    }
    closeModal() {
        this.setState({ showReactModal: false });
    }
    okDialog() {
        this.closeDialog();
    }
    displayMessage(title, message, action) {
        this.setState({ title: title, subtext: message, dialogAction: action });
        this.showDialog();
    }

    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'black' }}>
                From {start} to {to}. Total: {total}&nbsp;&nbsp;
            </p>
        );
    }

    callBackAddAction(selectedPostItem, selectedPatchItem) {
        const { campusNumber, startYear, endYear, savedWaivers, currentYear, status } = this.props;
        const postPatchPayload = Utilities.postPatchPayload(selectedPostItem, selectedPatchItem, savedWaivers, { campusNumber, startYear, endYear, status });
        this.props.actions.savePatchWaiversAction(postPatchPayload, { campusNumber, startYear });
        const { ID, campusName } = this.props.match.params;
        this.props.actions.updateAllActions(ID, currentYear, { ID, campusName });
        this.props.actions.getAddRequestDetails(ID, startYear, 'gerneral');
        this.props.history.push('/SavedWaiverDescription/' + campusNumber + '/' + this.props.campusName);
    }
    isValidCustomWaiver(data) {
        const { waiverTitle, waiverDescription } = data;
        let isValid = true;
        if (waiverTitle == null || waiverTitle == "") {
            isValid = false;
            this.displayMessage('Error: Waiver Name', 'Waiver Name cannot be empty.');
            return isValid;
        }

        if (waiverDescription == null || waiverDescription == "") {
            isValid = false;
            this.displayMessage('Error: Waiver Description', 'Waiver description cannot be empty.');
            return isValid;
        }
        return isValid;
    }

    isValidSDMCDetails(data){
        const {name, email} = data;
        let isValid = true;
        if(name == null || name == ''){
            isValid = false;
            this.displayMessage('Error : SDMC Name','SDMC name cannot be empty');
            return isValid;
        }
        if(email == null || email == ''){
            isValid = false;
            this.displayMessage('Error : SDMC Email','SDMC email cannot be empty');
            return isValid;
        }
        if(!EMAIL_VALIDATION.test(email)){
            isValid = false;
            this.displayMessage('Error : SDMC Email','Please enter a valid emial address');
            return isValid;
        }
        return isValid;
    }

    callBackCustomWaiverAction(data) {
        const { startYear, endYear, schoolType, campusNumber, campusName, status, currentYear } = this.props;
        const { ID } = this.props.match.params;
        if (this.isValidCustomWaiver(data)) {
            this.props.actions.addCustomWaiverAction(data, { startYear, endYear, schoolType, campusNumber, status }).then(() => {
            this.toggleAddModal(false);
            this.props.actions.updateAllActions(ID, currentYear, { ID, campusName });
            this.props.history.push('/SavedWaiverDescription/' + campusNumber + '/' + campusName);
            });
        }
    }
    callBackUpdateCustomWaiver(data) {
        const { currentYear, campusNumber } = this.props;
        const { ID, campusName } = this.props.match.params;
        if (this.isValidCustomWaiver(data)) {
            this.props.actions.updateCustomWaiver(data).then(() => {
                this.props.actions.updateAllActions(ID, currentYear, { ID, campusName });
                this.toggleEditModal(false);
                this.props.history.push('/SavedWaiverDescription/' + campusNumber + '/' + campusName);
            }).catch(reason => {
                //this.props.actions.ajaxCallError();
                this.displayMessage('Error: Custom Waiver', 'There was a problem with updating this Waiver. Operation canceled. Please try again.');
                this.toggleEditModal(false);
            });
        }
    }
    callBackDeleteCustomWaiver(row) {
        const { currentYear, campusNumber } = this.props;
        const { ID, campusName } = this.props.match.params;
        this.props.actions.deleteCustomWaiverAction(row.SchoolWaiverID, this.props.startYear).then(() => {
            this.props.actions.updateAllActions(ID, currentYear, { ID, campusName });
            this.props.history.push('/SavedWaiverDescription/' + campusNumber + '/' + campusName);
        }).catch(reason => {
            //this.props.actions.ajaxCallError();
            this.displayMessage('Error: Custom Waiver', 'There was a problem with deleting this Waiver. Operation canceled. Please try again.');
        });
    }

    render() {
        const { savedWaivers, status, customSchoolWaivers, userRole, isAllowed } = this.props;
        const { selectedWaivers, showCustomWaiverModal, editModalDetails, showEditModal } = this.state;
        const loadAllSavedWaiversData = (data) => {
            return (
                <SavedListStructure
                    callBackCustomWaiverAction={this.callBackCustomWaiverAction}
                    callBackUpdateCustomWaiver={this.callBackUpdateCustomWaiver}
                    callBackDeleteCustomWaiver={this.callBackDeleteCustomWaiver}
                    isAllowed={isAllowed}
                    userRole={userRole}
                    status={status}
                    showCustomWaiverModal = {showCustomWaiverModal}
                    toggleAddModal = {this.toggleAddModal}
                    addCustomWaiverCallBack = {this.addCustomWaiverCallBack}
                    resetSchoolWaivers = {this.resetSchoolWaivers}
                    showEditModal = {showEditModal}
                    editModalDetails = {editModalDetails}
                    toggleEditModal = {this.toggleEditModal}
                    editWavierCallBack = {this.editWavierCallBack}
                    customSchoolWaivers={customSchoolWaivers}
                    selectedWaivers={selectedWaivers}
                    data={data}
                    callBackAddAction={this.callBackAddAction}
                    getFinalizeCallBack={this.getFinalizeCallBack} />
            );
        };

        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="Select School Waivers" schoolStatus={status} campusName={this.props.campusName} />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <div className="white-box">
                                <If test={savedWaivers}>
                                    {loadAllSavedWaiversData(savedWaivers)}
                                </If>
                            </div>
                        </div>
                    </div>
                    <Dialog
                        hidden={this.state.hideDialog}
                        onDismiss={this.closeDialog}
                        dialogContentProps={{
                            type: DialogType.normal,
                            title: this.state.title,
                            subText: this.state.subtext
                        }}
                        modalProps={{
                            isBlocking: true,
                            containerClassName: 'ms-dialogMainOverride'
                        }}>
                        <DialogFooter>
                            <PrimaryButton onClick={this.okDialog} text="Ok" styles={this.state.OkButtonStyle} />
                        </DialogFooter>
                    </Dialog>

                     <Modal
                        isOpen={this.state.showCustomFinalizeModal}
                        style={DELETE_MODAL_STYLES}
                     >
                     <CommomDialogModal
                        actionHandlerCallback={this.finalizeModalCallBack}
                        toggleModal={this.toggleFinalizeModal}
                        text={FINALIZE_MODAL_TEXT}
                     />
                     </Modal>

                      <Modal
                        isOpen={this.state.sdmcModal}
                        style={DELETE_MODAL_STYLES}
                    >
                        <CommomDialogModal
                            actionHandlerCallback={this.sdmcModalCallBack}
                            toggleModal={this.sdmcToggleeModal}
                            text={SDMC_APPROVED}
                        />
                    </Modal>

                    <Modal
                        isOpen={this.state.facultyModal}
                        style={DELETE_MODAL_STYLES}
                    >
                        <CommomDialogModal
                            actionHandlerCallback={this.facultyModalCallBack}
                            toggleModal={this.facultyToggleModal}
                            text={FACULTY_APPROVED}
                        />
                    </Modal>

                    <Modal
                        isOpen={this.state.sdmcDetailsModal}
                        style={MODAL_STYLES}
                    >
                        <FillSdmcInformation
                            actionHandlerCallback={this.sdmcDetailsModalCallBack}
                            toggleModal={this.sdmcDetailsToggleModal}
                        />
                    </Modal>
                    <Modal
                        isOpen={this.state.ssoDetailsModal}
                        style={MODAL_STYLES}
                    >
                        <FillSsoInformation
                            actionHandlerCallback={this.ssoDetailsModalCallBack}
                            ssoDetails={this.props.ssoDetails}
                            supDetails={this.props.supDetails}
                            toggleModal={this.ssoDetailsToggleModal}
                        />
                    </Modal>

                    <Modal
                        isOpen={this.state.showSuccessModal}
                        style={waiversConstants.MODAL_STYLES}
                    >
                        <SuccessConfirmationDialogModal
                            text={waiversConstants.SUCCESS_MODAL_TEXT}
                            toggleModal={this.successModal}
                        />
                    </Modal>
            
                </div>
            </div>
        );
    }
}

WaiverDescriptionPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    campuses: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.campuses.campusName,
        savedWaivers: state.campuses.savedWaiversList,
        customSchoolWaivers: state.campuses.customWaiversList,
        principalName: state.userProps.user.principalName,
        currentYear: state.campuses.userStartYear,
        endYear: state.campuses.userEndYear,
        status: state.campuses.status,
        campusNumber: state.campuses.campusNumber,
        startYear: state.campuses.userStartYear,
        userRole: state.userProps.user.role,
        isAllowed: state.campuses.isAllowed,
        schoolType: state.waiversReducer.schoolType,
        formList : state.waiverRequestReducer.get('list').toJS(),
        ssoDetails: state.campuses.ssoDetails,
        supDetails: state.campuses.supDetails
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, waiversActions, waiverRequestFormActions,customWaiversActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(WaiverDescriptionPage);
