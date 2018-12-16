import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import LinkFormatter from '../common/formatters/linkFormatter';
import * as sharedActions from '../../actions/sharedActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

let isAdminActionsDataAdded = false;
class AdminPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            campusID: '',
            reportsOptions: []
        };
        isAdminActionsDataAdded = false;
    }

    linkFormatter(cell, row) {
        let url = row.url;
        let tooltip = cell;
        return (
            <LinkFormatter url={url} description={cell} tooltip={tooltip} />
        );
    }

    render() {
        if (isAdminActionsDataAdded == false && this.props.userProps.user.role) {
            const menuOptions = this.props.menuOptions;
            let adminActions = [];
            let links = [];
            if (this.props.userProps.user.role == 'Admin')
                adminActions = menuOptions[6];

            if (adminActions.links && adminActions.links.length > 0) {
                links = adminActions.links;
            }
            this.setState({ reportsOptions: links });
            isAdminActionsDataAdded = true;
        }
        const options = {

        };
        return (
            <IfAnyGranted expected={['Admin']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Administrative Actions" campus={this.props.campus} />
                        <div className="row">
                            <div className="col-md-8 col-lg-8 col-sm-12">
                                <div className="white-box">
                                    <DefaultButton
                                        text="Administrative Actions"
                                    />
                                    <BootstrapTable data={this.state.reportsOptions} hover condensed>
                                        <TableHeaderColumn dataField="name" width={'200px'} dataFormat={this.linkFormatter} tdStyle={{ padding: '8px', whiteSpace: 'normal', wordWrap: 'break-word' }} isKey dataAlign="left">Report Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="description" dataAlign="left" tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>Description</TableHeaderColumn>
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

AdminPage.propTypes = {
    campus: PropTypes.string,
    userProps: PropTypes.object,
    menuOptions: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        campus: state.userProps.user.campusName,
        userProps: state.userProps,
        menuOptions: state.menuOptions
    };
}

export default connect(mapStateToProps)(AdminPage);