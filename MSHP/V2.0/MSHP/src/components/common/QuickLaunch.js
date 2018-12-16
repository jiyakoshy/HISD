import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Nav } from 'office-ui-fabric-react/lib/Nav';

class QuickLaunch extends React.Component{
    render() {
        let myOptions = JSON.parse(localStorage.getItem("menu"));
        return (
            <div className="navbar-default sidebar nicescroll" role="navigation">
                <div className="sidebar-nav navbar-collapse ">
                    <div className="nav" id="side-menu">
                        <Nav groups={[{ links: myOptions }]} /> 
                    </div>
                </div>
            </div >
        );
    }
}

QuickLaunch.propTypes = {
    menuOptions: PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps,
        menuOptions: state.menuOptions
    };
}

export default connect(mapStateToProps)(QuickLaunch);