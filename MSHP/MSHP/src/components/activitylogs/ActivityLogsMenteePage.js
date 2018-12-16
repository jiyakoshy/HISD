import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import * as activityLogsActions from '../../actions/activityLogsActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import MenteesTable from '../mentees/MenteesTable';
import Utilities from '../../utilities/utilities';
import LinkFormatter from '../common/formatters/linkFormatter';
import LeaderInfo from '../common/LeaderInfo';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

let hasMounted = false;

class ActivityLogsMenteePage extends React.Component {
     constructor(props, context) {
        super(props, context);
        this.state = { 
            campusID: '',
            hideDialog: true,
            dialogAction: '',
            subtext: '' 
        };
    }

    componentDidMount(){
        this.props.actions.clearActivityLog();
        this.props.actions.loadActivityLogsByMenteeID(this.props.campusID, this.props.userProps.timeConfigurationID)
        .then(activityLogs => {
            hasMounted = true;
        })
        .catch(reason => {
            this.props.actions.ajaxCallError();
            this.displayMessage('There was a problem retrieving activity logs. Operation canceled. Reason: ' + reason, '');
        });
        this.setState({campusID: this.props.campusID});
    }

    cancel() {
        document.location = '#activitylogs';
    }

    okDialog(){
        if(this.state.dialogAction == 'SAVED')
            this.cancel();
        else
            this.closeDialog();
    }

    displayMessage(message, action){
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    showDialog() {
      this.setState({ hideDialog: false });
    }
  
    closeDialog() {
      this.setState({ hideDialog: true });
    }

    timeFormatter(cell, row) {
        let formattedDate = Utilities.getDateOnly(cell);
        let formattedTime = Utilities.getTimeOnly(cell);
        if(formattedDate == "12/31/1969") formattedTime = "";
        return (formattedTime);
    }

    dateFormatter(cell, row) {
        let formattedDate = Utilities.getDateOnly(cell);
        if(formattedDate == "12/31/1969") formattedDate = "";
        return (formattedDate);
    }

    linkFormatter(cell, row) {
        let url = '#menteeverification/' + row.ActivityLogID + '/' + row.ActivityLogMenteeID;
        let tooltip = 'Edit Activity Log Verification';
        return (
          <LinkFormatter url={url} description={row.MenteeName} tooltip={tooltip} />
        );
    }
    

   

    render() {
        if(this.state.campusID != this.props.campusID && hasMounted == true){
            this.props.actions.loadActivityLogsByMenteeID(this.props.userProps.user.employeeID, this.props.userProps.timeConfigurationID);
            this.setState({campusID: this.props.campusID});
        }
        const options = {
            defaultSortName: 'MentorName',
            sortOrder: 'asc',
            prePage: 'Prev',
            nextPage: 'Next',
            firstPage: 'First',
            lastPage: 'Last',
            paginationShowsTotal: this.renderShowsTotal
        };

        return (
            <IfAnyGranted expected={['Admin', 'Mentee']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="My Activity Logs" campus={this.props.campusName} />
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <LeaderInfo />
                                <div className="white-box">
                                    <BootstrapTable data={this.props.activityLogs} hover condensed pagination options={options} search>
                                        <TableHeaderColumn dataField="ActivityLogMenteeID" isKey hidden />
                                        <TableHeaderColumn dataField="MenteeName" dataAlign="left" dataFormat={this.linkFormatter} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Mentee Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MentorName" dataSort dataAlign="left" tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Mentor Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ActivityLogID" dataSort dataAlign="center" width={"100px"} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>Activity Log ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ActivityCodeName" dataSort dataAlign="left" width={"100px"}>Activity Code</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ActivityStartTime" dataSort dataAlign="center" width={"100px"} dataFormat={this.dateFormatter}>Activity Date</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ActivityStartTime" dataSort dataAlign="center" width={"100px"} dataFormat={this.timeFormatter}>Activity Time</TableHeaderColumn>
                                        <TableHeaderColumn dataField="Duration" dataSort dataAlign="center" width={"80px"}>Duration</TableHeaderColumn>
                                        <TableHeaderColumn dataField="VerificationCommentCode" dataSort dataAlign="left" width={"200px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>Verif. Comment Code</TableHeaderColumn>
                                        <TableHeaderColumn dataField="VerificationCommentDescription" dataSort dataAlign="left" width={"300px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>Verif. Comment Description</TableHeaderColumn>
                                        <TableHeaderColumn dataField="VerificationStatus" dataSort dataAlign="center" width={"110px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>Verif. Status</TableHeaderColumn>
                                    </BootstrapTable>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Dialog
                        hidden={this.state.hideDialog}
                        onDismiss={this.closeDialog}
                        dialogContentProps={{
                            type: DialogType.normal,
                            title: 'Activity Logs',
                            subText: this.state.subtext
                        }}
                        modalProps={{
                            isBlocking: true,
                            containerClassName: 'ms-dialogMainOverride'
                        }}
                        >
                        <DialogFooter>
                            <PrimaryButton onClick={this.okDialog} text="Ok" styles={this.state.OkButtonStyle} />
                            <DefaultButton onClick={this.closeDialog} text="Cancel" />
                        </DialogFooter>
                    </Dialog>
                </div>
            </IfAnyGranted>
        );
    }
}

ActivityLogsMenteePage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    activityLogs: PropTypes.array,
    newActivityLogEntry: PropTypes.func,
    actions: PropTypes.object.isRequired,
    history: PropTypes.object,
    userProps: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        activityLogs: state.activityLogs,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, activityLogsActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityLogsMenteePage);
