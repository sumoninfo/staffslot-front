<template>
  <div v-if="notifications.data.length" class="dropdown notify-drop">
    <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fa fa-bell fa-lg" :class="{ unread }"></i>
    </button>
    <div class="dropdown-menu">
        <div class="header"><span class="btn">{{ unreadCount === 0 ? 'No' : unreadCount }} {{ __('new message') }} {{ unreadCount !== 1 ? 's' : '' }}</span></div>
        <ul @scroll="onScroll">
            <li
                @click="goToMessage(notification)"
                v-for="(notification, i) in notifications.data"
                :key="notification.id"
                :class="{ last: (i == notifications.data.length-1), unread: !notification.read }"
            >
                <div class="avatar">
                    <img v-if="notification.user.account.profile_photo" :src="`https://app.timeslot.pro/storage/uploads/${notification.user.account.profile_photo}`"
                            alt="user" class="rounded-circle">

                    <img v-else src="/images/default-profile-time-slot-pro.png" alt="user"
                            class="rounded-circle">

                </div>
                <div class="message">{{ notification.preview }}</div>
            </li>
            <li v-if="notifications.loading" class="last">
                <div class="text-center w-100">
                    <div class="spinner-border spinner-border-sm" role="status">
                        <span class="sr-only">{{ __('Loading') }}...</span>
                    </div>
                </div>
            </li>
        </ul>
        <div class="notify-footer">
            <button @click="markAllAsRead" class="btn btn-link mr-2">{{ __('Mark all as read') }}</button>
            <button @click="clear" class="btn btn-link">{{ __('Clear') }}</button>
        </div>
    </div>
  </div>
</template>

<script>
import helpers from '../mixins/helpers'

export default {
    mixins: [helpers],

    computed: {
        notifications () {
            return this.$store.state.notifications
        },

        unread () {
            return this.unreadCount > 0;
        },

        unreadCount () {
            return this.notifications.unread;
        }
    },

    methods: {
        onScroll ({ target: { scrollTop, clientHeight, scrollHeight }}) {
            if (scrollTop + clientHeight >= scrollHeight) {
                this.$store.dispatch('notifications/fetchNext');
            }
        },
        goToMessage (notification) {
            if (notification.chatable_type && notification.chatable_type == 'App\\Models\\Booking') {
                const name = notification.type == 'product' ? 'productChat' : 'videoBooking';
                this.$router.push({
                    name,
                    params: {
                        bookingId: notification.chatable_id,
                        highlightedMessageId: notification.id
                    }
                });
            }
        },

        markAllAsRead () {
            this.$store.dispatch('notifications/markAllAsRead');
        },

        clear () {
            this.$store.dispatch('notifications/clear');
        }
    }
}
</script>

<style scoped>
    .notify-drop {
        padding: 0;
        line-height: 50px;
        color: #fff;
    }

    .notify-drop .dropdown-toggle {
        color: #fff;
        /* font-size: 12px; */
        padding: 0;
        margin: 0 13px 3px 0;
    }

    .notify-drop .unread {
        position: relative;
    }

    .notify-drop button .unread:after {
        content: "●";
        color: #f00;
        position: absolute;
        bottom: -5px;
        right: -3px;
    }

    .notify-drop .dropdown-menu {
        line-height: initial;
    }

    .dropdown-menu {
        padding: 0;
    }

    .dropdown-menu .header, .dropdown-menu .notify-footer {
        text-align: center;
    }
    .dropdown-menu .header {
        border-bottom: 1px solid #eee;
    }

    .dropdown-menu .notify-footer {
        border-top: 1px solid #eee;
    }

    .dropdown-menu ul {
        padding: 0;
        max-height: 300px;
        width: 300px;
        overflow-y: scroll;
    }

    .dropdown-menu li {
        padding: 5px;
        display: flex;
        border-bottom: 1px solid #eee;
        cursor: pointer;
    }

    .dropdown-menu li.unread {
        background-color: #c5e0ff;
    }

    .dropdown-menu li.last {
        border: none;
    }

    .dropdown-menu .avatar {
        margin-right: 5px;
    }

    .dropdown-menu img {
        width: 30px;
        height: 30px;
    }

    .dropdown-menu .message {

    }

    .spinner-border {
        border-color: #c5e0ff;
        /* border-color: #5d9cec; */
        border-bottom-color: transparent;
    }
</style>
