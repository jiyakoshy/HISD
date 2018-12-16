import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function topCampusesOnRelationShipsReducer(state = initialState.topCampusesOnRelationShip, action) {
    switch (action.type) {
        case types.LOAD_TOPRELATIONSHIPSCAMPUSES_SUCCESS:
            return action.topCampusesOnRelationShip;
        default:
            return state;
    }
}
