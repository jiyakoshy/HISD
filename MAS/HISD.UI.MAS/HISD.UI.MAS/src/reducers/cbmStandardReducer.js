import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function cbmStandardReducer(state = initialState.cbmStandard, action) {
    switch (action.type) {
        case types.LOAD_CBM_STANDARD_SUCCESS:
            return action.cbmStandard;
        case types.UPDATE_CBM_STANDARD_SUCCESS:
            return { ...state, NoOfLogs: action.cbmStandard.NoOfLogs, MonthOrder: action.cbmStandard.MonthOrder};
       
        default:
            return state;
    }
}
