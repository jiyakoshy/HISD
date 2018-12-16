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
import Utilities from '../../utilities/utilities';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class HomeMessagesPage extends React.Component {
     constructor(props, context) {
        super(props, context);
        this.props.actions.loadAllHomeMessages();
        this.newHomeMessage =  this.newHomeMessage.bind(this);
    }

    renderShowsTotal(start, to, total) {
        return (
          <p style={{color: 'black'}}>
            From {start} to {to}. Total: {total}&nbsp;&nbsp;
          </p>
        );
    }

    newHomeMessage(){
        document.location = "#admin-newhomemessage";
    }

    linkFormatter(cell, row) {
        let url = '#admin-homemessage/' + row.HomeMessageID;
        let tooltip = 'Edit "' + cell + '" home message';
        return (
          <LinkFormatter url={url} description={cell} tooltip={tooltip} />
        );
    }

    dateFormatter(cell, row) {
        let formattedDate = Utilities.getDateOnly(cell);
        return (formattedDate);
    }

    render() {
        const options = {
            defaultSortName: 'HomeMessageRole',
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
                        <PageHeader title="Home Messages" campus={this.props.campusName} />
                        <div className="row">
                            <div className="col-md-6 col-lg-6 col-sm-12">
                                <div className="white-box">
                                    <PrimaryButton
                                        text="New Home Message"
                                        onClick={this.newHomeMessage}
                                    />
                                    <br /><br />
                                <BootstrapTable data={this.props.homeMessages} hover condensed options={options}>
                                        <TableHeaderColumn dataField="HomeMessageID" isKey hidden>ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="HomeMessageRole" dataAlign="left" dataFormat={this.linkFormatter}>Message Role</TableHeaderColumn>
                                        <TableHeaderColumn dataField="StartDate" dataAlign="center" dataFormat={this.dateFormatter}>Start Date</TableHeaderColumn>
                                        <TableHeaderColumn dataField="EndDate" dataAlign="center" dataFormat={this.dateFormatter}>End Date</TableHeaderColumn>
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

HomeMessagesPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    homeMessages: PropTypes.array,
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object,
    history: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        userProps: state.userProps,
        homeMessages: state.homeMessages
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(adminActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeMessagesPage);

