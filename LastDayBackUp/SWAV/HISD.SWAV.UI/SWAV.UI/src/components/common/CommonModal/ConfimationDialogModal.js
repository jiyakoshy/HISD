import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, PrimaryButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

class ConfimationDialogModal extends React.Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.deleteGeneralWaivers = this.deleteGeneralWaivers.bind(this);
    }

    deleteGeneralWaivers() {
        this.props.deleteGeneralWaiverCallBack(this.props.data);
    }

    closeModal(data) {
        const { toggleDeleteModal } = this.props;
        toggleDeleteModal(false);
    }

    render() {
        const { text, heading, data } = this.props;
        return (
            <div className="row">
                <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4%', marginLeft: '2%'}}>
                    <span>{heading}</span>
                </div>
                <div style={{marginLeft:'2%'}}>
                    <span>{text} <span style={{fontWeight:'bold'}}>{data.WaiverName}</span> waiver ?</span>
                </div>
                <DefaultButton text="Cancel" onClick={this.closeModal} style={{marginTop: '6%', marginLeft: '2%'}}/>
                <PrimaryButton text="Delete" onClick={this.deleteGeneralWaivers} className="pull-right" style={{marginTop: '6%', marginRight:'2%', backgroundColor:'#d9534f'}}/>
            </div>
        );
    }
}

export default ConfimationDialogModal;