import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, PrimaryButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

class FillWaiverInformation extends React.Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.onChangesourceData = this.onChangesourceData.bind(this);
        this.onChangeEvidence = this.onChangeEvidence.bind(this);
        this.addDetails = this.addDetails.bind(this);
        this.state = {
            waiverID : '',
            waiverTitle: '',
            waiverDsptn: '',
            sourceData : '',
            evidence : ''
        }
    }

    componentDidMount() {
        const { WaiverName, WaiverDescription, SchoolWaiverID } = this.props.data; 
        this.setState({
            waiverTitle: WaiverName,
            waiverDsptn : WaiverDescription,
            waiverID : SchoolWaiverID
        })

    }

    addDetails() {
        this.props.addWaiversInfoCallBack(this.state);
    }

    closeModal(data) {
        const { toggleAddModal } = this.props;
        toggleAddModal(false);
    }

    onChangesourceData(e) {
        this.setState({ sourceData: e.target.value });
    }
   
    onChangeEvidence(e) {
        this.setState({ evidence: e.target.value });
    }

    render() {
        return (
            <div>
                <h3 style={{ textAlign: 'center', color: '#458ab6' }}><label>Add Waiver Request Details Form</label></h3>
                <div className="form-group">
                    <label className="required">Source of Data</label>
                    <div>
                        <textarea id="source-data" rows="2" className="form-control"
                         value={this.state.sourceData} placeholder="Please enter the source of data.." onChange={this.onChangesourceData}></textarea>
                    </div>
                </div>
                <div className="form-group">
                    <label className="required">Evidence of Complaince</label>
                    <div>
                        <textarea id="evidence" rows="5" value={this.state.evidence}
                         onChange={this.onChangeEvidence} placeholder="Please enter the evidence of complaince.." className="form-control"></textarea>
                    </div>
                </div>
                <PrimaryButton text="Add" onClick={this.addDetails} className="pull-right" />
                <DefaultButton text="Cancel" onClick={this.closeModal} />
            </div>
        );
    }
}

export default FillWaiverInformation;