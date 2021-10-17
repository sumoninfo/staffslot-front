import axios from 'axios'

let state = {
    loading: false,
    images: []
}

const actions = {
    async fetchImages ({ commit }) {
        const response = await axios.get('/api/images');
        commit('set', { images: response.data.images });
    },

    push({ commit }, image) {
        commit('push', image);
    }
}

const mutations = {
    set (state, data) {
        for (let key in data)
            state[key] = data[key];
    },

    push (state, image) {
        state.images.unshift(image)
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}

