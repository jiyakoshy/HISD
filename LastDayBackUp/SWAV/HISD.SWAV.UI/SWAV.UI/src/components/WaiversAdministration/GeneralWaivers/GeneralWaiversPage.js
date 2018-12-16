import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as generalWaiversActions from '../../../actions/generalWaiversActions';
import * as campusActions from '../../../actions/campusActions';
import { ajaxCallError } from '../../../actions/ajaxStatusActions';
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
import AddGeneralWaiver from './AddGeneralWaiver';
import EditGeneralWaiver from './EditGeneralWaiver';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import ConfimationDialogModal from '../../common/CommonModal/ConfimationDialogModal';
import { MODAL_STYLES, DELETE_MODAL_STYLES, DELETE_MODAL_HEADING, DELETE_MODAL_TEXT } from '../../../constants/constant';

class GeneralWaiversPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.deleteWaiversFormat = this.deleteWaiversFormat.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.toggleAddModal = this.toggleAddModal.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
        this.showAddWavierModal = this.showAddWavierModal.bind(this);
        this.saveGeneralWaiverCallBack = this.saveGeneralWaiverCallBack.bind(this);
        this.editWaiversFormat = this.editWaiversFormat.bind(this);
        this.updateGeneralWaiverCallBack = this.updateGeneralWaiverCallBack.bind(this);
        this.deleteGeneralWaiverCallBack = this.deleteGeneralWaiverCallBack.bind(this);
        this.state = {
            hideDialog: true,
            dialogAction: '',
            confirmation: false,
            showModal: false,
            showAddWaiverFlag: false,
            showEditWaiverFlag: false,
            showDeleteWaiverFlag: false,
            editModalDetails: '',
            deleteModalDetails: '',
            showAddModal: false,
            showEditModal: false,
            showDeleteModal: false
        };
    }

    saveGeneralWaiverCallBack(data) {
        const { startYear, endYear } = this.props;
        if (this.isValidGeneralWaiver(data)) {
            this.props.actions.addGeneralWaiverAction(data, startYear, endYear).then(() => {
                this.displayMessage('General Waiver', 'Waiver has been added successfully.');
                this.toggleAddModal(false);
            }).catch(reason => {
                this.displayMessage('Error: General Waiver', 'There was a problem with saving this Waiver. Operation canceled. Please try again.');
                this.toggleAddModal(false);
            });
        }
    }

    isValidGeneralWaiver(data) {
        const { waiverTitle, waiverDescription, elementaryChecked, highChecked, middleChecked } = data;
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

        if (!elementaryChecked && !highChecked && !middleChecked) {
            isValid = false;
            this.displayMessage('Error: Waiver School Type', 'Please select atleast one school type(ES or MS or HS)');
            return isValid;
        }
        return isValid;
    }

    updateGeneralWaiverCallBack(data) {
        const { startYear, endYear } = this.props;
        if (this.isValidGeneralWaiver(data)) {
            this.props.actions.updateGeneralWaiverAction(data, startYear, endYear).then(() => {
                this.displayMessage('General Waiver', 'Waiver has been updated successfully.');
                this.toggleEditModal(false);
            }).catch(reason => {
                this.displayMessage('Error: General Waiver', 'There was a problem with updating this Waiver. Operation canceled. Please try again.');
                this.toggleEditModal(false);
            });
        }
    }
    toggleAddModal(value) {
        this.setState({ showAddModal: value });
        this.setState({ showEditModal: false });
        this.setState({ showDeleteModal: false });
    }

    toggleEditModal(value) {
        this.setState({ showEditModal: value });
        this.setState({ showAddModal: false });
        this.setState({ showDeleteModal: false });
    }

    toggleDeleteModal(value) {
        this.setState({ showDeleteModal: value });
        this.setState({ showEditModal: false });
        this.setState({ showAddModal: false });
    }

    showAddWavierModal() {
        this.setState({ showAddModal: true });
    }
    componentDidMount() {
        this.props.actions.getCurrentSchoolYearAction().then(() => {
            this.props.actions.getGeneralWaiversAction(this.props.startYear);
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
            <span className="glyphicon glyphicon-pencil" onClick={() => { this.editWaiver(row); }} style={{ color: '#008CBA', cursor: 'pointer' }}></span>
        );
    }

    deleteWaiver(row) {
        this.setState({ showDeleteModal: true, deleteModalDetails: row });
    }
    deleteGeneralWaiverCallBack(row) {
        this.props.actions.deleteGeneralWaiverAction(row.WaiverAdministrationID, this.props.startYear).then(() => {
            this.displayMessage('General Waiver', 'Waiver has been deleted successfully.');
            this.toggleDeleteModal(false);
        }).catch(reason => {
            this.displayMessage('Error: General Waiver', 'There was a problem with deleting this Waiver. Operation canceled. Please try again.');
            this.toggleDeleteModal(false);
        });
    }

    editWaiver(row) {
        this.setState({ showEditModal: true, editModalDetails: row });
    }

    deleteWaiversFormat(cell, row) {

        return (
            <span className="glyphicon glyphicon-trash" style={{ color: 'red', cursor: 'pointer' }} onClick={() => { this.deleteWaiver(row); }}></span>
        );
    }

    elementaryFormat(cell, row) {
        if (row.Elementary) {
            return (
                <span className="glyphicon glyphicon-ok"></span>
            );
        }
    }

    middleFormat(cell, row) {
        if (row.Middle) {
            return (
                <span className="glyphicon glyphicon-ok"></span>
            );
        }
    }

    highFormat(cell, row) {
        if (row.High) {
            return (
                <span className="glyphicon glyphicon-ok"></span>
            );
        }
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
        const { showAddWaiverFlag, showEditWaiverFlag, showDeleteWaiverFlag } = this.state;
        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="General Waiver Administration" campus={this.props.campusName} />
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div className="white-box">
                                    <div className="row">
                                        <div className="col-md-12 col-lg-12 col-sm-12">
                                            <PrimaryButton text="Add Waiver" onClick={() => this.showAddWavierModal()} />
                                        </div>
                                    </div>
                                    <BootstrapTable data={this.props.list} hover striped condensed pagination options={options} search>
                                        <TableHeaderColumn dataField="WaiverAdministrationID" hidden={true}
                                            isKey dataAlign="left" width={"100px"}>ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="Elementary"
                                            dataFormat={this.elementaryFormat} dataAlign="center" width={"50px"} tdStyle={{ verticalAlign: 'middle' }}>ES</TableHeaderColumn>
                                        <TableHeaderColumn dataField="Middle"
                                            dataFormat={this.middleFormat} dataAlign="center" width={"50px"} tdStyle={{ verticalAlign: 'middle' }}>MS</TableHeaderColumn>
                                        <TableHeaderColumn dataField="High"
                                            dataFormat={this.highFormat} dataAlign="center" width={"50px"} tdStyle={{ verticalAlign: 'middle' }}>HS</TableHeaderColumn>
                                        <TableHeaderColumn dataField="WaiverName" dataFormat={this.formatWaiverDescription}
                                            dataSort dataAlign="left" thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                            tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>Waiver Description</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ReportType"
                                            dataSort dataAlign="center" width={"100px"} tdStyle={{ verticalAlign: 'middle' }}>Report Type</TableHeaderColumn>
                                        <TableHeaderColumn dataField="WaiverAdministrationID"
                                            dataFormat={this.editWaiversFormat} dataAlign="center" width={"50px"}
                                            tdStyle={{ verticalAlign: 'middle' }}>Edit</TableHeaderColumn>
                                        <TableHeaderColumn dataField="WaiverAdministrationID"
                                            dataFormat={this.deleteWaiversFormat} dataAlign="center" width={"50px"}
                                            tdStyle={{ verticalAlign: 'middle' }}>Delete</TableHeaderColumn>
                                    </BootstrapTable>
                                    {/* <div className="row">
                                        <div className="col-md-12 col-lg-12 col-sm-12 text-right">
                                            <PrimaryButton text="Add Waiver" onClick={() => this.showAddWavierModal()} />
                                        </div>
                                    </div> */}
                                    {/* <div className="form-group">
                                        <label>Content</label>
                                        <Editor
                                            editorStyle={{ border: "1px solid #ccc", height: "80px" }} />
                                    </div> */}
                                </div>

                            </div>
                        </div>
                        <Modal
                            isOpen={this.state.showAddModal}
                            style={MODAL_STYLES}
                        >
                            <AddGeneralWaiver
                                saveGeneralWaiverCallBack={this.saveGeneralWaiverCallBack}
                                toggleAddModal={this.toggleAddModal}
                            />
                        </Modal>
                        <Modal
                            isOpen={this.state.showEditModal}
                            style={MODAL_STYLES}
                        >
                            <EditGeneralWaiver
                                updateGeneralWaiverCallBack={this.updateGeneralWaiverCallBack}
                                data={this.state.editModalDetails}
                                toggleEditModal={this.toggleEditModal}
                            />
                        </Modal>
                        <Modal
                            isOpen={this.state.showDeleteModal}
                            style={DELETE_MODAL_STYLES}
                        >
                            <ConfimationDialogModal
                                heading={DELETE_MODAL_HEADING}
                                text={DELETE_MODAL_TEXT}
                                deleteGeneralWaiverCallBack={this.deleteGeneralWaiverCallBack}
                                data={this.state.deleteModalDetails}
                                toggleDeleteModal={this.toggleDeleteModal}
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
GeneralWaiversPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    campuses: PropTypes.array,
    waiverDescription: PropTypes.string
};
function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        principalName: state.userProps.user.principalName,
        userRole: state.userProps.user.role,
        list: state.generalWaivers.waviersList,
        userProps: state.userProps,
        startYear: state.campuses.userStartYear,
        endYear: state.campuses.userEndYear
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, campusActions, generalWaiversActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(GeneralWaiversPage);