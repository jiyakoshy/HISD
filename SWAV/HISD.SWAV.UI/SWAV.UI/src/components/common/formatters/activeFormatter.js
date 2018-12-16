import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as waiversActions from '../../../actions/waiversActions';
import Utilities from '../../../utilities/utilities';

class ActiveFormatter extends React.Component {
  
  constructor(props, context) {
    super(props, context);
  }
  isSelected(){
    const { selectedRow } = this.props;
    if(selectedRow.SchoolWaiverDeleted == false){
      return true;
    }
  }

  onChangedWaiver(isChecked){
    const { endYear,selectedRow,startYear, schoolStatus,campusNumber } = this.props;
    this.props.actions.handleSelectedWaivers({endYear,selectedRow,startYear, schoolStatus,campusNumber,isChecked});
  }
 
  render() {
    const { selectedRow, schoolStatus } = this.props;
    const waiverId = selectedRow.WaiverID;
    const isDisabled = schoolStatus === 'Submitted';
      return (
        <label className="container450">
          <input type="checkbox"
          ref="selectWaiver" name="selected-waiver" 
          id={`${waiverId}-id`}
          onChange={event=>this.onChangedWaiver(event.target.checked)}
          checked={this.isSelected()} disabled={isDisabled} />
          <span className="checkmark"></span>
        </label>        
      );
    }
}

ActiveFormatter.propTypes = {
  selectedRow: PropTypes.object,
    onSelectedWaiver : PropTypes.func
};

function mapStateToProps(state, ownProps) {
  return {
    startYear : state.campuses.userStartYear,
    endYear : state.campuses.userEndYear,
    schoolStatus : state.campuses.schoolStatus,
    campusNumber : state.campuses.campusNumber
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(waiversActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveFormatter);