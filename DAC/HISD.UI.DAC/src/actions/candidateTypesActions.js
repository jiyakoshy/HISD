import * as types from './actionTypes';
import CandidateTypesApi from '../api/candidateTypesApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';



export function loadCandidateTypesSuccess(candidateTypes) {
    return { type: types.LOAD_CANDIDATE_TYPES_SUCCESS, candidateTypes};
}

export function loadCandidateTypes() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CandidateTypesApi.loadCandidateTypes().then(candidateTypes => {
            dispatch(loadCandidateTypesSuccess(candidateTypes.value));
        }).catch(error => {
            throw (error);
        });
    };
}