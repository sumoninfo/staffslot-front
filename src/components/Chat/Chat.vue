<template>
    <div>
    <div v-if="!readOnly" class="chat-message-composer">
        <textarea
            @keydown.enter="send"
            @focus="validationError = false"
            placeholder="Type message here"
            v-model="message"
            class="form-control"
            :class="{ error: validationError }"></textarea>

        <div class="controls">
            <span v-if="attachedVideo" style="float: left;" class="attach-text">{{ __('Attached') }}: {{ attachedVideo.title }} <button class="btn p-0" @click="detachVideo"><i class="fa fa-times"></i></button></span>
            <button class="btn btn-success mt-2" @click="send"><i class="fa fa-paper-plane"></i> {{ __('Send') }}</button>
        </div>
    </div>
    <hr>
    <transition-group v-if="messages.length" :name="chatBoxTransitionName" tag="div" class="chat-box" ref="chatBox">
        <chat-message
            v-for="message in messages"
            :key="message.id"
            :message="message"
            :highlighted="highlightedMessageId == message.id"
            @remove-message="removeMessage"
            :actions="{ remove: false }"
            />
    </transition-group>
    <div v-else class="chat-box" ref="chatBox">
        <span v-if="loading" class="chat-message loading">
            {{ __('Loading messages') }}
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        </span>
        <span v-else class="chat-message status">{{ __('There are no messages yet') }}</span>
    </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        props: {
            readOnly: {
                type: Boolean,
                default: false
            },

            booking: Object
        },

        data () {
            return {
                attachedVideo: null,
                attachVideo: false,
                chatBoxTransitionName: null,
                loading: true,
                messages: [],
                message: null,
                validationError: false,
            }
        },

        computed: {
            highlightedMessageId () {
                return this.$route.params.highlightedMessageId;
            }
        },

        async mounted () {
            if (!this.booking) {
                await this.fetchBooking();
                this.fetchMessages();
            } else {
                this.fetchMessages();
            }

            this.scrollToMessages();

            this.Echo.private(`booking-${this.booking.booking_id}`)
                .listen('BookingStatusUpdate', e => {
                    this.booking.cancelled = e.booking.cancelled;
                    this.booking.completed = e.booking.completed;
                    this.$forceUpdate();
                });
        },

        methods: {
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
            },

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

            scrollToMessages () {
                if (this.highlightedMessageId && !this.messages.length) {
                    return window.scrollTo(0, this.$refs.chatBox.offsetTop);
                }
            }
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
