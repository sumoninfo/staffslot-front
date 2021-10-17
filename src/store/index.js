import axios from 'axios'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import moment from 'moment-timezone'
import flashMessage from './flash-message'
import wizard from './wizard'
import images from './api/images'
import notifications from './notifications'
import modals from './modals'
import products from './products'
import uiState from './ui-state'
import videoSubscriptions from './api/video-subscriptions'
import subscription from '../transformers/subscription'
import booking from '../transformers/booking'
import packageTransformer from '../transformers/package'

const defaultState = () => ({
    previousUserId: null,
    errorMessages: [],
    loading: false,
    dashboard: null,
    events: null,
    bookings: null,
    slots: {},
    slotDetails: {},
    packages: null,
    bookmarkPros: null,
    bookedVideoSubscriptions: {
        video_subscriptions: null,
        past_video_subscriptions: null,
    },
    pastVideoBookings: null,
    loginMessage: ''
})

const actions = {
    async callApi ({ commit }, params) {
        let response;
        try {
            response = await axios(params);
        } catch(e) {
            response = e.response
        }

        if (!response.data.success) {
            commit('pushError', response.data);
        }

        return response;
    },

    fetchUser ({ commit, dispatch, state }) {
        return axios.get('/api/user').then(response => {
            if (response.data.success) {
                if (response.data.user.user_id !== state.previousUserId) {
                    commit('clearAll')
                }

                commit('setUser', response.data.user)
                commit('setPreviousUserId', response.data.user.user_id)

                if (!state.uiState.viewMode || !state.user.account.pro) {
                    dispatch('uiState/setViewMode', state.user.account.pro ? 'PRO' : 'CUSTOMER')
                }
                moment.tz.setDefault(state.user.account.timezone);
            } else {
                commit('setUser', null)
            }
        }).catch(e => {
            if (e.response.status == 401)
                commit('setUser', null)
            else
                commit('pushError', e.response.data)
        })
    },

    clearUser ({ commit }) {
        commit('setUser', null)
    },

    fetchDashboard ({ commit }) {
        return axios.get('/api/dashboard').then(response => {
            commit('setDashboard', response.data)
        })
    },

    fetchEvents ({ commit }) {
        return axios.get('/api/event/list').then(response => {
            commit('setEvents', response.data)
        })
    },

    fetchSlots ({ commit }) {
        const data = {
            type: null,
            inactive: false,
            per_page: 15,
            current_page: 1,
        };

        let promises = [];

        ['all', 'full', 'booked', 'open'/*, 'inactive'*/].forEach(type => {
            const _data = Object.assign({}, data)
            _data.type = ['all', 'inactive'].includes(type) ? null : type
            _data.inactive = type == 'inactive'

            promises.push(axios.post('/api/slot/get', _data)
                .then(response => {
                    commit('setSlots', {type: type, slots: response.data.slots, totalPages: response.data.total_page})
                }));
        })

        return Promise.all(promises);
    },

    fetchPackages ({ commit, state }) {
        if (state.user.account.role &&
                state.user.account.role.restrictions.find(x => x.name === 'packages')) {
            return Promise.resolve();
        }

        return axios.get('/api/time-slots-package').then(response => {
            commit('setPackages', response.data)
        })
    },

    fetchBookings ({ commit }) {
        const data = {
            type: null,
            inactive: false,
            per_page: 15,
            current_page: 1,
        };

        let promises = [];

        ['past', 'upcoming'].forEach(type => {
            const _data = Object.assign({}, data)
            _data.type = type
            promises.push(axios.post('/api/booking/get', _data).then(response => {
                commit('setBookings', {type: type, bookings: response.data.bookings, totalPages: response.data.total_page})
            }));
        })

        promises.push(axios.get('/api/booking/video').then(response => {
            commit('setVideoBookings', response.data)
        }));

        return Promise.all(promises);
    },

    async fetchBoookedVideoSubscriptions ({ commit }, params) {
        let response = await axios('/api/video/subscriptions/booked', { params });
        response.data.video_subscriptions.data = response.data.video_subscriptions.data.map(x => {
            x = booking(x);
            x.bookable = subscription(x.bookable);
            return x;
        });
        commit('setBoookedVideoSubscriptions', response.data);
    },

    async fetchBoookedActiveVideoSubscriptions ({ dispatch }, pagination) {
        dispatch('fetchBoookedVideoSubscriptions', {
            pick: 'active', page: pagination.page, per_page: pagination.per_page
        });
    },

    async fetchBoookedPastVideoSubscriptions ({ dispatch }, pagination) {
        dispatch('fetchBoookedVideoSubscriptions', {
            pick: 'past', page: pagination.page, per_page: pagination.per_page
        });
    },

    fetchPackageOrders ({ commit }) {
        return axios.get('/api/package/orders').then(response => {
            commit('setPackageOrders', response.data)
        })
    },

    fetchBookmarkPros ({ commit }) {
        return axios.get('/api/bookmark/pros').then(response => {
            commit('setBookmarkPros', response.data)
        })
    },
}

