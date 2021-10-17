<template>

<div>
    <div class="row">
        <div class="hidden-xs hidden-sm col-md-1"></div>
        <div class="col-md-10">
            <div class="row calendar-header-text" v-if="user">
                <div class="col-12 text-start">
                    <p><a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"><i class="fa fa-play-circle-o" aria-hidden="true"></i> {{ __('Calendar Tutorial') }}</a> | 
                    <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link">
                        <i class="fa fa-support" aria-hidden="true"></i>
                        <span class="button-text"> {{ __('Support') }}</span>
                    </a></p>
                    <!-- <h6>Create a custom calendar link.</h6> -->
                    <div class="collapse" id="collapseExample">
                        <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                            <iframe src="https://www.youtube.com/embed/RR8MnP92j6s?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
                                allowfullscreen allowtransparency allow="autoplay"></iframe>
                        </div>
                        <p>{{ __('Customize your Pro Calendar Link and send it to clients. This public link provides \
                            direct access to your time slot calendar where clients can book online.') }}</p>
                        <p>{{ __('Customize your calendar link with the tool below. Type in what you want the URL to be \
                            then click "Update". You can now copy this link and send it to your clients as a direct \
                            link to your public calendar. Paste the url into your website, banner ad, text message or \
                            email directly to clients.') }}</p>
                        <p>{{ __('Customize your link, click update, the click copy URL. Paste the url into your \
                            website, banner ad, text message or email to send to clients.') }}</p>
                    </div>
                    <p class="small mb-0"><strong>https://app.timeslot.pro/{{ __('book') }}/{{ public_id }}</strong></p>
                    <div class="form-group row">
                        <div class="col-sm-12 col-md-12 mt-2">
                            <input type="text" id="example-input1-group1" name="public_id" class="form-control"
                                :placeholder="__('e.g. my-calendar')" v-model="newPublicId">
                        </div>
                        <div class="col-md-12 mt-2">
                            <button type="submit" class="btn btn-success" @click="updatePublicId" :disabled="updating">{{ __('Update Calendar URL') }}</button>
                            <ClipboardButton class="btn btn-info btn-clipboard" :clipboard-text="publicCalendarLink">{{
                                __('Copy Calendar URL') }}</ClipboardButton>
                        </div>
                    </div>
                </div>
            </div>
            <br>
            <div class="card-box" style="position: relative;">
                <Preloader v-if="loading" style="position: absolute;right: 10px;display: block;width: auto;top: 10px;"/>
                <FullCalendar
                    ref="fullCalendar"
                    :options="calendarOptions"
                />
                <Modal
                    :isVisible="showModal"
                    @close="showModal = !showModal"
                >
                    <template v-slot:header>
                        <strong>{{ __('Event details') }}</strong>
                    </template>
                    <div class="col-12">
                        <label>{{ __('Event') }}</label>
                        <p>{{ activeEventTitle }}</p>
                        <label>{{ __('Description') }}</label>
                        <p>{{ activeEvent?.description }}</p>
                        <label>{{ __('Location') }}</label>
                        <p>{{ activeEvent?.location_place }} ({{ activeEvent?.location_address }})</p>
                        <label>{{ __('Date') }}</label>
                        <p>{{ activeEvent?.description }}</p>
                        <label>{{ __('Time') }}</label>
                        <p>{{ activeEvent?.time }}</p>
                        <label>{{ __('Cost') }}</label>
                        <p>{{ activeEvent?.cost }}</p>
                        <label>{{ __('Bookings') }}</label>
                        <p>{{ activeEvent?.used_slots }} / {{ activeEvent?.slots }}</p>
                        <hr>
                        <br>
                        <div v-if="activeEvent?.bookings.length" class="row">
                            <div
                                v-for="(book, index) in activeEvent?.bookings"
                                :key="book.booking_id"
                                class="col-12 p-0"
                            >
                                <div class="card">
                                    <div class="row h6 pt-1">
                                        <div class="col-2">
                                            <span class="label label-success px-2">
                                                {{ index + 1}}
                                            </span>
                                        </div>
                                        <div class="col-auto text-primary">
                                            <span>{{ book.user.account.full_name }}</span>
                                        </div>
                                        <div class="col text-end">
                                            <span class="payment-type payment-status-link label label-danger">
                                                {{ book.payment_status.type }} - {{ book.payment_status.paid }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <template v-slot:footer>
                        <button @click="$router.push({ path: `/slot/details/${activeEvent?.slot_id}` })" class="btn-primary btn">{{ __('View details') }}</button>
                        <button @click="showModal = !showModal" class="btn-white btn">{{ __('Close') }}</button>
                    </template>
                </Modal>
            </div>
        </div>
        <div class="hidden-xs hidden-sm col-md-1"></div>
    </div>

</div>
</template>

<script>
    import moment from 'moment-timezone'
    import axios from 'axios'
    import helpers from '../mixins/helpers.js'
    import '@fullcalendar/core/vdom'
    import FullCalendar from '../../node_modules/@fullcalendar/vue3'
    import dayGridPlugin from '@fullcalendar/daygrid'
    import interactionPlugin from '@fullcalendar/interaction'
    import Modal from '../components/Modal.vue'
    import ClipboardButton from '../components/Controls/ClipboardButton.vue'
    import Preloader from '../components/Preloader.vue'

    export default {
        mixins: [helpers],
        components: {
            ClipboardButton,
            FullCalendar,
            Modal,
            Preloader
        },
        data () {
            return {
                showModal: false,
                loading: false,
                newPublicId: null,
                updating: false,
                activeEventTitle: null,
                activeEvent: null,
                prevQuery: null,
                calendarOptions: {
                    customButtons: {
                        prev: {
                            click: () => {
                                this.$refs.fullCalendar.getApi().prev();
                                this.getSlots(...this.makeDates())
                            }
                        },
                        next: {
                            click: () => {
                                this.$refs.fullCalendar.getApi().next();
                                this.getSlots(...this.makeDates())
                            }
                        }
                    },
                    headerToolbar: {
                        left: 'prev,next today',
                        center: 'title',
                        right: ''
                    },
                    plugins: [ dayGridPlugin, interactionPlugin ],
                    initialView: 'dayGridMonth',
                    eventClick: this.handlerEventClick,
                    events: [],
                    dayMaxEventRows: true,
                }

            }
        },

        computed: {
            public_id () {
                return this.user ? this.user.account.public_id : null
            },
            user () {
                return this.$store.state.user
            },
            publicCalendarLink() {
                const link = this.$router.resolve({
                    name: 'publicCalendar',
                    params: {
                        publicId: this.user.account.public_id
                    }
                })
                return window.location.origin + link.href
            }
        },

        mounted () {
            this.$nextTick(() => {
                const dates = this.makeDates()
                this.getSlots(...dates)
            })
            this.newPublicId = this.public_id
        },

        methods: {
            updatePublicId () {
                this.updating = true
                axios.post(route('profile.postUpdatePublicId').url(),{
                    public_id: this.newPublicId
                }).then(() => this.$store.dispatch('fetchUser')).finally(() => {
                    this.updating = false
                })
            },
            handlerEventClick (arg) {
                this.activeEvent = arg.event._def.extendedProps
                this.activeEventTitle = arg.event._def.title
                this.showModal = true
            },
            makeDates() {
                const activeRange = this.$refs.fullCalendar.getApi().getCurrentData().dateProfile.activeRange
                return [
                    moment(activeRange.start).format("YYYY-MM-DD"),
                    moment(activeRange.end).format("YYYY-MM-DD")
                ]
            },
            async getSlots (fromDate, toDate) {
                this.loading = true

                if (this.prevQuery)
                    clearTimeout(this.prevQuery)

                this.prevQuery = setTimeout(async () => {
                    const response = await axios.get('/api/calendar/private-slots', {
                        params: {
                            from_date: fromDate,
                            to_date: toDate,
                        }
                    })
                    this.calendarOptions.events = response.data.slots
                    this.calendarOptions.events.forEach(item => {
                        Object.assign(item, {
                            display: 'block',
                            className: item.bookings.length && item.bookings.length !== item.slots ? 'bg-orange'
                            : item.bookings.length
                                ? 'bg-danger'
                                : 'bg-primary',
                        })
                    })
                    this.loading = false
                }, 500);
            }
        }
    }
</script>
