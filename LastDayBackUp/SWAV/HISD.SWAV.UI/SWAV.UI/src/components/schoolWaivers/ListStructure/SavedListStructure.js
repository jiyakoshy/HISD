import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from '../../common/CheckBox';
import If from '../../common/If';
import _ from "lodash";
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import * as waiversConstants from '../../../constants/constant';
import { MODAL_STYLES, DELETE_MODAL_STYLES, DELETE_MODAL_HEADING, DELETE_MODAL_TEXT } from '../../../constants/constant';
import AddSchoolCustomWaiver from '../../WaiversAdministration/CustomWaivers/AddSchoolCustomWaiver';
import CustomWaiverDeleteDialog from '../../common/CommonModal/CustomWaiverDeleteDialog';
import Modal from 'react-modal';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import EditSchoolCustomWaiver from '../../WaiversAdministration/CustomWaivers/EditSchoolCustomWaiver';

class SavedListStructure extends React.Component {
    constructor(props) {
        super(props);
        this.selectedItem = this.selectedItem.bind(this);
        this.saveActionHandler = this.saveActionHandler.bind(this);
        this.toggleAddModalCallBack = this.toggleAddModalCallBack.bind(this);
        this.toggleEditModalCallBack = this.toggleEditModalCallBack.bind(this);
        this.saveCustomWaiverDetails = this.saveCustomWaiverDetails.bind(this);
        this.editWaiversFormat = this.editWaiversFormat.bind(this);
        this.deleteWaiversFormat = this.deleteWaiversFormat.bind(this);
        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
        this.updateCustomWaiverCallBack = this.updateCustomWaiverCallBack.bind(this);
        this.deleteCustomWaiverCallBack = this.deleteCustomWaiverCallBack.bind(this);
        const selectedWaivers = [];
        const selectedCheckboxArray = [];
        const selectedCheckboxPatchArray = [];
        this.state = {
            selectedWaivers: selectedWaivers,
            selectedCheckboxArrayIndex: 0,
            selectedCheckboxPatchArrayIndex: 0,
            selectedCheckboxArray: selectedCheckboxArray,
            selectedCheckboxPatchArray: selectedCheckboxPatchArray,
            isSaveDisabled: true,
            runOnce: true,
            showEditModal: false,
            showDeleteModal: false,
            editModalDetails: '',
            deleteModalDetails: ''
        };
        this.setState({ selectedWaivers: [] });
    }

    saveCustomWaiverDetails(data) {
        this.props.callBackCustomWaiverAction(data);
    }

    getFinalizeDetails(){
        this.props.getFinalizeCallBack();
    }

    updateCustomWaiverCallBack(data) {
        this.props.callBackUpdateCustomWaiver(data);
    }

    deleteCustomWaiverCallBack(row) {
        this.props.callBackDeleteCustomWaiver(row);
        this.toggleDeleteModal(false);
    }

    toggleEditModalCallBack(value) {
        this.props.toggleEditModal(value);
    }

    toggleDeleteModal(value) {
        this.setState({ showDeleteModal: value });
        this.setState({ showEditModal: false });
    }

    addCustomWaiver() {
        this.props.addCustomWaiverCallBack();
    }
    resetWaivers(){
        this.props.resetSchoolWaivers();
    }
    toggleAddModalCallBack(value) {
        this.props.toggleAddModal(value);
    }

    selectedItem(id, value, waiverId, obj) {
        this.state.selectedWaivers[id] = value;
        if (obj.hasOwnProperty('SchoolWaiverDeleted')) {
            if (value === false) {
                this.state.selectedCheckboxPatchArray[this.state.selectedCheckboxPatchArrayIndex] = waiverId;
                this.state.selectedCheckboxPatchArrayIndex = this.state.selectedCheckboxPatchArrayIndex + 1;
            }
            if (value === true) {
                this.state.selectedCheckboxPatchArray = _.without(this.state.selectedCheckboxPatchArray, waiverId);
                this.state.selectedCheckboxPatchArrayIndex = this.state.selectedCheckboxPatchArrayIndex - 1;
            }
        } else {
            if (value === true) {
                this.state.selectedCheckboxArray[this.state.selectedCheckboxArrayIndex] = waiverId;
                this.state.selectedCheckboxArrayIndex = this.state.selectedCheckboxArrayIndex + 1;
            }

            if (value === false) {
                this.state.selectedCheckboxArray = _.without(this.state.selectedCheckboxArray, waiverId);
                this.state.selectedCheckboxArrayIndex = this.state.selectedCheckboxArrayIndex - 1;
            }
        }

        this.setState({
            selectedWaivers: this.state.selectedWaivers,
            selectedCheckboxArray: this.state.selectedCheckboxArray,
            selectedCheckboxArrayIndex: this.state.selectedCheckboxArrayIndex,
            selectedCheckboxPatchArray: this.state.selectedCheckboxPatchArray,
            selectedCheckboxPatchArrayIndex: this.state.selectedCheckboxPatchArrayIndex,
            isSaveDisabled: false,
            runOnce: false
        });

    }
    saveActionHandler() {
        this.props.callBackAddAction(this.state.selectedCheckboxArray, this.state.selectedCheckboxPatchArray);
        this.setState({
            selectedCheckboxArray: [],
            selectedCheckboxPatchArray: [],
            selectedCheckboxArrayIndex: 0,
            selectedCheckboxPatchArrayIndex: 0
        });
    }

