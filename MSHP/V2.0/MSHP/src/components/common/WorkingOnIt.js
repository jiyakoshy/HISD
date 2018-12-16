import React from 'react';
import PropTypes from 'prop-types';
class WorkingOnIt extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {frame: 1};
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({  // eslint-disable-line react/no-did-mount-set-state
        frame: this.state.frame + 1
      });
    }, this.props.interval);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    
    return (<div id="lpm-workingOnIt-container"
        className="dissolve-animation">
        <div id="lpm-workingOnIt-message">
            <img src="data:image/gif;base64,R0lGODlhGAAYAJECAP///5mZmf///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgACACwAAAAAGAAYAAACQJQvAGgRDI1SyLnI5jr2YUQx10eW5hmeB6Wpkja5SZy6tYzn+g5uMhuzwW6lFtF05CkhxGQm+HKuoDPplOlDFAAAIfkEBQoAAgAsFAAGAAQABAAAAgVUYqeXUgAh+QQFCgACACwUAA4ABAAEAAACBVRip5dSACH5BAUKAAIALA4AFAAEAAQAAAIFVGKnl1IAIfkEBQoAAgAsBgAUAAQABAAAAgVUYqeXUgAh+QQFCgACACwAAA4ABAAEAAACBVRip5dSACH5BAUKAAIALAAABgAEAAQAAAIFVGKnl1IAIfkECQoAAgAsBgAAAAQABAAAAgVUYqeXUgAh+QQJCgACACwAAAAAGAAYAAACJZQvEWgADI1SyLnI5jr2YUQx10eW5omm6sq27gvH8kzX9o3ndAEAIfkECQoAAgAsAAAAABgAGAAAAkCULxFoAAyNUsi5yOY69mFEMddHluYZntyjqY3Vul2yucJo5/rOQ6lLiak0QtSEpvv1lh8l0lQsYqJHaO3gFBQAACH5BAkKAAIALAAAAAAYABgAAAJAlC8RaAAMjVLIucjmOvZhRDHXR5bmGZ7co6mN1bpdsrnCaOf6zkOpzJrYOjHV7Gf09JYlJA0lPBQ/0ym1JsUeCgAh+QQJCgACACwAAAAAGAAYAAACQJQvEWgADI1SyLnI5jr2YUQx10eW5hme3KOpjdW6XbK5wmjn+s5Dqcya2Dox1exn9PSWJeRNSSo+cR/pzOSkHgoAIfkECQoAAgAsAAAAABgAGAAAAkCULxFoAAyNUsi5yOY69mFEMddHluYZntyjqY3Vul2yucJo5/rOQ6nMmtg6MdXsZ/T0liXc6jRbOTHR15SqfEIKACH5BAkKAAIALAAAAAAYABgAAAJAlC8RaAAMjVLIucjmOvZhRDHXR5bmGZ7co6mN1bpdsrnCaOf6zkO4/JgBOz/TrHhC9pYRpNJnqURLwtdT5JFGCgAh+QQJCgACACwAAAAAGAAYAAACPpQvEWgADI1SyLnI5jr2YUQx10eW5jme3NOpTWe5Qpu6tYzn+l558tWywW4lmk/IS6KOr2UtSILOYiYiUVAAADs=" />
                <span className="ms-accentText lpm-workingOnIt-accentText">
                    &nbsp;Working on it...
                </span>
            </div>
        </div>
     );
  }
}

WorkingOnIt.defaultProps = {
  interval: 600, dots: 5
};

WorkingOnIt.propTypes = {
    interval: PropTypes.number,
    dots: PropTypes.number
};

export default WorkingOnIt;
