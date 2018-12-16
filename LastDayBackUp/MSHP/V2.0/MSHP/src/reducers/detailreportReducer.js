import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function detailreportReducer(state = initialState.detailreport, action) {
    switch (action.type) {
        case types.LOAD_ALL_DETAILREPORTS_SUCCESS:
            return action.detailreport;
        default:
            return state; 
    }
}
