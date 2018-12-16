import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as centralOfficeActions from '../../actions/centralOfficeActions';
import * as candidateSearchCampusesActions from '../../actions/candidateSearchCampusesActions';
import * as payGradeActions from '../../actions/payGradeActions';
import * as candidateNomineesActions from '../../actions/candidateNomineesAction';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import 'rc-time-picker/assets/index.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import TimePicker from 'rc-time-picker';
import Utilities from '../../utilities/utilities';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import CentralOfficeCandidateNominees from './CentralOfficeCandidateNominees';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class CampusCandidateNominees extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            employeeID: '',
            employeeName: '',
            CandidatesEligible: null,
            yearID: '',
            candidateNominees: null,
            candidateNomineesAllCampus: [],
            classRoomTeacherCount: 0,
            campusBaedProfessionalCount: 0,
            showAllCandidateNominees: false
        };

        this.onChangeEmployeeID = this.onChangeEmployeeID.bind(this);
        this.onChangeEmployeeName = this.onChangeEmployeeName.bind(this);

        this.search = this.search.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.addCandidateFormatter = this.addCandidateFormatter.bind(this);
        this.loadCandidateNominees = this.loadCandidateNominees.bind(this);
        this.loadAllCandidateNominees = this.loadAllCandidateNominees.bind(this);
        this.loadCandidateEligibilityAfterFilteringFromCandidateNominees = this.loadCandidateEligibilityAfterFilteringFromCandidateNominees.bind(this);
        this.deleteCandidateFormatter = this.deleteCandidateFormatter.bind(this);

        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }
    componentWillMount() {
        let schoolYear;
        if (this.props.userProps.schoolYearDescription) {
            schoolYear = this.props.userProps.schoolYearDescription;
            let partsOfStr = schoolYear.split('-');
            this.setState({ yearID: partsOfStr[0] });
        }
        this.loadCandidateNominees(this.props.votingSettingID,
            this.props.userProps.user.campusID, this.props.userProps.user.campusName);
        if (this.props.userProps.user.role == "Admin") {
            this.setState({ showAllCandidateNominees: true });
            this.loadAllCandidateNominees();
        }
        else {
            this.setState({ showAllCandidateNominees: false });
        }

    }
    componentWillReceiveProps(nextProps) {
        if (this.props.userProps.user.campusID !== nextProps.userProps.user.campusID) {
            this.setState({ CandidatesEligible: [] });
            this.setState({ employeeName: "" });
            this.setState({ employeeID: "" });
            this.loadCandidateNominees(this.props.votingSettingID,
                nextProps.userProps.user.campusID, nextProps.userProps.user.campusName);



        }
        if ((this.props.userProps.user.role !== nextProps.userProps.user.role) && nextProps.userProps.user.role == "Admin") {
            this.setState({ showAllCandidateNominees: true });
            this.loadAllCandidateNominees();
        }
        if ((this.props.userProps.user.role !== nextProps.userProps.user.role) && nextProps.userProps.user.role !== "Admin") {
            this.setState({ showAllCandidateNominees: false });

        }
    }

    loadAllCandidateNominees() {
        this.props.actions.loadCandidateNomineesAllCampus(this.props.votingSettingID)
            .then(candidateNominees => {
                if (this.props.candidateNomineesAllCampus.length > 0) {
                    this.setState({
                        candidateNomineesAllCampus: this.props.candidateNomineesAllCampus
                    });
                }
            });
    }
    loadCandidateNominees(votingSettingID, campusID, campusName) {
        this.props.actions.loadCandidateNomineesUsingCampusID(votingSettingID, campusID, campusName)
            .then(candidateNominees => {
                if (this.props.candidateNominees.value.length > 0) {
                    this.setState({ candidateNominees: this.props.candidateNominees.value });

                    let teachersArray = this.props.candidateNominees.value.filter(res => {
                        return (res.CandidateTypeName == "Classroom Teacher");
                    });

                    let nonTeachersArray = this.props.candidateNominees.value.filter(res => {
                        return (res.CandidateTypeName == "Campus Based Professional");
                    });
                    // this.setState({ classRoomTeacherCount: teachersArray.length });
                    // this.setState({ campusBaedProfessionalCount: nonTeachersArray.length });

                    this.setState({ classRoomTeacherCount: 0 });
                    this.setState({ campusBaedProfessionalCount: 0 });


                    if (this.state.CandidatesEligible) {
                        let candidatesEligibleAfterAddition = this.state.CandidatesEligible;
                        this.loadCandidateEligibilityAfterFilteringFromCandidateNominees(candidatesEligibleAfterAddition);
                    }
                }
                else {
                    this.setState({ candidateNominees: [] });
                    this.setState({ classRoomTeacherCount: 0 });
                    this.setState({ campusBaedProfessionalCount: 0 });

                }
            });
    }
    search() {
        let employeeID = this.state.employeeID;
        let employeeName = this.state.employeeName;
        let campusID = this.props.userProps.user.campusID;
        let campusName = this.props.userProps.user.campusName;
        let yearID = this.state.yearID;
        let CandidatesEligible = this;
        if (employeeID) {
            let promise = this.props.actions.loadCampusCandidatesByEmpID(campusID, employeeID, yearID);
            promise.then(candidateSearchCampuses => {
                if (this.props.candidateSearchCampuses.length > 0) {
                    let Candidates = this.props.candidateSearchCampuses.filter(res => {
                        return (res.Eligible === true);
                    });
                    this.loadCandidateEligibilityAfterFilteringFromCandidateNominees(Candidates);
                }
                else {
                    CandidatesEligible.setState({ CandidatesEligible: [] });
                    this.displayMessage(employeeID + ' not eligible for Candidate Nomination', 'NOTELIGIBLE');

                }

            })
                .catch(reason => {
                    this.props.actions.ajaxCallError();
                });
        }
        else if (employeeName) {
            let promise = this.props.actions.loadCampusCandidatesByEmpName(campusID, employeeName, yearID);
            promise.then(candidateSearchCampuses => {
                if (this.props.candidateSearchCampuses.length > 0) {
                    let Candidates = this.props.candidateSearchCampuses.filter(res => {
                        return (res.Eligible === true);
                    });
                    this.loadCandidateEligibilityAfterFilteringFromCandidateNominees(Candidates);
                }
                else {
                    this.setState({ CandidatesEligible: [] });
                    this.displayMessage(employeeName + ' not eligible for Candidate Nomination', 'NOTELIGIBLE');

                }

            })
                .catch(reason => {
                    this.props.actions.ajaxCallError();
                });
        }
    }
    loadCandidateEligibilityAfterFilteringFromCandidateNominees(candidates) {
        this.state.candidateNominees.map(a1 => {
            candidates.map((a2, index) => {
                if (a1.EmployeeID === a2.EmployeeNumber) {
                    candidates.splice(index, 1);
                }
            });
        });
        this.setState({ CandidatesEligible: candidates });

    }

    onChangeEmployeeID(e) {
        this.setState({ employeeID: e.target.value });
        this.setState({ employeeName: "" });
    }
    onChangeEmployeeName(e) {
        this.setState({ employeeName: e.target.value });
        this.setState({ employeeID: "" });

    }

    addCandidateFormatter(cell, row, enumObject, rowIndex) {
        let selectedCandidate = this.state.CandidatesEligible.filter((el, i, arr) => {
            return (el.EmployeeNumber === cell);
        });
        if (this.props.role !== "Admin") {
            if (this.state.classRoomTeacherCount == 0 && selectedCandidate["0"].CandidateType == "Classroom Teacher")
                return (<span className='glyphicon glyphicon-plus AddCandidateIcon' onClick={() => this.add(cell, row, rowIndex)}></span>);
            else if (this.state.campusBaedProfessionalCount == 0 && selectedCandidate["0"].CandidateType == "Campus Based Professional")
                return (<span className='glyphicon glyphicon-plus AddCandidateIcon' onClick={() => this.add(cell, row, rowIndex)}></span>);
            else
                return (<span ></span>);
        }
        else {
            return (<span className='glyphicon glyphicon-plus AddCandidateIcon' onClick={() => this.add(cell, row, rowIndex)}></span>);

        }


    }
    deleteCandidateFormatter(cell, row, enumObject, rowIndex) {

        return (<span className='glyphicon glyphicon-remove DeleteCandidateIcon' onClick={() => this.delete(cell, row, rowIndex)} ></span>);
    }

    delete(cell, row, rowIndex) {
        let selectedCandidate = [];
        selectedCandidate = this.state.candidateNominees.filter((el, i, arr) => {
            return (el.CandidateNomineeID === cell);
        });
        let promise = this.props.actions.deleteCandidateNominee(cell);
        promise.then((candidateNominees) => this.onDeletingSucceeds(selectedCandidate["0"].EmpName))
            .catch(reason => {
                this.props.actions.ajaxCallError();
                this.displayMessage('There was a problem saving this Candidate Nominee. Operation canceled.', '');
            });

    }
    onDeletingSucceeds(empName) {
        if (this.props.candidateNominees !== undefined || this.props.candidateNominees != 0) {
            this.loadCandidateNominees(this.props.votingSettingID,
                this.props.userProps.user.campusID, this.props.userProps.user.campusName);
            if (this.state.showAllCandidateNominees) {
                this.loadAllCandidateNominees();
            }
            this.search();
            this.displayMessage(empName + ' is removed as a Candidate Nominee.', 'CREATED');
            this.cancel();
        }
        else {
            this.onSavingFails();
        }
    }

    add(cell, row, rowIndex) {
        let selectedCandidate = this.state.CandidatesEligible.filter((el, i, arr) => {
            return (el.EmployeeNumber === cell);
        });
        let candidateNominees = {
            EmployeeID: selectedCandidate["0"].EmployeeNumber,
            DepartmentID: selectedCandidate["0"].EducationOrgNaturalKey,
            Location: {
                Description: selectedCandidate["0"].Location
            },
            CandidateType: {
                Description: selectedCandidate["0"].CandidateType
            },
            CampusID: selectedCandidate["0"].EducationOrgNaturalKey,
            CreatedBy: this.props.userProps.user.loginId,
            UpdatedBy: this.props.userProps.user.loginId
        };
        let promise = this.props.actions.createCandidateNominees(candidateNominees);
        promise.then((candidateNominees) => this.onSavingSucceeds(selectedCandidate["0"].FullName))
            .catch(reason => {
                this.props.actions.ajaxCallError();
                this.displayMessage('There was a problem saving this Candidate Nominee. Operation canceled.', '');
            });

    }
    onSavingSucceeds(empName) {
        if (this.props.candidateNominees !== undefined || this.props.candidateNominees != 0) {
            this.loadCandidateNominees(this.props.votingSettingID,
                this.props.userProps.user.campusID, this.props.userProps.user.campusName);
            if (this.state.showAllCandidateNominees) {
                this.loadAllCandidateNominees();
            }
            this.displayMessage(empName + ' is added as a Candidate Nominee.', 'CREATED');
            this.cancel();
        }
        else {
            this.onSavingFails();
        }
    }

    onSavingFails() {
        this.props.actions.ajaxCallError();
        this.displayMessage('Error trying to add Candidate Nominees.');
    }
    cancel() {
        document.location = '#candidatenominees';
    }



    okDialog() {
        if (this.state.dialogAction == 'SAVED')
            this.cancel();
        else if (this.state.dialogAction == 'NOTELIGIBLE')
            this.closeDialog();
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

    render() {

        let schoolYear;
        let CampusID;
        let CampusName;
        if (this.props.userProps.schoolYearDescription)
            schoolYear = this.props.userProps.schoolYearDescription;
        else
            schoolYear = "";

        if (this.props.userProps.user.campusID)
            CampusID = this.props.userProps.user.campusID;
        if (this.props.userProps.user.campusName)
            CampusName = this.props.userProps.user.campusName;
        let options = {
            sortName: 'CandidateType',
            sortOrder: 'desc'
        };
        let options2 = {
            sortName: 'CandidateTypeName',
            sortOrder: 'desc'
        };

        let options3 = {
            sortName: 'NameOfInstitution',
            sortOrder: 'asc'
        };


        return (
            <IfAnyGranted expected={['Admin', 'Principal', 'SC']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>

                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Candidate Nominees" schoolYear={schoolYear} />

                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div className="white-box">

                                    <div className="row">
                                        <label className="CandidateNomineesInnerHeader col-md-12 col-lg-12 col-sm-12 formSectionTitle"> Candidate Nominee Entry Search</label>

                                    </div>
                                    <div className="row">
                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                            <label >Employee ID:</label>
                                            <div >
                                                <input id="employeeID" placeholder="Employee ID" className="form-control" onChange={this.onChangeEmployeeID} value={this.state.employeeID} type="text" />
                                            </div>
                                        </div>

                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                            <label>Employee Name:</label>
                                            <div>
                                                <input id="employeeName" placeholder="Employee Name" className="form-control" onChange={this.onChangeEmployeeName} value={this.state.employeeName} type="text" />
                                            </div>
                                        </div>

                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                            <label style={{ visibility: 'hidden' }}>Search</label>
                                            <div>
                                                <PrimaryButton
                                                    text="Search" onClick={this.search}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className=" col-md-6 col-lg6 col-sm-6">

                                            <BootstrapTable data={this.state.CandidatesEligible} hover condensed search striped options={options}>
                                                <TableHeaderColumn row="0" colSpan="4" className="castVoteGridTitle" dataAlign="center"> Search Results</TableHeaderColumn>
                                                <TableHeaderColumn row="1" dataField="EmployeeNumber" dataSort dataAlign="center" isKey={true} >Emp. ID</TableHeaderColumn>
                                                <TableHeaderColumn row="1" dataField="FullName" columnTitle dataSort dataAlign="left">Employee Name</TableHeaderColumn>
                                                <TableHeaderColumn row="1" dataField="CandidateType" columnTitle dataSort dataAlign="left">Candidate Type</TableHeaderColumn>
                                                <TableHeaderColumn row="1" dataField="EmployeeNumber" dataFormat={this.addCandidateFormatter} dataAlign="center">Add</TableHeaderColumn>
                                            </BootstrapTable>
                                        </div>
                                        <div className=" col-md-6 col-lg6 col-sm-6">

                                            <BootstrapTable data={this.state.candidateNominees} hover condensed search striped options={options2} >
                                                <TableHeaderColumn row="0" colSpan="4" className="castVoteGridTitle" dataAlign="center">Candidates nominated from current campus</TableHeaderColumn>
                                                <TableHeaderColumn row="1" dataField="EmployeeID" dataSort dataAlign="center" isKey={true} >Emp. ID</TableHeaderColumn>
                                                <TableHeaderColumn row="1" dataField="EmpName" columnTitle dataSort dataAlign="left">Employee Name</TableHeaderColumn>
                                                <TableHeaderColumn row="1" dataField="CandidateTypeName" columnTitle dataSort dataAlign="left">Candidate Type</TableHeaderColumn>

                                                <TableHeaderColumn row="1" dataField="CandidateNomineeID" dataFormat={this.deleteCandidateFormatter} dataAlign="center">Remove</TableHeaderColumn>

                                            </BootstrapTable>
                                        </div>
                                    </div>
                                    {
                                        this.state.showAllCandidateNominees ?
                                            (
                                                <div className="row">
                                                    <hr />
                                                    <div className="col-md-12 col-lg-12 col-sm-12">
                                                        <BootstrapTable data={this.state.candidateNomineesAllCampus} hover condensed search striped options={options3}  >
                                                            <TableHeaderColumn row="0" colSpan="4" className="castVoteGridTitle" >Candidates nominated from all Campus</TableHeaderColumn>
                                                            <TableHeaderColumn row="1" dataField="EmployeeID" dataSort dataAlign="center" isKey={true} >Emp. ID</TableHeaderColumn>
                                                            <TableHeaderColumn row="1" dataField="CandidateName" dataSort columnTitle dataAlign="left">Employee Name</TableHeaderColumn>
                                                            <TableHeaderColumn row="1" dataField="CandidateTypeDesc" dataSort columnTitle dataAlign="left">Candidate Type</TableHeaderColumn>
                                                            <TableHeaderColumn row="1" dataField="NameOfInstitution" dataSort columnTitle dataAlign="left">Campus Name</TableHeaderColumn>


                                                        </BootstrapTable>
                                                    </div>
                                                </div>
                                            )
                                            :
                                            null
                                    }


                                </div>
                            </div>
                        </div>
                    </div>
                    <Dialog
                        hidden={this.state.hideDialog}
                        onDismiss={this.closeDialog}
                        dialogContentProps={{
                            type: DialogType.normal,
                            title: 'Candidate Nominees',
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
            </IfAnyGranted >
        );

    }
}

CampusCandidateNominees.propTypes = {

    userProps: PropTypes.object,
    actions: PropTypes.object.isRequired,
    loadCampusCandidatesByEmpID: PropTypes.func,
    candidateSearchCampuses: PropTypes.array,
    createCandidateNominees: PropTypes.array,
    candidateNomineesAllCampus: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {

        userProps: state.userProps,
        candidateSearchCampuses: state.candidateSearchCampuses,
        candidateNominees: state.candidateNominees,
        candidateNomineesAllCampus: state.candidateNomineesAllCampus,
        role: state.userProps.user.role
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({},
            candidateSearchCampusesActions, centralOfficeActions
            , payGradeActions,
            candidateNomineesActions, ajaxActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CampusCandidateNominees);