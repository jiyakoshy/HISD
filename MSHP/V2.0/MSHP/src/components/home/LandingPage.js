// This component handles the App template used on every page.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router-dom';
import HomePage from './HomePage';
import MessagePage from '../common/MessagePage';

class LandingPage extends React.Component {
    
    render() {
        return (<HomePage />);
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
