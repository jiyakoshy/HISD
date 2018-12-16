import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as campusActions from '../../actions/campusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import MessagePage from '../common/MessagePage';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

class HomePage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount(){
        this.props.actions.getCurrentSchoolYearAction();
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
            defaultSortName: 'CampusName',
            sortOrder: 'asc',
            prePage: 'Prev',
            nextPage: 'Next',
            firstPage: 'First',
            lastPage: 'Last',
            paginationShowsTotal: this.renderShowsTotal
        };
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="Home" campus={this.props.campusName} />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <div className="white-box">
                                <h3>Welcome at School Waivers(SWAV)</h3>
                                <div className="form-group">
                                    {/*<div className="col-md-6 col-lg-6 col-sm-6"><label>Principal Name: </label>&nbsp;<label style={{color: "darkgray"}}>{this.props.principalName}</label></div>
                                    <div className="col-md-6 col-lg-6 col-sm-6"><label>Campus: </label>&nbsp;&nbsp;<label style={{color: "darkgray"}}>{this.props.campusName}</label></div>
                                    */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

HomePage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        principalName : state.userProps.user.principalName
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(campusActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
