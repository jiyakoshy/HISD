import * as types from './actionTypes';
import SharedApi from '../api/sharedApi';
import UserSelectedCandidateNomineesApi from '../api/userSelectedCandidateNomineesApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';


export function loadUserSelectedCandidateNomineesSuccess(userSelectedCandidateNominees) {
    return { type: types.LOAD_USER_SELECTED_CANDIDATE_NOMINEES_SUCCESS, userSelectedCandidateNominees };
}

export function loadUserSelectedCandidateNominees(loginID,vottingSettingID) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return UserSelectedCandidateNomineesApi.getUserSelectedCandidateNominees(loginID,vottingSettingID).then(candidateNominees => {
            dispatch(loadUserSelectedCandidateNomineesSuccess(candidateNominees.value));
        }).catch(error => {
            throw (error);
        });
    };
}