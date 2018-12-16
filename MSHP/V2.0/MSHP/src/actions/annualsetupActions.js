import * as types from './actionTypes';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';
import adminApi from '../api/adminApi';
import campusApi from '../api/campusApi';
import { Calendar } from 'office-ui-fabric-react';

export function loadAnnualSetUpSuccess(annualsetup) {
    return { type: types.LOAD_ALL_ANNUALSETUP_SUCCESS, annualsetup};
}

export function loadAnnualSetUp(Schoolyear, compareDaySeq) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return adminApi.getAnnualSetup(Schoolyear, compareDaySeq).then(annualsetup => {
        // let summaryProps= [];
        // let summary = { CampusNumber: '', SchoolYear: '',  LevelGroup: '', Total:'', Capacity:'',Projection:'',
        // PrevSnapshot:'',LastYear:'', LastYearCapacity:'',LastYearEnrollment:'',CreatedDate:'', UpdatedDate:'', 
        // CampusName:'', CSO:''};
        //     for (let k = 0; k < annualsetup.value.length; k++) {
        //             summary.CampusNumber = annualsetup.value[k].CampusNumber;
        //             summary.SchoolYear = annualsetup.value[k].SchoolYear;
        //             summary.LevelGroup = annualsetup.value[k].LevelGroup;
        //             summary.Total = annualsetup.value[k].Total;
        //             summary.Capacity = annualsetup.value[k].Capacity;
        //             summary.Projection = annualsetup.value[k].Projection;
        //             summary.PrevSnapshot = annualsetup.value[k].PrevSnapshot;
        //             summary.LastYear = annualsetup.value[k].LastYear;
        //             summary.LastYearCapacity = annualsetup.value[k].LastYearCapacity;
        //             summary.LastYearEnrollment = annualsetup.value[k].LastYearEnrollment;
        //             summary.CreatedDate = annualsetup.value[k].CreatedDate;
        //             summary.UpdatedDate = annualsetup.value[k].UpdatedDate;
                    
        //             let campusInfoPromise = campusApi.getCSOByCampus(summary.CampusNumber);
        //             campusInfoPromise.then(
        //                 function(campusInfo){
        //                     summary.CampusName = campusInfo.NameOfInstitution;
        //                     summary.CSO = campusInfo.FirstName + ' '+ campusInfo.MiddleName + ' ' + campusInfo.LastName;
        //                 });
        //             summaryProps.push(summary);
        //         }
            dispatch(loadAnnualSetUpSuccess(annualsetup.value));
        }).catch(error => {
            throw (error);
        });
    };
}