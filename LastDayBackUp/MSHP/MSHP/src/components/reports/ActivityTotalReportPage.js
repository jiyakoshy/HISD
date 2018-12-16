import React from 'react';
import PropTypes from 'prop-types';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import * as sharedActions from './../../actions/sharedActions';
import * as campusActions from './../../actions/campusActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import Utilities from '../../utilities/utilities';
import LinkFormatter from '../common/formatters/linkFormatter';
import { campusesFormattedForDropdown } from './../../selectors/selectors';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class ActivityTotalReportPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            campusID: '',
            CSOEmployeeID: '',
            schoolID: '',
            schoolOfficeOptions: [],
            schoolNameOptions: [],
            hideDialog: true,
            reportStartDate: null,
            reportEndDate: null,
            firstDayOfWeek: DayOfWeek.Sunday,
            dayPickerStrings: Utilities.getDayPickerStrings(),
            dialogAction: '',
            subtext: ''
        };
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);

        this.onCSODropdownChanged = this.onCSODropdownChanged.bind(this);
        this.onSchoolDropdownChanged = this.onSchoolDropdownChanged.bind(this);

        this.onSelectReportStartDate = this.onSelectReportStartDate.bind(this);
        this.onSelectReportEndDate = this.onSelectReportEndDate.bind(this);
    }

    componentDidMount(){
        const role = this.props.userProps.user.role;
        this.setState({campusID: this.props.campusID});
        this.props.actions.clearReportData();
        this.props.actions.loadAllCampuses();
    }

    onCSODropdownChanged(){

    }

    onSchoolDropdownChanged(item) {
        this.setState({ schoolID: item.key });
    }

    onSelectReportStartDate(date) {
        this.setState({ reportStartDate: date });
    }

    onSelectReportEndDate(date) {
        this.setState({ reportEndDate: date });
    }

    runReport(){
       
    }

    formatDate(date) {
        if (date) {
            let newDate = Utilities.getDateOnly(date);
            return newDate;
        }
        return '';
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
    
    render() {
        const options = {
            defaultSortName: 'CSO',
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
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Activity Total Report" campus={this.props.campusName} />
                        <form className="form-horizontal">
                            <div className="form-group">
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{paddingTop: "8px"}}>School Office</label>
                                <div className="col-md-10 col-lg-10 col-sm-10">
                                    <Dropdown placeHolder="Select CSO" options={this.state.schoolOfficeOptions} selectedKey={this.state.CSOEmployeeID} onChanged={this.onCSODropdownChanged} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{paddingTop: "8px"}}>School Name</label>
                                <div className="col-md-10 col-lg-10 col-sm-10">
                                    <Dropdown placeHolder="Select School" options={this.props.allCampuses} defaultSelectedKey="All" onChanged={this.onSchoolDropdownChanged} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{paddingTop: "8px"}}>Start Date</label>
                                <div className="col-md-4 col-lg-4 col-sm-4">
                                    <DatePicker value={reportStartDate} firstDayOfWeek={firstDayOfWeek} strings={dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectReportStartDate} placeholder="Select start date..." />
                                </div>
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{paddingTop: "8px"}}>End Date</label>
                                <div className="col-md-4 col-lg-4 col-sm-4">
                                    <DatePicker value={reportEndDate} firstDayOfWeek={firstDayOfWeek} strings={dayPickerStrings} formatDate={this.formatDate} onSelectDate={this.onSelectReportEndDate} placeholder="Select end date..." />
                                </div>
                            </div>
                        </form>
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div className="white-box">
                                    <div className="col-md-12 col-lg-12 col-sm-12 pull-right" style={{textAlign: 'right', paddingBottom: '8px'}}>
                                        <PrimaryButton
                                            text="Run Report"
                                            onClick={this.runReport}
                                        />
                                    </div>
                                    <BootstrapTable data={this.props.relationships} hover condensed pagination options={options} search exportCSV>
                                        <TableHeaderColumn dataField="CSO" isKey width={"140px"} dataAlign="left">CSO Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="SchoolName" dataSort dataAlign="left">School Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="PSDeptID" dataSort dataAlign="left">PS Dept ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ActivityCode" dataSort dataAlign="left">Activity Code</TableHeaderColumn>
                                        <TableHeaderColumn dataField="Time" dataSort dataAlign="left">Time</TableHeaderColumn>
                                        <TableHeaderColumn dataField="CSOTotal" dataSort dataAlign="left">CSO Total</TableHeaderColumn>
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
                            title: 'Activity Total Report',
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

ActivityTotalReportPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    relationships: PropTypes.array,
    newRelationship: PropTypes.func,
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object,
    allCampuses: PropTypes.array,
    history: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    let campuses = campusesFormattedForDropdown(state.campuses, state.userProps.user.campusID, state.userProps.user.campusName);
    const first = {text: "--- All Schools ---", key: "All"};
    campuses.unshift(first);
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        userProps: state.userProps,
        allCampuses: campuses
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, campusActions, sharedActions, ajaxActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityTotalReportPage);