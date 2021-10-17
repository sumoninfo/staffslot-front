const state = {
    value: null
}

const mutations = {
    setFlashMessage (state, data) {
        state.value = data
    }
}

export default {
    namespaced: false,
    state,
    mutations
}