const state = {
    slot: null,
    videoSlot: null,
    product: null
}

const actions = {
    setSlot ({ commit }, event ) {
        commit('setSlot', event)
    },

    setVideoSlot ({ commit }, event ) {
        commit('setVideoSlot', event)
    },

    setProduct ({ commit }, event ) {
        commit('setProduct', event)
    }
}

const mutations = {
    setSlot (state, data) {
        state.slot = data
    },

    setVideoSlot (state, data) {
        state.videoSlot = data
    },

    setProduct (state, data) {
        state.product = data
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
