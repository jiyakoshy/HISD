import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, PrimaryButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

class EditSchoolCustomWaiver extends React.Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.onChangeWaiverTitle = this.onChangeWaiverTitle.bind(this);
        this.onChangeWaiverDescription = this.onChangeWaiverDescription.bind(this);
        this.saveGeneralWaivers = this.saveGeneralWaivers.bind(this);
        this.state = {
            waiverTitle: '',
            waiverDescription: ''
        }
    }

    componentDidMount() {
        const { WaiverName, WaiverDescription, WaiverID } = this.props.data;
        this.setState({
            waiverTitle: WaiverName,
            waiverDescription: WaiverDescription,
            wavierId : WaiverID
        })

    }

    saveGeneralWaivers() {
        this.props.updateCustomWaiverCallBack(this.state);
    }

    closeModal(data) {
        const { toggleEditModal } = this.props;
        toggleEditModal(false);
    }

    onChangeWaiverTitle(e) {
        this.setState({ waiverTitle: e.target.value });
    }
   
    onChangeWaiverDescription(e) {
        this.setState({ waiverDescription: e.target.value });
    }

    render() {
        return (
            <div>
                <h3 style={{textAlign: 'center', color: '#458ab6'}}><label>Edit General Waiver</label></h3>
                <div className="form-group">
                    <label className="required">Waiver Name</label>
                    <div>
                        <textarea id="waiverTitle" rows="2" className="form-control" value={this.state.waiverTitle} onChange={this.onChangeWaiverTitle}></textarea>
                    </div>
                </div>
                <div className="form-group">
                    <label className="required">Waiver Description</label>
                    <div>
                        <textarea id="wavierName" rows="5" value={this.state.waiverDescription} onChange={this.onChangeWaiverDescription} className="form-control"></textarea>
                    </div>
                </div>
                <PrimaryButton text="Update" onClick={this.saveGeneralWaivers} className="pull-right" />
                <DefaultButton text="Cancel" onClick={this.closeModal} />
            </div>
        );
    }
}

export default EditSchoolCustomWaiver;