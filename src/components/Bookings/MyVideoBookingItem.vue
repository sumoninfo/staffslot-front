<template>
    <div class="list-collapsable event-list-section">
        <div class="row">
            <div class="col-md-9 col-lg-10">
                <p class="col-collapsable event-title item-title-sm"><router-link :to="{
                    name: 'videoBooking',
                    path: `/video/booking/${booking.booking_id}`,
                    params: {
                        bookingId: booking.booking_id,
                        booking: JSON.stringify(booking)
                    }
                }">{{ booking.bookable.title }}</router-link></p>
                <div v-if="booking.last_message" style="margin-left: 2%;"><strong>{{ __('Last message') }}:</strong> {{ fromNow(booking.last_message.created_at) }}<br>
                <strong>{{ __('Total') }}:</strong> {{ booking.messages_count }} {{ __('message(s)') }}</div>
                <div>
                    <span v-if="booking.cancelled" class="badge-original badge-secondary ml-2 mt-1">{{ __('Canceled') }}</span>
                    <span v-if="booking.completed" class="badge-original badge-secondary ml-2 mt-1">{{ __('Completed') }}</span>
                </div>
                <p class="col-collapsable" v-if="booking.last_message">
                    <b>{{ booking.last_message.user.account.first_name }} {{ booking.last_message.user.account.last_name }}</b> {{ booking.last_message.preview }}
                </p>
                <p class="col-collapsable event-location-name item-title-sm">
                    <span v-text="booking.bookable.location_place"></span>
                </p>
                <p class="col-collapsable event-minutes item-title-sm" >
                    <strong>{{ __('Pro') }}</strong>{{ booking.bookable.user.account.first_name }} {{ booking.bookable.user.account.last_name }}
                </p>
                <p class="col-collapsable event-minutes item-title-sm" style="width: initial;">
                    <strong>{{ __('Cost') }}</strong>{{ formatCurrency(booking.bookable.cost_pretty) }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import helpers from '../../mixins/helpers.js';
    import filters from '../../mixins/filters.js';

    export default {
        mixins: [helpers, filters],

        props: {
            booking: Object
        }
    }
</script>