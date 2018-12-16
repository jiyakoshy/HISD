import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, PrimaryButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

class FillSdmcInformation extends React.Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.actionHandler = this.actionHandler.bind(this);
        this.state = {
            name : '',
            email : ''
        }
    }

    componentDidMount() {
      
    }

    actionHandler() {
        this.props.actionHandlerCallback(this.state);
    }

    closeModal(data) {
        this.props.toggleModal(false);
    }

    onChangeName(e) {
        this.setState({ name: e.target.value });
    }
   
    onChangeEmail(e) {
        this.setState({ email: e.target.value });
    }

    render() {
        return (
            <div>
                <h3 style={{ textAlign: 'center', color: '#458ab6' }}><label>SDMC Details</label></h3>
                <div className="form-group">
                    <label className="required">SDMC Name</label>
                    <div>
                        <textarea id="sdmc-name" rows="1" className="form-control"
                         value={this.state.name} onChange={this.onChangeName}></textarea>
                    </div>
                </div>
                <div className="form-group">
                    <label className="required">SDMC Email</label>
                    <div>
                        <textarea id="sdmc-email" rows="1" value={this.state.email}
                         onChange={this.onChangeEmail} className="form-control"></textarea>
                    </div>
                </div>
                <PrimaryButton text="Save" onClick={this.actionHandler} className="pull-right" />
                <DefaultButton text="Cancel" onClick={this.closeModal} />
            </div>
        );
    }
}

export default FillSdmcInformation;