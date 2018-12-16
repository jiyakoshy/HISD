import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import * as adminActions from '../../actions/adminActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import ActiveFormatter from '../common/formatters/activeFormatter';
import LinkFormatter from '../common/formatters/linkFormatter';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class ActivityCodesPage extends React.Component {
     constructor(props, context) {
        super(props, context);
        this.newActivityCode = this.newActivityCode.bind(this);
    }

    componentDidMount(){
        this.props.actions.loadAllActivityCodes();
    }

    newActivityCode() {
        document.location = '#admin-newactivitycode';
    }

    activeFormatter(cell, row) {
        return (
          <ActiveFormatter active={cell} />
        );
    }

    linkFormatter(cell, row) {
        let url = '#admin-activitycode/' + row.ActivityCodeID;
        let tooltip = 'Edit "' + cell + '" activity code';
        return (
          <LinkFormatter url={url} description={cell} tooltip={tooltip} />
        );
    }
    activeCheckmarkFormatter(row){
        if(row == true){
            return (
                <span className="glyphicon glyphicon-ok" style={{ color: 'green' }}></span>
            )
        }
        else{
            return (
                <span className="glyphicon glyphicon-remove" style={{ color: 'red' }}></span>
            )
        }
        
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
            defaultSortName: 'ActivityCodeName',
            sortOrder: 'asc',
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
                        <PageHeader title="Activity Codes" campus={this.props.campusName} />
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div className="white-box">
                                    <PrimaryButton
                                        text="New Activity Code"
                                        onClick={this.newActivityCode}
                                    />
                                    <BootstrapTable data={this.props.activityCodes} hover condensed pagination options={options} search>
                                        <TableHeaderColumn dataField="ActivityCodeID" isKey hidden>ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ActivityCodeName" dataSort dataAlign="left" width={'200px'} dataFormat={this.linkFormatter}>Code</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ActivityCodeDescription" dataSort dataAlign="left">Description</TableHeaderColumn>
                                        <TableHeaderColumn dataField="Status" dataSort dataAlign="center" width={'80px'} dataFormat={this.activeCheckmarkFormatter}>Status</TableHeaderColumn>
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

ActivityCodesPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    activityCodes: PropTypes.array,
    newActivityCode: PropTypes.func,
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object,
    history: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        activityCodes: state.activityCodes,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(adminActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityCodesPage);
