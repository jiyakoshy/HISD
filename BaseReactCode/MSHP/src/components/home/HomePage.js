import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as campusActions from '../../actions/campusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

class HomePage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount(){
        this.props.actions.loadAllCampuses();
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
                                This is working!
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
    history: PropTypes.object,
    campuses: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        campuses: state.campuses
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(campusActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
