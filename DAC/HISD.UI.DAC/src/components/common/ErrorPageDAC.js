import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';

class ErrorPageDAC extends React.Component {
    render() {
        let msg = this.props.errorMsg;
        if(msg == null || msg == "") msg = 'Page not found or access denied!!!';
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    
                    <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-12">
                            <div className="white-box">
                                <div id="errorMsg">{msg}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ErrorPageDAC.propTypes = {
    userProps: PropTypes.object,
    errorMsg: PropTypes.string
};

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps
    };
}

export default connect(mapStateToProps)(ErrorPageDAC);