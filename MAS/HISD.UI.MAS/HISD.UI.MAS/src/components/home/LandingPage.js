// This component handles the App template used on every page.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router-dom';
import HomePage from './HomePage';
import AdminHomePage from './AdminHomePage';
import PrincipalHomePage from './PrincipalHomePage';
import MentorHomePage from './MentorHomePage';
import MenteeHomePage from './MenteeHomePage';
import MessagePage from '../common/MessagePage';

class LandingPage extends React.Component {
    
    render() {
        // ------------ Commented Code focused the Maintenance && ALL Message Display
        //if(this.props.userProps && this.props.userProps.homePage && this.props.userProps.homePage.content && this.props.userProps.homePage.content != "" && (this.props.userProps.homePage.type=='Maintenance' || this.props.userProps.homePage.type=='All' || this.props.userProps.homePage.type=='Mentor' || this.props.userProps.homePage.type=='Mentee' || this.props.userProps.homePage.type=='Admin')){
        /*if(this.props.userProps && this.props.userProps.homePage && this.props.userProps.homePage.content && this.props.userProps.homePage.content != ""){
            return (<MessagePage />);
        }*/
        if(this.props.userProps.user.role == 'Admin'){
            return (<AdminHomePage />);
        }
        else if(this.props.userProps.user.role == 'Principal' || this.props.userProps.user.role == 'CIC'){
            return (<PrincipalHomePage />);
        }
        else if(this.props.userProps.user.role == 'Mentor'){
            return (<MentorHomePage />);
        }
        else if(this.props.userProps.user.role == 'Mentee'){
            return (<MenteeHomePage />);
        }
        // In case of any new role been introduced 
        else{
            return (<MessagePage />);
        }
        
        /*else{
            return (<div />);
        }*/
    }
}

LandingPage.propTypes = {
    userProps: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps
    };
}

export default connect(mapStateToProps)(LandingPage);
