import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, PrimaryButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { REPORT_DROPDOWN_LIST } from '../../../constants/constant';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class EditCustomWaiver extends React.Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.onChangeWaiverTitle = this.onChangeWaiverTitle.bind(this);
        this.onChangeWaiverDescription = this.onChangeWaiverDescription.bind(this);
        this.onChangeReportType = this.onChangeReportType.bind(this);
        this.saveCustomWaivers = this.saveCustomWaivers.bind(this);
        this.state = {
            waiverTitle: '',
            waiverDescription: '',
            reportType: ''
        }
    }

    componentDidMount() {
        const { WaiverID, WaiverName, WaiverDescription, ReportTypeID, WaiverAdministrationID, Elementary, Middle, High, WaiverAdminCreatedDate, WaiverCreatedDate } = this.props.data;
        this.setState({
            waiverTitle: WaiverName,
            waiverDescription: WaiverDescription,
            wavierId: WaiverID,
            reportType: ReportTypeID,
            waiverAdministrationID : WaiverAdministrationID,
            elementaryChecked : Elementary,
            middleChecked : Middle,
            highChecked : High,
            WaiverAdminCreatedDate : WaiverAdminCreatedDate,
            WaiverCreatedDate : WaiverCreatedDate
        })

    }

    saveCustomWaivers() {
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
    onChangeReportType(selectedItem) {
        this.setState({ reportType: selectedItem.value })
    }

    render() {
        return (
            <div>
                <h3 style={{ textAlign: 'center', color: '#458ab6' }}><label>Edit Custom Waiver</label></h3>
                <label>Campus: <span style={{ color: '#458ab6' }}>{this.props.data.NameOfInstitution}</span></label>
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
                <div className="row">
                    <div className="form-group col-sm-4">
                        <label className="required">Report Type</label>
                        <div>
                            <Select
                                options={REPORT_DROPDOWN_LIST}
                                onChange={this.onChangeReportType}
                                value={this.state.reportType}
                            />
                        </div>
                    </div>
                </div>
                <PrimaryButton text="Update" onClick={this.saveCustomWaivers} className="pull-right" />
                <DefaultButton text="Cancel" onClick={this.closeModal} />
            </div>
        );
    }
}

export default EditCustomWaiver;