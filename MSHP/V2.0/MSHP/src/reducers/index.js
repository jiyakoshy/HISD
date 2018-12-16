import {combineReducers} from 'redux';
import userProps from './userReducer';
import menuOptions from './menuOptionsReducer';
import appProps from './appReducer';
import campuses from './campusesReducer';
import enrollments from './enrollmentsReducer';
import enrollmentsHistory from './enrollmentsHistoryReducer';
import enrollment from './enrollmentReducer';
import schoolYears from './schoolYearsReducer';
import schoolYear from './schoolYearReducer';
import nonreportingschool from './nonreportingschoolReducer';
import summaryreport from './summaryreportReducer';
import detailreport from './detailreportReducer';
import summarydetailreport from './summarydetailreportReducer';
import reportDates from './reportDatesReducer';
import ajaxCallsInProgress from './ajaxStatusReducer';
import errorMsg from './errorReducer';
import gradeLevels from './gradeLevelsReducer';
import calendarReportDates from './calendarReportDatesReducer';
import calendars from './calendarsReducer';
import campusProfile from './campusProfileReducer';
import regionTotalsByGrade from './regionTotalsByGradeReducer';
import annualsetup from './annualsetupReducer';

const rootReducer = combineReducers({
    userProps, menuOptions, appProps, campuses, errorMsg, ajaxCallsInProgress, nonreportingschool, reportDates, enrollments, enrollmentsHistory,
    enrollment, calendarReportDates, calendars, campusProfile, regionTotalsByGrade, schoolYears, summaryreport, detailreport, summarydetailreport, schoolYear, gradeLevels,annualsetup
});

export default rootReducer;
