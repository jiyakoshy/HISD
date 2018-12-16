import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import * as adminActions from '../../actions/adminActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import Utilities from '../../utilities/utilities';
import LinkFormatter from '../common/formatters/linkFormatter';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class TimeConfigPage extends React.Component {
     constructor(props, context) {
        super(props, context);
        this.newTimeConfiguration = this.newTimeConfiguration.bind(this);
    }

    componentDidMount(){
        this.props.actions.loadAllTimeConfigs();
    }

    newTimeConfiguration() {
        document.location = '#admin-newtimeconfig';
    }

    linkFormatter(cell, row) {
        let url = '#admin-timeconfig/' + row.TimeConfigurationID;
        //let tooltip = 'Edit school year "' + cell.trim() + '" time configuration';
        let tooltip = 'Edit school year time configuration';
        return (
          <LinkFormatter url={url} description="View/Action" tooltip={tooltip} />
        );
    }
    
    dateFormatter(cell, row) {
        let formattedDate = Utilities.getDateOnly(cell);
        return (formattedDate);
    }

    renderShowsTotal(start, to, total) {
        return (
          <p style={{color: 'black'}}>
            From {start} to {to}. Total: {total}&nbsp;&nbsp;
          </p>
        );
    }
    
    render() {
        const options = {
            defaultSortName: 'SchoolYear',
            sortOrder: 'desc',
            prePage: 'Prev',
            nextPage: 'Next',
            firstPage: 'First',
            lastPage: 'Last',
            paginationShowsTotal: this.renderShowsTotal
        };

        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Time Configuration" campus={this.props.campusName} />
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                {/* <div className="white-box-button"> 
                                    <PrimaryButton
                                        text="New Time Configuration"
                                        onClick={this.newTimeConfiguration}
                                    />
                                </div>
 */}
                                <div className="white-box">
                                    <h3>School Year</h3>
                                    <BootstrapTable data={this.props.timeConfigs} hover condensed pagination options={options}>
                                            <TableHeaderColumn dataField="TimeConfigurationID" isKey dataAlign="left" dataFormat={this.linkFormatter}>View/Action</TableHeaderColumn>
                                            <TableHeaderColumn dataField="SchoolYear" dataAlign="left">School Year</TableHeaderColumn>
                                            <TableHeaderColumn dataField="SchoolStartDate" dataAlign="center" dataFormat={this.dateFormatter}>School Start Date</TableHeaderColumn>
                                            <TableHeaderColumn dataField="SchoolEndDate" dataAlign="center" dataFormat={this.dateFormatter}>School End Date</TableHeaderColumn>                                            
                                    </BootstrapTable>
                                </div>
                                <div className="white-box">
                                    <h3>Mentor Activity Log Input Window</h3>
                                    <BootstrapTable data={this.props.timeConfigs} hover condensed pagination options={options}>
                                            <TableHeaderColumn dataField="SchoolYear" isKey hidden>ID</TableHeaderColumn>
                                            <TableHeaderColumn dataField="LogStartDate" dataAlign="center" dataFormat={this.dateFormatter}>Activity Logs Start Date</TableHeaderColumn>
                                            <TableHeaderColumn dataField="LogEndDate" dataAlign="center" dataFormat={this.dateFormatter}>Activity Logs End Date</TableHeaderColumn>
                                    </BootstrapTable>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </IfAnyGranted>
        );
    }
}

TimeConfigPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    timeConfigs: PropTypes.array,
    newTimeConfig: PropTypes.func,
    actions: PropTypes.object.isRequired,
    history: PropTypes.object,
    userProps: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        timeConfigs: state.timeConfigs,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(adminActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeConfigPage);