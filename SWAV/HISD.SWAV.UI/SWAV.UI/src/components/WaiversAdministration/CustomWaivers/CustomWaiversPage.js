import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as customWaiversActions from '../../../actions/customWaiversActions';
import * as campusActions from '../../../actions/campusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../../common/PageHeader';
import MessagePage from '../../common/MessagePage';
import ErrorPage from '../../common/ErrorPage';
import { IfAnyGranted } from 'react-authorization';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import If from '../../common/If';
import Modal from 'react-modal';
import EditCustomWaiver from './EditCustomWaiver';
import CustomWaiverDeleteDialog from '../../common/CommonModal/CustomWaiverDeleteDialog';
import CustomWaiverRejectDialog from '../../common/CommonModal/CustomWaiverRejectDialog';
import {
    MODAL_STYLES,
    DELETE_MODAL_STYLES,
    DELETE_MODAL_HEADING,
    DELETE_MODAL_TEXT,
    APPROVE_MODAL_HEADING,
    APPROVE_MODAL_TEXT,
    REJECT_MODAL_TEXT,
    REJECT_MODAL_STYLES,
    APPROVE_BUTTON
} from '../../../constants/constant';

class CustomWaiversPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.deleteWaiversFormat = this.deleteWaiversFormat.bind(this);
        this.customApprovalFormat = this.customApprovalFormat.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
        this.toggleApproveModal = this.toggleApproveModal.bind(this);
        this.updateCustomWaiverCallBack = this.updateCustomWaiverCallBack.bind(this);
        this.deleteCustomWaiverCallBack = this.deleteCustomWaiverCallBack.bind(this);
        this.editWaiversFormat = this.editWaiversFormat.bind(this);
        this.approveCustomWaiverCallBack = this.approveCustomWaiverCallBack.bind(this);
        this.toggleRejectModal = this.toggleRejectModal.bind(this);
        this.rejectCustomWaiverCallBack = this.rejectCustomWaiverCallBack.bind(this);
        this.state = {
            hideDialog: true,
            dialogAction: '',
            confirmation: false,
            showModal: false,
            showEditWaiverFlag: false,
            showDeleteWaiverFlag: false,
            editModalDetails: '',
            deleteModalDetails: '',
            showEditModal: false,
            showDeleteModal: false,
            showApprovalModal: false,
            approvalModalDetails: '',
            showRejectModal: false,
            rejectModalData: ''
        };
    }
    rejectCustomWaiverCallBack(comment) {
        const { rejectModalData } = this.state;
        this.props.actions.rejectCustomWaiverAction(rejectModalData.SchoolWaiverID, this.props.startYear).then(() => {
            this.props.actions.getEmailLoginID(rejectModalData,comment);
            this.displayMessage('Custom Waiver', 'Waiver has been rejected.');
            this.toggleRejectModal(false);
        }).catch(reason => {
            this.displayMessage('Error: Custom Waiver', 'There was a problem with rejecting this Waiver. Operation canceled. Please try again.');
            this.toggleRejectModal(false);
        });
    }
    componentDidMount() {
        this.props.actions.getCurrentSchoolYearAction().then(()=>{
            this.props.actions.loadAllCampuses().then(()=>{
                this.props.actions.getCustomWaiversAction(this.props.startYear);
            });
        });
    }
    editWaiver(row) {
        this.setState({ showEditModal: true, editModalDetails: row });
    }
    deleteWaiver(row) {
        this.setState({ showDeleteModal: true, deleteModalDetails: row });
    }
    approvedStatus(row) {
        this.setState({ showApprovalModal: true, approvalModalDetails: row });
    }
    rejectStatus(row) {
        this.setState({ showRejectModal: true, rejectModalData: row });
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
    updateCustomWaiverCallBack(data) {
        const { startYear, endYear } = this.props;
        if (this.isValidCustomWaiver(data)) {
            this.props.actions.updateCustomWaiverAction(data, startYear, endYear).then(() => {
                this.displayMessage('Custom Waiver', 'Waiver has been updated successfully.');
                this.toggleEditModal(false);
            }).catch(reason => {
                this.displayMessage('Error: Custom Waiver', 'There was a problem with updating this Waiver. Operation canceled. Please try again.');
                this.toggleEditModal(false);
            });
        }
    }
    deleteCustomWaiverCallBack(row) {
        this.props.actions.deleteCustomWaiverAction(row.SchoolWaiverID, this.props.startYear).then(() => {
            this.displayMessage('Custom Waiver', 'Waiver has been deleted successfully.');
            this.toggleDeleteModal(false);
        }).catch(reason => {
            this.displayMessage('Error: Custom Waiver', 'There was a problem with deleting this Waiver. Operation canceled. Please try again.');
            this.toggleDeleteModal(false);
        });
    }
    approveCustomWaiverCallBack(row) {
        this.props.actions.approveCustomWaiverAction(row.SchoolWaiverID, this.props.startYear).then(() => {
            this.props.actions.getApprovalEmailLoginID(row);
            this.displayMessage('Custom Waiver', 'Waiver has been approved successfully.');
            this.toggleApproveModal(false);
        }).catch(reason => {
            this.displayMessage('Error: Custom Waiver', 'There was a problem with approving this Waiver. Operation canceled. Please try again.');
            this.toggleApproveModal(false);
        });
    }
    toggleEditModal(value) {
        this.setState({ showEditModal: value });
        this.setState({ showDeleteModal: false });
        this.setState({ showApprovalModal: false });
        this.setState({ showRejectModal: false });
    }
    toggleDeleteModal(value) {
        this.setState({ showDeleteModal: value });
        this.setState({ showEditModal: false });
        this.setState({ showApprovalModal: false });
        this.setState({ showRejectModal: false });
    }
    toggleApproveModal(value) {
        this.setState({ showApprovalModal: value });
        this.setState({ showEditModal: false });
        this.setState({ showDeleteModal: false });
        this.setState({ showRejectModal: false });
    }
    toggleRejectModal(value) {
        this.setState({ showRejectModal: value });
        this.setState({ showEditModal: false });
        this.setState({ showDeleteModal: false });
        this.setState({ showApprovalModal: false });
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
    formatWaiverDescription(cell, row) {
        return (
            <div className="waiver-description">
                <span className="waiver-description-heading">{row.WaiverName}</span>
                {row.WaiverDescription}
            </div>
        );
    }
    editWaiversFormat(cell, row) {
        return (
            <span className="glyphicon glyphicon-pencil" style={{ color: '#008CBA', cursor: 'pointer' }} onClick={() => { this.editWaiver(row) }}></span>
        );
    }
    deleteWaiversFormat(cell, row) {
        return (
            <span className="glyphicon glyphicon-trash" style={{ color: 'red', cursor: 'pointer' }} onClick={() => { this.deleteWaiver(row) }}></span>
        );
    }
    customApprovalFormat(cell, row) {
        if (row.CustomApprovalStatus == '1') {
            return (
                <span> Approved </span>
            );
        }
        else if (row.CustomApprovalStatus == '2') {
            return (
                <span> Rejected </span>
            );
        }
        return (
            <div>
                <div>
                    <span onClick={() => this.approvedStatus(row)} className="glyphicon glyphicon-ok" style={{ color: 'green', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold', fontSize: 'larger' }}>Approve</span>
                </div>
                <div>
                    <span onClick={() => this.rejectStatus(row)} className="glyphicon glyphicon-remove" style={{ color: 'red', cursor: 'pointer', fontWeight: 'bold', fontSize: 'larger' }}>Reject</span>
                </div>
            </div>
        );
    }
    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'black' }}>
                From {start} to {to}. Total: {total}&nbsp;&nbsp;
            </p>
        );
    }

    render() {
        const options = {
            defaultSortName: 'NameOfInstitution',
            sortOrder: 'asc',
            prePage: 'Prev',
            nextPage: 'Next',
            firstPage: 'First',
            lastPage: 'Last',
            paginationShowsTotal: this.renderShowsTotal
        };
        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Custom Waiver Administration" campus={this.props.campusName} />
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div className="white-box">
                                    <BootstrapTable data={this.props.list} hover striped condensed pagination options={options} search>
                                        <TableHeaderColumn dataField="SchoolWaiverID" hidden={true}
                                            isKey dataAlign="left">ID</TableHeaderColumn>
                                        <TableHeaderColumn tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word', verticalAlign: 'middle', fontWeight: 'bold'}}
                                            dataSort width={"100px"} dataField="NameOfInstitution" dataAlign="center"
                                        >Campus</TableHeaderColumn>
                                        <TableHeaderColumn dataField="WaiverName" dataFormat={this.formatWaiverDescription}
                                            dataSort dataAlign="left" thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                            tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>Waiver Description</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ReportType"
                                            dataSort dataAlign="center" width={"100px"} tdStyle={{ verticalAlign: 'middle' }}>Report Type</TableHeaderColumn>
                                        <TableHeaderColumn dataField="WaiverID"
                                            dataFormat={this.editWaiversFormat} dataAlign="center" width={"50px"}
                                            tdStyle={{ verticalAlign: 'middle' }}>Edit</TableHeaderColumn>
                                        <TableHeaderColumn dataField="SchoolWaiverID"
                                            dataFormat={this.deleteWaiversFormat} dataAlign="center" width={"50px"}
                                            tdStyle={{ verticalAlign: 'middle' }}>Delete</TableHeaderColumn>
                                        <TableHeaderColumn dataField="SchoolWaiverID"
                                            thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                            dataFormat={this.customApprovalFormat} dataAlign="center" width={"80px"}
                                            tdStyle={{ verticalAlign: 'middle', fontWeight: 'bold' }}>Approval Status</TableHeaderColumn>
                                    </BootstrapTable>
                                </div>

                            </div>
                        </div>
                        <Modal
                            isOpen={this.state.showEditModal}
                            style={MODAL_STYLES}
                        >
                            <EditCustomWaiver
                                updateCustomWaiverCallBack={this.updateCustomWaiverCallBack}
                                data={this.state.editModalDetails}
                                toggleEditModal={this.toggleEditModal}
                            />
                        </Modal>
                        <Modal
                            isOpen={this.state.showDeleteModal}
                            style={DELETE_MODAL_STYLES}
                        >
                            <CustomWaiverDeleteDialog
                                heading={DELETE_MODAL_HEADING}
                                text={DELETE_MODAL_TEXT}
                                deleteCustomWaiverCallBack={this.deleteCustomWaiverCallBack}
                                data={this.state.deleteModalDetails}
                                toggleDeleteModal={this.toggleDeleteModal}
                            />
                        </Modal>
                        <Modal
                            isOpen={this.state.showApprovalModal}
                            style={DELETE_MODAL_STYLES}
                        >
                            <CustomWaiverDeleteDialog
                                heading={APPROVE_MODAL_HEADING}
                                text={APPROVE_MODAL_TEXT}
                                deleteCustomWaiverCallBack={this.approveCustomWaiverCallBack}
                                data={this.state.approvalModalDetails}
                                toggleDeleteModal={this.toggleApproveModal}
                                buttonText={APPROVE_BUTTON}
                            />
                        </Modal>

                        <Modal
                            isOpen={this.state.showRejectModal}
                            style={REJECT_MODAL_STYLES}
                        >
                            <CustomWaiverRejectDialog
                                heading={APPROVE_MODAL_HEADING}
                                text={REJECT_MODAL_TEXT}
                                toggleDeleteModal={this.toggleRejectModal}
                                data={this.state.rejectModalData}
                                rejectCustomWaiverCallBack={this.rejectCustomWaiverCallBack}
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
            </IfAnyGranted>
        );
    }
}
CustomWaiversPage.propTypes = {
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
        campusName: state.userProps.user.campusName,
        principalName: state.userProps.user.principalName,
        userRole: state.userProps.user.role,
        list: state.campuses.waviersList,
        userProps: state.userProps,
        startYear: state.campuses.userStartYear,
        endYear: state.campuses.userEndYear
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({},campusActions, customWaiversActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomWaiversPage);