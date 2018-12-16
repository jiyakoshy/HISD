import {combineReducers} from 'redux';
import userProps from './userReducer';
import menuOptions from './menuOptionsReducer';
import appProps from './appReducer';
import campuses from './campusesReducer';
import votingSettings from './votingSettingsReducer';
import centralOffices from './centralOfficeReducer';
import candidateSearchCO from './candidateSearchCOReducer';
import candidateSearchCampuses from './candidateSearchCampusesReducer';
import candidateNominees from './candidateNomineesReducer';
import candidateNomineesAllCampus from './candidateNomineesAllCampusReducer';
import payGrades from './payGradesReducer';
import locations from './locationsReducer';
import candidateTypes from './candidateTypesReducer';
import ajaxCallsInProgress from './ajaxStatusReducer';
import voteEligibility from './voteEligibilityReducer';
import castVotes from './castVotesReducer';
import errorMsg from './errorReducer';
import userSelectedCandidateNominees from './userSelectedCandidateNomineesReducer';

const rootReducer = combineReducers({
    userProps, menuOptions, appProps, campuses, errorMsg, ajaxCallsInProgress ,
    votingSettings,centralOffices,candidateSearchCO,payGrades,candidateNominees,
    locations , candidateTypes,candidateSearchCampuses ,voteEligibility , castVotes,
    userSelectedCandidateNominees , candidateNomineesAllCampus
});

export default rootReducer;
