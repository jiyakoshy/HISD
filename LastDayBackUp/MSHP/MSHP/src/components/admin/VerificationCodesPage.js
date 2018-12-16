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

class VerificationCodesPage extends React.Component {
     constructor(props, context) {
        super(props, context);
        this.newVerificationCode = this.newVerificationCode.bind(this);
    }

    componentDidMount(){
        this.props.actions.loadVerificationCode();
    }

    newVerificationCode() {
        document.location = '#admin-newverificationcode';
    }

    activeFormatter(cell, row) {
        return (
          <ActiveFormatter active={cell} />
        );
    }

    linkFormatter(cell, row) {
        let url = '#admin-verificationcode/' + row.MultiChoiceListItemID;
        let tooltip = 'Edit "' + cell + '" verification code';
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
            defaultSortName: 'MultiChoiceListItemCode',
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
                        <PageHeader title="Activity Log Verification Codes" campus={this.props.campusName} />
                        <div className="row">
                            <div className="col-md-8 col-lg-8 col-sm-12">
                                <div className="white-box">
                                    <PrimaryButton
                                        text="New Verification Code"
                                        onClick={this.newVerificationCode}
                                    />
                                    <BootstrapTable data={this.props.verificationCode.MultiChoiceListItems} hover condensed pagination options={options} search>
                                        <TableHeaderColumn dataField="MultiChoiceListID" hidden />
                                        <TableHeaderColumn dataField="MultiChoiceListItemID" isKey hidden />
                                        <TableHeaderColumn dataField="MultiChoiceListItemCode" dataSort dataAlign="left" width={'200px'} dataFormat={this.linkFormatter}>Code</TableHeaderColumn>
                                        <TableHeaderColumn dataField="MultiChoiceListItemDescription" dataSort dataAlign="left">Description</TableHeaderColumn>
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

VerificationCodesPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    verificationCode: PropTypes.object,
    newActivityCode: PropTypes.func,
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object,
    history: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        verificationCode: state.verificationCode,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(adminActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(VerificationCodesPage);
