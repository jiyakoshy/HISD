import React from 'react';
import PropTypes from 'prop-types';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import * as relationshipsActions from '../../actions/relationshipsActions';
import * as spUserPropsActions from '../../actions/spUserPropsActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import Utilities from '../../utilities/utilities';
import LinkFormatter from '../common/formatters/linkFormatter';
import LeaderInfo from '../common/LeaderInfo';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class RelationshipsPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            campusID: '', 
            visibility: {visibility: "hidden" },
            firstDayOfWeek: DayOfWeek.Sunday,
            dayPickerStrings: Utilities.getDayPickerStrings(),
            hideDialog: true,
            dialogAction: '',
            subtext: ''
        };
        this.newRelationship = this.newRelationship.bind(this);
        this.filterRecords = this.filterRecords.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
    }

    componentDidMount(){
        this.props.actions.loadRelationshipsByCampusID(this.props.campusID, this.props.userProps.timeConfigurationID);
        const role = this.props.userProps.user.role;
        if(role == 'Admin' || role == 'Principal' || role == 'CIC'){
            this.setState({ visibility: {visibility: "visible"}});
        }
        this.setState({campusID: this.props.campusID});
    }

    newRelationship() {
        document.location = '#newrelationship';
    }

    okDialog(){
        this.closeDialog();
    }

    showDialog() {
      this.setState({ hideDialog: false });
    }
  
    closeDialog() {
      this.setState({ hideDialog: true });
    }

    displayMessage(message, action){
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    renderShowsTotal(start, to, total) {
        return (
          <p style={{color: 'black'}}>
            From {start} to {to}. Total: {total}&nbsp;&nbsp;
          </p>
        );
    }

    dateFormatter(cell, row) {
        let formattedDate = Utilities.getDateOnly(cell);
        if(formattedDate == "12/31/1969") formattedDate = "";
        return (formattedDate);
    }

    linkFormatter(cell, row) {
        let url = '#relationships/' + row.MentorMenteeRelationshipID;
        let tooltip = 'View Mentor/Mentee Relationship';
        return (
          <LinkFormatter url={url} description={cell.toString()} tooltip={tooltip} />
        );
    }

    filterRecords(){

    }
    
    render() {
        if(this.state.campusID != this.props.campusID){
            this.props.actions.loadRelationshipsByCampusID(this.props.campusID, this.props.userProps.timeConfigurationID);
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
        let { firstDayOfWeek } = this.state.firstDayOfWeek;
        let { dayPickerStrings } = this.state.dayPickerStrings;
        const reportStartDate = this.state.reportStartDate;
        const reportEndDate = this.state.reportEndDate;
        return (
            <IfAnyGranted expected={['Admin', 'Principal', 'CIC']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Mentor/Mentee Relationships" campus={this.props.campusName} />
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <LeaderInfo />
                                <div className="white-box">
                                    <PrimaryButton
                                        text="New Relationship"
                                        onClick={this.newRelationship}
                                        style={this.state.visibility}
                                    />
                                    <form className="form-horizontal">
                                        <div className="form-group">
                                            <label className="col-md-1 col-lg-1 col-sm-1" style={{paddingTop: '6px'}}>Start Date:</label> &nbsp;&nbsp;
                                            <div className="col-md-3 col-lg-3 col-sm-3"><DatePicker value={reportStartDate} width={'200px'} firstDayOfWeek={firstDayOfWeek} strings={dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectReportStartDate} placeholder="Select relationship start date..." /></div>
                                            <label className="col-md-1 col-lg-1 col-sm-1" style={{paddingTop: '6px'}}>End Date:</label>&nbsp;&nbsp;
                                            <div className="col-md-3 col-lg-3 col-sm-3"><DatePicker value={reportEndDate} width={'200px'} firstDayOfWeek={firstDayOfWeek} strings={dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectReportEndDate} placeholder="Select relationship end date..." /></div>
                                          
                                            <PrimaryButton
                                                text="Filter"
                                                onClick={this.filterRecords}
                                            />
                                            
                                        </div>
                                    </form>
                                    <BootstrapTable data={this.props.relationships} hover condensed pagination options={options} search>
                                            <TableHeaderColumn dataField="MentorMenteeRelationshipID" isKey width={"40px"} dataAlign="center" dataFormat={this.linkFormatter}>ID</TableHeaderColumn>
                                            <TableHeaderColumn dataField="MentorEmployeeID" dataSort dataAlign="left" width={"70px"} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Mentor Emp. ID</TableHeaderColumn>
                                            <TableHeaderColumn dataField="MentorName" dataSort dataAlign="left" thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Mentor Name</TableHeaderColumn>
                                            <TableHeaderColumn dataField="MenteeEmployeeID" dataSort dataAlign="left" width={"70px"} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Mentee Emp. ID</TableHeaderColumn>
                                            <TableHeaderColumn dataField="MenteeName" dataSort dataAlign="left" thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Mentee Name</TableHeaderColumn>
                                            <TableHeaderColumn dataField="MenteeEndDateInRelationship" dataSort dataAlign="center" dataFormat={this.dateFormatter} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Mentee End Date</TableHeaderColumn>
                                            <TableHeaderColumn dataField="RelationshipStatus" dataSort dataAlign="left" thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Relationship Status</TableHeaderColumn>
                                            <TableHeaderColumn dataField="PrincipalApproval" dataSort dataAlign="center" thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Principal Approval</TableHeaderColumn>
                                            <TableHeaderColumn dataField="MentorAgreement" dataSort dataAlign="center" thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Mentor Agreement</TableHeaderColumn>
                                            <TableHeaderColumn dataField="ApprovalDate" dataSort dataAlign="center" dataFormat={this.dateFormatter} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Approval Date</TableHeaderColumn>
                                            <TableHeaderColumn dataField="RelationshipStartDate" dataSort dataAlign="center" dataFormat={this.dateFormatter} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Relationship Start Date</TableHeaderColumn>
                                            <TableHeaderColumn dataField="RelationshipEndDate" dataSort dataAlign="center" dataFormat={this.dateFormatter} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Relationship End Date</TableHeaderColumn>
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
                            title: 'Mentor/Mentee Relationship',
                            subText: this.state.subtext
                        }}
                        modalProps={{
                            isBlocking: true,
                            containerClassName: 'ms-dialogMainOverride'
                        }}
                        >
                        <DialogFooter>
                            <PrimaryButton onClick={this.okDialog} text="Ok" />
                            <DefaultButton onClick={this.closeDialog} text="Cancel" />
                        </DialogFooter>
                    </Dialog>
                </div>
            </IfAnyGranted>
        );
    }
}

RelationshipsPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    relationships: PropTypes.array,
    newRelationship: PropTypes.func,
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object,
    spUserProps: PropTypes.object,
    history: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        relationships: state.relationships,
        userProps: state.userProps,
        spUserProps: state.spUserProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, relationshipsActions, spUserPropsActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(RelationshipsPage);