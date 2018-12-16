import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

class LinkFormatter extends React.Component {
    render() {
      return (
        <a href={this.props.url} title={this.props.tooltip}>{this.props.description}</a>
      );
    }
}

LinkFormatter.propTypes = {
    url: PropTypes.string,
    description: PropTypes.string,
    tooltip: PropTypes.string
};

export default LinkFormatter;