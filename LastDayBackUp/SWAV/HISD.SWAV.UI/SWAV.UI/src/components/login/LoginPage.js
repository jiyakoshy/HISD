import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import 'rc-time-picker/assets/index.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import Utilities from '../../utilities/utilities';
import { IfAnyGranted } from 'react-authorization';
import ErrorPage from '../common/ErrorPage';
import * as sharedActions from '../../actions/sharedActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import Config from '../../api/config';

class LoginPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            userID: '',
            currentUser:{}
        };
        this.login = this.login.bind(this);
        this.onChangeUserID = this.onChangeUserID.bind(this);
    }

    login() {
         let promise = this.props.actions.loadCustomUser(this.state.userID);
        promise.then(users => {
            document.location = "#";
        })
            .catch(reason => {
               this.props.actions.ajaxCallError();
            });
    }
    onChangeUserID(e) {
        this.setState({ userID: e.target.value });
    }

    render() {
        return (
            <IfAnyGranted expected={[true]} actual={Config.SHOW_LOGIN} unauthorized={<ErrorPage />}>
            <div id="page-wrapper">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <div className="white-box">
                                <form className="form-horizontal">
                                    <div className="row">
                                        <label className="col-md-2 col-lg-2 col-sm-2">User ID:</label>
                                        <div className=" col-md-4 col-lg-4 col-sm-4">
                                            <input id="userID" className="form-control" onChange={this.onChangeUserID} value={this.state.userID} type="text" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <PrimaryButton
                                            text="Login" onClick={this.login}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </IfAnyGranted>
        );
    }
}
function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps

    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, sharedActions, ajaxActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
