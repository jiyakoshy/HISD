import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';

class ErrorPage extends React.Component {
    render() {
        let msg = this.props.errorMsg;
        if(msg == null || msg == "") msg = 'Page not found or access denied!';
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="Error Message" campus={this.props.campus} />
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

ErrorPage.propTypes = {
    userProps: PropTypes.object,
    errorMsg: PropTypes.string
};

function mapStateToProps(state, ownProps) {
    return {
        errorMsg: state.errorMsg,
        userProps: state.userProps
    };
}

export default connect(mapStateToProps)(ErrorPage);