const mutations = {
    clearAll (state) {
        Object.assign(state, defaultState())
    },

    setLoading (state, value) {
        state.loading = value
    },

    pushError (state, message) {
        state.errorMessages.push(message);
    },

    clearErrors (state) {
        state.errorMessages = [];
    },

    setUser (state, data) {
        state.user = data
    },

    setPreviousUserId (state, data) {
        state.previousUserId = data
    },

    setDashboard (state, data) {
        state.dashboard = data
    },

    setEvents (state, data) {
        state.events = data
    },

    setSlots (state, data) {
        state.slots = { ...state.slots, [data.type]: data.slots }
        state.slots = { ...state.slots, [data.type + '-totalPages']: data.totalPages }
    },

    setSlotDetails (state, data) {
        state.slotDetails = data
    },

    setPackages (state, data) {
        state.packages = data
    },

    setBookings (state, data) {
        // state.bookings = { ...state.bookings, [data.type]: data.bookings }
        // state.bookings = { ...state.bookings, [data.type + '-totalPages']: data.totalPages }
        let bookings = { ...state.bookings, [data.type]: data.bookings }
        bookings = { ...bookings, [data.type + '-totalPages']: data.totalPages }
        state.bookings = bookings
    },

    setVideoBookings (state, data) {
        state.videoBookings = data.bookings
        state.pastVideoBookings = data.pastBookings
    },

    setBoookedVideoSubscriptions (state, data) {
        if (data.video_subscriptions)
            state.bookedVideoSubscriptions.video_subscriptions = data.video_subscriptions;

        if (data.past_video_subscriptions)
            state.bookedVideoSubscriptions.past_video_subscriptions = data.past_video_subscriptions;
    },

    setPackageOrders (state, data) {
        state.packageOrders = data.packageOrders.map(x => packageTransformer(x))
    },

    setBookmarkPros (state, data) {
        state.bookmarkPros = data.pros
    },

    setAllTags (state, data) {
        state.allTags = data
    },

    setLoginMessage (state, data) {
        state.loginMessage = data
    },

    setUserConfig(state, data) {
      state.user = {...state.user, ...data}
    }
}

// // No local storage if in iframe
// const vuexLocal = window == window.top ? new VuexPersistence({
//     storage: window.localStorage,
//     modules: ['user', 'wizard', 'uiState']
// }) : null

export const createStore = (noLocalStorage = false) => {
    const vuexLocal = noLocalStorage ? null : new VuexPersistence({
        storage: window.localStorage,
        modules: ['user', 'wizard', 'uiState', 'dashboard', 'events', 'slots', 'bookings', 'previousUserId']
    })

    return new Vuex.Store({
        state: defaultState(),
        actions,
        mutations,
        modules: { flashMessage, wizard, notifications, products, uiState, videoSubscriptions, modals, images },
        plugins: vuexLocal ? [vuexLocal.plugin] : []
    })
}
