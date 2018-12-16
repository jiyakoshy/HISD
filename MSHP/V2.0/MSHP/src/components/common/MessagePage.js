import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';

class MessagePage extends React.Component {
    render() {
        let msg;
        // if(this.props.userProps && this.props.userProps.homePage && this.props.userProps.homePage.content)
        //     msg = this.props.userProps.homePage.content;
        // else 
            msg = "";
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="Message" campus={this.props.userProps.user.campusName} />
                    <div className="row">
                        <div className="col-md-8 col-lg-8 col-sm-12">
                            <div className="white-box">
                                {/* <div dangerouslySetInnerHTML={{__html: msg}} /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

MessagePage.propTypes = {
    userProps: PropTypes.object,
    message: PropTypes.string
};

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps
    };
}

export default connect(mapStateToProps)(MessagePage);