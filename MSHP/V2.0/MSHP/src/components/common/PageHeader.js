import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sharedActions from './../../actions/sharedActions';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Link, IndexLink } from 'react-router-dom';
import { campusesFormattedForDropdown } from './../../selectors/selectors';
import Utilities from './../../utilities/utilities';
import * as enrollmentActions from '../../actions/enrollmentActions';
import * as gradeLevelsActions from '../../actions/gradeLevelsActions';

class PageHeader extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onCampusDropdownChanged = this.onCampusDropdownChanged.bind(this);
        this.state = {
            campusID: this.props.userProps.user.campusID,
            allCampuses: [],
            campusProfile: this.props.campusProfile
        };
    }

    onCampusDropdownChanged(item) {
        this.setState({ campusID: item.key });
        this.props.actions.updateUserCampus(item, Utilities.getSchoolYear());
        // this.props.actions.loadCampusProfile(item.key, Utilities.getSchoolYear()).then(
        //     campusProfile => {
        //     }
        // );
    }

    render() {
        let selectedKey = '';
        if(this.props.userProps && this.props.userProps.user)
            selectedKey = this.props.userProps.user.campusID;
        let isDisabled = false;
        if(this.props.userProps.user.role == 'Admin') isDisabled = false;
        if((!selectedKey || selectedKey == '') && (this.props.allCampuses.length > 0)) selectedKey = this.props.allCampuses[0].key;
        
        return (
            <div className="row bg-title">
                <div className="col-lg-12 col-md-12 col-sm-12 hidden-xs">
                    <span >{this.props.title}</span>
                    <div className="dropDownPageHeader pull-right">
                        <b className="hidden-xs">
                            {/* <Dropdown options={this.props.allCampuses} onChanged={this.onCampusDropdownChanged} selectedKey={this.props.userProps.user.campusID} disabled={isDisabled} /> */}
                            {/* <label>CampusId: {this.props.userProps.user.campusID}</label> <br/>
                            <label>Campus Name: {this.props.userProps.user.campusName}</label>  */}
                        </b>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps,
        campuses: state.campuses,
        allCampuses: campusesFormattedForDropdown(state.campuses, state.userProps.user.campusID, state.userProps.user.campusName),
        campusProfile: state.campusProfile,
        gradeLevels: state.gradeLevels
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, sharedActions, enrollmentActions, gradeLevelsActions), dispatch) };
}

PageHeader.propTypes = {
    title: PropTypes.string,
    userProps: PropTypes.object,
    campuses: PropTypes.array,
    allCampuses: PropTypes.array,
    actions: PropTypes.object,
    campusProfile: PropTypes.object,
    gradeLevels: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader);