/*eslint-disable import/default */
//import 'babel-polyfill';
import React from 'react';
import { connect, Provider } from 'react-redux';
import { render } from 'react-dom';
import configureStore from './store/configureStore';
import { HashRouter, hashHistory, Route } from 'react-router-dom';
import App from './components/App';
import { loadUser, loadMenuOptions } from './actions/sharedActions';
import initialState from './reducers/initialState';
import './styles/styles.css';
import LandingPage from './components/home/LandingPage';
import HomePage from './components/home/HomePage';
import ErrorPage from './components/common/ErrorPage';
import VotingSettingsPage from './components/votingSettings/VotingSettingsPage';
import CandidateNomineesPage from './components/candidateNominees/CandidateNomineesPage';
import LoginPage from './components/login/LoginPage';
import CastVotePage from './components/castVote/CastVotePage';




const store = configureStore(initialState);
store.dispatch(loadUser());
render(
    <Provider store={store}>
        <HashRouter hashType="noslash" basename="index.html" history={hashHistory}>
            <div>
                <Route path="/" exact component={LandingPage} />
                <Route path="/home" component={HomePage} />
                <Route path="/votingsettings" component={VotingSettingsPage} />
                <Route path="/candidatenominees" component={CandidateNomineesPage} />
                <Route path="/castvotes" component={CastVotePage} />
                <Route path="/error" component={ErrorPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="**" component={App} />
            </div>
        </HashRouter>
    </Provider>,
    document.getElementById('app')
);
