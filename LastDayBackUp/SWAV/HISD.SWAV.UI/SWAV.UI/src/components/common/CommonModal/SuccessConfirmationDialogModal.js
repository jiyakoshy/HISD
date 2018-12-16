import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, PrimaryButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

class SuccessConfirmationDialogModal extends React.Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal(data) {
        const { toggleModal } = this.props;
        toggleModal(false);
    }

    render() {
        const { text } = this.props;
        return (
            <div className="row">
                <div style={{marginLeft:'2%'}}>
                    <span style={{fontWeight: 'bold'}}>{text}</span>
                </div>
                <PrimaryButton text="Ok" onClick={this.closeModal} className="pull-right"
                 style={{marginTop: '6%', marginRight:'2%'}}/>
            </div>
        );
    }
}

export default SuccessConfirmationDialogModal;