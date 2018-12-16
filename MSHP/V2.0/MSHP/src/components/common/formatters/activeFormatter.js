import React from 'react';
import PropTypes from 'prop-types';

class ActiveFormatter extends React.Component {
    render() {
      return (
        <input type="checkbox" checked={this.props.active} readOnly />
      );
    }
}

ActiveFormatter.propTypes = {
    active: PropTypes.bool
};

export default ActiveFormatter;