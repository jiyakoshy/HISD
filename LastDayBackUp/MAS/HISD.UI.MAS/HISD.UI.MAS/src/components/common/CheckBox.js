import React, { Component } from 'react';

class CheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        };
        this.checkIt = this.checkIt.bind(this);
    }

    checkIt() {
        this.props.callback(this.props.index, !this.props.checked, this.props.obj);
    }

    render() {
        if (this.props.defaultChecked == '1') {
            return (
                <div>
                    <input type="checkbox" name="check-box" onChange={this.checkIt} defaultChecked />
                </div>
            );
        }
        else {
            return (
                <div>
                    <input type="checkbox" name="check-box" onChange={this.checkIt} />
                </div>
            );
        }
    }
}

export default CheckBox;
