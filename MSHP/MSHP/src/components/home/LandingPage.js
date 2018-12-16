// This component handles the App template used on every page.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router-dom';
import HomePage from './HomePage';
import AdminHomePage from './AdminHomePage';
import PrincipalHomePage from './PrincipalHomePage';
import MessagePage from '../common/MessagePage';

class LandingPage extends React.Component {
    
    render() {
        console.log('RENDER OF LANDING PAGE');
        return (<HomePage />);
        //if(this.props.userProps && this.props.userProps.homePage && this.props.userProps.homePage.content && this.props.userProps.homePage.content != "" && (this.props.userProps.homePage.type=='Maintenance' || this.props.userProps.homePage.type=='All' || this.props.userProps.homePage.type=='Mentor' || this.props.userProps.homePage.type=='Mentee' || this.props.userProps.homePage.type=='Admin')){
      /*   if(this.props.userProps && this.props.userProps.homePage && this.props.userProps.homePage.content && this.props.userProps.homePage.content != ""){
            console.log('INTO MESSAGE PAGE CALL OF LANDING PAGE');
            return (<MessagePage />);
        }
        else if(this.props.userProps.user.role == 'Admin'){
            console.log('INTO HOME PAGE CALL OF LANDING PAGE');
            return (<HomePage />);
            //return (<AdminHomePage />);//gm commented
        }
            //gm commented
          else if(this.props.userProps.user.role == 'Principal' || this.props.userProps.user.role == 'CIC'){
            return (<PrincipalHomePage />);
        }
 
        else{
            console.log('NEITHER MESSAGE PAGE NOR HOME PAGE OF LANDING PAGE');
            return (<div />);
        } */
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
