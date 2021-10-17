<template>
    <div class="row">
        <div class="hidden-sm hidden-xs col-md-1"></div>
        <div class="col-xs-12 col-sm-12 col-md-10">
            <div class="row">
                <div class="col-md-12 text-start">
                    <p>
                        <a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"><i class="fa fa-play-circle-o" aria-hidden="true"></i> {{ __('Tutorial') }}</a> | <a href="#" @click="shareSlotList"><i class="fa fa-share-square-o" aria-hidden="true"></i> {{ __('Share') }}</a> |

                        <ClipboardButton class="copy-clipboard like-link" :clipboard-text="availableSlotsLink">
                            <i class="fa fa-clipboard" aria-hidden="true"></i>
                            <span class="button-text">{{__('Copy')}}</span>
                        </ClipboardButton> | <router-link :to="{ name: 'eventList' }"><i class="fa fa-list-ul" aria-hidden="true"></i> {{ __('Events') }}</router-link>
                    </p>
                    <div class="collapse" id="collapseExample">
                        <p>{{ __('Time Slots are the specific day/time/event that you have added to your calendar and what clients actually book.') }}</p>
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                                    <iframe src="https://www.youtube.com/embed/XdlvtQuvH6g?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="plyr__video-embed mt-2" id="player" style="margin-bottom: 20px;">
                                    <iframe src="https://www.youtube.com/embed/eqmB_2jK1Fo?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="plyr__video-embed" id="player" style="margin-bottom: 20px; margin-top: 4px;">
                                    <iframe src="https://www.youtube.com/embed/0-lkh4Pe3Xw?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
                                </div>
                            </div>
                        </div>
                        <p>{{ __('The list below shows all of your currently booked, available and previously booked time slots.') }}</p>
                        <p>{{ __('To add a time slot, click the "Add Slot" button; next select the event type, location (optional), day and time. Now clients can view the time slot on your calendar and book it online.') }} <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link"><i class="fa fa-support" aria-hidden="true"></i><span class="button-text"> {{ __('Contact Support') }}</span></a></p>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12 text-center">
                    <router-link to="/wizard/select-event" class="btn btn-success btn-block btn-navigation w-100" :class="{ disabled: !new_slots_allowed }">
                        <span class="button-icon">
                            <i class="fa fa-calendar-plus-o"></i></span><span class="hidden-md-down visible">{{ __('ADD SLOT') }}
                        </span>
                    </router-link>
                    <span v-if="!new_slots_allowed" class="error">{{ __('You have reached the Pro-free account maximum of') }} {{ $max_active_slots }} {{ __('active time slots. To add more slots') }} <a :href="route('subscription.showSelectSubscription')" class="upgrade-pro-plus-text">{{ __('click here') }}</a> {{ __('to upgrade to Pro-Plus') }}.</span>
                </div>
                <div class="col-12 text-center">
                    <button @click="deleteDayPicker" class="btn">{{ __("Delete an entire day's slots? Click here") }}.</button>
                    <date-picker
                        style="width: 1px; position: fixed; left: -100px"
                        ref="deleteEntireDay"
                        v-model="deleteEntireDay"
                    />
                    <confirm ref="deleteEntireDayConfirm" @confirm="deleteDay" />
                </div>
            </div>

            <div class="row">
                <div class="col-md-12 text-center">
                    <form id="fform" :action="route('slot.showSlotList')" method="get">
                        <div class="form-group ">
                            <select class="form-control mt-4" id="sel1" name="event_title" v-model="filters.selectedEvent">
                                <option value="">{{ __('Choose an event') }}...</option>
                                <option v-for="(event, i) in events.real" :key="i" :value="event.title" v-html="event.title"></option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>{{ __('Set Date Range') }}:</label>
                            <div class="m-b-20 row">
                                <div class="col-6">
                                    <date-picker
                                        class="form-control"
                                        placeholder="Select from date"
                                        name="date_from"
                                        v-model="filters.dateFrom"
                                    />
                                </div>
                                <div class="col-6">
                                    <date-picker
                                        class="form-control"
                                        placeholder="Select to date"
                                        name="date_to"
                                        v-model="filters.dateTo"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div class="slot-box">
                <div class="col-lg-12 result-tabs">
                    <ul class="nav nav-tabs tabs slot-tabs" style="width: 100%;">
                        <li class="tab" style="width: 20%;">
                            <a href="#active-slots" data-bs-toggle="tab" aria-expanded="false" class="active all-tab">{{ __('ALL') }}</a>
                        </li>

                        <li class="tab" style="width: 20%;">
                            <a href="#full-slots" data-bs-toggle="tab" aria-expanded="false" class="full-tab">{{ __('FULL') }}</a>
                        </li>

                        <li class="tab" style="width: 20%;">
                            <a href="#booked-slots" data-bs-toggle="tab" aria-expanded="false" class="part-tab">{{ __('PART') }}</a>
                        </li>

                        <li class="tab" style="width: 20%;">
                            <a href="#open-slots" data-bs-toggle="tab" aria-expanded="false" class="open-tab">{{ __('OPEN') }}</a>
                        </li>

                        <li class="tab" style="width: 20%;">
                            <a @click="loadPastBookings" href="#archived-slots" data-bs-toggle="tab" aria-expanded="true" class="past-tab">{{ __('PAST') }}</a>
                        </li>
                        <!-- <div class="indicator" style="right: 295px; left: 147.5px;"></div> -->
                    </ul>
                </div>

                <div class="tab-content no-bck">
                    <div class="tab-pane active" id="active-slots">
                        <slot-list ref="slotListAll" perpage="15"></slot-list>
                    </div>
                    <div class="tab-pane" id="full-slots">
                        <slot-list ref="slotListFull" type='full' perpage="15"></slot-list>
                    </div>
                    <div class="tab-pane" id="booked-slots">
                        <slot-list ref="slotListBooked" type='booked' perpage="15"></slot-list>
                    </div>
                    <div class="tab-pane" id="open-slots">
                        <slot-list ref="slotListOpen" type='open' perpage="15"></slot-list>
                    </div>
                    <div class="tab-pane past-booking-grid" id="archived-slots">
                        <slot-list  ref="slotListArchived" perpage="15" inactive="true"></slot-list>
                    </div>
                </div>
            </div>

            <div>
                <invite-customer/>
            </div>
            <div>
                <book-for-customer/>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import helpers from '../mixins/helpers.js'
    import ClipboardButton from '../components/Controls/ClipboardButton.vue'

    export default {
        mixins: [helpers],
        components: { ClipboardButton },
        data () {
            return {
                new_slots_allowed: true,
                filters: {
                    dateFrom: '',
                    dateTo: '',
                    selectedEvent: ''
                },
                deleteEntireDay: null
            }
        },

        watch: {
            'filters.dateFrom' (val) {
                this.update()
            },
            'filters.dateTo' (val) {
                this.update()
            },
            'filters.selectedEvent' (val) {
                this.update()
            },
            deleteEntireDay (val) {
                this.$refs.deleteEntireDayConfirm.show();
            }
        },

        computed: {
            user() {
                return this.$store.state.user
            },
            events () {
                return this.$store.state.events ? this.$store.state.events.events : []
            },
            availableSlotsLink() {
                const link = this.$router.resolve({
                    name: 'availableSlots',
                    params: {
                        userId: this.user.user_id
                    }
                })
                return window.location.origin + link.href
            }
        },

        methods: {
            update () {
                this.$refs.slotListAll.getData()
                this.$refs.slotListFull.getData()
                this.$refs.slotListBooked.getData()
                this.$refs.slotListOpen.getData()
                this.$refs.slotListArchived.getData()
            },
            shareSlotList(){
                this.emitter.emit('inviteCustomer', {item: {}, _type: "all", item_type: "slotList"});
            },
            loadPastBookings () {
                this.$refs.slotListArchived.doNotLoad = false;
                this.$refs.slotListArchived.getData();
            },
            deleteDayPicker () {
                this.$refs.deleteEntireDay.open();
            },
            async deleteDay () {
                await axios.put('/api/slot/cancel-day', {
                    date: this.deleteEntireDay
                });

                this.update();
            }
        },
        mounted(){
            this.Echo.private('slot-status-update')
                .listen('SlotStatusUpdate', e => {
                let slot = e.slot;
                slot.bookings_count = e.bookingsCount;

                let i = this.$refs.slotListAll.slots.findIndex(x => x.slot_id === slot.slot_id); if (i !== -1) {
                    this.$refs.slotListAll.getData();
                }
            });
        },
    }
</script>
