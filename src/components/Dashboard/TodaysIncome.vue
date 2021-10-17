<template> 
    <div class="loader-layout">
        <preloader v-show="loader"></preloader>
        <div class="data-card widget-box-1 bg-white">
            <h4 class="text-dark font-18">{{ __("Today's Income") }}</h4>
            <h2 class="text-primary text-lef">$<span data-plugin="counterup">{{ todaysActualIncome }}</span></h2>
            <p class="text-muted">{{ __('Remaining Potential') }}:<br>${{ todaysPotentialIncome }}</p>
        </div>
    </div>
</template>

<script>
    import Preloader from '../Preloader.vue'
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        props: {
            todaysActualIncome: [String, Number],
            todaysPotentialIncome: [String, Number],
            loader:  [Boolean],
        },
        components: {
            Preloader,
        },
    }
</script>