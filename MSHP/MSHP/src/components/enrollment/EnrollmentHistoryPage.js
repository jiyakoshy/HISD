import React from 'react';
import PropTypes from 'prop-types';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import * as reportsActions from './../../actions/reportsActions';
import * as campusActions from '../../actions/campusActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import Utilities from '../../utilities/utilities';
import LinkFormatter from '../common/formatters/linkFormatter';
import * as enrollmentActions from './../../actions/enrollmentActions';
import * as sharedActions from './../../actions/sharedActions';

import { campusesFormattedForDropdownGeneric, campusesFormattedForDropdown, reportDateYearsFormattedForDropdown, currentYearKey } from './../../selectors/selectors';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

//MAS DemographicReport provided template for Enroll His
class EnrollmentHistoryPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            campusID: (this.props.userProps.user.role == 'Campus') ? this.props.userProps.user.campusID : '001',
            isCampusDD_Disabled: false,

            //allReportDates: [],
            schoolYear: Utilities.getSchoolYear(),
            selectedYear: '',
           
            schoolID: (this.props.userProps.user.role == 'Campus') ? this.props.userProps.user.campusID :'',
            

            hideDialog: true,
            reportStartDate: null,
            reportEndDate: null,
            
            dialogAction: '',
            subtext: '',
            isShow: false
        };

        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.displayMessage = this.displayMessage.bind(this);

        this.onSchoolDropdownChanged = this.onSchoolDropdownChanged.bind(this);
        this.onYearsDropdownChanged = this.onYearsDropdownChanged.bind(this);
        //this.onSelectReportStartDate = this.onSelectReportStartDate.bind(this);
        

        this.runReport = this.runReport.bind(this);
        this.isValidForm = this.isValidForm.bind(this);
        this.cancelToHome = this.cancelToHome.bind(this);
    }

    
    componentWillMount() {
        if (this.props.userProps.user.role == 'Campus' || this.props.userProps.user.role == 'Reports') {
            this.setState({ isCampusDD_Disabled: true });
 
        }
}
    componentDidMount(){
        
        
        
        
    }

    

    isValidForm(){
        let isValid = true;
       /*  if(this.state.reportStartDate == null){
            isValid = false;
            this.displayMessage('Error: Invalid Start Date. Start Date must be selected', '');
        }
        else if(this.state.reportEndDate == null){
            isValid = false;
            this.displayMessage('Error: Invalid End Date. End Date must be selected', '');
        } */
        return isValid;
    }
