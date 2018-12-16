import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sharedActions from './../../actions/sharedActions';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Link, IndexLink } from 'react-router-dom';
import { campusesFormattedForDropdownDAC } from './../../selectors/selectors';
import DepartmentDropDown from './DepartmentDropDown'

class PageHeader extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onCampusDropdownChanged = this.onCampusDropdownChanged.bind(this);
        this.state = {
            CampusID: this.props.userProps.user.campusID,
            allCampuses: []
        };
    }

    onCampusDropdownChanged(item) {
        this.setState({ CampusID: item.key });
        this.props.actions.updateUserCampus(item);
    }



    render() {


        let selectedKey = '';
        if (this.props.userProps && this.props.userProps.user)
            selectedKey = this.props.userProps.user.campusID;
        let isDisabled = true;



        if (this.props.userProps.user.role == 'Admin' ||
            this.props.userProps.user.role == 'Principal' ||
            this.props.userProps.user.role == 'SC') isDisabled = false;
            
        if (this.props.isDisabled)
            isDisabled = this.props.isDisabled;


        if ((!selectedKey || selectedKey == '') && (this.props.allCampuses.length > 0))
            selectedKey = this.props.allCampuses[0].key;
        return (

            <div className="row bg-title">

                <div className="col-lg-12 col-md-12 col-sm-12 hidden-xs pageHeader">
                    <span className="page-title-custom">{this.props.title}</span>
                    <span className="page-title-Year">School Year {this.props.schoolYear}</span>


                    <DepartmentDropDown options={this.props.allCampuses}

                        onChanged={this.onCampusDropdownChanged}
                        selectedKey={this.props.userProps.user.campusID}
                        disabled={isDisabled} showSchoolDropDown={this.props.showSchoolDropDown}
                        orgGrpNaturalKey={this.props.userProps.user.OrgGrpNaturalKey} />






                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps,
        campuses: state.campuses,
        allCampuses: campusesFormattedForDropdownDAC(state.campuses, state.userProps.user.campusID, state.userProps.user.campusName, state.userProps.user.role, state.userProps)
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(sharedActions, dispatch) };
}

PageHeader.propTypes = {
    title: PropTypes.string,
    userProps: PropTypes.object,
    campuses: PropTypes.array,
    allCampuses: PropTypes.array,
    actions: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader);