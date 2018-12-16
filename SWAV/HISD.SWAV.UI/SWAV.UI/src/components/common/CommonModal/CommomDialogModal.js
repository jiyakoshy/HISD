import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, PrimaryButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

class CommomDialogModal extends React.Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.actionHandler = this.actionHandler.bind(this);
    }

    actionHandler() {
        this.props.actionHandlerCallback({});
    }

    closeModal(data) {
        const { toggleModal } = this.props;
        toggleModal(false);
    }

    render() {
        const { text, heading, data } = this.props;
        return (
            <div className="row">
                <div style={{marginLeft:'2%'}}>
                    <span style={{fontWeight: 'bold'}}>{text}</span>
                </div>
                <DefaultButton text="No" onClick={this.closeModal} style={{marginTop: '6%', marginLeft: '2%'}}/>
                <PrimaryButton text="Yes" onClick={this.actionHandler} className="pull-right" style={{marginTop: '6%', marginRight:'2%'}}/>
            </div>
        );
    }
}

export default CommomDialogModal;