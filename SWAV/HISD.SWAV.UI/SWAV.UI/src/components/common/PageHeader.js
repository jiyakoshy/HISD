import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sharedActions from './../../actions/sharedActions';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Link, IndexLink } from 'react-router-dom';
import Utilities from '../../utilities/utilities'
import { campusesFormattedForDropdown } from './../../selectors/selectors';
import If from '../common/If';
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
        this.props.actions.getSchoolCampusDetails(item);
        this.props.actions.getPrincipalNameAction(item);
    }

    render() {
        let selectedKey = '';
        if(this.props.userProps && this.props.userProps.user)
            selectedKey = this.props.userProps.user.campusID;
        const { isDisabled, campusName } = this.props;
       
        if((!selectedKey || selectedKey == '') && (this.props.allCampuses.length > 0)) selectedKey = this.props.allCampuses[0].key;
        return (
            <div className="row bg-title" style={{height:'55px'}}>
                <div className="col-lg-12 col-md-12 col-sm-12 hidden-xs">
                    <span className="page-title-custom">{this.props.title}</span>
                    <span className="page-title-middle">School Year: {this.props.currentYear}</span>
                    <If test={this.props.schoolStatus}>
                        <span className="page-title-center">Status: <span style={{color: 'green'}}>{this.props.schoolStatus}</span></span>
                    </If>
                    <If test={campusName}>
                        <span className="page-campus-name"><span style={{marginLeft:'110px', fontWeight:'bold'}}>{campusName}</span></span>
                    </If>
                    <If test ={!this.props.schoolStatus}>
                    <div className="dropDownPageHeader pull-right">
                        <b className="hidden-xs">
                            <Dropdown options={this.props.allCampuses} placeHolder="All" onChanged={this.onCampusDropdownChanged} selectedKey={this.props.userProps.user.campusID} disabled={isDisabled} />
                        </b>
                    </div>
                    </If>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps,
        campuses: state.campuses.campusesDropDownList,
        currentYear : Utilities.getCurrentYear(state.campuses.userStartYear,state.campuses.userEndYear),
        status : ownProps.schoolStatus,
        allCampuses: campusesFormattedForDropdown(state.campuses.campusesDropDownList, state.userProps.user.campusID, state.userProps.user.campusName)
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
    actions: PropTypes.object,
    status : PropTypes.string,
    isDisabled : PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader);