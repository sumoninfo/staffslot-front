<template>
    <div class="loader-layout">
        <preloader v-show="loader"></preloader>
        <div class="data-card widget-box-1 bg-white calendar-style-slots">
            <h4 class="text-dark font-18">{{ __("Today's Slots") }}</h4>
            <slots source="today" :booked-count="todaysBookedSlots" :slots-count="todaysAvailableSlots"/>
            <p class="text-muted hidden">{{ todaysBookedSlots }} / {{ todaysAvailableSlots }} {{ __('Slots Booked') }}</p>
        </div>
    </div>
</template>

<script>
    import Preloader from '../Preloader.vue'
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        props: {
            todaysAvailableSlots: [String, Number],
            todaysBookedSlots: [String, Number],
            loader:  [Boolean],
        },
        components: {
            Preloader,
        }
    }
</script>