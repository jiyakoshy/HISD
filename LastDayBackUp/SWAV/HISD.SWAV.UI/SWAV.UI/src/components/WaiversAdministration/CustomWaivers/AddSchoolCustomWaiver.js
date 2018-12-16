import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, PrimaryButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class AddSchoolCustomWaiver extends React.Component {

    constructor(props) {
        super(props);
        this.onChangeWaiverTitle = this.onChangeWaiverTitle.bind(this);
        this.onChangeWaiverDescription = this.onChangeWaiverDescription.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.state = {
            waiverTitle: '',
            waiverDescription: '',
            reportType: '2'
        }
    }
    save() {
        this.props.saveCustomWaiverDetails(this.state);
    }
    closeModal(data) {
        const { toggleAddModal } = this.props;
        toggleAddModal(false);
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
                <h3 style={{ textAlign: 'center', color: '#458ab6' }}><label>Add Custom Waiver</label></h3>
                <div className="form-group">
                    <label className="required">Waiver Name</label>
                    <div>
                        <textarea id="waiverTitle" rows="2" placeholder="Please enter the waiver name.." className="form-control" value={this.state.waiverTitle} onChange={this.onChangeWaiverTitle}></textarea>
                    </div>
                </div>
                <div className="form-group">
                    <label className="required">Waiver Description</label>
                    <div>
                        <textarea id="wavierName" rows="5" placeholder="Please enter the waiver description.." value={this.state.waiverDescription} onChange={this.onChangeWaiverDescription} className="form-control"></textarea>
                    </div>
                </div>
                <PrimaryButton text="Save" onClick={() => this.save()} className="pull-right" />
                <DefaultButton text="Cancel" onClick={this.closeModal} />
            </div>
        );
    }
}

export default AddSchoolCustomWaiver;