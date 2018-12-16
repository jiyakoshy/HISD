import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as customWaiversActions from '../../actions/customWaiversActions';
import * as waiverRequestFormActions from '../../actions/waiverRequestFormActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import MessagePage from '../common/MessagePage';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import LinkFormatter from '../common/formatters/linkFormatter';
import * as waiversConstants from '../../constants/constant';
import Utilities from '../../utilities/utilities';
import FillWaiverInformation from './FillWaiverInformation';
import CommomDialogModal from '../common/CommonModal/CommomDialogModal';
import FillSdmcInformation from './FillSdmcInformation';
import FillSsoInformation from './FillSsoInformation';
import EditFilledWaiverInformation from './EditFilledWaiverInformation';
import SuccessConfirmationDialogModal from '../common/CommonModal/SuccessConfirmationDialogModal';
import Modal from 'react-modal';
import { EMAIL_VALIDATION } from '../../constants/constant';
import _ from 'lodash';

class AddWaiverRequestDetailsForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.addActionFormat = this.addActionFormat.bind(this);
        this.toggleAddModal = this.toggleAddModal.bind(this);
        this.addWaiversInfoCallBack = this.addWaiversInfoCallBack.bind(this);
        this.sdmcModalCallBack = this.sdmcModalCallBack.bind(this);
        this.sdmcToggleeModal = this.sdmcToggleeModal.bind(this);
        this.facultyToggleModal = this.facultyToggleModal.bind(this);
        this.sdmcDetailsModalCallBack = this.sdmcDetailsModalCallBack.bind(this);
        this.sdmcDetailsToggleModal = this.sdmcDetailsToggleModal.bind(this);
        this.ssoDetailsModalCallBack = this.ssoDetailsModalCallBack.bind(this);
        this.ssoDetailsToggleModal = this.ssoDetailsToggleModal.bind(this);
        this.facultyModalCallBack = this.facultyModalCallBack.bind(this);
        this.successModal = this.successModal.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.updateWaiversInfoCallBack = this.updateWaiversInfoCallBack.bind(this);
        this.editFormFormat = this.editFormFormat.bind(this);
        this.state = {
            hideDialog: true,
            dialogAction: '',
            confirmation: false,
            showModal: false,
            showWaiverInfoModal: false,
            waiverInfoData: '',
            requestFormList: [],
            wavierInforArr: [],
            sdmcModal: false,
            facultyModal: false,
            sdmcDetailsModal: false,
            sdmcDetails: '',
            formListLength: 0,
            ssoDetailsModal: false,
            showSuccessModal: false,
            editWaiverInfoModal : false,
            editWaiverInfoData : {}
        };
    }

    componentDidMount() {
        const { campusNumber, type } = this.props.match.params;
        const { currentYear,list } = this.props;
        this.props.actions.getAddRequestDetails(campusNumber, currentYear, type).then(() => {
            this.setState({
                formListLength: this.props.formList.length
            });
            this.props.formList.length == 0 && this.nextButtonHandler();
        });
    }

    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'black' }}>
                From {start} to {to}. Total: {total}&nbsp;&nbsp;
            </p>
        );
    }
    formatWaiverDescription(cell, row) {
        return (
            <div className="waiver-description">
                <span className="waiver-description-heading">{row.WaiverName}</span>
                {row.WaiverDescription}
            </div>
        );
    }
    formatWaiverDsptn(cell, row){
        return (
            <div className="waiver-description">
                <span className="waiver-description-heading">{row.waiverTitle}</span>
                {row.waiverDsptn}
            </div>
        ); 
    }

    editForm(row){
        this.setState({ editWaiverInfoModal : true, editWaiverInfoData : row})
    }

    editFormFormat(cell, row) {
        return (
            <span className="glyphicon glyphicon-pencil" onClick={() => { this.editForm(row) }} style={{ color: '#008CBA', cursor: 'pointer' }}></span>
        );
    }

    toggleEditModal(val){
        this.setState({ editWaiverInfoModal : val});
    }

    updateWaiversInfoCallBack(data){
        if(this.isValidWaiverRequestDetails(data)){
            const { wavierInforArr } = this.state;
            _.remove(wavierInforArr, { waiverID: data.waiverID });
            wavierInforArr.push(data);
            this.toggleEditModal(false);
        }   
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

    facultyModalCallBack() {
        this.setState({ facultyModal: false });
        this.setState({ ssoDetailsModal: true });
    }

    facultyToggleModal(value) {
        this.setState({ facultyModal: value });
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

    ssoDetailsToggleModal(value) {
        this.setState({ ssoDetailsModal: value });
    }

    ssoDetailsModalCallBack() {
        const { wavierInforArr, sdmcDetails } = this.state;
        const { campusNumber, campusName } = this.props.match.params;
        const data = Object.assign([{}], wavierInforArr);

        this.props.actions.submitWaiverRequestAction(data).then(()=>{
            this.props.actions.finalizeWaiverRequestAction(campusNumber, this.props.currentYear);
            this.props.actions.addSDMCDetailsAction(campusNumber, sdmcDetails);
            this.props.actions.getSWAVAdminLoginIDAction(campusName);
            this.setState({ ssoDetailsModal : false, showSuccessModal : true});   
        });      
    }

    showWaiverInfo(row) {
        this.setState({ showWaiverInfoModal: true, waiverInfoData: row });
    }

    addActionFormat(cell, row) {
        return (
            <span onClick={() => this.showWaiverInfo(row)} className="glyphicon glyphicon-plus" style={{ color: 'green', cursor: 'pointer', fontSize: '20px' }}></span>
        );
    }

    toggleAddModal(value) {
        this.setState({ showWaiverInfoModal: value });
    }

    addWaiversInfoCallBack(data) {
        if (this.isValidWaiverRequestDetails(data)) {
            const { wavierInforArr, requestFormList } = this.state;
            this.props.actions.removeRequestList(data.waiverID);
            wavierInforArr.push(data);
            this.toggleAddModal(false);
        }
    }
    isValidWaiverRequestDetails(data) {
        const { evidence, sourceData } = data;
        let isValid = true;
        if (sourceData == null || sourceData == "") {
            isValid = false;
            this.displayMessage('Error: Source of Data', 'Source of Data cannot be empty.');
            return isValid;
        }
        if (evidence == null || evidence == "") {
            isValid = false;
            this.displayMessage('Error: Evidence of Complaince', 'Evidence of Complaince cannot be empty.');
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

    nextButtonHandler() {
        this.setState({ sdmcModal: true });
    }
    cancelButtonHandler(){
        const { campusNumber, campusName } = this.props.match.params;
        this.props.history.replace('/SavedWaiverDescription/' + campusNumber + '/' + campusName);
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

    render() {
        const options = {
            defaultSortName: 'WaiverName',
            sortOrder: 'asc',
            prePage: 'Prev',
            nextPage: 'Next',
            firstPage: 'First',
            lastPage: 'Last',
            paginationShowsTotal: this.renderShowsTotal
        };
        const { status, campusName } = this.props.match.params;

        const enableNextButton = () => {
            const { wavierInforArr, formListLength } = this.state;
            let disabled = true;

            if (!_.isEmpty(wavierInforArr)) {
                disabled = wavierInforArr.length == formListLength;
                return !disabled;
            }
            return disabled;
        };
        const { requestFormList } = this.state;
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="Waiver Request Details Form" isDisabled={true} schoolStatus={status} campusName={campusName} />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <div className="white-box">
                                <BootstrapTable data={this.props.formList} hover striped condensed
                                    pagination options={options} search>
                                    <TableHeaderColumn row="0" colSpan="2" dataAlign="center"
                                        thStyle={{ backgroundColor: '#458ab6', color: '#ffffff' }}>
                                        Fill out Waiver Request Details Form</TableHeaderColumn>
                                    <TableHeaderColumn row="1"
                                        dataField="SchoolWaiverID" hidden={true} isKey dataAlign="left"
                                        width={"100px"}>ID</TableHeaderColumn>
                                    <TableHeaderColumn row="1" dataField="WaiverName"
                                        dataFormat={this.formatWaiverDescription} dataSort dataAlign="left"
                                        thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                        tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                        Waiver Description</TableHeaderColumn>
                                    <TableHeaderColumn row="1" dataField="SchoolWaiverID"
                                        dataAlign="center" dataFormat={this.addActionFormat} width={"80px"}
                                        thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                        tdStyle={{ verticalAlign: 'middle' }}>
                                        Fill Form</TableHeaderColumn>
                                </BootstrapTable>

                                <BootstrapTable data={this.state.wavierInforArr}>
                                    <TableHeaderColumn row="0" colSpan="4" dataAlign="center"
                                        thStyle={{ backgroundColor: '#458ab6', color: '#ffffff' }}>
                                        Filled Waiver Request Details Form</TableHeaderColumn>
                                    <TableHeaderColumn row="1"
                                        dataField="waiverID" hidden={true} isKey dataAlign="left"
                                        width={"100px"}>ID</TableHeaderColumn>
                                    <TableHeaderColumn row="1" dataField="waiverTitle"
                                        dataFormat={this.formatWaiverDsptn} dataSort dataAlign="left"
                                        thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                        tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                        Waiver Name</TableHeaderColumn>
                                    <TableHeaderColumn row="1" dataField="sourceData"
                                        dataSort dataAlign="left" width={"200px"}
                                        thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                        tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                        Source of Data</TableHeaderColumn>
                                    <TableHeaderColumn row="1" dataField="evidence"
                                        dataSort dataAlign="left" width={"200px"}
                                        thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                        tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                        Evidence of Complaince</TableHeaderColumn> 
                                    <TableHeaderColumn row="1" dataFormat={this.editFormFormat} dataField="waiverID"
                                         dataAlign="left" width={"50px"}  tdStyle={{ verticalAlign: 'middle' }}                                  >
                                        Edit</TableHeaderColumn>                                                                       
                                </BootstrapTable>
                                <div className="row">
                                    <div className="col-md-12 col-lg-12 col-sm-12 text-right">
                                        <PrimaryButton text="Next" onClick={() => this.nextButtonHandler()} disabled={enableNextButton()} />
                                        <DefaultButton text="Cancel" className="pull-left" onClick={() => this.cancelButtonHandler()}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal
                        isOpen={this.state.showWaiverInfoModal}
                        style={waiversConstants.MODAL_STYLES}
                    >
                        <FillWaiverInformation
                            data={this.state.waiverInfoData}
                            toggleAddModal={this.toggleAddModal}
                            addWaiversInfoCallBack={this.addWaiversInfoCallBack}
                        />
                    </Modal>

                    <Modal
                        isOpen={this.state.editWaiverInfoModal}
                        style={waiversConstants.MODAL_STYLES}
                    >
                        <EditFilledWaiverInformation
                            data={this.state.editWaiverInfoData}
                            toggleEditModal={this.toggleEditModal}
                            updateWaiversInfoCallBack={this.updateWaiversInfoCallBack}
                        />
                    </Modal>

                    <Modal
                        isOpen={this.state.sdmcModal}
                        style={waiversConstants.DELETE_MODAL_STYLES}
                    >
                        <CommomDialogModal
                            actionHandlerCallback={this.sdmcModalCallBack}
                            toggleModal={this.sdmcToggleeModal}
                            text={waiversConstants.SDMC_APPROVED}
                        />
                    </Modal>

                    <Modal
                        isOpen={this.state.facultyModal}
                        style={waiversConstants.DELETE_MODAL_STYLES}
                    >
                        <CommomDialogModal
                            actionHandlerCallback={this.facultyModalCallBack}
                            toggleModal={this.facultyToggleModal}
                            text={waiversConstants.FACULTY_APPROVED}
                        />
                    </Modal>

                    <Modal
                        isOpen={this.state.sdmcDetailsModal}
                        style={waiversConstants.MODAL_STYLES}
                    >
                        <FillSdmcInformation
                            actionHandlerCallback={this.sdmcDetailsModalCallBack}
                            toggleModal={this.sdmcDetailsToggleModal}
                        />
                    </Modal>
                    <Modal
                        isOpen={this.state.ssoDetailsModal}
                        style={waiversConstants.MODAL_STYLES}
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
                </div>
            </div>
        );
    }
}

AddWaiverRequestDetailsForm.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    campuses: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        currentYear: state.campuses.userStartYear,
        userRole: state.userProps.user.role,
        ssoDetails: state.campuses.ssoDetails,
        supDetails: state.campuses.supDetails,
        formList : state.waiverRequestReducer.get('list').toJS()
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({},customWaiversActions, waiverRequestFormActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddWaiverRequestDetailsForm);
