<template>
    <select v-model="time.days" class="form-control col-sm-2" style="max-width: 60px !important; display: inline;">
        <option value="0">- </option>
        <option v-for="day,i in times.days" :key="i">{{ day }}</option>
    </select>
    <span class="mt-4">-{{ __('days') }}</span>
    <select v-model="time.hours" class="form-control col-sm-2" style="max-width: 60px !important; display: inline;">
        <option value="0">-</option>
        <option v-for="hour,i in times.hours" :key="i">{{ hour }}</option>
    </select>
    <span class="mt-4">-{{ __('hours') }}</span>
    <select v-model="time.minutes" class="form-control col-sm-2" style="max-width: 60px !important; display: inline;">
        <option value="0">-</option>
        <option v-for="minute,i in times.minutes" :key="i">{{ minute }}</option>
    </select>
    <span class="mt-4">-{{ __('minutes before') }}</span>
</template>

<script>
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        props: {
            modelValue: Object,
            daysRange: {
                type: Array,
                default: [1, 3]
            },
            hoursRange: {
                type: Array,
                default: [1, 23]
            },
            minutesRange: {
                type: Array,
                default: [5, 55, 5] // start, end, step
            },

        },
        data() {
            return {
                time: this.modelValue || {},
                times: {
                    days: [...this.range(...this.daysRange)],
                    hours: [...this.range(...this.hoursRange)],
                    minutes: [...this.range(...this.minutesRange)]
                }
            }
        },
        watch: {
            time: {
                handler: function(time) {
                    const value = (time.day || 0) * 1440 + // minutes in a day
                    (time.hour || 0) * 60 +
                    (time.minute || 0)
                    this.$emit('update:modelValue', time)
                },
                deep: true
            },
            modelValue() {
                this.time = this.modelValue
            }
        },
        methods: {
            range: function* (start, end, step = 1) {
                for (let i = start; i <= end; i+=step) {
                    yield i;
                }
            }
        }
    }
</script>
