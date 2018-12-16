import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as campusActions from '../../actions/campusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { Chart } from 'react-google-charts';
import ReactSpeedometer from "react-d3-speedometer";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import LeaderInfo from '../common/LeaderInfo';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class PrincipalHomePage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    renderShowsTotal(start, to, total) {
    return (
      <p style={{color: 'black'}}>
        From {start} to {to}, totals is {total}&nbsp;&nbsp;
      </p>
    );
   }

    render() {
        let options = {};
        let mentorActivities = [{MentorID: 1, Mentor: 'Darr, Lauren', Activities: 12, Completed: 8, Percent: '67%'},{MentorID: 2, Mentor: 'Eaton, Steven', Activities: 10, Completed: 3, Percent: '30%'},{MentorID: 3, Mentor: 'Kiel, Willie', Activities: 9, Completed: 2, Percent: '22%'}, {MentorID: 4, Mentor: 'SantaAna, Reyna', Activities: 7, Completed: 4, Percent: '57%'}, {MentorID: 5, Mentor: 'Loera Garza, Luis', Activities: 6, Completed: 3, Percent: '50%'}, {MentorID: 6, Mentor: 'Moore, Tesava', Activities: 6, Completed: 5, Percent: '83%'}];
        return (
            <IfAnyGranted expected={['Principal', 'CIC']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Dashboard" campus={this.props.campusName} />
                        <div className="row">
                            <LeaderInfo />
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-lg-6 col-sm-12 pull-center">                         
                                <div className="white-box">
                                    <h3>Percentage of mentors with complete logs</h3>
                                    <div className="pull-center"  
                                        style={{
                                            width: "100%",
                                            height: "200px !important",
                                            textAlign: "center"
                                        }}>
                                        <ReactSpeedometer
                                            maxValue={100}
                                            value={35}
                                            needleColor="steelblue"
                                            startColor="red"
                                            segments={10}
                                            endColor="green"
                                            needleTransitionDuration={4000}
                                            needleTransition="easeElastic"
                                            height={200}
                                        /> 
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-sm-12">
                                <div className="white-box">
                                    <h3>Total activities by mentor</h3>
                                    <div className="row row-in">
                                        <BootstrapTable data={mentorActivities} hover condensed options={options}>
                                            <TableHeaderColumn dataField="MentorID" isKey hidden>ID</TableHeaderColumn>
                                            <TableHeaderColumn dataField="Mentor" dataAlign="left">Mentor</TableHeaderColumn>
                                            <TableHeaderColumn dataField="Activities" dataAlign="center">Total Activities</TableHeaderColumn>
                                            <TableHeaderColumn dataField="Completed" dataAlign="center">Completed</TableHeaderColumn>
                                            <TableHeaderColumn dataField="Percent" dataAlign="center">Percentage</TableHeaderColumn>
                                        </BootstrapTable>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6 col-xs-12 col-md-4 col-lg-4">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="white-box">
                                            <div className="bar-widget">
                                                <div className="table-box">
                                                    <div className="cell text-left">
                                                        <h2 className="m-t-0 m-b-5 font-light counter">3</h2>
                                                        <h5 className="text-muted m-b-0 m-t-0">relationships pending for approval</h5> 
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="white-box">
                                            <div className="bar-widget">
                                                <div className="table-box">
                                                    <div className="cell text-left">
                                                        <h2 className="m-t-0 m-b-5 font-light">11</h2>
                                                        <h5 className="text-muted m-b-0 m-t-0">mentors using the program</h5> 
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6 col-xs-12 col-md-4 col-lg-4">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="white-box">
                                            <div className="bar-widget">
                                                <div className="table-box">
                                                    <div className="cell text-left">
                                                        <h2 className="m-t-0 m-b-5 font-light counter">25%</h2>
                                                        <h5 className="text-muted m-b-0 m-t-0">percentage of activities verified by mentors</h5> 
                                                    </div>
                                                    <div className="cell text-right">
                                                        <div id="sparkline1"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="white-box">
                                            <div className="bar-widget">
                                                <div className="table-box">
                                                    <div className="cell text-left">
                                                        <h2 className="m-t-0 m-b-5 font-light counter">18</h2>
                                                        <h5 className="text-muted m-b-0 m-t-0">hours spent by mentors this month</h5> 
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-xs-12 col-md-4 col-lg-4">
                                <div className="row">
                                    <div className="col-lg-12 pull-center">
                                        <div className="white-box">
                                            <h3>Relationships status</h3>
                                            <div className="pull-center">
                                                <Chart
                                                    chartType="PieChart"
                                                    data={[['Status', 'Total'], ['pending', 3],['approved', 8], ['rejected', 2]]}
                                                    graph_id="StatusChart"
                                                    width="100%"
                                                    height="250px"
                                                    options={{pieHole: 0.4, is3D: true, colors: ['blue','green', 'red']}}
                                                />
                                            </div>
                                        </div>
                                    </div>   
                                </div>
                            </div>                
                        </div>
                    </div>
                </div>
            </IfAnyGranted>
        );
    }
}

PrincipalHomePage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    userProps: PropTypes.object,
    campuses: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        campuses: state.campuses,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(campusActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PrincipalHomePage);
