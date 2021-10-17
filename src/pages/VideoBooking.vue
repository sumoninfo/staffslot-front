<template>
    <div class="row">
        <div class="col-md-2"></div>
        <div class="col-md-8">
            <div class="card-box" v-if="booking">

                <video-slot-details :videoSlot="booking.bookable" :booking="booking" />
                <hr v-if="slotOwner && isActive">
                <div v-if="slotOwner && isActive" class="text-end">
                    <payment-status-manage class="pull-left" :paymentStatus="booking.payment_status" :booking="booking.booking_id" />
                    <confirm @confirm="completeBooking(booking)" style="display: inline-table;">
                        <button class="btn btn-success btn-xs">{{ __('Complete') }}</button>
                    </confirm>
                    <confirm @confirm="cancelBooking(booking)" style="display: inline-table;">
                        <button class="btn btn-danger btn-xs">{{ __('Cancel') }}</button>
                    </confirm>
                </div>
                <hr>
                <div v-if="slotOwner"><b>{{ __('Customer name') }}</b> {{ booking.user.account.full_name }}</div>
                <div v-if="!(booking.cancelled || booking.completed)" class="chat-message-composer">
                    <textarea
                        @keydown.enter="send"
                        @focus="validationError = false"
                        placeholder="Type message here"
                        v-model="message"
                        class="form-control"
                        :class="{ error: validationError }"></textarea>

                    <div class="controls">
                        <span v-if="attachedVideo" style="float: left;" class="attach-text">{{ __('Attached') }}: {{ attachedVideo.title }} <button class="btn p-0" @click="detachVideo"><i class="fa fa-times"></i></button></span>
                        <button class="btn btn-primary mt-2" @click="attachVideo"><i class="fa fa-video-camera"></i> {{ __('Attach video') }}</button>
                        <button class="btn btn-success mt-2" @click="send"><i class="fa fa-paper-plane"></i> {{ __('Send') }}</button>
                    </div>
                </div>
                <div v-else class="text-center">
                    <span class="chat-message status">{{ __('The booking is') }} {{ booking.cancelled ? 'cancelled' : 'completed' }}.</span>
                    <p v-if="slotOwner">
                        <button class="btn btn-success mt-2" @click="reopenBooking(booking)">{{ __('Reopen') }}</button>
                    </p>
                </div>
                <hr>
                <transition-group v-if="messages.length" :name="chatBoxTransitionName" tag="div" class="chat-box" ref="chatBox">
                    <chat-message
                        v-for="message in messages"
                        :key="message.id"
                        :message="message"
                        :highlighted="highlightedMessageId == message.id"
                        @remove-message="removeMessage"
                        :actions="{ remove: (user && booking && message.user_id == user.user_id && !booking.cancelled && !booking.completed ? true : false) }"
                    />
                </transition-group>
                <div v-else class="chat-box" ref="chatBox">
                    <span v-if="loading" class="chat-message loading">
                        {{ __('Loading messages') }}
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </span>
                    <span v-else class="chat-message status">{{ __('There are no messages yet') }}</span>
                </div>
                <br>
            </div>
        </div>
        <modal :isVisible="showChooseOrUpload" modalId="chooseOrUpload" style="max-height: 100%; overflow-y: scroll;">
            <template v-slot:header>
                {{ __('Choose or upload video') }}
            </template>
            <video-choose-upload v-model="attachedVideo" />
            <template v-slot:footer>
                <button class="btn btn-primary" @click="showChooseOrUpload = false">{{ __('Close') }}</button>
            </template>
        </modal>
    </div>
</template>

