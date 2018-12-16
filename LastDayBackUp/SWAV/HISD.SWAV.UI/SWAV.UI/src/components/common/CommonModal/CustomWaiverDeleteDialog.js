import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, PrimaryButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import If from '../If';

class CustomWaiverDeleteDialog extends React.Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.deleteCustomWaivers = this.deleteCustomWaivers.bind(this);
    }

    deleteCustomWaivers() {
        this.props.deleteCustomWaiverCallBack(this.props.data);
    }
    

    closeModal(data) {
        const { toggleDeleteModal } = this.props;
        toggleDeleteModal(false);
    }

    render() {
        const { text, heading,data } = this.props;
        const buttonText = this.props.buttonText || 'Delete';
        const buttonColor = this.props.buttonText ? 'green' : '#d9534f';
        return (
            <div className="row">
                <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4%', marginLeft: '2%'}}>
                    <span>{heading}</span>
                </div>
                <div style={{marginLeft:'2%'}}>
                    <span>{text} <span style={{fontWeight:'bold'}}>{data.WaiverName}</span> waiver ?</span>
                </div>
                <DefaultButton text="Cancel" onClick={this.closeModal} style={{marginTop: '6%', marginLeft: '2%'}}/>
                <PrimaryButton text={buttonText} onClick={this.deleteCustomWaivers} className="pull-right" style={{marginTop: '6%', marginRight:'2%', backgroundColor: buttonColor}}/>
            </div>
        );
    }
}

export default CustomWaiverDeleteDialog;