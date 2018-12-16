import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as campusActions from '../../actions/campusActions';
import * as sharedActions from '../../actions/sharedActions';
import * as ajaxStatusActions from '../../actions/ajaxStatusActions';
import * as votingSettingsAction from '../../actions/votingSettingsAction';
import { hashHistory } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import Utilities from '../../utilities/utilities';



class HomePage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }


    render() {


        let msgBody;
        let msgHeader;
        let schoolYear;
        if (this.props.userProps.schoolYearDescription)
            schoolYear = this.props.userProps.schoolYearDescription;
        else
            schoolYear = "";
        if (this.props.userProps && this.props.userProps.homePage && this.props.userProps.homePage.messageBody &&
            this.props.votingSettings) {
            msgBody = this.props.userProps.homePage.messageBody;
            let VotingStartDate;
            let VotingStartTime;
            let VotingEndDate;
            let VotingEndTime;
            let ResultsAvailableStartDate;

            this.props.votingSettings.map(
                function (item) {
                    VotingStartDate = item.VotingStartDate;
                    VotingStartTime = item.VotingStartTime;
                    VotingEndDate = item.VotingEndDate;
                    VotingEndTime = item.VotingEndTime;
                    ResultsAvailableStartDate = item.ResultsAvailableStartDate;
                }
            );
            if (VotingStartDate && VotingStartTime && VotingEndDate && VotingEndTime && ResultsAvailableStartDate) {
                msgBody = msgBody
                    .replace("<StartYearPlaceHolder>", "<span style='color:red'>" + schoolYear + "</span>")
                    .replace("<VotingStartDatePlaceHolder>", "<span style='color:red'>" + Utilities.getDateOnlyWithMonthNameWeekName(VotingStartDate) + "</span>")
                    .replace("<VotingStartTimePlaceHolder>", "<span style='color:red'>" + Utilities.getTimeFromISO(VotingStartTime) + "</span>")
                    .replace("<VotingEndDatePlaceHolder>", "<span style='color:red'>" + Utilities.getDateOnlyWithMonthNameWeekName(VotingEndDate) + "</span>")
                    .replace("<VotingEndTimePlaceHolder>", "<span style='color:red'>" + Utilities.getTimeFromISO(VotingEndTime) + "</span>")
                    .replace("<ResultsAvailableStartDatePlaceHolder>", "<span style='color:red'>" + Utilities.getDateOnlyWithMonthNameWeekName(ResultsAvailableStartDate) + "</span>");

            }


        }

        if (this.props.userProps && this.props.userProps.homePage && this.props.userProps.homePage.messageHeader)
            msgHeader = this.props.userProps.homePage.messageHeader;
        else
            msgHeader = "";

        
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <PageHeader title="Dashboard" schoolYear={schoolYear} campus={this.props.userProps.user.campusName} isDisabled={true} />
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <div className="white-box">

                                <div className="HomeMessageHeader" dangerouslySetInnerHTML={{ __html: msgHeader }} />
                                <br /> <div dangerouslySetInnerHTML={{ __html: msgBody }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

HomePage.propTypes = {
    votingSettings: PropTypes.array,
    message: PropTypes.string,
    userProps: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    return {
        userProps: state.userProps,
        votingSettings: state.votingSettings
    };
}

export default connect(mapStateToProps)(HomePage);
