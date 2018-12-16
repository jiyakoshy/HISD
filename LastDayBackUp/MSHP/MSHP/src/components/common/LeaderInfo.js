import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sharedActions from './../../actions/sharedActions';
import * as adminActions from './../../actions/adminActions';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Link, IndexLink } from 'react-router-dom';
import { campusesFormattedForDropdown } from './../../selectors/selectors';
import { debuglog } from 'util';

class LeaderInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            CampusID: this.props.userProps.user.campusID,
            campusContactNames: ''
        };
    }

    componentDidMount() {
        
    }

    render() {
        let principalName = this.props.userProps.user.principalName;
        if(principalName == '') principalName = 'Not Assigned Yet';
        const cics = this.props.userProps.user.campusContacts;
        let cicNames = '';
        $.each(cics, function (key,obj) {
            if(cicNames == '')
                cicNames = obj.FirstName + ' ' + obj.LastSurname;
            else
                cicNames += '; ' + obj.FirstName + ' ' + obj.LastSurname;
        });
        return (
            <div className="white-box" style={{marginBottom: '3px'}}>
                <div className="form-group">
                    <div className="col-md-6 col-lg-6 col-sm-6"><label>Principal Name: </label>&nbsp;<label style={{color: "darkgray"}}>{principalName}</label></div>
                    <div className="col-md-6 col-lg-6 col-sm-6"><label>Campus Contacts: </label>&nbsp;&nbsp;<label style={{color: "darkgray"}}>{cicNames}</label></div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps
    };
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(Object.assign({}, sharedActions, adminActions), dispatch) };
}

LeaderInfo.propTypes = {
    title: PropTypes.string,
    userProps: PropTypes.object,
    actions: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(LeaderInfo);