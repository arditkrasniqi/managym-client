import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    currency: process.env.currency,
    user: {
      showConfirmEmail: true,
      auth: null,
      info: null,
      role: null,
      affiliateLink: null
    },
    organisationRoles: {},
    trainerVisit: 0,
    frontPage: {
      trainerSearch: {
        trainerList: []
      }
    },
    loggedInTrainerSearch: {
      trainerList: [],
      location: ""
    },
    trainerPlans: {},
    authTrainerPlan: null
  },
  getters: {},
  mutations: {
    setCurrency: (state, payload) => {
      state.currency = payload;
    },
    setActiveUserEmail: (state, payload) => {
      if (state.user.info !== null) {
        state.user.info.emailConfirmed = payload;
      }
    },
    setConfEmail: (state, payload) => {
      state.user.showConfirmEmail = payload;
    },
    setTrainerNotify: (state, payload) => {
      state.user.info.becomeTrainerNotify = payload;
    },
    setAuth: (state, auth) => {
      state.user.auth = auth;
    },
    setAuthUser: (state, user) => {
      state.user.info = user;
    },
    setUserRole: (state, role) => {
      state.user.role = role;
    },
    logout: state => {
      state.user.auth = null;
      state.user.info = null;
      state.user.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem("expiration");
    },
    // organisation roles
    setOrganisationRoles: (state, roles) => {
      state.organisationRoles = roles;
    },

    // front page settings
    setTrainerVisitId: (state, id) => {
      state.trainerVisit = id;
    },
    // front page trainer search
    setTrainers: (state, trainers) => {
      state.frontPage.trainerSearch.trainerList = trainers;
    },

    // set trainer plans
    setTrainerPlans: (state, trainerPlans) => {
      state.trainerPlans = trainerPlans;
    },

    // set auth trainer plan description
    setAuthTrainerPlan: (state, trainerPlan) => {
      state.authTrainerPlan = trainerPlan;
    },

    // affiliate link
    setAffiliateLink: (state, affilateLink) => {
      state.user.affiliateLink = affilateLink;
    },
    // set trainers list on search when user is logged in
    setTrainersSearchList: (state, list) => {
      state.loggedInTrainerSearch.trainerList = list;
    },
    // store the location of the search
    setSearchLocation: (state, location) => {
      state.loggedInTrainerSearch.location = location;
    }
  },
  actions: {
    setCurrency: ({ commit }, currency) => {
      commit("setCurrency", currency);
    },
    setAuth: ({ commit }, auth) => {
      commit("setAuth", auth);
    },
    setAuthUser: ({ commit }, user) => {
      commit("setAuthUser", user);
    },
    setUserRole: ({ commit }, role) => {
      commit("setUserRole", role);
    },
    // organisation roles
    setOrganisationRoles: ({ commit }, roles) => {
      commit("setOrganisationRoles", roles);
    },

    // front page settings
    // front page trainer search
    setTrainers: ({ commit }, trainers) => {
      commit("setTrainers", trainers);
    },

    // set trainer plans
    setTrainerPlans: ({ commit }, trainerPlans) => {
      commit("setTrainerPlans", trainerPlans);
    },
    // set auth trainer plan description
    setAuthTrainerPlan: ({ commit }, trainerPlan) => {
      commit("setAuthTrainerPlan", trainerPlan);
    },

    // affiliate link
    setAffiliateLink: ({ commit }, affiliateLink) => {
      commit("setAffiliateLink", affiliateLink);
    },
    // set trainers list on search when user is logged in
    setTrainersSearchList: ({ commit }, list) => {
      commit("setTrainersSearchList", list);
    },
    // store the location of the search
    setSearchLocation: ({ commit }, location) => {
      commit("setSearchLocation", location);
    }
  }
});
