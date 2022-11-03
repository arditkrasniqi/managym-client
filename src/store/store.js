import Vue from 'vue'
import Vuex from 'vuex'
import config from '../config'
import axios from 'axios'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state:{
        user:{
            showConfirmEmail:true,
            auth:null,
            info:null,
            role:null,
            affiliateLink:null
        },
        organisationRoles:{

        },
        trainerVisit:0,
        frontPage:{
            trainerSearch:{
                trainerList:[]
            }
        },
        loggedInTrainerSearch:{
            trainerList:[],
            location:''
        },
        trainerPlans:{

        },
        authTrainerPlan:null
    },
    getters:{

    },
    mutations:{
        setActiveUserEmail:(state, payload) => {
            if(state.user.info !== null){
                state.user.info.emailConfirmed = payload;
            }
        },
        setConfEmail:(state,payload) => {
            state.user.showConfirmEmail = payload;
        },
        setTrainerNotify:(state, payload) => {
            state.user.info.becomeTrainerNotify = payload;
        },
        setAuth:(state,auth) => {
            state.user.auth = auth
        },
        setAuthUser:(state, user) => {
            state.user.info = user
        },
        setUserRole:(state,role) => {
            state.user.role = role
        },
        logout:(state) => {
            state.user.auth = null;
            state.user.info = null;
            state.user.role = null;
            localStorage.removeItem('token');
            localStorage.removeItem('expiration');
        },
        // organisation roles
        setOrganisationRoles:(state,roles) => {
            state.organisationRoles = roles;
        },

        // front page settings
        setTrainerVisitId:(state,id) => {
            state.trainerVisit = id;
        },
        // front page trainer search
        setTrainers:(state,trainers) => {
            state.frontPage.trainerSearch.trainerList = trainers;
        },

        // set trainer plans
        setTrainerPlans:(state,trainerPlans) => {
            state.trainerPlans = trainerPlans;
        },

        // set auth trainer plan description
        setAuthTrainerPlan:(state, trainerPlan) => {
            state.authTrainerPlan = trainerPlan;
        },

        // affiliate link
        setAffiliateLink:(state, affilateLink) => {
            state.user.affiliateLink = affilateLink;
        },
        // set trainers list on search when user is logged in
        setTrainersSearchList:(state, list) => {
            state.loggedInTrainerSearch.trainerList = list;
        },
        // store the location of the search
        setSearchLocation:(state, location) => {
            state.loggedInTrainerSearch.location = location;
        }
    },
    actions:{
        setAuth:({commit},auth) => {
            commit('setAuth',auth)
        },
        setAuthUser:({commit}, user) => {
            commit('setAuthUser',user)
        },
        setUserRole:({commit}, role) => {
            commit('setUserRole',role)
        },
        // organisation roles
        setOrganisationRoles:({commit}, roles) => {
            commit('setOrganisationRoles',roles);
        },

        // front page settings
        // front page trainer search
        setTrainers:({commit},city) => {
            setTimeout(function(){
                $.get('https://maps.googleapis.com/maps/api/geocode/json?address='+city+'&key='+config.google_api_key,function(response){
                    let pos = response.results[0].geometry.location;
                    axios.post(config.api_hostname + '/search-guest',{latitude:pos.lat,longitude:pos.lng})
                        .then(response => {
                            commit('setTrainers',response.data.data);
                        });
                });
            },100);
        },

        // set trainer plans
        setTrainerPlans:({commit}, trainerPlans) => {
            commit('setTrainerPlans',trainerPlans);
        },
        // set auth trainer plan description
        setAuthTrainerPlan:({commit},trainerPlan) => {
            commit('setAuthTrainerPlan',trainerPlan);
        },

        // affiliate link
        setAffiliateLink:({commit}, affiliateLink) => {
            commit('setAffiliateLink',affiliateLink);
        },
        // set trainers list on search when user is logged in
        setTrainersSearchList:({commit}, list) => {
            commit('setTrainersSearchList',list)
        },
        // store the location of the search
        setSearchLocation:({commit}, location) => {
            commit('setSearchLocation',location);
        }
    }
});