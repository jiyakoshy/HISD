import {combineReducers} from 'redux';
import userProps from './userReducer';
import menuOptions from './menuOptionsReducer';
import appProps from './appReducer';
import mentors from './mentorsReducer';
import mentees from './menteesReducer';
import relationship from './relationshipReducer';
import relationships from './relationshipsReducer';
import campuses from './campusesReducer';
import activityLogs from './activityLogsReducer';
import activityLog from './activityLogReducer';
import activityLogMentee from './activityLogMenteeReducer';
import activityCodes from './activityCodesReducer';
import verificationCode from './verificationCodeReducer';
import verificationCodeDetails from './verificationCodeDetailsReducer';
import activityMentees from './activityMenteesReducer';
import activityCode from './activityCodeReducer';
import cbmStandards from './cbmStandardsReducer';
import cbmStandard from './cbmStandardReducer';
import activityStandards from './activityStandardsReducer';
import mentoringTools from './mentoringToolsReducer';
import homeMessage from './homeMessageReducer';
import homeMessages from './homeMessagesReducer';
import siteContent from './siteContentReducer';
import siteContents from './siteContentsReducer';
import campusContact from './campusContactReducer';
import campusContacts from './campusContactsReducer';
import timeConfig from './timeConfigReducer';
import timeConfigs from './timeConfigsReducer';
import menteeEndDate from './menteeEndDateReducer';
import menteesEndDates from './menteesEndDatesReducer';
import staff from './staffReducer';
import staffs from './staffsReducer';
import reportData from './reportDataReducer';
import spUserProps from './spUserPropsReducer';
import ajaxCallsInProgress from './ajaxStatusReducer';
import errorMsg from './errorReducer';
import enrollments from './enrollmentsReducer';
import gradeLevels from './gradeLevelsReducer';
import calendarReportDates from './calendarReportDatesReducer';
import enrollment from './enrollmentReducer';
import campusProfile from './campusProfileReducer';
import regionTotalsByGrade from './regionTotalsByGradeReducer';


const rootReducer = combineReducers({
    userProps, menuOptions, appProps, relationship, relationships, mentors, mentees, campuses, activityLogs, activityLog, activityLogMentee, activityCode, activityCodes, activityMentees, cbmStandard, cbmStandards, activityStandards, mentoringTools, homeMessage, siteContent, siteContents, homeMessages, reportData, spUserProps, campusContact, campusContacts, timeConfig, timeConfigs, staff, staffs, menteeEndDate, menteesEndDates, verificationCode, verificationCodeDetails, errorMsg, ajaxCallsInProgress, enrollments, gradeLevels, calendarReportDates, enrollment, campusProfile, regionTotalsByGrade
});

export default rootReducer;
