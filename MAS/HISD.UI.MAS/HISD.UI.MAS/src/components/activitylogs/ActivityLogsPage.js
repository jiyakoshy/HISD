import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import * as activityLogsActions from '../../actions/activityLogsActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import * as adminActions from '../../actions/adminActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import MenteesTable from '../mentees/MenteesTable';
import Utilities from '../../utilities/utilities';
import LinkFormatter from '../common/formatters/linkFormatter';
import LeaderInfo from '../common/LeaderInfo';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

let hasMounted = false;

class ActivityLogsPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.newActivityLogEntry = this.newActivityLogEntry.bind(this);
        this.state = {
            campusID: '',
            hideDialog: true,
            dialogAction: '',
            subtext: '',
            // conditional 
            isMentor: false,
            activityLogs: null,
            isActivityLogEditable: false
        };
    }

    componentWillMount() {
        const loggedInRole = this.props.userProps.user.role;
        this.setState({ userRole: loggedInRole });
        if (loggedInRole == "Mentor") {
            this.setState({ isMentor: true });
        }
        let formattedLogStartDate = new Date(Utilities.getDateOnly(this.props.userProps.LogStartDate));
        let formattedLogEndDate = new Date(Utilities.getDateOnly(this.props.userProps.LogEndDate));
        let formattedDate = new Date();
        if (formattedDate >= formattedLogStartDate && formattedDate <= formattedLogEndDate) {
            this.setState({ isActivityLogEditable: true });
        }
        this.props.actions.clearActivityLog();
        this.props.actions.loadCampusContactsByCampusID(this.props.campusID);
        this.props.actions.loadActivityLogsByCampusID(this.props.campusID, this.props.userProps.timeConfigurationID)
            .then(activityLogsData => {

                if (this.props.activityLogs.length > 0) {
                    if (!this.state.isMentor)
                        this.setState({ activityLogs: this.props.activityLogs });

                    else {
                        let filterActivityLog = this.props.activityLogs.filter(e => {
                            return (e.MentorEmployeeID == this.props.userProps.user.staffNaturalKey);
                        });
                        //  let filterActivityLogPartTwo = [...filterActivityLog];
                        let filterActivityLogPartTwo = JSON.parse(JSON.stringify(filterActivityLog));
                        filterActivityLogPartTwo.map(e => {
                            e.LogStartDate = this.props.userProps.LogStartDate;
                            e.LogEndDate = this.props.userProps.LogEndDate;
                        });
                        this.setState({ activityLogs: filterActivityLogPartTwo });
                    }
                }
                hasMounted = true;
            })
            .catch(reason => {
                this.props.actions.ajaxCallError();
                this.displayMessage('There was a problem retrieving activity logs. Operation canceled.', '');
            });
        this.setState({ campusID: this.props.campusID });
    }

    cancel() {
        document.location = '#activitylogs';
    }

    okDialog() {
        if (this.state.dialogAction == 'SAVED')
            this.cancel();
        else
            this.closeDialog();
    }

    displayMessage(message, action) {
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    showDialog() {
        this.setState({ hideDialog: false });
    }

    closeDialog() {
        this.setState({ hideDialog: true });
    }

    newActivityLogEntry() {
        document.location = '#newactivitylogentry';
    }

    timeFormatter(cell, row) {
        let formattedDate = Utilities.getDateOnly(cell);
        let formattedTime = Utilities.getTimeOnly(cell);
        if (formattedDate == "12/31/1969") formattedTime = "";
        return (formattedTime);
    }

    dateFormatter(cell, row) {
        let formattedDate = Utilities.getDateOnly(cell);
        if (formattedDate == "12/31/1969") formattedDate = "";
        return (formattedDate);
    }


    linkFormatter(cell, row) {
        let formattedLogStartDate = new Date(Utilities.getDateOnly(row.LogStartDate));
        let formattedLogEndDate = new Date(Utilities.getDateOnly(row.LogEndDate));
        let formattedDate = new Date(Utilities.getDateOnly(row.ActivityStartTime));
        if (formattedDate >= formattedLogStartDate && formattedDate <= formattedLogEndDate) {
            let url = '#activitylogs/' + row.ActivityLogID;
            let tooltip = 'Edit Activity Log';
            return (
                <LinkFormatter url={url} description="View/Edit" tooltip={tooltip} />
            );
        }

    }



    menteeFormatter(cell, row) {
        let mentees = "";
        const comp = cell.split(';');
        return (
            <div>
                {comp.map((item, index) => (
                    <div key={index}>{item}</div>
                ))}
            </div>
        );
    }

    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'black' }}>
                From {start} to {to}. Total: {total}&nbsp;&nbsp;
            </p>
        );
    }

    expandComponent(row) {
        if (hasMounted === true && this.expanding.length == 0 || this.expanding.indexOf(row.Mentees[0].ActivityLogID) === -1)
            return (<div></div>);
        else {
            return (<MenteesTable data={row.Mentees} role="NotMentor" />);
        }
    }
    expandComponentMentor(row) {
        if (hasMounted === true && this.expanding.length == 0 || this.expanding.indexOf(row.Mentees[0].ActivityLogID) === -1)
            return (<div></div>);
        else {
            return (<MenteesTable data={row.Mentees} role="Mentor" />);
        }
    }

    expandColumnComponent({ isExpandableRow, isExpanded }) {
        let content = '';
        if (isExpandableRow) {
            content = (isExpanded ? '(-)' : '(+)');
        } else {
            content = ' ';
        }
        return (<div>{content}</div>);
    }

    isExpandableRow(row) {
        if (row.Mentees.length > 0)
            return true;
        else
            return false;
    }

    render() {
        if (this.state.campusID != this.props.campusID && hasMounted == true) {
            this.props.actions.loadActivityLogsByCampusID(this.props.campusID, this.props.userProps.timeConfigurationID)
                .then(activityLogs => {
                    if (this.props.activityLogs.length > 0) {
                        if (!this.state.isMentor)
                            this.setState({ activityLogs: this.props.activityLogs });

                        else {
                            let filterActivityLog = this.props.activityLogs.filter(e => {
                                return (e.MentorEmployeeID == this.props.userProps.user.staffNaturalKey);
                            });
                            //  let filterActivityLogPartTwo = [...filterActivityLog];
                            let filterActivityLogPartTwo = JSON.parse(JSON.stringify(filterActivityLog));
                            filterActivityLogPartTwo.map(e => {
                                e.LogStartDate = this.props.userProps.LogStartDate;
                                e.LogEndDate = this.props.userProps.LogEndDate;
                            });
                            this.setState({ activityLogs: filterActivityLogPartTwo });
                        }
                    }
                });
            this.props.actions.loadCampusContactsByCampusID(this.props.campusID);
            this.setState({ campusID: this.props.campusID });
        }
        const options = {
            defaultSortName: 'MentorName',
            sortOrder: 'asc',
            prePage: 'Prev',
            nextPage: 'Next',
            firstPage: 'First',
            lastPage: 'Last',
            paginationShowsTotal: this.renderShowsTotal,
            expandRowBgColor: 'rgb(175, 238, 238)'
        };
        const optionsForMentor = {
            defaultSortName: 'ActivityStartTime',
            sortOrder: 'desc',
            prePage: 'Prev',
            nextPage: 'Next',
            firstPage: 'First',
            lastPage: 'Last',
            paginationShowsTotal: this.renderShowsTotal,
            expandRowBgColor: 'rgb(175, 238, 238)'
        };



        return (
            <IfAnyGranted expected={['Admin', 'Principal', 'CIC', 'Mentor']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Activity Log" campus={this.props.campusName} />
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <LeaderInfo />
                                <div>{this.state.isMentor &&
                                    this.state.isActivityLogEditable &&
                                    <div className="white-box-button">
                                        <PrimaryButton
                                            text="New Activity Log Entry"
                                            onClick={this.newActivityLogEntry}
                                        />
                                    </div>
                                }</div>
                                <div>{this.state.userRole == 'Mentor' &&
                                    <div className="white-box">
                                        <h3>Existing Activity Logs</h3>
                                        <BootstrapTable data={this.state.activityLogs} hover condensed pagination options={optionsForMentor} search
                                            expandableRow={this.isExpandableRow}
                                            expandComponent={this.expandComponentMentor}
                                            expandColumnOptions={{
                                                expandColumnVisible: true,
                                                onlyOneExpanding: true,
                                                expandColumnComponent: this.expandColumnComponent,
                                                columnWidth: 25
                                            }}>
                                            <TableHeaderColumn dataField="ActivityLogID" isKey dataAlign="center" dataFormat={this.linkFormatter}>View/Edit</TableHeaderColumn>
                                            <TableHeaderColumn dataField="MentorComments" dataSort dataAlign="left" tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>Mentor Comments</TableHeaderColumn>
                                            <TableHeaderColumn dataField="ActivityCodeName" dataSort dataAlign="left">Activity Code</TableHeaderColumn>
                                            <TableHeaderColumn dataField="ActivityStartTime" dataSort dataAlign="center" dataFormat={this.dateFormatter}>Activity Date</TableHeaderColumn>
                                            <TableHeaderColumn dataField="ActivityStartTime" dataSort dataAlign="center" dataFormat={this.timeFormatter}>Activity Time</TableHeaderColumn>
                                            <TableHeaderColumn dataField="Duration" dataSort dataAlign="center" >Duration</TableHeaderColumn>
                                        </BootstrapTable>
                                    </div>
                                }</div>

                                <div>{this.state.userRole != 'Mentor' &&
                                    <div className="white-box">
                                        <h3>Existing Activity Logs</h3>
                                        <BootstrapTable data={this.props.activityLogs} hover condensed pagination options={options} search
                                            expandableRow={this.isExpandableRow}
                                            expandComponent={this.expandComponent}
                                            expandColumnOptions={{
                                                expandColumnVisible: true,
                                                onlyOneExpanding: true,
                                                expandColumnComponent: this.expandColumnComponent,
                                                columnWidth: 25
                                            }}>
                                            <TableHeaderColumn dataField="ActivityLogID" isKey dataAlign="center" hidden>ID</TableHeaderColumn>
                                            <TableHeaderColumn dataField="MentorName" dataSort dataAlign="left" tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>Mentor Name</TableHeaderColumn>
                                            <TableHeaderColumn dataField="MentorComments" dataSort dataAlign="left" tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>Mentor Comments</TableHeaderColumn>
                                            <TableHeaderColumn dataField="ActivityCodeName" dataSort dataAlign="left">Activity Code</TableHeaderColumn>
                                            <TableHeaderColumn dataField="ActivityStartTime" dataSort dataAlign="center" dataFormat={this.dateFormatter}>Activity Date</TableHeaderColumn>
                                            <TableHeaderColumn dataField="ActivityStartTime" dataSort dataAlign="center" dataFormat={this.timeFormatter}>Activity Time</TableHeaderColumn>
                                            <TableHeaderColumn dataField="Duration" dataSort dataAlign="center" >Duration</TableHeaderColumn>
                                        </BootstrapTable>
                                    </div>
                                }</div>

                            </div>
                        </div>
                    </div>
                    <Dialog
                        hidden={this.state.hideDialog}
                        onDismiss={this.closeDialog}
                        dialogContentProps={{
                            type: DialogType.normal,
                            title: 'Activity Log',
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

ActivityLogsPage.propTypes = {
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
    return { actions: bindActionCreators(Object.assign({}, activityLogsActions, ajaxActions, adminActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityLogsPage);
