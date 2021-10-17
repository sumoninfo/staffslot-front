<template>
	<div class="col-12">
		<p>{{ __('Scroll down to view the available Time Slot Packages') }}.</p>
        <choose-users v-model="selectedPros" :users="pros" />
        <package-list :packages="packages" />
        <pages @on-changed="fetchPackages" v-model="pagination" />
	</div>
</template>

<script>
import axios from 'axios'

export default {
    data () {
        return {
            packages: [],
            pagination: null,
            pros: [],
            selectedPros: null
        }
    },

    mounted () {
        this.fetchPackages();
    },

    watch: {
        selectedPros (val) {
            this.fetchPackages();
        }
    },

    computed: {
        loading () {
            return this.$root.loading;
        }
    },

    methods: {
        async fetchPackages () {
            this.emitter.emit('isLoading', true);
            let params = this.selectedPros && { pros: this.selectedPros.map(x => x.user_id) };

            if (this.pagination)
                params = { ...params, page:this.pagination.page, per_page: this.pagination.per_page };

            const response = await axios.get('/api/package', { params });
            if (response.data.success) {
                let {data, ...pagination} = response.data.packages;
                this.packages = data || [];
                this.pagination = pagination;
                this.pros = response.data.pros || [];
            }
            this.emitter.emit('isLoading', false);
        }
    }
}
</script>

<style>

</style>