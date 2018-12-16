import * as types from './actionTypes';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';
import Utilities from '../utilities/utilities';
import nonreportingschoolsApi from '../api/nonreportingschoolsApi';
import CampusApi from '../api/campusApi';
import { Calendar } from 'office-ui-fabric-react';
import { loadAllCampuses} from '../actions/campusActions';
import React from 'react';

export function loadAllNonSchoolReportSuccess(nonreportingschool) {
    return { type: types.LOAD_ALL_NONSCHOOLREPORTS_SUCCESS, nonreportingschool};
}

export function loadAllCompareDaySeqSuccess(reportDates) {
    return { type: types.LOAD_ALL_COMPAREDAYSEQS_SUCCESS, reportDates};
}

export function loadNonReportingCampusesReports(Schoolyear, compareDaySeq) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return nonreportingschoolsApi.getNonReportingCampusesReport(Schoolyear, compareDaySeq).then(nonreportingschool => {
            let nondetailreports = [];
            let allcampuses = [];
            CampusApi.getAllCampuses().then(campuses => {
                allcampuses = campuses.value;
                for (let i = 0; i < nonreportingschool.value.length; i++) {
                    let nondetailreportobj = {};
                    let filtername = allcampuses.filter(c => c.EducationOrgNaturalKey == nonreportingschool.value[i].CampusNumber);
                   
                    nondetailreportobj.LevelGroupID = nonreportingschool.value[i].LevelGroupID;
                    nondetailreportobj.LevelGroup = nonreportingschool.value[i].LevelGroup;
                    nondetailreportobj.CampusNumber = nonreportingschool.value[i].CampusNumber;
                    if (filtername.length > 0){nondetailreportobj.CampusName = filtername['0'].NameOfInstitution;}
                    else{nondetailreportobj.CampusName = '';}
                    nondetailreportobj.IEE = nonreportingschool.value[i].IEE;
                    nondetailreportobj.IPK = nonreportingschool.value[i].IPK;
                    nondetailreportobj.IKG = nonreportingschool.value[i].IKG;
                    nondetailreportobj.I01 = nonreportingschool.value[i].I01;
                    nondetailreportobj.I02 = nonreportingschool.value[i].I02;
                    nondetailreportobj.I03 = nonreportingschool.value[i].I03;
                    nondetailreportobj.I04 = nonreportingschool.value[i].I04;
                    nondetailreportobj.I05 = nonreportingschool.value[i].I05;
                    nondetailreportobj.I06 = nonreportingschool.value[i].I06;
                    nondetailreportobj.I07 = nonreportingschool.value[i].I07;
                    nondetailreportobj.I08 = nonreportingschool.value[i].I08;
                    nondetailreportobj.I09 = nonreportingschool.value[i].I09;
                    nondetailreportobj.I10 = nonreportingschool.value[i].I10;
                    nondetailreportobj.I11 = nonreportingschool.value[i].I11;
                    nondetailreportobj.I12 = nonreportingschool.value[i].I12;
                    nondetailreportobj.Capacity = nonreportingschool.value[i].Capacity;
                    nondetailreportobj.Total = nonreportingschool.value[i].Total;
                    nondetailreportobj.LastYearEnrollment = nonreportingschool.value[i].LastYearEnrollment;
                    nondetailreportobj.TotalDiff = nonreportingschool.value[i].Total - nonreportingschool.value[i].LastYearEnrollment;
                    nondetailreportobj.Projection = nonreportingschool.value[i].Projection;
                    nondetailreportobj.Snapshot = nonreportingschool.value[i].Snapshot;
                    nondetailreportobj.PrevSnapshot = nonreportingschool.value[i].PrevSnapshot;
                    nondetailreportobj.Projdiff = nonreportingschool.value[i].Total - nonreportingschool.value[i].Projection;          

                    nondetailreports.push(nondetailreportobj);
                }
                
            dispatch(loadAllNonSchoolReportSuccess(nondetailreports));
        });
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadAllCompareDaySeq(Schoolyear) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return nonreportingschoolsApi.getCompareDaySeq(Schoolyear).then(calendar => {
            let reportDates = [];
            for (let k = 0; k < calendar.value.length; k++) {
                if(calendar.value[k].ReportDate != null)
                {
                    reportDates.push(<option key={calendar.value[k].CompareDaySeq} value={calendar.value[k].CompareDaySeq}> {Utilities.dateFormatter(calendar.value[k].ReportDate)} </option>);
                }
              }
            // calendar.value.forEach(function(item) {
            //     reportDates.push(item.ReportDate);
            // });
            dispatch(loadAllCompareDaySeqSuccess(reportDates));
        }).catch(error => {
            throw (error);
        });
    };
}