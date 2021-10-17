<template>
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card-box" style="margin-bottom: 10px;">
                <slot-filter
                    :events="events"
                    @on-change="getSlots"
                />
            </div>
            <div v-for="slot in slots" :key="slot.slot_id" class="list-collapsable event-list-section">
                <div class="row">
                    <div class="col-md-8">
                        <p class="col-collapsable event-title item-title-sm"><strong>{{ __('Event') }}:</strong>
                            <router-link :to="{ name: 'bookSlot', params: { id: slot.slot_id }}" v-if="!isFull(slot)">
                                {{ slot.title }}
                            </router-link>
                            <a v-else>{{ slot.title }}</a>
                        </p>
                        <p class="col-collapsable event-location-name item-title-sm"><strong>{{ slot.location_place }}</strong></p>
                        <p class="col-collapsable event-minutes item-title-sm" style="width: 100%;"> {{ slot.description }}</p>
                        <p v-if="slot.ongoing" class="col-collapsable event-minutes item-title-sm"><strong>{{ __('from') }}:</strong> {{ slot.event_day }}<br> {{ slot.start_time }}<br></p>
                        <p v-if="slot.ongoing" class="col-collapsable event-minutes item-title-sm"><strong>{{ __('to') }}:</strong> {{ slot.end_day }}<br> {{ slot.end_time }}</p>
                        <p v-if="!slot.ongoing" class="col-collapsable event-minutes item-title-sm"><strong>{{ __('when') }}:</strong> {{ slot.event_day }}<br> {{ slot.start_time }} - {{ slot.end_time }}</p>
                        <p class="col-collapsable event-cost item-title-sm"><strong>{{ __('Cost') }}:</strong> ${{ slot.cost }}</p>
                        <p v-if="slot.slots !== slot.bookings_count" class="available-slots-field"><strong>{{ __('Available slots') }}:</strong> {{ slot.slots - slot.bookings_count }}/{{ slot.slots }}</p>
                        <p v-if="slot.slots === slot.bookings_count" class="available-slots-field"><strong>{{ __('Available slots') }}:</strong> {{ __('Fully Booked') }}</p>
                        <ul class="solts-visualizer" :class="{ full: isFull(slot) }">
                            <li v-for="i in slot.slots" :key="i" :class="{ booked: i <= slot.bookings_count }" :style="`width: ${1/slot.slots * 100}%;`"></li>
                        </ul>
                    </div>
                    <div class="col-md-4">
                        <div class="row row-three-buttons">
                            <div class="btn-navigation button-nav" v-if="!isFull(slot)">
                                <router-link
                                class="btn btn-success slot-button"
                                :to="{
                                    name: 'bookSlot',
                                    params: {
                                    id: slot.slot_id
                                    }
                                }"
                                >
                                    {{ __('Select slot') }}
                                </router-link>
                            </div>
                            <div class="btn-navigation button-nav" v-if="isFull(slot)">
                                <a class="btn btn-default slot-button" >
                                    {{ __('Fully booked') }}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import helpers from '../mixins/helpers.js'

    export default {
        mixins: [helpers],

        data () {
            return {
                slots: [],
                events: []
            }
        },

        async mounted () {
            this.getSlots();

            this.Echo.private('slot-status-update')
                .listen('SlotStatusUpdate', e => {
                let slot = e.slot;
                slot.bookings_count = e.bookingsCount;

                let i = this.slots.findIndex(x => x.slot_id === slot.slot_id); if (i !== -1) {
                    this.slots[i] = slot;
                    this.$forceUpdate();
                }
            });
        },

        methods: {
            isFull (slot) {
                return slot.bookings_count >= slot.slots;
            },

            async getSlots (filters) {
                const params = filters ? {
                    event_title: filters.selectedEvent,
                    date_from: filters.dateFrom,
                    date_to: filters.dateTo
                } : null;

                const response = await axios.get(`/api/available-slots/${this.$route.params.userId}`, { params });
                this.events = response.data.events;
                this.slots = response.data.slots;
            }
        }
    }
</script>

<style scoped>
    .full li {
        background-color: red !important;
    }
</style>
