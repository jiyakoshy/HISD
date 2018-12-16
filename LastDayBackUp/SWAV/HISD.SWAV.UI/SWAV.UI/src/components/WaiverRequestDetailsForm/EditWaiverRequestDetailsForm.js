import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, PrimaryButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

class EditWaiverRequestDetailsForm extends React.Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.onChangeSourceData = this.onChangeSourceData.bind(this);
        this.onChangeEvidence = this.onChangeEvidence.bind(this);
        this.updateRequestForm = this.updateRequestForm.bind(this);
        this.state = {
            sourceData: '',
            evidence: ''
        }
    }

    componentDidMount() {
        const { SourceOfData, EvidenceOfCompliance, WaiverRequestDetailID} = this.props.data;
         this.setState({
            requestID : WaiverRequestDetailID,
            sourceData: SourceOfData,
            evidence: EvidenceOfCompliance
        })

    }

    updateRequestForm() {
        this.props.updateRequestFormCallBack(this.state);
    }

    closeModal(data) {
        const { toggleEditModal } = this.props;
        toggleEditModal(false);
    }

    onChangeSourceData(e) {
        this.setState({ sourceData: e.target.value });
    }
  

    onChangeEvidence(e) {
        this.setState({ evidence: e.target.value });
    }

    render() {
        return (
            <div>
                <h3 style={{ textAlign: 'center', color: '#458ab6' }}><label>Edit Waiver Request Details Form</label></h3>
                <div className="form-group">
                    <label>Waiver Name</label>
                    <div>{this.props.data.WaiverName}</div>
                </div>
                <div className="form-group">
                    <label>Waiver Description</label>
                    <div>{this.props.data.WaiverDescription}</div>         
                </div>
                <div className="form-group">
                    <label className="required">Source of Data</label>
                    <div>
                        <input id="sourceData" className="form-control"
                         value={this.state.sourceData}
                         onChange={this.onChangeSourceData} />
                    </div>
                </div>
                <div className="form-group">
                    <label className="required">Evidence of Compliance</label>
                    <div>
                        <input id="evidence" value={this.state.evidence}
                         onChange={this.onChangeEvidence}
                         className="form-control"/>
                    </div>
                </div>

                <PrimaryButton text="Update" onClick={this.updateRequestForm} className="pull-right" />
                <DefaultButton text="Cancel" onClick={this.closeModal} />
            </div>
        );
    }
}

export default EditWaiverRequestDetailsForm;