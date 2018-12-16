import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as waiversActions from '../../../actions/waiversActions';
import { hashHistory } from 'react-router-dom';
import { HashRouter, Route } from 'react-router-dom';
import SavedWaiverDescriptionPage from './SavedWaiverDescriptionPage';
import PageHeader from '../../common/PageHeader';
import MessagePage from '../../common/MessagePage';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import LinkFormatter from '../../common/formatters/linkFormatter';
import ActiveFormatter from '../../common/formatters/activeFormatter';
import { PERMISSIONS } from '../../../constants/constant';
import Input from '../../common/Input';
import ListStructure from '../../schoolWaivers/ListStructure/index';
import If from '../../common/If';
import Utilities from '../../../utilities/utilities';

class WaiverDescriptionPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.callBackAddAction = this.callBackAddAction.bind(this);
        this.callBackCustomWaiverAction = this.callBackCustomWaiverAction.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.state = {
            schoolStatus: '',
            startYear: '',
            endYear: ''
        }
    }

    componentDidMount() {
        const { startYear, endYear } = this.props;
        const { ID, campusName } = this.props.match.params;
        this.props.actions.clearAction();
        this.props.actions.loadAllWaivers(ID, startYear);
        this.props.actions.saveSchoolDetailsSuccess({ ID, campusName });
        this.props.actions.saveStatusAction(startYear, ID);
    }
    showDialog() {
        this.setState({ hideDialog: false });
    }

    closeDialog() {
        this.setState({ hideDialog: true });
    }
    closeModal() {
        this.setState({ showReactModal: false });
    }
    okDialog() {
        this.closeDialog();
    }
    displayMessage(title, message, action) {
        this.setState({ title: title, subtext: message, dialogAction: action });
        this.showDialog();
    }

    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'black' }}>
                From {start} to {to}. Total: {total}&nbsp;&nbsp;
            </p>
        );
    }

    saveAction() {
        const { checkList, campusNumber, startYear } = this.props;
        this.props.actions.saveWaiversAction(checkList, { campusNumber, startYear });
    }

    callBackAddAction(selectedItem) {
        const { campusNumber, startYear, endYear, waivers, status } = this.props;
        const payload = Utilities.updatePostPayload(selectedItem, waivers, { campusNumber, startYear, endYear, status });
        this.props.actions.saveWaiversAction(payload, { campusNumber, startYear });
        this.props.history.push('/SavedWaiverDescription/' + campusNumber + '/' + this.props.campusName);
        //window.location = '#SavedWaiverDescription/'+campusNumber+'/'+ this.props.campusName;        
    }
    isValidCustomWaiver(data) {
        const { waiverTitle, waiverDescription } = data;
        let isValid = true;
        if (waiverTitle == null || waiverTitle == "") {
            isValid = false;
            this.displayMessage('Error: Waiver Name', 'Waiver Name cannot be empty.');
            return isValid;
        }

        if (waiverDescription == null || waiverDescription == "") {
            isValid = false;
            this.displayMessage('Error: Waiver Description', 'Waiver description cannot be empty.');
            return isValid;
        }
        return isValid;
    }
    callBackCustomWaiverAction(data) {
        const { startYear, endYear, schoolType, campusNumber, campusName, status } = this.props;
        if (this.isValidCustomWaiver(data)) {
            this.props.actions.addCustomWaiverAction(data, { startYear, endYear, schoolType, campusNumber, status }).then(() => {
                this.props.history.push('/SavedWaiverDescription/' + campusNumber + '/' + campusName);
            });
        }
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
        const { schoolStatus } = this.state;
        const { checkList, waivers, status, isAllowed } = this.props;
        const loadAllWaiversData = (data) => {
            return (
                <ListStructure
                    isAllowed={isAllowed}
                    data={data}
                    callBackAddAction={this.callBackAddAction}
                    callBackCustomWaiverAction={this.callBackCustomWaiverAction}
                />
            )
        }
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="Select School Waivers" isDisabled={true} schoolStatus={status} campusName={this.props.campusName} />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <div className="white-box">
                                <If test={waivers}>
                                    {loadAllWaiversData(waivers)}
                                </If>
                            </div>

                        </div>
                    </div>
                    <Dialog
                        hidden={this.state.hideDialog}
                        onDismiss={this.closeDialog}
                        dialogContentProps={{
                            type: DialogType.normal,
                            title: this.state.title,
                            subText: this.state.subtext
                        }}
                        modalProps={{
                            isBlocking: true,
                            containerClassName: 'ms-dialogMainOverride'
                        }}>
                        <DialogFooter>
                            <PrimaryButton onClick={this.okDialog} text="Ok" styles={this.state.OkButtonStyle} />
                        </DialogFooter>
                    </Dialog>
                </div>
            </div>
        );
    }
}

WaiverDescriptionPage.propTypes = {
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    campuses: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        waivers: state.campuses.waiversList,
        startYear: state.campuses.userStartYear,
        endYear: state.campuses.userEndYear,
        campusName: state.campuses.campusName,
        campusNumber: state.campuses.campusNumber,
        status: state.campuses.status,
        checkList: state.waiversReducer.waiversCheckList,
        isAllowed: state.campuses.isAllowed,
        schoolType: state.waiversReducer.schoolType
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(waiversActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(WaiverDescriptionPage);
