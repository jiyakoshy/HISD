import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function centralOfficeReducer(state = initialState.centralOffices, action) {
    switch (action.type) {
        case types.LOAD_CENTRAL_OFFICE_DEPARTMENTS_SUCCESS:
            return action.centralOffices;
       
        default:
            return state;
    }
}