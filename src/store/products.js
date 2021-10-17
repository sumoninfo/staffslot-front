import axios from 'axios'
import bookingTransformer from '../transformers/booking';

const state = {
    types: null,
    products: null,
    canceledProducts: null,
    soldProducts: null,
    purchases: { data: [] },
    pastPurchases: { data: []},
    loading: false
}

const actions = {
    async fetchTypes ({ commit }) {
        commit('isLoading', true);
        const response = await axios.get('/api/product/types');
        commit('set', { types: response.data.product_types });
        commit('isLoading', false);
    },

    async duplicate ({ commit, dispatch }, productType) {
        commit('isLoading', true);
        await axios.put(`/api/product/types/${productType.id}/duplicate`);
        dispatch('fetchTypes');
        commit('isLoading', false);
    },

    async destroy ({ commit, dispatch }, productType) {
        commit('isLoading', true);
        await axios.delete(`/api/product/types/${productType.id}`);
        dispatch('fetchTypes');
        commit('isLoading', false);
    },

    async fetchProducts ({ commit, state }, params) {
        commit('isLoading', true);
        const response = await axios.get('/api/products', {
            params: {
                page: params ? params.page : (state.products || {}).current_page,
                per_page: params ? params.per_page : (state.products || {}).per_page
            }
        });
        commit('set', { products: response.data.products });
        commit('isLoading', false);
    },

    async fetchSoldProducts ({ commit }, params) {
        commit('isLoading', true);
        const response = await axios.get('/api/products/sold', {
            params: {
                page: params ? params.page : (state.soldProducts || {}).current_page,
                per_page: params ? params.per_page : (state.soldProducts || {}).per_page
            }
        });
        commit('set', { soldProducts: response.data.products });
        commit('isLoading', false);
    },

    async fetchCanceledProducts ({ commit }, params) {
        commit('isLoading', true);
        const response = await axios.get('/api/products/canceled', {
            params: {
                page: params ? params.page : (state.canceledProducts || {}).current_page,
                per_page: params ? params.per_page : (state.canceledProducts || {}).per_page
            }
        });
        commit('set', { canceledProducts: response.data.products });
        commit('isLoading', false);
    },

    async fetchPurchases ({ commit }) {
        commit('isLoading', true);
        const response = await axios.get('/api/purchases');
        let purchases = response.data.purchases;
        let pastPurchases = response.data.past_purchases;
        purchases.data = purchases.data.map(x => bookingTransformer(x));
        pastPurchases.data = pastPurchases.data.map(x => bookingTransformer(x));
        commit('set', { purchases, pastPurchases });
        commit('isLoading', false);
    },

    async fetchActivePurchases ({ commit }, { page, per_page}) {
        const response = await axios.get('/api/purchases', {
            params: { page, per_page, pick: 'active' }
        });
        let purchases = response.data.purchases;
        purchases.data = purchases.data.map(x => bookingTransformer(x));
        commit('set', { purchases });
    },

    async fetchPastPurchases ({ commit }, { page, per_page}) {
        const response = await axios.get('/api/purchases', {
            params: { page, per_page, pick: 'past' }
        });
        let purchases = response.data.past_purchases;
        purchases.data = purchases.data.map(x => bookingTransformer(x));
        commit('set', { pastPurchases: purchases });
    }
}

const mutations = {
    isLoading (state, data) {
        state.loading = data;
    },

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
