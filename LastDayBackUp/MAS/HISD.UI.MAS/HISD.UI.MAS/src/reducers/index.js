import {combineReducers} from 'redux';
import userProps from './userReducer';
import menuOptions from './menuOptionsReducer';
import appProps from './appReducer';
import mentor from './mentorReducer';
import mentorActivityLog from './mentorActivityLogReducer';

import mentors from './mentorsReducer';
import mentee from './menteeReducer';
import mentees from './menteesReducer';
import relationship from './relationshipReducer';
import relationships from './relationshipsReducer';
import campusesWithCampusContact from './campusesWithCampusContactReducer';
import campuses from './campusesReducer';
import campus from './campusReducer';
import activityLogs from './activityLogsReducer';
import activityLogsMentee from './activityLogsMenteeReducer';
import activityLog from './activityLogReducer';
import activityLogMentee from './activityLogMenteeReducer';
import activityCodes from './activityCodesReducer';
import verificationCode from './verificationCodeReducer';
import verificationCodeDetails from './verificationCodeDetailsReducer';
import activityMentees from './activityMenteesReducer';
import activityCode from './activityCodeReducer';
import activityLogMentorCountPerMonth from './activityLogMentorCountPerMonthReducer';
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
import topCampusesOnRelationShip from './topCampusesOnRelationShipsReducer';
import timeConfigs from './timeConfigsReducer';
import menteeEndDate from './menteeEndDateReducer';
import menteesEndDates from './menteesEndDatesReducer';
import staff from './staffReducer';
import staffs from './staffsReducer';
import csoStaffs from './csoStaffsReducer';
import reportData from './reportDataReducer';
import spUserProps from './spUserPropsReducer';
import ajaxCallsInProgress from './ajaxStatusReducer';
import errorMsg from './errorReducer';
import activityType from './activityStandardReducer';
import taskID from './taskIDReducer';

const rootReducer = combineReducers({
    userProps, menuOptions,activityType, taskID, topCampusesOnRelationShip, appProps, relationship, relationships, mentor, mentors,mentorActivityLog, mentee, mentees, campus, campuses, campusesWithCampusContact, activityLogs, activityLogsMentee, activityLog, activityLogMentee,activityLogMentorCountPerMonth, activityCode, activityCodes, activityMentees, cbmStandard, cbmStandards, activityStandards, mentoringTools, homeMessage, siteContent, siteContents, homeMessages, reportData, spUserProps, campusContact, campusContacts, timeConfig, timeConfigs, staff, staffs, csoStaffs, menteeEndDate, menteesEndDates, verificationCode, verificationCodeDetails, errorMsg, ajaxCallsInProgress
});

export default rootReducer;
