import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, PrimaryButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

class FillSdmcInformation extends React.Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.actionHandler = this.actionHandler.bind(this);
    }

    actionHandler() {
        this.props.actionHandlerCallback();
    }

    closeModal(data) {
        this.props.toggleModal(false);
    }
    /*ssoEmailFormat(){
        <span>{ssoDetails.email}</span>
    }*/

    render() {
        const { ssoDetails, supDetails } = this.props;
        return (
            <div>
                <h3 style={{ textAlign: 'center', color: '#458ab6' }}><label>Faculty Details</label></h3>
           
                <div className="form-group">
                    <label>SSO Name</label>
                    <div>
                        <textarea readOnly id="sso-name" rows="1" 
                         value={ssoDetails.name} className="form-control"></textarea>
                    </div>
                </div>
                <div className="form-group">
                    <label>SSO Email</label>
                    <div>
                        <textarea readOnly id="sso-email" rows="1" 
                         value={ssoDetails.email} className="form-control"></textarea>
                    </div>
                </div>
                <div className="form-group">
                    <label>Area Superintendent Name</label>
                    <div>
                        <textarea readOnly id="sdmc-name" rows="1" 
                        value={supDetails.name}  className="form-control"></textarea>
                    </div>
                </div>
                <div className="form-group">
                    <label>Area Superintendent Email</label>
                    <div>
                        <textarea readOnly id="sdmc-email" rows="1" 
                         value={supDetails.email} className="form-control"></textarea>
                    </div>
                </div>
                <PrimaryButton text="Submit" onClick={this.actionHandler} className="pull-right" />
                <DefaultButton text="Cancel" onClick={this.closeModal} />
            </div>
        );
    }
}

export default FillSdmcInformation;