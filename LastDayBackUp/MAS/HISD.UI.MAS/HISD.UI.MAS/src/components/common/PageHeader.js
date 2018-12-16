import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sharedActions from './../../actions/sharedActions';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Link, IndexLink } from 'react-router-dom';
import { campusesFormattedForDropdown } from './../../selectors/selectors';
import If from './If';

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
        if (this.props.userProps.user.role == 'Admin' || this.props.userProps.user.role == 'Principal') isDisabled = false;
        if (this.props.isDropDownDisabled) {
            isDisabled = true;
        }
        if ((!selectedKey || selectedKey == '') && (this.props.allCampuses.length > 0)) selectedKey = this.props.allCampuses[0].key;
        const { hideCampusDrpDwn } = this.props;
        return (
            <div className="row bg-title" style={{ height: '55px' }}>
                <div className="col-lg-12 col-md-12 col-sm-12 hidden-xs">
                    <span className="page-title-custom">{this.props.title}</span>
                    <If test={hideCampusDrpDwn}>
                        <span></span>
                    </If>
                    <If test={!hideCampusDrpDwn}>
                        <div className="dropDownPageHeader pull-right">
                            <b className="hidden-xs">
                                <Dropdown options={this.props.allCampuses} onChanged={this.onCampusDropdownChanged} selectedKey={this.props.userProps.user.campusID} disabled={isDisabled} />
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
        campuses: state.campuses,
        allCampuses: campusesFormattedForDropdown(state.campuses, state.userProps.user.campusID, state.userProps.user.campusName)
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