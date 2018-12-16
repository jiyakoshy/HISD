import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sharedActions from './../../actions/sharedActions';
import * as campusActions from './../../actions/campusActions';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Link, IndexLink } from 'react-router-dom';
import { genericFormattedForDropdown } from './../../selectors/selectors';
import WorkingOnIt from './WorkingOnIt';
import RoleDropDown from './RoleDropDown';

class Header extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onRoleDropdownChanged = this.onRoleDropdownChanged.bind(this);
        this.state = {
            RoleID: '',
            SPHostUrl: '#home'
        };
        this.getUrlParameter = this.getUrlParameter.bind(this);
    }

    componentWillMount() {
        let SPHostUrlValue = this.getUrlParameter('SPHostUrl');
        if (SPHostUrlValue != '' && SPHostUrlValue != undefined)
            this.setState({ SPHostUrl: SPHostUrlValue });
    }

    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        let results = regex.exec(window.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    onRoleDropdownChanged(item) {
        this.setState({ RoleID: item.key });
        //this.props.actions.loadHomeMessageByRole(item.key);
        this.props.actions.updateUserRole(item.key);
        if (item.key == 'Admin')
            this.props.actions.loadAllCampuses();
        else if (item.key == 'Principal') {
            if (this.props.userProps.user.staffNaturalKey)
                this.props.actions.loadCampusesByManager(this.props.userProps.user.staffNaturalKey);
            else
                this.props.actions.loadCampusesByManager('94549');
        }
        else if (item.key == 'SC') {
            if (this.props.userProps.user.staffNaturalKey)
                this.props.actions.loadCampusesByManager(this.props.userProps.user.staffNaturalKey);
            else
                this.props.actions.loadCampusesByManager('94549');
        }
        let promise = this.props.actions.updateMenuOptions(item.key);
        promise.then(value => {
            document.location = "#";
        });
    }

    getWorkingOnItScreen() {
        if (this.props.loading) return (<WorkingOnIt interval={100} dots={20} />);
    }

    render() {
        if (this.props.userProps.user.campusID != "" && this.props.userProps.user.role == undefined) {
            this.props.actions.logErrorSuccess("You are not authorized to access the District Advisory Committee System.");
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
        if (!selectedKey || selectedKey == '') selectedKey = this.props.userProps.user.role;

        return (
            <div>
                {this.getWorkingOnItScreen()}
                <nav className="navbar navbar-default navbar-static-top" style={styleNav}>
                    <div className="navbar-header"> <a className="navbar-toggle hidden-lg hidden-md hidden-sm" href="javascript:void(0)" data-toggle="collapse" data-target=".navbar-collapse"><i className="ti-menu"></i></a>
                        <div className="top-left-part">
                            <a className="hidden-xs" href={this.state.SPHostUrl} title="Back to Site"><i className="icon-home fa-fw"></i></a>
                            <a className="page-title" href={this.state.SPHostUrl}>DAC</a>
                        </div>
                        <ul className="nav navbar-top-links navbar-left">
                            <li className="dropdown hidden-xs">
                                <span href="#"><b className="hidden-xs" style={styleTitle}>District Advisory Committee</b> </span>
                            </li>
                        </ul>
                        {/*        <ul className="nav navbar-top-links pull-right">
                            <li className="dropdown">
                                <a className="profile-pic">
                                    <b className="hidden-xs">
                                        <Dropdown options={this.props.roles} onChanged={this.onRoleDropdownChanged} selectedKey={selectedKey} style={styleDropDown} />
                                    </b>
                                </a>
                            </li>
                        </ul>
       */}
                        <RoleDropDown options={this.props.roles} onChanged={this.onRoleDropdownChanged}
                            selectedKey={selectedKey} style={styleDropDown} />
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
    return { actions: bindActionCreators(Object.assign({}, sharedActions, campusActions), dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);