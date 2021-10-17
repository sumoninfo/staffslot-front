<template>
    <div class="w-100 text-start">
        <div>{{ __('Video time uploaded') }}:</div>
        <div class="progress w-100 mb-0" style="background-color: #fff; color: #000">
            <div class="progress-bar" role="progressbar" :style="`width: ${percentsUsed}%`" :aria-valuenow="percentsUsed" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="mt-1">{{ usageRepr }}</div>
    </div>
</template>

<script>
import helpers from '../mixins/helpers';

export default {
    mixins: [ helpers ],

    computed: {
        percentsUsed () {
            return this.user.video_seconds_used * 100 / this.user.video_seconds_max;
        },

        usageRepr () {
            return `${this.hoursUsed > 0 ? this.hoursUsed + (this.hoursUsed === 1 ? 'hour' : ' hours ') : ''}
                ${this.minutesUsed > 0 ? (this.hoursUsed > 0 ? ' and ' : '') + this.minutesUsed + (this.minutesUsed === 1 ? ' minute' : ' minutes') : ''}
                ${this.hoursUsed === 0 && this.minutesUsed === 0 ? this.secondsUsed + (this.secondsUsed === 1 ? ' second' : ' seconds') : ''}
                out of ${this.hoursMax} ${this.hoursMax === 1 ? 'hour' : 'hours'} used this month`;
        },

        hoursUsed () {
            return Math.floor(this.user.video_seconds_used / 3600);
        },

        minutesUsed () {
            return Math.floor(this.user.video_seconds_used % 3600 / 60);
        },

        secondsUsed () {
            return Math.floor(this.user.video_seconds_used % 3600 % 60);
        },

        hoursMax () {
            return Math.floor(this.user.video_seconds_max / 3600);
        },

        user () {
            return this.$store.state.user;
        }
    }
}
</script>

<style>

</style>