// This component handles the App template used on every page.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from './common/Header';
import { hashHistory } from 'react-router-dom';
import QuickLaunch from './common/QuickLaunch';

class App extends React.Component {
    
    render() {
        return (
        <div id="wrapper">
            <Header userProps={this.props.userProps} appProps={this.props.appProps} menuOptions={this.props.menuOptions} loading={this.props.loading} />
            <QuickLaunch menuOptions={this.props.menuOptions} />
            {this.props.children}
      </div>
    );
  }
}

const parameters = {
    method: 'get',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'AppID': 'MSHP'
    }
  };  

App.propTypes = {
    children: PropTypes.object,
    userProps: PropTypes.object.isRequired,
    menuOptions: PropTypes.array,
    appProps: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps,
        menuOptions: state.menuOptions,
        appProps: state.appProps,
        loading: state.ajaxCallsInProgress > 0
    };
}
export default connect(mapStateToProps)(App);
