import * as types from './actionTypes';
import LocationsApi from '../api/locationsApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';



export function loadLocationsSuccess(locations) {
    return { type: types.LOAD_LOCATIONS_SUCCESS, locations};
}

export function loadLocations() {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return LocationsApi.loadLocations().then(locations => {
            dispatch(loadLocationsSuccess(locations.value));
        }).catch(error => {
            throw (error);
        });
    };
}