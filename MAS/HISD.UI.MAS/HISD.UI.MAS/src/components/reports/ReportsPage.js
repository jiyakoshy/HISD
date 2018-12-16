import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import * as sharedActions from '../../actions/sharedActions';
import { hashHistory } from 'react-router-dom';
import LinkFormatter from '../common/formatters/linkFormatter';
import PageHeader from '../common/PageHeader';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

let isReportDataAdded = false;
class ReportsPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 
            campusID: '',
            reportsOptions: []
        };
        isReportDataAdded = false;
    }

    linkFormatter(cell, row) {
        let url = row.url;
        let tooltip = cell;
        return (
          <LinkFormatter url={url} description={cell} tooltip={tooltip} />
        );
    }

    render() {
        if(isReportDataAdded == false && this.props.userProps.user.role){
            const menuOptions = this.props.menuOptions;
            let reports = [];
            let links = [];
            if(this.props.userProps.user.role == 'Admin')
                reports = menuOptions[5];
            else if(this.props.userProps.user.role == 'Principal')
                reports = menuOptions[6];
            else if(this.props.userProps.user.role == 'CIC')
                reports = menuOptions[5];
            else if(this.props.userProps.user.role == 'Mentor')
                reports = menuOptions[3];
            if(reports.links && reports.links.length > 0){
                links = reports.links;
            }
            this.setState({reportsOptions: links});
            isReportDataAdded = true;
        }
        const options = {
            
        };
        return (
            <IfAnyGranted expected={['Admin','Principal', 'CIC', 'Mentor']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Reports" campus={this.props.campus} hideCampusDrpDwn="Hide"/>
                        <div className="row">
                            <div className="col-md-8 col-lg-8 col-sm-12">
                                <div className="white-box">
                                    <DefaultButton
                                        text="Reports"
                                    />
                                <BootstrapTable data={this.state.reportsOptions} hover condensed>
                                        <TableHeaderColumn dataField="name" width={'250px'} dataFormat={this.linkFormatter} tdStyle={{padding: '8px'}} isKey dataAlign="left">Report Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="description" dataAlign="left">Description</TableHeaderColumn>
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

ReportsPage.propTypes = {
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

export default connect(mapStateToProps)(ReportsPage);