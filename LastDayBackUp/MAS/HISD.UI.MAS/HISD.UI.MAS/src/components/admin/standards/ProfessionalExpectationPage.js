import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import * as adminActions from '../../../actions/adminActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../../common/PageHeader';
import LinkFormatter from '../../common/formatters/linkFormatter';
import Utilities from '../../../utilities/utilities';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../../common/ErrorPage';

class ProfessionalExpectationPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.newProfessionalExpectationPage = this.newProfessionalExpectationPage.bind(this);
        this.state = {
            professionalStandard: []
        }
    }

    componentDidMount() {
        this.props.actions.loadAllActivityStandards().then(item => {
            const getProfessionalExpectation = Utilities.getInstructionPlanning(this.props.activityStandards[3].ActivityStandardItems);
            this.setState({
                professionalStandard: getProfessionalExpectation,
                activityGroupID: getProfessionalExpectation[0].ActivityStandardGroupID
            });
        });
    }

    renderShowsTotal(start, to, total) {
        return (
            <p style={{ color: 'black' }}>
                From {start} to {to}. Total: {total}&nbsp;&nbsp;
          </p>
        );
    }

    newProfessionalExpectationPage() {
        const groupID = this.state.activityGroupID;
        document.location = "#admin-newactivitystandard/" + groupID;
    }

    linkFormatter(cell, row) {
        let url = '#admin-editactivitystandard/' + row.ActivityStandardItemID + '/' + row.ActivityStandardGroupID;
        let tooltip = 'Edit "' + cell + '" Professional Expectation';
        return (
            <LinkFormatter url={url} description={cell} tooltip={tooltip} />
        );
    }

    dateFormatter(cell, row) {
        let formattedDate = Utilities.getDateOnly(cell);
        if (formattedDate == 'NaN/NaN/NaN') {
            formattedDate = 'No Date.'
        }
        return (formattedDate);
    }

    render() {
        const options = {
            defaultSortName: 'ActivityStandardItemID',
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
                        <PageHeader title="Professional Expectation Standards" campus={this.props.campusName} />
                        <div className="row">
                            <div className="col-md-8 col-lg-8 col-sm-12">
                                <div className="white-box">
                                    <PrimaryButton
                                        text="New Professional Expectation"
                                        onClick={this.newProfessionalExpectationPage}
                                    />
                                    <br /><br />
                                    <BootstrapTable data={this.state.professionalStandard} hover condensed pagination options={options} search>
                                        <TableHeaderColumn dataField="ActivityStandardItemID" isKey hidden>ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ActivityStandardItemName" dataAlign="left" dataSort
                                            dataFormat={this.linkFormatter} tdStyle={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>Activity Standard Item Name</TableHeaderColumn>
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

ProfessionalExpectationPage.propTypes = {
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
        homeMessages: state.homeMessages,
        activityStandards: state.activityStandards
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(adminActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionalExpectationPage);

