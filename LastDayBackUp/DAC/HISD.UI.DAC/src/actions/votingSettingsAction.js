import * as types from './actionTypes';
import SharedApi from '../api/sharedApi';
import VotingSettingsApi from '../api/votingSettingsApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';


export function loadVotingSettingsActiveYearSuccess(votingSettings) {
    return { type: types.LOAD_VOTING_SETTINGS_ACTIVE_YEAR_SUCCESS, votingSettings };
}

export function loadVotingSettingsActiveYear(activeYear) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return VotingSettingsApi.getVotingSettingsActiveYear(activeYear).then(votingSettings => {
            dispatch(loadVotingSettingsActiveYearSuccess(votingSettings.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadActiveVotingSettingsSuccess(votingSettings) {
    return { type: types.LOAD_ACTIVE_VOTING_SETTINGS_SUCCESS, votingSettings };
}

export function loadActiveVotingSettings() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return VotingSettingsApi.getActiveVotingSettings().then(votingSettings => {
            dispatch(loadActiveVotingSettingsSuccess(votingSettings.value));
        }).catch(error => {
            throw (error);
        });
    };
}

export function createVotingSettings(votingSettings) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return VotingSettingsApi.createVotingSettings(votingSettings).then(votingSettings => {
            dispatch(createVotingSettingsSuccess(votingSettings));
            
        }).catch(error => {
            throw (error);
        });
    };
}

export function createVotingSettingsSuccess(votingSettings) {
    return { type: types.CREATE_VOTING_SETTINGS_SUCCESS, votingSettings };
}

export function updateVotingSettings(votingSettings) {
    let schoolYear=votingSettings.SchoolYear;
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return VotingSettingsApi.updateVotingSettings(votingSettings).then(votingSettings => {
            dispatch(updateVotingSettingsSuccess(votingSettings));
            dispatch(loadVotingSettingsActiveYear(schoolYear));
        }).catch(error => {
            throw (error);
        });
    };
}

export function updateVotingSettingsSuccess(votingSettings) {
    return { type: types.UPDATE_VOTING_SETTINGS_SUCCESS, votingSettings };
}