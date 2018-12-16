import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from '../../common/CheckBox';
import _ from "lodash";
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { MODAL_STYLES } from '../../../constants/constant';
import AddSchoolCustomWaiver from '../../WaiversAdministration/CustomWaivers/AddSchoolCustomWaiver';
import Modal from 'react-modal';

class ListStructure extends React.Component {
    constructor(props) {
        super(props);
        this.selectedItem = this.selectedItem.bind(this);
        this.saveActionHandler = this.saveActionHandler.bind(this);
        this.toggleAddModal = this.toggleAddModal.bind(this);
        this.saveCustomWaiverDetails = this.saveCustomWaiverDetails.bind(this);
        const selectedWaivers = [];
        const selectedCheckboxArray = [];
        this.state = {
            selectedWaivers: selectedWaivers,
            selectedCheckboxArrayIndex: 0,
            selectedCheckboxArray: selectedCheckboxArray,
            isSaveDisabled: true,
            runOnce: true,
            showCustomWaiverModal : false
        };
    }
    
    saveCustomWaiverDetails(data){
        this.props.callBackCustomWaiverAction(data);
    }

    addCustomWaiver(){
        this.setState({ showCustomWaiverModal : true});
    }

    toggleAddModal(value) {
        this.setState({ showCustomWaiverModal: value });
    }

    selectedItem(id, value, waiverId) {
        this.state.selectedWaivers[id] = value;
        if (value === true) {
            this.state.selectedCheckboxArray[this.state.selectedCheckboxArrayIndex] = waiverId;
            this.state.selectedCheckboxArrayIndex = this.state.selectedCheckboxArrayIndex + 1;
        }

        if (value === false) {
            this.state.selectedCheckboxArray = _.without(this.state.selectedCheckboxArray, waiverId);
            this.state.selectedCheckboxArrayIndex = this.state.selectedCheckboxArrayIndex - 1;
        }
        this.setState({
            selectedWaivers: this.state.selectedWaivers,
            selectedCheckboxArray: this.state.selectedCheckboxArray,
            selectedCheckboxArrayIndex: this.state.selectedCheckboxArrayIndex,
            isSaveDisabled: false,
            runOnce: false
        });

    }
    saveActionHandler() {
        this.props.callBackAddAction(this.state.selectedCheckboxArray);
        this.setState({
            selectedCheckboxArray: [],
            selectedCheckboxArrayIndex: 0
        });
    }

    render() {
        const { data, isAllowed } = this.props;
        let indexValue = 0;
        let obj;
        const tableStyle = { 'text-align': 'left', 'white-space': 'normal', 'word-wrap': 'break-word' };
        const loadList = () => {
            return data.map((result, index) => {
                return (
                    <tr>
                        <td style={tableStyle}>
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
                                disabled={isAllowed}
                            />
                        </td>
                    </tr>
                );
            });
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
            const { selectedCheckboxArray, isSaveDisabled } = this.state;
            if (!_.isEmpty(selectedCheckboxArray) && !isSaveDisabled) {
                disabled = false;
            }
            if(isAllowed){
                disabled = true;
            }
            return disabled;
        };

        const enableCustomButton = () => {
            const { isAllowed } = this.props;
            let disabled = false;
            if(isAllowed){
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
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12 text-right">
                        <PrimaryButton text="Add Custom" onClick={()=>this.addCustomWaiver()} disabled={enableCustomButton()} />
                        &nbsp;&nbsp;&nbsp;
                        <PrimaryButton text="Finalize Submission" disabled />
                        &nbsp;&nbsp;&nbsp;
                        <PrimaryButton text="Save" disabled={enableSaveButton()} onClick={this.saveActionHandler} />
                    </div>
                </div>
                <Modal
                    isOpen={this.state.showCustomWaiverModal}
                    style={MODAL_STYLES}
                    >
                    <AddSchoolCustomWaiver
                        toggleAddModal={this.toggleAddModal}
                        saveCustomWaiverDetails={this.saveCustomWaiverDetails}
                    />
                </Modal>
            </div>
        );
    }
}

export default ListStructure;