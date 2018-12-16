import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as campusActions from '../../actions/campusActions';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import LeaderInfo from '../common/LeaderInfo';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';

import HomePage from './HomePage';
import MessagePage from '../common/MessagePage';

class MenteeHomePage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    renderShowsTotal(start, to, total) {
    return (
      <p style={{color: 'black'}}>
        From {start} to {to}, totals is {total}&nbsp;&nbsp;
      </p>
    );
   }

    render() {
        // welcome Message
        let msg;
        if(this.props.userProps && this.props.userProps.homePage && this.props.userProps.homePage.content)
            msg = this.props.userProps.homePage.content;
        else 
            msg = "Mentee - Welcome Message Content Place Holder.";
        
        let options = {};
        let mentorActivities = [{MentorID: 1, Mentor: 'Darr, Lauren', Activities: 12, Completed: 8, Percent: '67%'},{MentorID: 2, Mentor: 'Eaton, Steven', Activities: 10, Completed: 3, Percent: '30%'},{MentorID: 3, Mentor: 'Kiel, Willie', Activities: 9, Completed: 2, Percent: '22%'}, {MentorID: 4, Mentor: 'SantaAna, Reyna', Activities: 7, Completed: 4, Percent: '57%'}, {MentorID: 5, Mentor: 'Loera Garza, Luis', Activities: 6, Completed: 3, Percent: '50%'}, {MentorID: 6, Mentor: 'Moore, Tesava', Activities: 6, Completed: 5, Percent: '83%'}];
        return (
            <IfAnyGranted expected={['Mentee']} actual={this.props.userProps.user.role} unauthorized={<ErrorPage />}>
                <div id="page-wrapper">
                    <div className="container-fluid">
                        <PageHeader title="Home" campus={this.props.campusName} />
                        {/*<div className="row">
                            <LeaderInfo />
                        </div>
                        <br />*/}
                        <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <div className="white-box">
                                <h3>Welcome at Mentor Activity System(MAS)</h3>
                                <div dangerouslySetInnerHTML={{__html: msg}} />
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </IfAnyGranted>
        );
    }
}

MenteeHomePage.propTypes = {
    campusID: PropTypes.string,
    campusName: PropTypes.string,
    actions: PropTypes.object.isRequired,
    reloadData: PropTypes.func,
    history: PropTypes.object,
    userProps: PropTypes.object,
    campuses: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        campusID: state.userProps.user.campusID,
        campusName: state.userProps.user.campusName,
        campuses: state.campuses,
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(campusActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenteeHomePage);
