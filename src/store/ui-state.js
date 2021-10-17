let state = {
    myVideoBookingsPane: 0,
    videoSubscriptionsPane: 0,
    productsPane: 0,
    viewMode: null,
    redirectAfterLogin: null,
    lang: null,
    translations: null
}

const actions = {
    set ({ commit }, data) {
        commit('set', data);
    },
    setViewMode({ commit }, mode) {
        commit('set', { viewMode: mode });
    }
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
