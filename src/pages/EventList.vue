<template>
<div class="row">
    <div class="hidden-sm hidden-xs col-md-1"></div>
    <div class="col-xs-12 col-sm-12 col-md-10">
        <div class="row">
            <div class="col-12 text-start">
                <p><a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"><i class="fa fa-play-circle-o" aria-hidden="true"></i> {{ __('Events Tutorial') }}</a> | 
                    <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link">
                        <i class="fa fa-support" aria-hidden="true"></i>
                        <span class="support-text">{{ __('Support') }}</span>
                    </a>
                </p>
                <div class="collapse" id="collapseExample">
                    <p>{{ __('Events products that get added to a calendar as time slots. Pick the event cost, how many slots are available and a variety of customizeable settings') }}. <router-link :to="isVideo ? '/video/event/create' : '/event/create/'" :href="route('event.showEventCreate')">
                        <span class="button-icon"><i class="fa fa-plus"></i></span>{{ __('Click to add a new event type') }}.</router-link></p>
                    <div class="row">
                        <div class="col-md-6 col-sm-12">
                            <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                                <iframe src="https://www.youtube.com/embed/4pRq9TkE0vs?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-12">
                            <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                                <iframe src="https://www.youtube.com/embed/Aqcx1NuSsGs?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
                            </div>
                        </div>
                    </div>
                    <p>{{ __('This is a great feature if you repeat the same types of events.  Events, location and time are 3 independent features.') }}</p>
                    <p><strong>{{ __('Event example') }}:</strong> {{ __('Baseball Hitting lesson that is 1-hour, has 4 slots and costs $20 per slot.') }}</p>
                    <p>{{ __('Click on the "Create a New Event" button to get started or select an existing event to add it to your calendar.') }} <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link"><i class="fa fa-support" aria-hidden="true"></i><span class="button-text"> {{ __('Contact Support') }}</span></a></p>
                </div>
            </div>
            <div class="col-12 text-center">
            <router-link :to="isVideo ? '/video/event/create' : '/event/create/'" class="btn btn-success btn-block btn-new-event w-100">
            <span class="button-icon"></span>{{ __('CREATE NEW TYPE') }} <i class="fa fa-plus"></i></router-link>
            </div>
        </div>

        <div class="row event-search">
            <div class="form-group col-12">
                <input type="text" class="form-control" name="query" v-model="eventsFilter" :placeholder="__('Enter event name') + '...'">
                <button class="btn btn-info">{{ __('Search') }}</button>
            </div>
        </div>

        <div class="event-card-box">
            <div v-for="(event, key) in eventList" :key="key">
                <div class="list-collapsable event-list-section" v-if="!eventsFilter || event.title.toLowerCase().includes(eventsFilter.toLowerCase())">
                    <div class="row">
                        <div class="col-md-6">
                            <p class="col-collapsable event-title item-title-sm">
                                <strong>{{ __('STAFF TYPE:') }}:</strong>
                                <router-link v-if="isVideo" :to="{
                                            name: 'videoEventEdit',
                                            params: {
                                                'videoEventId': event.event_id,
                                                'videoEvent': JSON.stringify(event)
                                            }
                                        }">{{ event.title }}</router-link>
                                <router-link v-else :to="{
                                            name: 'eventEdit',
                                            params: {
                                                'eventId': event.event_id,
                                                'event': JSON.stringify(event)
                                            }
                                        }">{{ event.title }}</router-link>
                            </p>
                            <p class="col-collapsable event-minutes item-title-sm"> {{ event.description }}</p>
                            <!-- <p class="col-collapsable event-minutes item-title-sm"><strong>{{ __('Length') }}:</strong> {{ event.duration }}</p>
                            <p class="col-collapsable event-cost item-title-sm"><strong>{{ __('Cost') }}:</strong> ${{ event.cost_pretty }}</p> -->
                        </div>
                        <div class="col-md-6">
                            <div class="row-three-buttons">
                                <div v-if="events.new_slots_allowed" class="btn-navigation button-nav">
                                    <router-link v-if="isVideo" class="btn btn-success btn-block" :to="'/wizard/video/select-event' + '?event_id=' + event.event_id"><span class="button-icon"><i class="fa fa-calendar-check-o"></i></span>{{ __('Add as Video Slot') }}</router-link>
                                    <router-link v-else class="btn btn-success btn-block" :to="'/wizard/select-event' + '?event_id=' + event.event_id"><span class="button-icon"><i class="fa fa-calendar-plus-o"></i></span>{{ __('ADD STAFF SLOT') }}</router-link>
                                </div>
                                <!-- <div class="btn-navigation button-nav">
                                    <router-link v-if="isVideo" class="btn btn-edit btn-block"
                                        :to="{
                                            name: 'videoEventEdit',
                                            params: {
                                                'videoEventId': event.event_id,
                                                'videoEvent': JSON.stringify(event)
                                            }
                                        }"><span class="icon-only"><i class="fa fa-edit"></i> {{ __('Edit') }}</span></router-link>
                                    <router-link v-else class="btn btn-edit btn-block"
                                        :to="{
                                            name: 'eventEdit',
                                            params: {
                                                'eventId': event.event_id,
                                                'event': JSON.stringify(event)
                                            }
                                        }"><span class="icon-only"><i class="fa fa-edit"></i> {{ __('Edit') }}</span></router-link>
                                </div> -->
                                <!-- <div class="btn-navigation button-nav">
                                    <button v-if="isVideo" @click="duplicate(event)" class="btn btn-edit btn-block"><span class="icon-only"><i class="fa fa-copy"></i> {{ __('Duplicate this event') }}</span></button>
                                    <a v-else class="btn btn-edit btn-block" :href="route('event.duplicate', event.event_id)"><span class="icon-only"><i class="fa fa-copy"></i> {{ __('Duplicate this event') }}</span></a>
                                </div> -->
                            </div>
                        </div>
                        <confirm @confirm="destroy(event)">
                            <button class="btn btn-default delete-link"><span class="icon-only"><i class="fa fa-close"></i></span></button>
                        </confirm>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="hidden-sm hidden-xs col-md-1"></div>
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
                eventsFilter: null
            }
        },

        computed: {
            isVideo () {
                return _.get(this, '$route.meta.isVideo', false)
            },

            eventList () {
                if (!this.events) return []

                if (this.isVideo) {
                    return this.events.events.video
                } else {
                    return this.events.events.real
                }
            },

            events () {
                return _.get(this, '$store.state.events', [])
            }
        },

        methods: {
            async duplicate (event) {
                const response = await axios.put(`/api/video/event/${event.event_id}/duplicate`);
                this.$store.dispatch('fetchEvents');
            },

            async destroy (event) {
                const params = this.isVideo ?
                {
                    url: `/api/video/event/${event.event_id}`,
                    method: 'delete'
                } : {
                    url: `/api/event/${event.event_id}`,
                    method: 'delete'
                }

                const response = await this.$store.dispatch('callApi', params);
                if (response.data.success) {
                    this.$store.commit('setFlashMessage', 'Successfully deleted the event');
                    this.$store.dispatch('fetchEvents');
                }
            }
        }
    }
</script>

<style scoped>
    .event-list-section.busy {
        opacity: 0.5;
    }
</style>