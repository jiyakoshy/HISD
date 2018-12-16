import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import * as adminActions from '../../actions/adminActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import LinkFormatter from '../common/formatters/linkFormatter';
import Utilities from '../../utilities/utilities';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class SiteContentPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.props.actions.loadAllSiteContents();
        this.newSiteContentPage = this.newSiteContentPage.bind(this);
    }

    newSiteContentPage() {
        document.location = "#admin-newsitecontent";
    }

    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'black' }}>
                From {start} to {to}. Total: {total}&nbsp;&nbsp;
          </p>
        );
    }

    linkFormatter(cell, row) {
        let url = '#admin-sitecontent/' + row.SiteContentID;
        let tooltip = 'Edit "' + cell + '" site content';
        return (
            <LinkFormatter url={url} description={cell} tooltip={tooltip} />
        );
    }

    textFormat(cell, row) {
        let html = row.SiteContentDescription;
        let div = document.createElement("div");
        div.innerHTML = html;
        let text = div.textContent || div.innerText || "";
        return(
            <div>{text}</div>
        );
    }


    render() {
        const options = {
            defaultSortName: 'SiteContentCode',
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
                        <PageHeader title="Site Content" campus={this.props.campusName} />
                        <div className="row">
                            <div className="col-md-6 col-lg-6 col-sm-12">
                                <div className="white-box">
                                    <PrimaryButton
                                        text="New Site Content Page"
                                        onClick={this.newSiteContentPage}
                                    />
                                    <br /><br />
                                    <BootstrapTable data={this.props.siteContents} hover condensed options={options}>
                                        <TableHeaderColumn dataField="SiteContentID" isKey hidden>ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="SiteContentCode" dataAlign="left" dataFormat={this.linkFormatter}>Code</TableHeaderColumn>
                                        <TableHeaderColumn dataField="SiteContentDescription" dataAlign="left" dataFormat={this.textFormat}>Content</TableHeaderColumn>
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

SiteContentPage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    siteContents: PropTypes.array,
    actions: PropTypes.object.isRequired,
    history: PropTypes.object,
    userProps: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        siteContents: state.siteContents,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(adminActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteContentPage);

