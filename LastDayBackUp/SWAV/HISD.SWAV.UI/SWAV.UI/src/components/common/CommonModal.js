import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Modal } from 'react-bootstrap';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { backdrop } from 'glamor';

class CommonModal extends React.Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.onChangeWaiverTitle = this.onChangeWaiverTitle.bind(this);
        this.onChangeWaiverDescription = this.onChangeWaiverDescription.bind(this);
        this.saveGeneralWaivers = this.saveGeneralWaivers.bind(this);
        this.elementoryOnChange = this.elementoryOnChange.bind(this);
        this.middleOnChange = this.middleOnChange.bind(this);
        this.highOnChange = this.highOnChange.bind(this);
        this.state = {
            waiverTitle: '',
            waiverDescription: '',
            elementoryChecked : false,
            middleChecked : false,
            highChecked : false
        };
    }

    saveGeneralWaivers() {
        this.props.saveGeneralWaiverCallBack(this.state);
    }

    closeModal(data) {
        const { toggleModal } = this.props;
        toggleModal(false);
    }

    onChangeWaiverTitle(e) {
        this.setState({ waiverTitle: e.target.value });
    }
    elementoryOnChange(){
        let { elementoryChecked } = this.state;
        this.setState({ elementoryChecked : !elementoryChecked  });
    }

    middleOnChange(){
        let { middleChecked } = this.state;
        this.setState({ middleChecked : !middleChecked  });
    }

    highOnChange(){
        let { highChecked } = this.state;
        this.setState({ highChecked : !highChecked  });
    }

    onChangeWaiverDescription(e) {
        this.setState({ waiverDescription: e.target.value });
    }
    
    render() {
        const { showModal, toggleModal } = this.props;
        return (
            <Modal show={showModal} onHide={(event) => this.closeModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add General Waiver</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Waiver Name</label>
                        <div>
                            <input id="waiverTitle" className="form-control" value={this.state.waiverTitle} onChange={this.onChangeWaiverTitle} type="text" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Waiver Description</label>
                        <div>
                            <textarea id="wavierName" rows="5"  placeholder="Please enter the description.." value={this.state.waiverDescription} onChange={this.onChangeWaiverDescription} className="form-control"></textarea>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-sm-4">
                            <label>Report Type</label>
                            <div>
                                <Dropdown placeHolder="Select Report Type" />
                            </div>
                        </div>
                      
                        <div className="form-check col-sm-6"> 
                            <div className="col-sm-2">
                            <input type="checkbox" checked={this.state.elementoryChecked} id="exampleCheck1"  onChange={this.elementoryOnChange} />
                                <label className="form-check-label">ES</label>
                            </div>
                            <div className="col-sm-2">
                                <input type="checkbox" checked={this.state.middleChecked} id="exampleCheck1"  onChange={this.middleOnChange} />
                                <label className="form-check-label">MS</label>
                            </div>
                            <div className="col-sm-2">
                                <input type="checkbox"  checked={this.state.highChecked} onChange={this.highOnChange} id="exampleCheck1" />
                                <label className="form-check-label">HS</label>
                            </div>

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <PrimaryButton text="Save" onClick={this.saveGeneralWaivers} />
                    <DefaultButton text="Cancel" onClick={this.closeModal} style={{ float: 'left' }} />
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CommonModal;