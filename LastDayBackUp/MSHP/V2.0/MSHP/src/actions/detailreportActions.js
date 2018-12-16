import * as types from './actionTypes';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';
import detailreportApi from '../api/detailreportApi';
import CampusApi from '../api/campusApi';
import { Calendar } from 'office-ui-fabric-react';
import { loadAllCampuses} from '../actions/campusActions';

export function loadDetailReportsSuccess(detailreport) {
    return { type: types.LOAD_ALL_DETAILREPORTS_SUCCESS, detailreport};
}

export function loadDetailReports(Schoolyear, compareDaySeq) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return detailreportApi.getDetailLevelAllReport(Schoolyear, compareDaySeq).then(detailreport => {
            let detailreports = [];
            let allcampuses = [];
            CampusApi.getAllCampuses().then(campuses => {
                allcampuses = campuses.value;
                for (let i = 0; i < detailreport.value.length; i++) {
                    let detailreportobj = {};
                    let filtername = allcampuses.filter(c => c.EducationOrgNaturalKey == detailreport.value[i].CampusNumber);
                   
                    detailreportobj.LevelGroupID = detailreport.value[i].LevelGroupID;
                    detailreportobj.LevelGroup = detailreport.value[i].LevelGroup;
                    detailreportobj.CampusNumber = String(detailreport.value[i].CampusNumber);
                    if (filtername.length > 0){detailreportobj.CampusName = filtername['0'].NameOfInstitution;}
                    else{detailreportobj.CampusName = '';}
                    detailreportobj.IEE = detailreport.value[i].IEE;
                    detailreportobj.IPK = detailreport.value[i].IPK;
                    detailreportobj.IKG = detailreport.value[i].IKG;
                    detailreportobj.I01 = detailreport.value[i].I01;
                    detailreportobj.I02 = detailreport.value[i].I02;
                    detailreportobj.I03 = detailreport.value[i].I03;
                    detailreportobj.I04 = detailreport.value[i].I04;
                    detailreportobj.I05 = detailreport.value[i].I05;
                    detailreportobj.I06 = detailreport.value[i].I06;
                    detailreportobj.I07 = detailreport.value[i].I07;
                    detailreportobj.I08 = detailreport.value[i].I08;
                    detailreportobj.I09 = detailreport.value[i].I09;
                    detailreportobj.I10 = detailreport.value[i].I10;
                    detailreportobj.I11 = detailreport.value[i].I11;
                    detailreportobj.I12 = detailreport.value[i].I12;
                    detailreportobj.Capacity = detailreport.value[i].Capacity;
                    detailreportobj.Total = detailreport.value[i].Total;
                    detailreportobj.LastYearEnrollment = detailreport.value[i].LastYearEnrollment;
                    detailreportobj.TotalDiff = detailreport.value[i].Total - detailreport.value[i].LastYearEnrollment;
                    detailreportobj.Projection = detailreport.value[i].Projection;
                    detailreportobj.Snapshot = detailreport.value[i].Snapshot;
                    detailreportobj.PrevSnapshot = detailreport.value[i].PrevSnapshot;
                    detailreportobj.Projdiff = detailreport.value[i].Total - detailreport.value[i].Projection;          

                    detailreports.push(detailreportobj);
                }
                
                dispatch(loadDetailReportsSuccess(detailreports));
            });
        }).catch(error => {
            throw (error);
        });
    };
}