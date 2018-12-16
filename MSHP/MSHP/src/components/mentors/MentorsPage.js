import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as campusActions from '../../actions/campusActions';
import * as mentorsActions from '../../actions/mentorsActions';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import Utilities from '../../utilities/utilities';
import LeaderInfo from '../common/LeaderInfo';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

class MentorsPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { campusID: '' };
    }

    componentDidMount() {
        this.props.actions.loadMentorsByCampus(this.props.userProps.user.campusID);
        this.setState({campusID: this.props.campusID});
    }

    lowerCaseFormatter(cell, row) {
        if(cell != null)
            return (
            <span style={{textTransform: "lowercase"}}>{cell}</span>
            );
        else
        return (
            <span></span>
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
        if(this.state.campusID != this.props.campusID){
            this.props.actions.loadMentorsByCampus(this.props.campusID);
            this.setState({campusID: this.props.campusID});
        }
        const options = {
            defaultSortName: 'FullName',
            sortOrder: 'asc',
            prePage: 'Prev',
            nextPage: 'Next',
            firstPage: 'First',
            lastPage: 'Last',
            paginationShowsTotal: this.renderShowsTotal
        };
        return (
            <IfAnyGranted expected={['Admin', 'Campus', 'Reports']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Mentor Profiles" campus={this.props.campus} />
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <LeaderInfo />
                                <div className="white-box">
                                    <BootstrapTable data={this.props.mentors} hover condensed pagination options={options} search>
                                        <TableHeaderColumn dataField="StaffNaturalKey" width={"100px"} isKey dataAlign="left">Emp. ID</TableHeaderColumn>
                                        <TableHeaderColumn dataField="FullName" dataSort dataAlign="left" thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Mentor Name</TableHeaderColumn>
                                        <TableHeaderColumn dataField="JobFunctionDescription" dataSort dataAlign="left" tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>Title</TableHeaderColumn>
                                        <TableHeaderColumn dataField="ElectronicMailAddress" dataSort dataAlign="left" dataFormat={this.lowerCaseFormatter} thStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}} tdStyle={{whiteSpace: 'normal', wordWrap: 'break-word'}}>E-mail Address</TableHeaderColumn>
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

MentorsPage.propTypes = {
    campusID: PropTypes.string,
    campus: PropTypes.string,
    mentors: PropTypes.array,
    actions: PropTypes.object.isRequired,
    userProps: PropTypes.object,
    visibility: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campus: state.userProps.user.campusName,
        mentors: state.mentors,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, campusActions, mentorsActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(MentorsPage);