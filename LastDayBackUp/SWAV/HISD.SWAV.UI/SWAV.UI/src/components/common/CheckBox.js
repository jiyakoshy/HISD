import React, { Component } from 'react';
import If from './If';

class CheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked : false
    };
    this.checkIt = this.checkIt.bind(this);
  }

  checkIt() {
    this.props.callback(this.props.index, !this.props.checked, this.props.obj.WaiverID, this.props.obj);
    return;
  }

  render() {
    const { obj } = this.props;

    return (
      <div>
        <label className="container450">
          <input type="checkbox" name="check-box" disabled={this.props.disabled} checked={this.props.checked} onChange={this.checkIt}/>
          <If test={this.props.disabled && !this.props.checked}>
            <span className="checkmark" style={{marginLeft: '45px', backgroundColor: 'lightgray'}}></span>
          </If>
          <If test={this.props.disabled && this.props.checked}>
            <span className="checkmark" style={{marginLeft: '45px'}}></span>
          </If>
          <If test={!this.props.disabled}>
            <span className="checkmark" style={{marginLeft: '45px'}}></span>
          </If>
        </label>
      </div>
    );
  }
}

export default CheckBox;
