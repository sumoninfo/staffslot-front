<template>
    <div class="row justify-content-center">
        <div class="col-md-10" v-if="videoSlots.length">
            <div
                v-for="videoSlot,i in videoSlots"
                :key="i"
                class="list-collapsable event-list-section"
            >
                <div class="row">
                    <div class="col-md-8">
                        <p class="col-collapsable event-title item-title-sm"><strong>{{ __('Event') }}:</strong>
                            <router-link :to="{
                                name: 'confirmVideoSlot',
                                params: {
                                    videoSlotId: videoSlot.id,
                                    videoSlot: JSON.stringify(videoSlot)
                                }}">
                                {{ videoSlot.title }}
                            </router-link>
                        </p>
                        <p class="col-collapsable event-minutes item-title-sm" style="width: 100%;">
                            {{ videoSlot.description }}</p>
                        <p class="col-collapsable event-cost item-title-sm"><strong>{{ __('Cost') }}:</strong> ${{ videoSlot.cost }}
                        </p>
                        <p v-if="videoSlot.slots !== videoSlot.bookings.length" class="col-collapsable event-cost item-title-sm">
                            <strong>{{ __('Available slots') }}:</strong> {{ videoSlot.slots - videoSlot.bookings.length }}/{{ videoSlot.slots }}
                        </p>
                        <p v-if="videoSlot.slots === videoSlot.bookings.length" class="col-collapsable event-cost item-title-sm">
                            <strong>{{ __('Available slots') }}:</strong> {{ __('Fully Booked') }}
                        </p>
                        <ul class="solts-visualizer">
                            <li
                                v-for="i in videoSlot.slots"
                                :key="i"
                                :class="{ booked: i <= videoSlot.bookings.length }"
                                :style="'width: ' + 1/videoSlot.slots * 100  + '%;'"
                            ></li>
                        </ul>
                    </div>
                    <div class="col-md-4">

                        <div class="row row-three-buttons">
                            <div v-if="videoSlot.slots !== videoSlot.bookings.length" class="btn-navigation button-nav">
                                <router-link class="btn btn-success slot-button" :to="{
                                    name: 'confirmVideoSlot',
                                    params: {
                                        videoSlotId: videoSlot.id,
                                        videoSlot: JSON.stringify(videoSlot)
                                    }
                                }">
                                    {{ __('Select slot') }}
                                </router-link>
                            </div>
                            <div v-if="videoSlot.slots === videoSlot.bookings.length" class="btn-navigation button-nav">
                                <router-link class="btn btn-default slot-button" >
                                    {{ __('Fully booked') }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <pages @on-changed="onPaginationChanged" v-model="pagination" />
        </div>
        <div class="col-md-10 super-center text-center" v-else>
            <h4  class="mt-2" v-if="loading">{{ __('Please wait') }}...</h4>
            <h4 v-else>{{ __('This pro does not have any video slots available. Please contact your pro to request a video slot') }}.</h4>
        </div>
    </div>
</template>

<script>
    import helpers from '../mixins/helpers.js'
    import axios from 'axios'
    import _ from 'lodash'

    export default {
        mixins: [helpers],

        data () {
            return {
                videoSlots: [],
                pagination: null,
                loading: true
            }
        },

        mounted () {
            this.getVideoSlots();
        },

        methods: {
            async getVideoSlots () {
                const response = await axios.get(`/api/video/avaialable-slots/${ this.$route.params.userId }`, {
                    params: _.pick(this.pagination, ['page', 'per_page'])
                });
                this.videoSlots = response.data.slots.data;
                this.pagination = _.omit(response.data.slots, ['data']);
                this.loading = false;
            },

            onPaginationChanged () {
                this.getVideoSlots();
            }
        }
    }
</script>
