import _ from 'lodash';
import Utils from '../utilities/utilities';

export const fetchActivityMenteeDetails = (state, action) =>{
    const { activityList, staffList} =  action.data;
    const activityArr =[];
    if(!_.isEmpty(activityList)){
        activityList.map(item => {
            let obj = {};
            const getMenteeName = Utils.filteredArray(staffList, 'StaffNaturalKey', item.MenteeEmployeeID);
            if(getMenteeName){
                obj.MenteeName = getMenteeName.FirstName + " " + getMenteeName.LastSurname;
            }else{
                obj.MenteeName = item.MenteeEmployeeID;
            }

            const getMentorName = Utils.filteredArray(staffList, 'StaffNaturalKey', item.MentorEmployeeID);
            if(getMentorName){
                obj.MentorName = getMentorName.FirstName + " " + getMentorName.LastSurname;
            }else{
                obj.MentorName = item.MentorEmployeeID
            }
            obj.StaffNaturalKey = item.StaffNaturalKey;
            obj.CompletedActivitiesCount = item.CompletedActivitiesCount;
            obj.totalActivityCount = item.TotalActivitiesCount;
            obj.PercentageCount = ((item.CompletedActivitiesCount * 100) / obj.totalActivityCount).toFixed(2)+'%';
            activityArr.push(obj);
        });
    }
    return {...state, activitiesMenteeLogs : activityArr}
}