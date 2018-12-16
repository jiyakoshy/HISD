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

class ActivityStandardGroupsPage extends React.Component {
     constructor(props, context) {
        super(props, context);
        this.newActivityStandardGroup = this.newActivityStandardGroup.bind(this);
    }

    componentDidMount(){
        this.props.actions.loadAllnewActivityStandardGroups();
    }

    newActivityStandardGroup() {
        document.location = '#admin-newactivitystandardgroup';
    }

    activeFormatter(cell, row) {
        return (
          <ActiveFormatter active={cell} />
        );
    }

    linkFormatter(cell, row) {
        let url = '#admin-activitystandardgroup/' + row.ActivityStandardGroupID;
        let tooltip = 'Edit "' + cell + '" activity standard group';
        return (
          <LinkFormatter url={url} description={cell} tooltip={tooltip} />
        );
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
            defaultSortName: 'ActivityStandardGroupName',
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
                        <PageHeader title="Activity Standard Groups" campus={this.props.campusName} />
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <div className="white-box">
                                    <PrimaryButton
                                        text="New Activity Standard Group"
                                        onClick={this.newActivityCode}
                                    />
                                    <BootstrapTable data={this.props.activityStandardGroups} hover condensed pagination options={options} search>
                                        <TableHeaderColumn dataField="ActivityStandardGroupID" isKey hidden>ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ActivityStandardGroupName" dataSort dataAlign="left" width={'200px'} dataFormat={this.linkFormatter}>Code</TableHeaderColumn>
                                        <TableHeaderColumn dataField="Status" dataSort dataAlign="center" width={'80px'} dataFormat={this.activeFormatter}>Active</TableHeaderColumn>
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

ActivityStandardGroupsPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    activityStandardGroups: PropTypes.array,
    newActivityStandardGroup: PropTypes.func,
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object,
    history: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        activityStandardGroups: state.activityCodes,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(adminActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityStandardGroupsPage);
