import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import * as adminActions from '../../actions/adminActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import LinkFormatter from '../common/formatters/linkFormatter';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class CBMStandardsPage extends React.Component {
     constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        this.props.actions.loadAllCBMStandards();
    }
    
    linkFormatter(cell, row) {
        let url = '#admin-cbmstandard/' + row.CBMStandardID;
        let tooltip = 'Edit "' + cell.trim() + '" CBM Standard';
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
            defaultSortName: 'MonthOrder',
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
                        <PageHeader title="CBM Standards" campus={this.props.campusName} />
                        <div className="row">
                            <div className="col-md-6 col-lg-6 col-sm-12">
                                <div className="white-box">
                                <BootstrapTable data={this.props.cbmStandards} hover condensed options={options}>
                                        <TableHeaderColumn dataField="CBMStandardID" isKey hidden>ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MonthName" dataAlign="left" dataFormat={this.linkFormatter}>Month</TableHeaderColumn>
                                        <TableHeaderColumn dataField="Year" dataAlign="center">Year</TableHeaderColumn>
                                        <TableHeaderColumn dataField="NoOfLogs" dataAlign="center">Number of Logs</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MonthOrder" dataAlign="center">Month Order</TableHeaderColumn>
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

CBMStandardsPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    cbmStandards: PropTypes.array,
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object,
    history: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        userProps: state.userProps,
        cbmStandards: state.cbmStandards
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(adminActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(CBMStandardsPage);

