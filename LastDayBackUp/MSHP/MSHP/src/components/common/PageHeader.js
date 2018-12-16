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
            CampusID: this.props.userProps.user.campusID,
            allCampuses: [],
            campusProfile: this.props.campusProfile,
            deleteBtnVisibility: { visibility: "hidden" },
            approveBtnVisibility: { visibility: "hidden" }
        };
    }

   

    componentWillMount () {
        console.log('pageheader component will mount');
    }

    onCampusDropdownChanged(item) {
        this.setState({ CampusID: item.key });
        this.props.actions.updateUserCampus(item, Utilities.getSchoolYear());
       //any save while user using this campus will need to use a correct campusProfileID
        //this.props.actions.loadCampusProfile(item.key, Utilities.getSchoolYear());
        //7/14
        this.props.actions.loadCampusProfile(item.key, Utilities.getSchoolYear()).then(
            campusProfile => {
                console.log('PAGEHEADER LINE 36 WHERE CAMPUSPROFILE RETRIEVED, this.props.campusProfile.campusProfileID----', this.props.campusProfile.campusProfileID);
          
            }
        );



        //following appears not to be necessary because componentDidMount performs it in first render of EnrollmentInputPage
        /* this.props.actions.loadGradeLevelsByCampusAndYear(item.key, Utilities.getSchoolYearEnd()).then(obj => {
            //2console
            }); */
    }
    
   
    render() {
        console.log('entered PageHeader render');
        let isDisabled = true;
        if(this.props.userProps.user.role == 'Admin' || this.props.userProps.user.role == 'Reports') isDisabled = false;
        
        let campusDD = null;
        let campusDDAdmin = null;
       
        
        //if(!this.props.userProps.user.isChoseSchool){
        if (isDisabled){
            campusDD = (
                <div>
                    <Dropdown options={this.props.allCampuses}
                      selectedKey={this.props.userProps.user.campusID} 
                      disabled/>
                 </div>
                );
        
        } 
         else {
            campusDDAdmin = (       
            <div>
                <Dropdown 
                options={this.props.allCampuses}
                placeHolder="Choose a campus first"
                onChanged={this.onCampusDropdownChanged}
                style={this.state.deleteBtnVisibility}
                />
             </div>
           );
        } 


        return (
            <div className="row bg-title">
                <div className="col-lg-12 col-md-12 col-sm-12 hidden-xs">
                    <span className="page-title-custom">{this.props.title}</span>
                    <div className="dropDownPageHeader pull-right">
                        <b >
                            {campusDD}
                            {campusDDAdmin}
                            
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