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

class AdminHomePage extends React.Component {
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

   componentWillMount () {//gm
    console.log('AdminHomePage component will mount');
        }

    render() {
        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Dashboard" campus={this.props.campusName} />
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
                                            value={75}
                                            needleColor="steelblue"
                                            startColor="red"
                                            segments={10}
                                            endColor="green"
                                            needleTransition="easeElastic"
                                            needleTransitionDuration={4000}
                                            height={200}
                                        /> 
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-sm-12">
                                <div className="white-box">
                                    <h3>Top 5 campuses with the most relationships</h3>
                                    <div className="row row-in">
                                        <Chart
                                            chartType="BarChart"
                                            data={[['Campus', 'Relationships',{"role":"style"}], ['Stevenson Middle School', 9,'red'],['Bellaire High School', 13, 'blue'], ['Elliot Elementary', 8, 'green'], ['McGowen Elementary', 11, 'orange'],['Westside High School', 7, 'maroon']]}
                                            options={{legend: 'none'}}
                                            graph_id="Top5CampusesChart"
                                            width="100%"
                                            height="200px"
                                            />
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6 col-xs-12 col-md-4 col-lg-4">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="white-box">
                                            <h3>Relationships status</h3>
                                            <div className="row row-in">
                                                <Chart
                                                    chartType="PieChart"
                                                    data={[['Status', 'Total'], ['pending', 28],['approved', 85], ['rejected', 12]]}
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

                            <div className="col-sm-6 col-xs-12 col-md-4 col-lg-4">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="white-box">
                                            <div className="bar-widget">
                                                <div className="table-box">
                                                    <div className="cell text-left">
                                                        <h2 className="m-t-0 m-b-5 font-light counter">47%</h2>
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
                                                        <h2 className="m-t-0 m-b-5 font-light">64</h2>
                                                        <h5 className="text-muted m-b-0 m-t-0">campuses using the program</h5> 
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
                                                        <h2 className="m-t-0 m-b-5 font-light counter">341.5</h2>
                                                        <h5 className="text-muted m-b-0 m-t-0">hours spent by mentors this month</h5> 
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
                                                        <h2 className="m-t-0 m-b-5 font-light counter">28</h2>
                                                        <h5 className="text-muted m-b-0 m-t-0">relationships pending for approval</h5> 
                                                    </div>
                                                    <div className="cell text-right">
                                                        <div id="sparkline1"></div>
                                                    </div>
                                                </div>
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

AdminHomePage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    userProps: PropTypes.object,
    history: PropTypes.object,
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminHomePage);