    formatWaiverDescription(cell, row) {
        return (
            <div className="waiver-description">
                <span className="waiver-description-heading">{row.WaiverName}</span>
                {row.WaiverDescription}
            </div>
        );
    }

    formatApprovalStatus(cell, row) {
        let approval = waiversConstants.PENDING;
        
        if (row.CustomApprovalStatus == '1') {
            approval = waiversConstants.APPROVED;
        }
        else if(row.CustomApprovalStatus == '2'){
            approval = waiversConstants.REJECTED;
        }
        return (
            <div className="approval-status">{approval}</div>
        );
    }
    enableCustomWaviers(){
        const { status, userRole, isAllowed } = this.props;
        let disabled = true;

        if (status === waiversConstants.WAIVERS_SAVED_STATUS || userRole === "Admin") {
            disabled = false;
        }

        if (isAllowed) {
            disabled = true;
        }

        return disabled;
    }
    editWaiver(row) {
        this.props.editWavierCallBack(row);
    }
   
    editWaiversFormat(cell, row) {
        return (
            <span className="glyphicon glyphicon-pencil" onClick={() => { this.editWaiver(row) }} style={{ color: '#008CBA', cursor: 'pointer' }}></span>
        );
    }

    deleteWaiversFormat(cell, row) {
        return (
            <span className="glyphicon glyphicon-trash" style={{ color: 'red', cursor: 'pointer' }} onClick={() => { this.deleteWaiver(row) }}></span>
        );
    }

    deleteWaiver(row) {
        this.setState({ showDeleteModal: true, deleteModalDetails: row });
    }

