import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { IfAnyGranted } from 'react-authorization';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

import * as ajaxActions from '../../actions/ajaxStatusActions';
import * as sharedActions from '../../actions/sharedActions';
import * as voteEligibilityActions from '../../actions/voteEligibilityActions';
import * as locationsActions from '../../actions/locationsActions';
import * as candidateTypesActions from '../../actions/candidateTypesActions';
import * as candidateNomineesActions from '../../actions/candidateNomineesAction';
import * as castVotesActions from '../../actions/castVotesActions';
import ErrorPage from '../common/ErrorPage';
import config from '../../api/config';
import Utilities from '../../utilities/utilities';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import moment from 'moment';

class CastVotePage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isUserEligiblie: 'No',
            locations: null,
            candidateTypes: null,
            nonCampusCandidates: null,
            classRoomCandidates: null,
            campusBasedCandidates: null,
            selectedCandiateNonCampus: null,
            selectedCandiateCampusProfesional: null,
            selectedCandiateClassRoomTeacher: null,
            castVoteSuccessMessage: false,
            hideDialog: true,
            dialogAction: '',
            subtext: ''
        };
        this.CheckCampusEligibility = this.CheckCampusEligibility.bind(this);
        this.CheckNonCampusEligibility = this.CheckNonCampusEligibility.bind(this);
        this.ExitWithoutVoting = this.ExitWithoutVoting.bind(this);
        this.selectCandidateFormatter = this.selectCandidateFormatter.bind(this);
        this.selectCandidateNonCampus = this.selectCandidateNonCampus.bind(this);
        this.selectCandidateFormatterClassRoomTeacher = this.selectCandidateFormatterClassRoomTeacher.bind(this);
        this.selectCandidateFormatterCampusBased = this.selectCandidateFormatterCampusBased.bind(this);
        this.Vote = this.Vote.bind(this);

        this.okDialog = this.okDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    componentWillMount() {
        let userProps = { ... this.props.userProps };
        if (userProps.user.OrgGrpNaturalKey == "Campus") {
            this.CheckCampusEligibility();
        }
        else {
            this.CheckNonCampusEligibility();



        }

    }
    componentDidUpdate() {
        let gg = "kk";
    }

    CheckCampusEligibility() {
        let userProps = { ... this.props.userProps };
        let yearID = "";
        if (userProps.schoolYearDescription) {
            let schoolYear = userProps.schoolYearDescription;
            let partsOfStr = schoolYear.split('-');
            yearID = partsOfStr[0];
        }
        let JobCodeNaturalKey = userProps.user.JobCodeNaturalKey;
        let JobFamilyNaturalKey = userProps.user.JobFamilyNaturalKey;
        let JobFunctionNaturalKey = userProps.user.JobFunctionNaturalKey;
        let SalaryPlanTypeNaturalKey = userProps.user.SalaryPlanTypeNaturalKey;
        let campusID = userProps.user.campusID;
        /*  console.log("--Campus--", JobCodeNaturalKey, "--JobCodeNaturalKey--", JobFamilyNaturalKey, "--JobFamilyNaturalKey--", JobFunctionNaturalKey, "--JobFunctionNaturalKey--", SalaryPlanTypeNaturalKey, "--SalaryPlanTypeNaturalKey--");
         */
        let voteEligiblityPromise = this.props.actions.loadVoteEligibilityCampus(
            JobFamilyNaturalKey, campusID, yearID, JobCodeNaturalKey, JobFunctionNaturalKey,
            SalaryPlanTypeNaturalKey);
        voteEligiblityPromise.then(voteElibility => {
            if (this.props.voteEligibility.eligible == 'Yes') {
                this.setState({ isUserEligiblie: this.props.voteEligibility.eligible });

                this.props.actions.loadLocations()
                    .then(locations => {
                        if (this.props.locations.length > 0) {
                            this.setState({ locations: this.props.locations });

                            let locations = this.props.locations.filter((obj, pos, arr) => {
                                return (obj.Description === this.props.voteEligibility.campusType);
                            });
                            this.props.actions.loadCandidateTypes()
                                .then(candidateTypesRes => {
                                    if (this.props.candidateTypes.length > 0) {

                                        this.setState({ candidateTypes: this.props.candidateTypes });
                                        let candidateTypes = [];

                                        this.props.candidateTypes.map(candidateType => {

                                            if (candidateType.Description == "Classroom Teacher"
                                                || candidateType.Description == "Campus Based Professional")
                                                candidateTypes.push(candidateType.CandidateTypeID);
                                        });
                                        if (this.props.votingSettings.length > 0) {
                                            this.props.actions.loadCandidateNomineesBasedOnLocation(this.props.votingSettings[0].VotingSettingID,
                                                locations["0"].LocationID)
                                                .then(centralOffices => {
                                                    if (this.props.candidateNominees.value.length > 0) {
                                                        let classRoomTeacherID = this.props.candidateTypes.filter(val => {
                                                            return (val.Description == config.ClassroomTeacher);
                                                        });
                                                        let campusBasedID = this.props.candidateTypes.filter(val => {
                                                            return (val.Description == config.CampusBasedProfessional);
                                                        });

                                                        let classRoomTeachGrid = this.props.candidateNominees.value.filter(e => {
                                                            return (e.CandidateTypeID == classRoomTeacherID[0].CandidateTypeID && e.DepartmentName != '' && e.EmpName != '');
                                                        });
                                                        let campusBasedGrid = this.props.candidateNominees.value.filter(e => {
                                                            return (e.CandidateTypeID == campusBasedID[0].CandidateTypeID && e.DepartmentName != '' && e.EmpName != '');
                                                        });
                                                        if (classRoomTeachGrid.length > 0)
                                                            this.setState({ classRoomCandidates: classRoomTeachGrid });

                                                        if (campusBasedGrid.length > 0)
                                                            this.setState({ campusBasedCandidates: campusBasedGrid });

                                                    }
                                                });
                                        }

                                    }
                                });
                        }
                    });
            }
        });
    }
    CheckNonCampusEligibility() {
        let userProps = { ... this.props.userProps };
        let PayGradeLevel = userProps.user.PayGradeLevel;
        let JobFamilyNaturalKey = userProps.user.JobFamilyNaturalKey;
        /*console.log("--Department--",PayGradeLevel, "--PayGradeLevel--", JobFamilyNaturalKey, "--JobFamilyNaturalKey--");
         */
        let voteEligiblityPromise = this.props.actions.loadVoteEligibilityNonCampus(PayGradeLevel, JobFamilyNaturalKey);
        voteEligiblityPromise.then(voteElibility => {
            if (this.props.voteEligibility.eligible == 'Yes') {
                this.setState({ isUserEligiblie: this.props.voteEligibility.eligible });

                this.props.actions.loadLocations()
                    .then(locations => {
                        if (this.props.locations.length > 0) {
                            this.setState({ locations: this.props.locations });
                            let locations = this.props.locations.filter((obj, pos, arr) => {
                                return (obj.Description === "Central Office");
                            });
                            this.props.actions.loadCandidateTypes()
                                .then(candidateTypesRes => {
                                    if (this.props.candidateTypes.length > 0) {
                                        this.setState({ candidateTypes: this.props.candidateTypes });
                                        let candidateTypes = [];
                                        this.props.candidateTypes.map(candidateType => {

                                            if (candidateType.Description == "Central Office Professional" || candidateType.Description == "Non IT Central Office Professional"
                                                || candidateType.Description == "IT Central Office Professional")
                                                candidateTypes.push(candidateType.CandidateTypeID);
                                        });
                                        if (this.props.votingSettings.length > 0) {
                                            this.props.actions.loadCandidateNomineesCentralOffice(this.props.votingSettings[0].VotingSettingID,
                                                locations["0"].LocationID, candidateTypes)
                                                .then(centralOffices => {
                                                    if (this.props.candidateNominees.value.length > 0)
                                                        this.setState({ nonCampusCandidates: this.props.candidateNominees.value });
                                                });
                                        }

                                    }
                                });
                        }
                    });
            }
        });

    }

    selectCandidateFormatter(cell, row, enumObject, rowIndex) {
        if (this.state.selectedCandiateNonCampus == cell)
            return (<input type="radio" id={'rd' + cell} name="selCandidate" defaultChecked onClick={() => this.selectCandidateNonCampus(cell, row, rowIndex)}></input>);

        else
            return (<input type="radio" id={'rd' + cell} name="selCandidate" onClick={() => this.selectCandidateNonCampus(cell, row, rowIndex)}></input>);
    }
    selectCandidateNonCampus(cell, row, rowIndex) {
        this.setState({ selectedCandiateNonCampus: cell });
    }
    selectCandidateFormatterClassRoomTeacher(cell, row, enumObject, rowIndex) {
        if (this.state.selectedCandiateClassRoomTeacher == cell)
            return (<input type="radio" id={'rd' + cell} name="selCandidateClassRoom" defaultChecked onClick={() => this.selectCandidateClassRoomTeacher(cell, row, rowIndex)}></input>);
        else
            return (<input type="radio" id={'rd' + cell} name="selCandidateClassRoom" onClick={() => this.selectCandidateClassRoomTeacher(cell, row, rowIndex)}></input>);
    }
    selectCandidateClassRoomTeacher(cell, row, rowIndex) {
        this.setState({ selectedCandiateClassRoomTeacher: cell });
    }

    selectCandidateFormatterCampusBased(cell, row, enumObject, rowIndex) {
        if (this.state.selectedCandiateCampusProfesional == cell)
            return (<input type="radio" id={'rd' + cell} defaultChecked name="selCandidateCampusBased" onClick={() => this.selectCandidateCampusBased(cell, row, rowIndex)}></input>);

        else
            return (<input type="radio" id={'rd' + cell} name="selCandidateCampusBased" onClick={() => this.selectCandidateCampusBased(cell, row, rowIndex)}></input>);
    }
    selectCandidateCampusBased(cell, row, rowIndex) {
        this.setState({ selectedCandiateCampusProfesional: cell });
    }

    ExitWithoutVoting() {
        document.location = "#";
    }

    displayMessage(message, action) {
        this.setState({ subtext: message, dialogAction: action });
        this.showDialog();
    }

    showDialog() {
        this.setState({ hideDialog: false });
    }



    cancel() {
        document.location = '#castvotes';
    }

    okDialog() {
        if (this.state.dialogAction == 'CASTVOTENONCAMPUS') {
            this.CastVoteForNonCampus();

        }


        else if (this.state.dialogAction == 'Error') {
            this.setState({ hideDialog: true });
            this.cancel();
        }
        if (this.state.dialogAction == 'SELECTCANDIDATENONCAMPUS') {
            this.setState({ hideDialog: true });
            this.cancel();
        }
        else
            this.closeDialog();
    }
    closeDialog() {
        this.setState({ hideDialog: true });
    }

    Vote() {
        if (this.props.userProps.user.OrgGrpNaturalKey == "Campus") {
            console.log("selectedCandiateCampusProfesional----", this.state.selectedCandiateCampusProfesional);
            console.log("selectedCandiateClassRoomTeacher----", this.state.selectedCandiateClassRoomTeacher);
        }
        else {
            if (this.state.selectedCandiateNonCampus !== null) {
                this.displayMessage('Is this your final vote?. Click Ok if Yes else click Cancel ', 'CASTVOTENONCAMPUS');
            }
            else {
                this.displayMessage('Please select a candidate.', 'SELECTCANDIDATENONCAMPUS');
            }


        }
    }
    CastVoteForNonCampus() {
        let CastVotes = {
            "CandidateNomineeID": this.state.selectedCandiateNonCampus,
            "CreatedBy": this.props.userProps.user.loginId,
            "UpdatedBy": this.props.userProps.user.loginId
        };

        let promise = this.props.actions.createCastVotes(CastVotes);
        promise.then((CastVotes) => {
            this.setState({ hideDialog: true, castVoteSuccessMessage: true });
            this.cancel();
        })
            .catch(reason => {
                this.props.actions.ajaxCallError();
                this.displayMessage('There was a problem casting the Vote. Operation canceled.', 'Error');
            });
    }
    render() {
        let schoolYear;
        let UserVotingDiv;
        let allCODepartments;
        let VotingStartDate;
        let VotingEndDate;
        let ResultsAvailableStartDate;
        let ResultsAvailableStartTime;
        if (this.props.userProps.schoolYearDescription)
            schoolYear = this.props.userProps.schoolYearDescription;
        else
            schoolYear = "";

        if (this.props.votingSettings.length > 0) {
            VotingStartDate = this.props.votingSettings[0].VotingStartDate;
            VotingEndDate = this.props.votingSettings[0].VotingEndDate;
            ResultsAvailableStartDate = this.props.votingSettings[0].ResultsAvailableStartDate;
            ResultsAvailableStartTime = this.props.votingSettings[0].ResultsAvailableStartTime;
        }
        let UserVotingButton = (<div className="row">
            <div className=" col-md-4 col-lg-4 col-sm-4 pull-right" style={{ display: 'inline', marginTop: '5px' }} >
                <PrimaryButton text="Vote" style={{ marginRight: '5px' }} onClick={this.Vote} />
                <PrimaryButton text="Exit without Voting" onClick={this.ExitWithoutVoting} />
            </div>
        </div>);

        if (VotingStartDate != null && VotingStartDate != '' && VotingStartDate != undefined &&
            VotingEndDate != null && VotingEndDate != '' && VotingEndDate != undefined) {

            let currentDate = new Date();
            let startDate = new Date(Utilities.getDateTime(VotingStartDate));
            let endDate = new Date(Utilities.getDateTime(VotingEndDate));

            if (currentDate > startDate && currentDate < endDate) {

                if (!this.state.castVoteSuccessMessage) {
                    if (this.props.userProps.user.OrgGrpNaturalKey == "Campus" && this.state.isUserEligiblie == "Yes") {
                        UserVotingDiv =
                            <div className="white-box">
                                <div className="row">
                                    <label className="CastVoteInnerHeader col-md-12 col-lg-12 col-sm-12"> Please select one candidate from each category to represent you on the District Advisory Committee. </label>
                                </div>
                                <div className="row">

                                    <div className=" col-md-6 col-lg-6 col-sm-12">
                                        <BootstrapTable data={this.state.classRoomCandidates} hover condensed striped >
                                            <TableHeaderColumn row="0" colSpan="4" className="castVoteGridTitle" dataAlign="center">Classroom Teacher Candidates</TableHeaderColumn>

                                            <TableHeaderColumn row="1" dataField="EmployeeID" dataSort dataAlign="center" isKey={true} >Emp. ID</TableHeaderColumn>
                                            <TableHeaderColumn row="1" dataField="EmpName" columnTitle dataSort dataAlign="left">Employee Name</TableHeaderColumn>
                                            <TableHeaderColumn row="1" dataField="DepartmentName" columnTitle dataSort dataAlign="left">Department Name</TableHeaderColumn>

                                            <TableHeaderColumn row="1" dataField="CandidateNomineeID" dataFormat={this.selectCandidateFormatterClassRoomTeacher} dataAlign="center">Vote</TableHeaderColumn>

                                        </BootstrapTable>
                                    </div>
                                    <div className=" col-md-6 col-lg-6 col-sm-12">
                                        <BootstrapTable data={this.state.campusBasedCandidates} hover condensed striped >
                                            <TableHeaderColumn row="0" colSpan="4" className="castVoteGridTitle" dataAlign="center">Campus Based Professional Candidates</TableHeaderColumn>

                                            <TableHeaderColumn row="1" dataField="EmployeeID" dataSort dataAlign="center" isKey={true} >Emp. ID</TableHeaderColumn>
                                            <TableHeaderColumn row="1" dataField="EmpName" columnTitle dataSort dataAlign="left">Employee Name</TableHeaderColumn>
                                            <TableHeaderColumn row="1" dataField="DepartmentName" columnTitle dataSort dataAlign="left">Department Name</TableHeaderColumn>

                                            <TableHeaderColumn row="1" dataField="CandidateNomineeID" dataFormat={this.selectCandidateFormatterCampusBased} dataAlign="center">Vote</TableHeaderColumn>

                                        </BootstrapTable>
                                    </div>
                                </div>
                                <div className="row">
                                </div>
                                {UserVotingButton}
                            </div>;
                    }
                    else if (this.props.userProps.user.OrgGrpNaturalKey != "Campus" && this.state.isUserEligiblie == "Yes") {
                        UserVotingDiv =
                            <div className="white-box">
                                <div className="row">
                                    <label className="CastVoteInnerHeader col-md-12 col-lg-12 col-sm-12"> Please select one candidate from below category to represent you on the District Advisory Committee. </label>
                                </div>
                                <div className="row">
                                    <div className=" col-md-2 col-lg-2 "></div>
                                    <div className=" col-md-8 col-lg-8 col-sm-12">
                                        <BootstrapTable data={this.state.nonCampusCandidates} hover condensed striped >
                                            <TableHeaderColumn row="0" colSpan="4" className="castVoteGridTitle" dataAlign="center">Central Office Professional Candidates</TableHeaderColumn>

                                            <TableHeaderColumn row="1" dataField="EmployeeID" dataSort dataAlign="center" isKey={true} >Emp. ID</TableHeaderColumn>
                                            <TableHeaderColumn row="1" dataField="EmpName" columnTitle dataSort dataAlign="left">Employee Name</TableHeaderColumn>
                                            <TableHeaderColumn row="1" dataField="DepartmentName" columnTitle dataSort dataAlign="left">Department Name</TableHeaderColumn>

                                            <TableHeaderColumn row="1" dataField="CandidateNomineeID" dataFormat={this.selectCandidateFormatter} dataAlign="center">Vote</TableHeaderColumn>

                                        </BootstrapTable>
                                    </div>
                                    <div className=" col-md-2 col-lg-2"></div>
                                </div>
                                <div className="row">
                                </div>
                                {UserVotingButton}
                            </div>;

                    }
                    else
                        UserVotingDiv =
                            (
                                <div className="alert alert-warning CastVoteInnerHeader" style={{ textAlign: "center" }} role="alert">
                                    <p><strong>Warning! </strong>
                                        Current login user not eligible to vote.</p>
                                </div>
                            );
                }
                else {
                    let ResultDate = moment.utc(new Date(Utilities.getDateTime(ResultsAvailableStartDate))).format('LL');

                    let ResultTime = Utilities.tConvert(moment.duration(ResultsAvailableStartTime).hours() + ":" + moment.duration(ResultsAvailableStartTime).minutes() + ":00");

                    UserVotingDiv = (
                        <div className="alert alert-success CastVoteInnerHeader" style={{ textAlign: "center" }} role="alert">
                            <p><strong>Success!</strong> You have already cast your votes for the {schoolYear}  school year,
                                    Thank you for your votes.</p>
                            <p> Results will be avialable on {ResultDate} @ {ResultTime}.</p>
                        </div>
                    );
                }
            }
            else {
                UserVotingDiv =
                    <div className="white-box">
                        <div className="row">
                            <label className="CastVoteInnerHeader col-md-12 col-lg-12 col-sm-12">
                                Voting Period didnt start </label>
                        </div></div>;
            }
        }






        return (
            <IfAnyGranted expected={['Principal', 'SC', 'Voter']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>

                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Cast Vote" schoolYear={schoolYear} isDisabled={true} />

                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                {UserVotingDiv}
                            </div>
                        </div>
                    </div>
                    <Dialog
                        hidden={this.state.hideDialog}
                        onDismiss={this.closeDialog}
                        dialogContentProps={{
                            type: DialogType.normal,
                            title: 'Cast Vote',
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
CastVotePage.propTypes = {
    userProps: PropTypes.object,
    actions: PropTypes.object.isRequired,
    voteEligibility: PropTypes.object,
    locations: PropTypes.array,
    candidateTypes: PropTypes.array,
    votingSettings: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps,
        voteEligibility: state.voteEligibility,
        locations: state.locations,
        candidateTypes: state.candidateTypes,
        votingSettings: state.votingSettings,
        candidateNominees: state.candidateNominees
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, ajaxActions, sharedActions, voteEligibilityActions, locationsActions, candidateTypesActions, candidateNomineesActions, castVotesActions), dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CastVotePage);
