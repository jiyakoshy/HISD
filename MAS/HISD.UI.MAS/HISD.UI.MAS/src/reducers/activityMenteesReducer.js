import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function activityMenteesReducer(state = initialState.activityMentees, action) {
    let newArray = [];
    switch (action.type) {
        case types.LOAD_ALL_ACTIVITY_MENTEES_SUCCESS:{
            return state.sort(function(a,b) {
                return (a.MenteeName > b.MenteeName) ? 1 : ((b.MenteeName > a.MenteeName) ? -1 : 0);
            });
        }
        case types.NEW_ADD_ACTIVITY_MENTEE_SUCCESS:{
            let newArray = state.slice();
            newArray.push(action.activityMentee);
            state = newArray;
            return state;
        }
        case types.NEW_ADD_ACTIVITY_MENTEES_SUCCESS:{
            let newArray = [];
            action.activityMentees.forEach(function(element){
                newArray.push(element);
            });
            state = newArray;
            return state;
        }
        case types.NEW_DELETE_ACTIVITY_MENTEE_SUCCESS:{
            newArray = [];
            const mentees = state;
            mentees.forEach(function(item){
                if(item.MenteeEmployeeID != action.employeeID)
                {
                    newArray.push(item);
                }
            });
            state = newArray;
            return state;
        }
        case types.NEW_DELETE_ACTIVITY_MENTEE_EDIT_SUCCESS:{
            newArray = [];
            const mentees = state;
            mentees.forEach(function(item){
                if(item.StaffNaturalKey != action.employeeID)
                {
                    newArray.push(item);
                }
            });
            state = newArray;
            return state;
        }
        case types.NEW_DELETE_ALL_ACTIVITY_MENTEE_SUCCESS:{
            newArray = [];
            state = newArray;
            return state;
        }
        default:
            return state;
    }
}