    render() {
        const { data, status, userRole, isAllowed } = this.props;
        const { customSchoolWaivers } = this.props;
        let indexValue = 0;
        let obj;
        const loadList = () => {
            let disabled = true;
            if (userRole === "Admin") {
                disabled = false;
            }
            if (userRole === "Principal" || userRole === "SC") {
                disabled = isAllowed;
            }
            if ((userRole === "Principal" || userRole === "SC") && status === waiversConstants.WAIVERS_SUBMITTED_CONSTANTS) {
                disabled = true;
            }

            if (!_.isEmpty(data)) {
                return data.map((result, index) => {
                    return (
                        <tr>
                            <td style={{ 'text-align': 'left', 'white-space': 'normal', 'word-wrap': 'break-word' }}>
                                <div className="waiver-description">
                                    <span className="waiver-description-heading">{result.WaiverName}</span>
                                    {result.WaiverDescription}
                                </div>
                            </td>
                            <td style={{ width: '10%' }}>
                                <CheckBox
                                    key={index}
                                    obj={result}
                                    index={index}
                                    checked={this.state.selectedWaivers[index]}
                                    callback={this.selectedItem}
                                    disabled={disabled}
                                />
                            </td>
                        </tr>
                    );
                });
            }
        };
          
        const setInitialRowStateLength = () => {
            if (!_.isEmpty(data) && this.state.runOnce) {
                return data.map((result) => {
                    this.state.selectedWaivers[indexValue] = result.CheckBox;
                    indexValue = indexValue + 1;
                });
            }
        };

        const enableSaveButton = () => {
            let disabled = true;
            const { isAllowed } = this.props;
            const { selectedCheckboxArray, selectedCheckboxPatchArray, isSaveDisabled } = this.state;
            if ((!_.isEmpty(selectedCheckboxArray) || !_.isEmpty(selectedCheckboxPatchArray)) && !isSaveDisabled) {
                disabled = false;
            }
            if (isAllowed) {
                disabled = true;
            }
            
            return disabled;
        };

        const enableFinalizeButton = () => {
            const { status, userRole } = this.props;
            const { isAllowed } = this.props;
            let disabled = true;

            if (status === waiversConstants.WAIVERS_SAVED_STATUS){  // || userRole === "Admin") {
                disabled = false;
            }
            if (isAllowed) {
                disabled = true;
            }

            return disabled;
        };
        const enableResetButton = () => {
            const { status, userRole } = this.props;
            let disabled = true;

            if (status === waiversConstants.WAIVERS_SUBMITTED_CONSTANTS && userRole === "Admin") {
                disabled = false;
            }

            return disabled;
        };
        const enableAddCustomButton = () => {
            const { status, userRole } = this.props;
            const { isAllowed } = this.props;
            let disabled = false;

            if (status === waiversConstants.WAIVERS_SUBMITTED_CONSTANTS){// && userRole != "Admin") {
                disabled = true;
            }
            if (isAllowed) {
                disabled = true;
            }
            return disabled;
        };
        return (
            <div className="react-bs-table-container">

                {setInitialRowStateLength()}
                <div className="react-bs-table react-bs-table-bordered" style={{ height: '100%' }}>
                    <div className="react-bs-container-header table-header-wrapper">
                        <table className="table table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th>Waiver Description</th>
                                    <th style={{ width: '10%' }}>Select</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="react-bs-container-body" style={{ height: '100%' }}>
                        <table className="table table-bordered">
                            <tbody>
                                {loadList()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style={{marginTop:'20px'}}>
                <BootstrapTable data={this.props.customSchoolWaivers} >
                    <TableHeaderColumn dataField="SchoolWaiverID" hidden={true}
                        isKey dataAlign="left" width={"100px"}>ID</TableHeaderColumn>
                    <TableHeaderColumn dataField="WaiverName" dataFormat={this.formatWaiverDescription}
                        dataAlign="left" thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                        tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>Custom Waiver Description</TableHeaderColumn>
                    <TableHeaderColumn dataField="WaiverName" dataFormat={this.formatApprovalStatus}
                        dataAlign="left" thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                        tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word', verticalAlign: 'middle', fontWeight: 'bold'}} dataAlign="center"
                        width={"100px"}>Aprroval Status</TableHeaderColumn>
                    <TableHeaderColumn dataField="SchoolWaiverID" hidden={this.enableCustomWaviers()}
                        dataFormat={this.editWaiversFormat} dataAlign="center" width={"50px"}
                        tdStyle={{ verticalAlign: 'middle' }}>Edit</TableHeaderColumn>
                    <TableHeaderColumn dataField="SchoolWaiverID" hidden={this.enableCustomWaviers()}
                        dataFormat={this.deleteWaiversFormat} dataAlign="center" width={"50px"}
                        tdStyle={{ verticalAlign: 'middle' }}>Delete</TableHeaderColumn>
                </BootstrapTable>
                </div>
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12 text-right">
                        <PrimaryButton text="Reset Waivers" onClick={() => this.resetWaivers()}  disabled={enableResetButton()} />
                        &nbsp;&nbsp;&nbsp;
                        <PrimaryButton text="Add Custom" onClick={() => this.addCustomWaiver()} disabled={enableAddCustomButton()} />
                        &nbsp;&nbsp;&nbsp;
                        <PrimaryButton text="Finalize Submission" onClick={()=> this.getFinalizeDetails()} disabled={enableFinalizeButton()} />
                        &nbsp;&nbsp;&nbsp;
                        <PrimaryButton text="Save" disabled={enableSaveButton()} onClick={this.saveActionHandler} />
                    </div>
                </div>
                <Modal
                    isOpen={this.props.showCustomWaiverModal}
                    style={MODAL_STYLES}
                >
                    <AddSchoolCustomWaiver
                        toggleAddModal={this.toggleAddModalCallBack}
                        saveCustomWaiverDetails={this.saveCustomWaiverDetails}
                    />
                </Modal>
                <Modal
                    isOpen={this.props.showEditModal}
                    style={MODAL_STYLES}
                >
                    <EditSchoolCustomWaiver
                        updateCustomWaiverCallBack={this.updateCustomWaiverCallBack}
                        data={this.props.editModalDetails}
                        toggleEditModal={this.toggleEditModalCallBack}
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
            </div>

        );
    }
}

export default SavedListStructure;