//like campus DD
    onSchoolDropdownChanged(item) {
        //only Admins get here
        let useYear = '';
        if (this.state.selectedYear && this.state.selectedYear.length > 8){
            useYear = this.state.selectedYear;
        } else {
            useYear = Utilities.getSchoolYear();
        }
        //this.props.actions.updateUserCampus(item, useYear);//nothing depending on user.campus
        this.setState({ schoolID: item.key });
        if (this.state.selectedYear && this.state.selectedYear.length == 9){
            this.runReport(useYear, item.key);
        }
    }

    onYearsDropdownChanged(item) { 
       //admin had to select a campus so state.schoolID is already set (thus req that school DD is not disabled)...campus user uses user.campusID
        this.setState({isShow: false});
        this.setState({selectedYear: item.text});
        //year selected... get school
        let schoolID = this.state.schoolID;
        if (schoolID == '') {
            this.displayMessage('Please select a campus first.', 'CLOSE');
        } else {
            this.runReport(item.text, schoolID);
        }
        
    }

    runReport(year, schoolID){
        //debugger;
        if(this.isValidForm() !== true) return;
            
            let promise = this.props.actions.loadAllEnrollmentsByYearCampus(schoolID, year);
                promise.then(enrollments => {

                    console.log('completed loadEnrollment call', enrollments);
                })
                .catch(reason => {
                    this.props.actions.ajaxCallError();
                });
           
            

            this.setState({isShow: true});
            
        
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

    formatDate(date) {
        if (date) {
            let newDate = Utilities.getDateOnly(date);
            return newDate;
        }
        return '';
    }

    lowerCaseFormatter(cell, row) {
        return (
          <span style={{textTransform: "lowercase"}}>{cell}</span>
        );
    }

    dateFormatter(cell, row) {
        let formattedDate = Utilities.getDateOnly(cell);
        if(formattedDate == "12/31/1969") formattedDate = "";
        return (formattedDate);
    }
    cancelToHome(){
        document.location = '#home';
    }

    
    linkFormatter(cell, row) {
        let url = '#editenrollmentinput/' + row.CampusEnrollmentID;
        let tooltip = 'Edit at EnrollmentInput Page';
        return (
          <LinkFormatter url={url} description={row.ReportDate} tooltip={tooltip} />
        );
    }
    render() {
        
        let campusDD = null;
        
        console.log('EIP -- this.props.userProps.user.role-------------', this.props.userProps.user.role);
        console.log('EIP -- this.props.userProps.user.isChoseSchool-------------', this.props.userProps.user.isChoseSchool);

        
        /* if (this.props.userProps.user.role == 'Admin'){
            if (this.props.userProps.user.isChoseSchool === false){
                //place message here or at HomePage/PageHeader gfm
                this.cancelToHome();
                
                } 
        } */
        
        if(this.props.userProps.user.role == 'Admin'){
            campusDD = (
                <div>
                    <div className="dropDownPageHeader pull-right">
                        <b>
                            <Dropdown
                                options={this.props.allCampuses} 
                                placeHolder="Choose a campus first"
                                onChanged={this.onSchoolDropdownChanged} 
                                
                                
                                />
                        </b>
                    </div>
                </div>
            );
        } else {
            campusDD = (
                    <div className="dropDownPageHeader pull-right">
                    <b>
                        <Dropdown options={this.props.allCampuses} 
                                onChanged={this.onSchoolDropdownChanged}
                                selectedKey={this.state.schoolID} 
                                disabled={this.state.isCampusDD_Disabled} />
                    </b>
                    </div>    
            );
        }
        

        const options = {
            defaultSortName: 'CampusEnrollmentID',
            sortOrder: 'asc',
            prePage: 'Prev',
            nextPage: 'Next',
            firstPage: 'First',
            lastPage: 'Last',
            paginationShowsTotal: this.renderShowsTotal
        };
        let bootStrap = null;
        if (this.state.isShow){
            bootStrap =  (
                <div>

                <BootstrapTable data={this.props.enrollments} hover condensed pagination search>
                                    <TableHeaderColumn dataField="CampusEnrollmentID" dataAlign="left" isKey hidden />
                                        <TableHeaderColumn dataField="InstructionDay" dataSort dataAlign="left" width={"150px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Instruction Day</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ReportDate" dataFormat={this.linkFormatter} dataAlign="left" width={"150px"}>Report Date</TableHeaderColumn>
                                        <TableHeaderColumn dataField="IEE" dataAlign="left" width={"80px"}>EE</TableHeaderColumn>
                                        <TableHeaderColumn dataField="IPK" dataAlign="left" width={"80px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>PK</TableHeaderColumn>
                                        <TableHeaderColumn dataField="IKG" dataAlign="left" width={"80px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>KG</TableHeaderColumn>
                                        <TableHeaderColumn dataField="I01" dataAlign="left" width={"80px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>01</TableHeaderColumn>
                                        <TableHeaderColumn dataField="I02" dataAlign="left" width={"80px"} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>02</TableHeaderColumn>
                                        <TableHeaderColumn dataField="I03" dataAlign="left" width={"80px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>03</TableHeaderColumn>
                                        <TableHeaderColumn dataField="I04" dataAlign="left" width={"80px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>04</TableHeaderColumn>
                                        <TableHeaderColumn dataField="I05" dataAlign="left" width={"80px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>05</TableHeaderColumn>
                                        <TableHeaderColumn dataField="I06" dataAlign="left" width={"80px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>06</TableHeaderColumn>
                                        <TableHeaderColumn dataField="I07" dataAlign="left" width={"80px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>07</TableHeaderColumn>
										<TableHeaderColumn dataField="I08" dataAlign="left" width={"80px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>08</TableHeaderColumn>
                                        <TableHeaderColumn dataField="I09" dataAlign="left" width={"80px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>09</TableHeaderColumn>
                                        <TableHeaderColumn dataField="I10" dataAlign="left" width={"80px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>10</TableHeaderColumn>
                                        <TableHeaderColumn dataField="I11" dataAlign="left" width={"80px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>11</TableHeaderColumn>
                                        <TableHeaderColumn dataField="I12" dataAlign="left" width={"80px"} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>12</TableHeaderColumn>
                                        <TableHeaderColumn dataField="CreatedBy" dataAlign="left" width={"80px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>Created</TableHeaderColumn>
										<TableHeaderColumn dataField="CreatedDate" dataAlign="left" width={"80px"} dataFormat={this.dateFormatter} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>On</TableHeaderColumn>
                                        <TableHeaderColumn dataField="UpdatedBy" dataAlign="left" width={"80px"} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word', maxHeight: '20px'}}>Updated</TableHeaderColumn>
										<TableHeaderColumn dataField="UpdatedDate" dataAlign="left" width={"80px"} dataFormat={this.dateFormatter} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>On</TableHeaderColumn>
										
										
                                    </BootstrapTable>




                </div>

            );
        }
        
        
        return (
            <IfAnyGranted expected={['Admin','Campus']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        
                        <form >
                            <div className="row bg-title">
                                <div className="col-lg-12 col-md-12 col-sm-12 ">
                                    <span className="page-title-custom">Enrollment History</span>

                                        {campusDD}
                                            
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{paddingTop: "8px"}}>School Year</label>
                                <div className="col-md-4 col-lg-4 col-sm-4">
                                <Dropdown   placeHolder="--- Choose a School Year ---"
                                            options={this.props.allReportDates}
                                            onChanged={this.onYearsDropdownChanged} />
                                
                                <label className="col-md-2 col-lg-2 col-sm-2" style={{paddingTop: "8px"}}></label>
                               
                                    
                                </div>
                            </div>
                            <div className="form-group">
                                
                            </div>		
                        </form>
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div className="white-box">
                                    <div className="col-md-12 col-lg-12 col-sm-12 pull-right" style={{textAlign: 'right', paddingBottom: '8px'}}>
                                       
                                    </div>
									{bootStrap}
									
									
</div>
                            </div>
                        </div>
                    </div>
                    <Dialog
                        hidden={this.state.hideDialog}
                        onDismiss={this.closeDialog}
                        dialogContentProps={{
                            type: DialogType.normal,
                            title: 'Enrollment History Page',
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


function mapStateToProps(state, ownProps) {
    /* let flexCampuses = [];
    if (this.props.userProps.user.role == 'Campus'){
	    flexCampuses = campusesFormattedForDropdown(state.campuses, state.userProps.user.campusID, state.userProps.user.campusName);
    } else {
        flexCampuses = campusesFormattedForDropdown(state.campuses, '001', 'Austin High School');
    } */
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        userProps: state.userProps,
        
        allCampuses: campusesFormattedForDropdownGeneric(state.campuses),
        reportData: state.reportData,
        allReportDates: reportDateYearsFormattedForDropdown(state.calendarReportDates),
        calendarReportDates: state.calendarReportDates,
        enrollments: state.enrollments
        
    };
}

EnrollmentHistoryPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
   
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object,
    campuses: PropTypes.array,
    allCampuses: PropTypes.array,
    reportData: PropTypes.array,
    history: PropTypes.object,
    calendarReportDates: PropTypes.array,
    allReportDates: PropTypes.array,
    enrollments: PropTypes.array,
    cancelToHome: PropTypes.func
    
};

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, campusActions, reportsActions, ajaxActions, enrollmentActions, sharedActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EnrollmentHistoryPage);									