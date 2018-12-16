import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, PrimaryButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { REPORT_DROPDOWN_LIST } from '../../../constants/constant';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class AddGeneralWaiver extends React.Component {

    constructor(props) {
        super(props);
        this.onChangeWaiverTitle = this.onChangeWaiverTitle.bind(this);
        this.onChangeWaiverDescription = this.onChangeWaiverDescription.bind(this);
        this.saveGeneralWaivers = this.saveGeneralWaivers.bind(this);
        this.elementoryOnChange = this.elementoryOnChange.bind(this);
        this.middleOnChange = this.middleOnChange.bind(this);
        this.highOnChange = this.highOnChange.bind(this);
        this.waiverRDSOnChange = this.waiverRDSOnChange.bind(this);
        this.onChangeReportType = this.onChangeReportType.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.state = {
            waiverTitle: '',
            waiverDescription: '',
            elementaryChecked: false,
            middleChecked: false,
            highChecked: false,
            waiverRDSChecked: false,
            reportType: '1'
        }
    }

    saveGeneralWaivers() {
        this.props.saveGeneralWaiverCallBack(this.state);
    }

    closeModal(data) {
        const { toggleAddModal } = this.props;
        toggleAddModal(false);
    }

    onChangeWaiverTitle(e) {
        this.setState({ waiverTitle: e.target.value });
    }
    elementoryOnChange() {
        let { elementaryChecked } = this.state;
        this.setState({ elementaryChecked: !elementaryChecked });
    }

    middleOnChange() {
        let { middleChecked } = this.state;
        this.setState({ middleChecked: !middleChecked });
    }

    highOnChange() {
        let { highChecked } = this.state;
        this.setState({ highChecked: !highChecked });
    }
    waiverRDSOnChange(){
        let { waiverRDSChecked } = this.state;
        this.setState({ waiverRDSChecked: !waiverRDSChecked});
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
                <h3 style={{textAlign: 'center', color: '#458ab6'}}><label>Add General Waiver</label></h3>
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

                    <div className="form-check col-sm-6" style={{ marginTop: '20px' }}>
                        <div className="col-sm-2" style={{ marginRight: '60px' }}>
                            <label className="container450">
                                <label className="required" style={{ fontSize: '65%', marginLeft: '60px', display: 'inline-flex' }}>ES</label>
                                <input type="checkbox" name="check-box" checked={this.state.elementaryChecked} onChange={this.elementoryOnChange} />
                                <span className="checkmark" style={{ marginLeft: '65px', marginTop: '5px' }}></span>
                            </label>
                        </div>
                        <div className="col-sm-2" style={{ marginRight: '60px' }}>
                            <label className="container450">
                                <label className="required" style={{ fontSize: '65%', marginLeft: '60px', display: 'inline-flex' }}>MS</label>
                                <input type="checkbox" name="check-box" checked={this.state.middleChecked} onChange={this.middleOnChange} />
                                <span className="checkmark" style={{ marginLeft: '65px', marginTop: '5px' }}></span>
                            </label>
                        </div>
                        <div className="col-sm-2">
                            <label className="container450">
                                <label className="required" style={{ fontSize: '65%', marginLeft: '60px', display: 'inline-flex' }}>HS</label>
                                <input type="checkbox" name="check-box" checked={this.state.highChecked} onChange={this.highOnChange} />
                                <span className="checkmark" style={{ marginLeft: '65px', marginTop: '5px' }}></span>

                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-sm-4" style={{marginLeft: '324px'}}>
                            <label className="container450">
                                <label style={{ fontSize: '65%', marginLeft: '16px' }}>Waiver Request Details Form</label>
                                <input type="checkbox" name="check-box" checked={this.state.waiverRDSChecked} onChange={this.waiverRDSOnChange} />
                                <span className="checkmark" style={{marginTop: '5px' }}></span>
                            </label>
                        </div>
                    </div>
                </div>
                <PrimaryButton text="Save" onClick={this.saveGeneralWaivers} className="pull-right" />
                <DefaultButton text="Cancel" onClick={this.closeModal} />
            </div>
        );
    }
}

export default AddGeneralWaiver;