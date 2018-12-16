import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function votingSettingsReducer(state = initialState.votingSettings, action) {
    switch (action.type) {
        case types.LOAD_VOTING_SETTINGS_ACTIVE_YEAR_SUCCESS:
            return action.votingSettings;
        
        case types.CREATE_VOTING_SETTINGS_SUCCESS:
            return action.votingSettings;
        default:
            return state;
    }
}