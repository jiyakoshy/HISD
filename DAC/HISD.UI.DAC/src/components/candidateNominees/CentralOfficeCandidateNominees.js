import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as centralOfficeActions from '../../actions/centralOfficeActions';
import * as candidateSearchCOActions from '../../actions/candidateSearchCOActions';
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
import CampusCandidateNominees from './CampusCandidateNominees';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class CentralOfficeCandidateNominees extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            allCODepartments: null,
            DepartmentID: '',
            employeeID: '',
            employeeName: '',
            CandidatesEligible: null,
            candidateNominees: null,
            hideDialog: true,
            dialogAction: '',
            subtext: ''
        };

        this.loadCODepatments = this.loadCODepatments.bind(this);
        this.fillDepartmentNameDropDown = this.fillDepartmentNameDropDown.bind(this);
        this.removeDuplicates = this.removeDuplicates.bind(this);
        this.onCentralOfficeDropdownChanged = this.onCentralOfficeDropdownChanged.bind(this);
        this.change = this.change.bind(this);
        this.onChangeEmployeeID = this.onChangeEmployeeID.bind(this);
        this.onChangeEmployeeName = this.onChangeEmployeeName.bind(this);

        this.search = this.search.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.addCandidateFormatter = this.addCandidateFormatter.bind(this);
        this.deleteCandidateFormatter = this.deleteCandidateFormatter.bind(this);
        this.customTitle = this.customTitle.bind(this);


        this.cancel = this.cancel.bind(this);
        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);

    }

    componentWillMount() {
        this.props.actions.loadCentralOfficeDepartments()
            .then(centralOffices => this.fillDepartmentNameDropDown());

        if (this.props.locations && this.props.candidateTypes) {
            let locations = this.props.locations.filter((obj, pos, arr) => {
                return (obj.Description === "Central Office");
            });
            let candidateTypes = [];
            this.props.candidateTypes.map(candidateType => {

                if (candidateType.Description == "Central Office Professional" || candidateType.Description == "Non IT Central Office Professional"
                    || candidateType.Description == "IT Central Office Professional")
                    candidateTypes.push(candidateType.CandidateTypeID);
            });
            let candidateNominees = this;
            this.props.actions.loadCandidateNomineesCentralOffice(this.props.votingSettingID,
                locations["0"].LocationID, candidateTypes)
                .then(centralOffices => {
                    this.setState({ candidateNominees: this.props.candidateNominees.value })
                });
        }
    }

    fillCandidateNominees() {

    }

    fillDepartmentNameDropDown() {
        let allDepartments = this.loadCODepatments();
        if (allDepartments && allDepartments != null && allDepartments !== undefined) {
            this.setState({ allCODepartments: allDepartments });
            this.setState({ DepartmentID: allDepartments[0].key });
        }
    }
    loadCODepatments() {
        if (this.props.centralOffices) {
            let centralOffices = this.props.centralOffices;
            if (Array.isArray(centralOffices)) {
                let newCentralOffices = [];
                (centralOffices.map(centralOffice => {


                    let newCentralOffice = { key: centralOffice.EducationOrgNaturalKey, text: centralOffice.NameOfInstitution };
                    newCentralOffices.push(newCentralOffice);
                }));
                newCentralOffices.sort(
                    function (a, b) {
                        let nameA = a.text.toLowerCase();
                        let nameB = b.text.toLowerCase();
                        if (nameA < nameB) //sort string ascending
                            return -1;
                        if (nameA > nameB)
                            return 1;
                        return 0; //default return value (no sorting)
                    });
                return this.removeDuplicates(newCentralOffices, 'key');
            }
        }
    }
    removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }
    onCentralOfficeDropdownChanged(item) {
        this.setState({ DepartmentID: item.key });
    }
    change(event) {
        this.setState({ DepartmentID: event.target.value });
    }
    onChangeEmployeeID(e) {
        this.setState({ employeeID: e.target.value });
        this.setState({ employeeName: "" });
    }
    onChangeEmployeeName(e) {
        this.setState({ employeeName: e.target.value });
        this.setState({ employeeID: "" });
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
            if (this.props.locations && this.props.candidateTypes) {
                let locations = this.props.locations.filter((obj, pos, arr) => {
                    return (obj.Description === "Central Office");
                });
                let candidateTypes = [];
                this.props.candidateTypes.map(candidateType => {

                    if (candidateType.Description == "Central Office Professional" || candidateType.Description == "Non IT Central Office Professional"
                        || candidateType.Description == "IT Central Office Professional")
                        candidateTypes.push(candidateType.CandidateTypeID);
                });
                let candidateNominees = this;
                this.props.actions.loadCandidateNomineesCentralOffice(this.props.votingSettingID,
                    locations["0"].LocationID, candidateTypes)
                    .then(centralOffices => {
                        this.setState({ candidateNominees: this.props.candidateNominees.value });

                        this.search();
                    });
            }


            this.displayMessage(empName + ' is removed from  Candidate Nominee list.', 'CREATED');
            this.cancel();


        }
        else {
            this.onSavingFails();
        }
    }
    add(cell, row, rowIndex) {
        let selectedCandidate = [];
        selectedCandidate = this.state.CandidatesEligible.filter((el, i, arr) => {
            return (el.EmpID === cell);
        });

        let CandidateTypeDescription = null;
        if (
            selectedCandidate["0"].PayGradeLevel == "06" || selectedCandidate["0"].PayGradeLevel == "07" ||
            selectedCandidate["0"].PayGradeLevel == "08" || selectedCandidate["0"].PayGradeLevel == "09" ||
            selectedCandidate["0"].PayGradeLevel == "10" || selectedCandidate["0"].PayGradeLevel == "11" ||
            selectedCandidate["0"].PayGradeLevel == "12" || selectedCandidate["0"].PayGradeLevel == "13" ||
            selectedCandidate["0"].PayGradeLevel == "14" || selectedCandidate["0"].PayGradeLevel == "15" ||
            selectedCandidate["0"].PayGradeLevel == "16" || selectedCandidate["0"].PayGradeLevel == "17"
        ) {
            CandidateTypeDescription = "IT Central Office Professional";
        }
        if (selectedCandidate["0"].PayGradeLevel === "25" || selectedCandidate["0"].PayGradeLevel === "26" ||
            selectedCandidate["0"].PayGradeLevel === "27" || selectedCandidate["0"].PayGradeLevel === "28" ||
            selectedCandidate["0"].PayGradeLevel === "29" || selectedCandidate["0"].PayGradeLevel === "30" ||
            selectedCandidate["0"].PayGradeLevel === "31" || selectedCandidate["0"].PayGradeLevel === "32" ||
            selectedCandidate["0"].PayGradeLevel === "31" || selectedCandidate["0"].PayGradeLevel === "32" ||
            selectedCandidate["0"].PayGradeLevel === "33" || selectedCandidate["0"].PayGradeLevel === "34" ||
            selectedCandidate["0"].PayGradeLevel === "35" || selectedCandidate["0"].PayGradeLevel === "36" ||
            selectedCandidate["0"].PayGradeLevel === "37" || selectedCandidate["0"].PayGradeLevel === "A" ||
            selectedCandidate["0"].PayGradeLevel === "B") {
            CandidateTypeDescription = "Non IT Central Office Professional";
        }
        let candidateNominees = {
            EmployeeID: selectedCandidate["0"].EmpID,
            DepartmentID: selectedCandidate["0"].DepartmentID,
            Location: {
                Description: "Central Office"
            },
            CandidateType: {
                Description: CandidateTypeDescription
            },
            CampusID: selectedCandidate["0"].DepartmentID,
            CreatedBy: this.props.userProps.user.loginId,
            UpdatedBy: this.props.userProps.user.loginId
        };
        let promise = this.props.actions.createCandidateNominees(candidateNominees);
        promise.then((candidateNominees) => this.onSavingSucceeds(selectedCandidate["0"].EmpName))
            .catch(reason => {
                this.props.actions.ajaxCallError();
                this.displayMessage('There was a problem saving this Candidate Nominee. Operation canceled.', '');
            });


    }
    onSavingSucceeds(empName) {
        if (this.props.candidateNominees !== undefined || this.props.candidateNominees != 0) {
            if (this.props.locations && this.props.candidateTypes) {
                let locations = this.props.locations.filter((obj, pos, arr) => {
                    return (obj.Description === "Central Office");
                });
                let candidateTypes = [];
                this.props.candidateTypes.map(candidateType => {

                    if (candidateType.Description == "Central Office Professional" || candidateType.Description == "Non IT Central Office Professional"
                        || candidateType.Description == "IT Central Office Professional")
                        candidateTypes.push(candidateType.CandidateTypeID);
                });
                let candidateNominees = this;
                this.props.actions.loadCandidateNomineesCentralOffice(this.props.votingSettingID,
                    locations["0"].LocationID, candidateTypes)
                    .then(centralOffices => {
                        this.setState({ candidateNominees: this.props.candidateNominees.value });

                        if (this.state.CandidatesEligible) {
                            let candidatesEligibleAfterAddition = this.state.CandidatesEligible;
                            this.state.candidateNominees.map(a1 => {
                                candidatesEligibleAfterAddition.map((a2, index) => {
                                    if (a1.EmployeeID === a2.EmpID) {
                                        candidatesEligibleAfterAddition.splice(index, 1);
                                    }
                                });
                            });
                            this.setState({ CandidatesEligible: candidatesEligibleAfterAddition })
                        }
                    });
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

    addCandidateFormatter(cell, row, enumObject, rowIndex) {

        return (<span className='glyphicon glyphicon-plus AddCandidateIcon' onClick={() => this.add(cell, row, rowIndex)}></span>);
    }

    deleteCandidateFormatter(cell, row, enumObject, rowIndex) {

        return (<span className='glyphicon glyphicon-remove DeleteCandidateIcon' onClick={() => this.delete(cell, row, rowIndex)} ></span>);
    }


    search() {
        let employeeID = this.state.employeeID;
        let employeeName = this.state.employeeName;
        let DepartmentID = this.state.DepartmentID;
        let CandidateSearchGrid = [];
        let CandidatesFilteredByPayGrade = [];

        if (employeeID && employeeID != null && employeeID != '' && employeeID != undefined) {
            let CandidatesEligible = this;
            let promise = this.props.actions.loadCandidatesByEmpID(employeeID);
            promise.then(Candidates => {
                if (this.props.candidateSearchCO.length > 0) {
                    let CandidatesFiltered = [...this.props.candidateSearchCO];
                    CandidatesEligible.state.candidateNominees.map(a1 => {
                        CandidatesFiltered.map((a2, index) => {
                            if (a1.EmployeeID === a2.EmpID) {
                                CandidatesFiltered.splice(index, 1);
                            }
                        });
                    });
                    CandidatesEligible.setState({ CandidatesEligible: CandidatesFiltered });
                }
                else {
                    CandidatesEligible.setState({ CandidatesEligible: [] });
                    this.displayMessage(employeeID + ' not eligible for Candidate Nomination', 'NOTELIGIBLE');
                }
            })
                .catch(reason => {
                    this.props.actions.ajaxCallError();
                    this.setState({ subtext: 'There was a problem searching the eligible candidates. Operation canceled.', dialogAction: '' });
                    this.showDialog();
                });
        }
        else if (employeeName && employeeName != null && employeeName != '' && employeeName != undefined) {
            let CandidatesEligible = this;
            let promise = this.props.actions.loadCandidatesByEmpName(employeeName);
            promise.then(Candidates => {
                if (this.props.candidateSearchCO.length > 0) {
                    let CandidatesFiltered = [...this.props.candidateSearchCO];
                    CandidatesEligible.state.candidateNominees.map(a1 => {
                        CandidatesFiltered.map((a2, index) => {
                            if (a1.EmployeeID === a2.EmpID) {
                                CandidatesFiltered.splice(index, 1);
                            }
                        });
                    });
                    CandidatesEligible.setState({ CandidatesEligible: CandidatesFiltered });
                }
                else {
                    CandidatesEligible.setState({ CandidatesEligible: [] });
                    this.displayMessage(employeeName + ' not eligible for Candidate Nomination', 'NOTELIGIBLE');
                }
            })
                .catch(reason => {
                    this.props.actions.ajaxCallError();
                    this.setState({ subtext: 'There was a problem searching the eligible candidates. Operation canceled.', dialogAction: '' });
                    this.showDialog();
                });
        }
        else if (DepartmentID && DepartmentID != null && DepartmentID != '' && DepartmentID != undefined) {
            let CandidatesEligible = this;
            let promise = this.props.actions.loadCandidatesByDepartmentID(DepartmentID);
            promise.then(Candidates => {
                if (this.props.candidateSearchCO.length > 0) {
                    let CandidatesFiltered = [...this.props.candidateSearchCO];
                    CandidatesEligible.state.candidateNominees.map(a1 => {
                        CandidatesFiltered.map((a2, index) => {
                            if (a1.EmployeeID === a2.EmpID) {
                                CandidatesFiltered.splice(index, 1);
                            }
                        });
                    });
                    CandidatesEligible.setState({ CandidatesEligible: CandidatesFiltered });
                }
                else {
                    CandidatesEligible.setState({ CandidatesEligible: [] });
                }
            })
                .catch(reason => {
                    this.props.actions.ajaxCallError();
                    this.setState({ subtext: 'There was a problem searching the eligible candidates. Operation canceled.', dialogAction: '' });

                });


        }
    }

    customTitle(cell, row, rowIndex, colIndex) {
        return `${row.name} for ${cell}`;
    }
    render() {
        let schoolYear;
        let allCODepartments;
        if (this.props.userProps.schoolYearDescription)
            schoolYear = this.props.userProps.schoolYearDescription;
        else
            schoolYear = "";

        let locations = this.props.locations;
        let candidateTypes = this.props.candidateTypes;

        if (this.state.allCODepartments)
            allCODepartments = this.state.allCODepartments;

        let options = {
            sortName: 'EmpID',
            sortOrder: 'asc'
        };

        let options2 = {
            sortName: 'EmployeeID',
            sortOrder: 'asc'
        };

        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>

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
                                            <label >Employee Name:</label>
                                            <div>
                                                <input id="employeeName" placeholder="Employee Name" className="form-control" onChange={this.onChangeEmployeeName} value={this.state.employeeName} type="text" />
                                            </div>
                                        </div>

                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                            <label style={{ visibility: 'hidden' }}>Search</label>
                                            <div>
                                                <PrimaryButton
                                                    text="Search"
                                                    onClick={this.search}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className=" col-md-6 col-lg6 col-sm-6">

                                            <BootstrapTable data={this.state.CandidatesEligible} hover condensed search striped options={options}>
                                                <TableHeaderColumn row='0' colSpan='4' className='castVoteGridTitle' dataAlign="center">Search Results</TableHeaderColumn>
                                                <TableHeaderColumn row='1' dataField="EmpID" dataSort dataAlign="center" isKey={true} >Emp. ID</TableHeaderColumn>
                                                <TableHeaderColumn row='1' dataField="EmpName" columnTitle dataSort dataAlign="left">Employee Name</TableHeaderColumn>
                                                <TableHeaderColumn row='1' dataField="DepartmentName" columnTitle dataSort dataAlign="left">Department</TableHeaderColumn>
                                                <TableHeaderColumn row='1' dataField="EmpID" dataFormat={this.addCandidateFormatter} dataAlign="center">Add</TableHeaderColumn>
                                            </BootstrapTable>
                                        </div>
                                        <div className=" col-md-6 col-lg6 col-sm-6">

                                            <BootstrapTable data={this.state.candidateNominees} hover condensed search striped
                                                options={options2} >
                                                <TableHeaderColumn row='0' colSpan='4' className='castVoteGridTitle' dataAlign="center"> Current Candidates</TableHeaderColumn>
                                                <TableHeaderColumn row='1' dataField="EmployeeID" dataSort dataAlign="center" isKey={true} >Emp. ID</TableHeaderColumn>
                                                <TableHeaderColumn row='1' dataField="EmpName" columnTitle dataSort dataAlign="left">Employee Name</TableHeaderColumn>
                                                <TableHeaderColumn row='1' dataField="DepartmentName" columnTitle dataSort dataAlign="left">Department Name</TableHeaderColumn>

                                                <TableHeaderColumn row='1' dataField="CandidateNomineeID" dataFormat={this.deleteCandidateFormatter} dataAlign="center">Remove</TableHeaderColumn>

                                            </BootstrapTable>
                                        </div>
                                    </div>
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

CentralOfficeCandidateNominees.propTypes = {
    userProps: PropTypes.object,
    actions: PropTypes.object.isRequired,
    centralOffices: PropTypes.array,
    candidateSearchCO: PropTypes.array,
    payGrades: PropTypes.object,
    campusName: PropTypes.string,
    votingSettings: PropTypes.array,
    locations: PropTypes.array,
    candidateTypes: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps,
        centralOffices: state.centralOffices,
        candidateSearchCO: state.candidateSearchCO,
        payGrades: state.payGrades,
        campusName: state.userProps.user.campusName,
        candidateNominees: state.candidateNominees,
        votingSettings: state.votingSettings
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, centralOfficeActions,
            candidateSearchCOActions, payGradeActions, candidateNomineesActions, ajaxActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CentralOfficeCandidateNominees);