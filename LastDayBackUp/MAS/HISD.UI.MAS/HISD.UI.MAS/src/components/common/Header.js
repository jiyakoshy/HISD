import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sharedActions from './../../actions/sharedActions';
import * as adminActions from './../../actions/adminActions';
import * as campusActions from './../../actions/campusActions';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Link, IndexLink } from 'react-router-dom';
import { genericFormattedForDropdown } from './../../selectors/selectors';
import WorkingOnIt from './WorkingOnIt';
import Config from './../../api/config';

class Header extends React.Component {
    constructor(props, context) {
        super(props, context); 
        this.onRoleDropdownChanged = this.onRoleDropdownChanged.bind(this);
        this.state = {
            RoleID: ''
        };
    }

    onRoleDropdownChanged(item) {
        this.setState({ RoleID: item.key });
        this.props.actions.loadHomeMessageByRole(item.key);
        this.props.actions.updateUserRole(item.key);
        if(item.key == 'Admin')
            this.props.actions.loadAllCampuses();
        else if(item.key == 'Principal')
            this.props.actions.loadCampusesByManager(this.props.userProps.user.staffNaturalKey);
        let promise = this.props.actions.updateMenuOptions(item.key);
        promise.then(value =>{
            document.location = "#";
        });
    }

    getWorkingOnItScreen(){
        if(this.props.loading) return(<WorkingOnIt interval={100} dots={20} />);
    }

    render() {
        if(this.props.userProps.user.campusID != "" && this.props.userProps.user.role == undefined){
            this.props.actions.logErrorSuccess("You are not authorized to access the Mentor Activity System.");
            document.location = "#error";
        }
        let styleTitle = {
            fontSize: '20px',
            color: '#fff',
            lineHeight: '50px',
            verticalAlign: 'middle'
        };
        let styleDropDown = {
            fontSize: '14px',
            lineHeight: '14px',
            verticalAlign: 'middle',
            padding: '0px',
            paddingTop: '8px',
            width: '120px',
            marginBottom: '0px'
        };
        let styleNav = { marginBottom: 0 };
        let selectedKey = this.state.RoleID;
        if(!selectedKey || selectedKey == '') selectedKey = this.props.userProps.user.role;

        return (
        <div>
            {this.getWorkingOnItScreen()}
            <nav className="navbar navbar-default navbar-static-top" style={styleNav}>
                <div className="navbar-header"> <a className="navbar-toggle hidden-lg hidden-md hidden-sm" href="javascript:void(0)" data-toggle="collapse" data-target=".navbar-collapse"><i className="ti-menu"></i></a>
                    <div className="top-left-part">
                        <a className="hidden-xs" href={Config.SiteURL} title="Back to Parent(Hosting) Site"><i className="glyphicon glyphicon-home"></i></a>
                        {/*<a className="page-title" href="https://connectdevapps.houstonisd.org/_layouts/15/start.aspx#/" title="Back to Parent(Hosting) Site">MAS</a>*/}
                    </div>
                    <ul className="nav navbar-top-links navbar-left">
                        <li className="dropdown hidden-xs">
                            <span href="#"><b className="hidden-xs" style={styleTitle}>Mentor Activity System</b> </span>
                        </li>
                    </ul>
                    <ul className="nav navbar-top-links pull-right">
                        <li className="dropdown">
                            <a className="profile-pic">
                                <b className="hidden-xs">
                                    <Dropdown options={this.props.roles} onChanged={this.onRoleDropdownChanged} selectedKey={selectedKey} style={styleDropDown} />
                                </b> 
                            </a>
                        </li>
                    </ul>
                    <ul className="nav navbar-top-links pull-right">
                        <li className="userName">
                            {this.props.userProps.user.fullName}
                        </li>
                    </ul>
                    
                </div>
            </nav>
        </div>
        );
    }
}

Header.propTypes = {
    userProps: PropTypes.object,
    menuOptions: PropTypes.array,
    homeMessage: PropTypes.object,
    appProps: PropTypes.object,
    roles: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps,
        menuOptions: state.menuOptions,
        homeMessage: state.homeMessage,
        appProps: state.appProps,
        roles: genericFormattedForDropdown(state.userProps.user.roles),
        loading: state.ajaxCallsInProgress > 0
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, adminActions, sharedActions, campusActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);