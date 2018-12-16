import React, { Component } from 'react';
import If from './If';

class SimpleCheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked : false
    };
    this.checkIt = this.checkIt.bind(this);
  }

  checkIt() {
    this.props.callback(!this.props.checked);
    return;
  }

  render() {
    return (
      <div>
        <label className="container450">
          <input type="checkbox" class="form-check-input" id="exampleCheck1" checked={this.props.checked} onChange={this.checkIt}/>
        </label>
      </div>
    );
  }
}

export default SimpleCheckBox;
