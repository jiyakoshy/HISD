import * as types from './actionTypes';
import SharedApi from '../api/sharedApi';
import CastVotesApi from '../api/castVotesApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';


export function createCastVotes(castVotes) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CastVotesApi.createCastVotes(castVotes).then(castVotes => {
            dispatch(createCastVotesSuccess(castVotes));
            
        }).catch(error => {
            throw (error);
        });
    };
}

export function createCastVotesSuccess(castVotes) {
    return { type: types.CREATE_CAST_VOTES_SUCCESS, castVotes };
}

export function createCastVotesForCampus(castVotes) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return CastVotesApi.createCastVotesForCampus(castVotes).then(castVotes => {
            dispatch(createCastVotesForCampusSuccess(castVotes));
            
        }).catch(error => {
            throw (error);
        });
    };
}

export function createCastVotesForCampusSuccess(castVotes) {
    return { type: types.CREATE_CAST_VOTES_FOR_CAMPUS_SUCCESS, castVotes };
}