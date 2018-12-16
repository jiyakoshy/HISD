import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as waiverRequestFormActions from '../../actions/waiverRequestFormActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import MessagePage from '../common/MessagePage';
import ErrorPage from '../common/ErrorPage';
import { IfAnyGranted } from 'react-authorization';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Utilities from '../../utilities/utilities';
import { MODAL_STYLES, DELETE_MODAL_STYLES, DELETE_MODAL_HEADING, DELETE_MODAL_TEXT } from '../../constants/constant';
import Modal from 'react-modal';
import EditWaiverRequestDetailsForm from './EditWaiverRequestDetailsForm';
import * as waiversConstants from '../../constants/constant';

class WaiverRequestDetailsFormPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.editRequestFormat = this.editRequestFormat.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.updateRequestFormCallBack = this.updateRequestFormCallBack.bind(this);
        this.state = {
            editModal: false,
            editDetails: ''
        };
    }

    componentDidMount() {
        const { startYear, endYear } = this.props;
        const { campusNumber } = this.props.match.params;
        this.props.actions.getRequestFormDetailsActions(startYear, campusNumber);
    }

    updateRequestFormCallBack(data) {
        const { startYear, endYear } = this.props;
        const { campusNumber } = this.props.match.params;
        this.props.actions.updateRequestFormAction(data, { startYear, campusNumber }).then(() => {
            this.toggleEditModal(false);
        });

    }

    toggleEditModal(value) {
        this.setState({ editModal: value });
    }

    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'black' }}>
                From {start} to {to}. Total: {total}&nbsp;&nbsp;
            </p>
        );
    }

    formatWaiverDescription(cell, row) {
        return (
            <div className="waiver-description">
                <span className="waiver-description-heading">{row.WaiverName}</span>
                {row.WaiverDescription}
            </div>
        );
    }

    editRequest(data) {
        this.setState({ editModal: true, editDetails: data });
    }

    editRequestFormat(cell, row) {
        return (
            <span onClick={() => { this.editRequest(row); }} className="glyphicon glyphicon-pencil" style={{ color: '#008CBA', cursor: 'pointer' }}></span>
        );
    }

    deleteRequestFormat(cell, row) {
        return (
            <span className="glyphicon glyphicon-trash" style={{ color: 'red', cursor: 'pointer' }} onClick={() => { this.deleteWaiver(row); }}></span>
        );
    }
    
    enableRequestForm() {
        const { userRole } = this.props;
        const { statusID } = this.props.match.params;
        const status = Utilities.getStatus(statusID) || 'NA';
        let disabled = false;

        if (status === waiversConstants.WAIVERS_SUBMITTED_CONSTANTS && userRole != "Admin") {
            disabled = true;
        }
        return disabled;
    }

    render() {
        const options = {
            defaultSortName: 'WaiverName',
            sortOrder: 'asc',
            prePage: 'Prev',
            nextPage: 'Next',
            firstPage: 'First',
            lastPage: 'Last',
            paginationShowsTotal: this.renderShowsTotal
        };
        const { statusID, campusName } = this.props.match.params;
        const status = Utilities.getStatus(statusID) || 'NA';
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="Waiver Request Details Form" isDisabled={true} schoolStatus={status} campusName={campusName} />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <div className="white-box">
                                <BootstrapTable data={this.props.getRequestDetails} striped hover condensed pagination options={options} search>
                                    <TableHeaderColumn dataField="WaiverRequestDetailID" hidden={true}
                                        isKey dataAlign="left" width={"100px"}>ID</TableHeaderColumn>
                                    <TableHeaderColumn dataField="WaiverName" dataFormat={this.formatWaiverDescription}
                                        dataSort dataAlign="left" thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                        tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>Waiver Description</TableHeaderColumn>
                                    <TableHeaderColumn dataField="SourceOfData"
                                        dataSort dataAlign="center" width={"160px"} thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                        tdStyle={{ verticalAlign: 'middle', whiteSpace: 'normal', wordWrap: 'break-word' }}>Source of Data</TableHeaderColumn>
                                    <TableHeaderColumn dataField="EvidenceOfCompliance"
                                        dataSort dataAlign="center" width={"160px"} thStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                        tdStyle={{ verticalAlign: 'middle', whiteSpace: 'normal', wordWrap: 'break-word' }}>Evidence Of Compliance</TableHeaderColumn>
                                    <TableHeaderColumn dataField="WaiverAdministrationID"
                                        dataFormat={this.editRequestFormat} dataAlign="center" width={"50px"}
                                        tdStyle={{ verticalAlign: 'middle' }} hidden={this.enableRequestForm()}>Edit</TableHeaderColumn>
                                </BootstrapTable>
                            </div>

                        </div>
                    </div>
                    <Modal
                        isOpen={this.state.editModal}
                        style={MODAL_STYLES}
                    >
                        <EditWaiverRequestDetailsForm
                            updateRequestFormCallBack={this.updateRequestFormCallBack}
                            data={this.state.editDetails}
                            toggleEditModal={this.toggleEditModal}
                        />
                    </Modal>
                </div>
            </div>
        );
    }
}
WaiverRequestDetailsFormPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    campuses: PropTypes.array
};
function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        principalName: state.userProps.user.principalName,
        userRole: state.userProps.user.role,
        list: state.generalWaivers.waviersList,
        userProps: state.userProps,
        startYear: state.campuses.userStartYear,
        endYear: state.campuses.userEndYear,
        getRequestDetails: state.campuses.getRequestDetails
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(waiverRequestFormActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(WaiverRequestDetailsFormPage);