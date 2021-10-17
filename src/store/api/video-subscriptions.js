import axios from 'axios'

let state = {
    loading: false
}

const actions = {
    async cancel ({ commit, dispatch }, subscription) {
        commit('set', { loading: true });
        try {
            await axios.put(`/api/booking/video/cancel/${subscription.booking_id}`);
            await dispatch('fetchBoookedVideoSubscriptions', null, { root: true });
        } catch (e) {} finally {
            commit('set', { loading: false });
        }
    },
}

const mutations = {
    set (state, data) {
        for (let key in data)
            state[key] = data[key];
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}