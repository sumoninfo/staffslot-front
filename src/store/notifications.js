import axios from 'axios'

let state = {
    data: [],
    pagination: {
        next: null,
        total: null
    },
    unread: 0,
    loading: false
}

const actions = {
    fetch ({ commit }) {
        commit('isLoading', true);
        return axios.get('/api/notifications').then(response => {
            commit('isLoading', false);
            commit('clear');
            commit('push', response.data.messages.data);
            commit('params', {
                pagination: {
                    next: response.data.messages.next_page_url,
                    total: response.data.messages.total
                },
                unread: response.data.messages.unread
            })
        })
    },

    async fetchNext ({ commit, state }) {
        if (state.loading) return;
        if (state.pagination.next) {
            commit('isLoading', true);
            const response = await axios.get(state.pagination.next);
            commit('push', response.data.messages.data);
            commit('params', {
                pagination: {
                    next: response.data.messages.next_page_url,
                    total: response.data.messages.total
                },
            })
            commit('isLoading', false);
        }
    },

    async markAsRead ({ dispatch }, ids) {
        const params = Array.isArray(ids) ? { ids } : { ids: [ids] };
        const response = await axios.put('/api/notifications/read', params);
        if (response.data.success) {
            dispatch('fetch');
        }
    },

    async markAllAsRead ({ dispatch }) {
        const response = await axios.put('/api/notifications/read/all');
        if (response.data.success) {
            dispatch('fetch');
        }
    },

    async clear ({ dispatch }) {
        const response = await axios.put('/api/notifications/clear');
        if (response.data.success) {
            dispatch('fetch');
        }
    },

    push ({ commit }, event ) {
        commit('push', event);
    },

    unshift ({ commit }, event ) {
        commit('unshift', event);
    }
}

const mutations = {
    clear (state) {
        state.data = [];
    },

    push (state, data) {
        if (Array.isArray(data))
            state.data.push(...data);
        else
            state.data.push(data);
    },

    unshift (state, data) {
        const items = Array.isArray(data) ? data : [data];
        state.data.unshift(data);
        state.pagination.total++;
        items.map(x => {
            if (x.read === 0) state.unread++;
        });
    },

    params (state, data) {
        if (data.pagination !== undefined) state.pagination = data.pagination;
        if (data.unread !== undefined) state.unread = data.unread;
    },

    isLoading (state, data) {
        state.loading = data;
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}