<script>
    import helpers from '../mixins/helpers.js';
    import axios from 'axios'

    export default {
        mixins: [helpers],

        data () {
            return {
                booking: this.$route.params && this.$route.params.booking && JSON.parse(this.$route.params.booking),
                messages: [],
                message: null,
                attachedVideo: null,
                chatBoxTransitionName: null,
                showChooseOrUpload: false,
                validationError: false,
                loading: true
            }
        },

        computed: {
            user () {
                return this.$store.state.user;
            },

            slotOwner () {
                return this.user && this.booking.bookable.user_id == this.user.user_id;
            },

            isActive () {
                return !this.booking.cancelled && !this.booking.completed;
            },

            highlightedMessageId () {
                return this.$route.params.highlightedMessageId;
            }
        },

        watch: {
            async $route (newVal, oldVal) {
                if (newVal.name === oldVal.name && newVal.params.bookingId !== oldVal.params.bookingId) {
                    this.messages = [];
                    this.loading = true;
                    await this.fetchBooking();
                    this.fetchMessages();
                }
            }
        },

        async mounted () {
            if (!this.booking) {
                await this.fetchBooking();
                this.fetchMessages();
            } else {
                this.fetchMessages();
            }

            if (this.booking.defaultChatMessage !== undefined && this.booking.defaultChatMessage.length !== 0) {
                this.messages.push(this.booking.defaultChatMessage)
            }
            this.scrollToMessages();

            this.emitter.on('close-modal', params => {
                if (params.modalId === 'player') {
                    this.showPlayer = false;
                    this.playingVideo = null;
                } else if (params.modalId === 'chooseOrUpload') {
                    this.showChooseOrUpload = false;
                }
            });

            this.emitter.on('video-processing-status-change', video => {
                for (let i = 0; i < this.messages.length; i++) {
                    if (this.messages[i].video && this.messages[i].video.video_id === video.video_id) {
                        this.messages[i].video = video;
                        this.$forceUpdate();
                    }
                }
            });

            this.emitter.on('annotation', image => {
                this.attachedImage = image;
                this.send();
                this.scrollToMessages();
            })

            this.Echo.private(`booking-${this.booking.booking_id}`)
                .listen('BookingStatusUpdate', e => {
                    this.booking.cancelled = e.booking.cancelled;
                    this.booking.completed = e.booking.completed;
                    this.$forceUpdate();
                });
        },

        updated () {
            if (this.messages.length)
                this.scrollBottom();
        },

        beforeDestroy(){
            this.$root.$off('annotation');
        },

        methods: {
            async fetchMessages() {
                const response = await axios.get(`/api/chat/booking/${this.booking.booking_id}`);
                this.messages = response.data.messages;
                this.loading = false;

                if (Array.isArray(this.messages))
                    this.$store.dispatch('notifications/markAsRead', this.messages.map(x => x.id));

                this.Echo.private(`booking-chat-${this.booking.booking_id}`)
                    .listen('ChatMessageSent', e => {
                        this.pushMessage(e.chatMessage)
                        this.$store.dispatch('notifications/markAsRead', e.chatMessage.id);
                    });
            },

            async fetchBooking() {
                const response = await axios.get(`/api/booking/video/${this.$route.params.bookingId}`);
                this.booking = response.data.booking;
            },

            async send (e) {
                if (e && e.shiftKey)
                    return;

                e && e.preventDefault();

                axios.put('/api/chat', {
                    video_booking_id: this.booking.booking_id,
                    message: this.message,
                    video_id: this.attachedVideo ? this.attachedVideo.id : null,
                    image_id: this.attachedImage ? this.attachedImage.id : null
                }).then(response => this.pushMessage(response.data.message))
                .catch(({ response }) => {
                    if (response.status === 422) {
                        this.validationError = true;
                    }
                });

                this.message = null;
                this.attachedVideo = null;
                this.attachedImage = null;
            },

            attachVideo () {
                this.showChooseOrUpload = true;
            },

            detachVideo () {
                this.attachedVideo = null;
            },

            pushMessage (chatMessage) {
                if (!this.chatBoxTransitionName)
                    this.chatBoxTransitionName = 'fade';

                this.messages.unshift(chatMessage);
            },

            async removeMessage (message) {
                const response = await axios.delete(`/api/chat/messages/${message.id}`);

                if (response.data.success)
                    this.messages = this.messages.filter(x => x.id != message.id);
            },

            scrollBottom () {
                const e = this.$refs.chatBox.$el;
                e.scrollTop = e.scrollHeight;
            },

            scrollToMessages () {
                if (this.highlightedMessageId && !this.messages.length) {
                    return window.scrollTo(0, this.$refs.chatBox.offsetTop);
                }
            },

            async cancelBooking (booking) {
                const response = await axios.put(`/api/booking/video/cancel/${booking.booking_id}`);
                booking.cancelled = true;
            },

            async completeBooking (booking) {
                const response = await axios.put(`/api/booking/video/complete/${booking.booking_id}`);
                booking.completed = true;
            },

            async reopenBooking (booking) {
                const response = await axios.put(`/api/booking/video/reopen/${booking.booking_id}`);
                booking.completed = false;
                booking.cancelled = false;
            },
        }
    }
</script>

<style scoped>
    .chat-message-composer {
        position: relative;
    }

    .chat-message-composer .error {
        border-color: red;
    }

    .chat-message-composer .controls {
        text-align: right;
    }

    .chat-message-composer .controls .btn {
        background-color: transparent;
        color: #797979;
    }

    .attach-text {
        background-color: #ea7e25;
        padding: 8px;
        color: #fff;
        border-radius: 5px;
        margin-top: 8px;
    }

    .chat-box {
        position: relative;
        height: 100%;
        overflow-y: scroll;
        background-color: #f7f7f7;
        padding-top: 12px;
        padding-bottom: 18px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 4px;
        background-color: #fff;
    }

    .chat-box .status {
        position: absolute;
        bottom: 0;
        text-align: center;
        width: 100%;
        font-style: italic;
        color: #ccc;
    }

    .chat-box .loading {
        position: absolute;
        bottom: 2px;
        text-align: center;
        width: 100%;
        font-style: italic;
        color: #000;
        font-size: 1rem;
    }

    .chat-box .loading .spinner-border {
        margin-bottom: 2px;
    }

    .btn-xs {
        padding-top: 6px;
        padding-bottom: 6px;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: background 1s;
    }

    .fade-enter,
    .fade-leave-to {
        background-color: #ddddff;
    }
</style>