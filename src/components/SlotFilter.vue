<template>
    <div style="padding: 12px 2px 18px 2px">
        <div class="form-group" v-if="events">
            <label for="sel1">{{ __('Event Type') }}:</label>
            <select class="form-control" id="sel1" name="event_title" v-model="filters.selectedEvent">
                <option value="">{{ __('Choose an event') }}...</option>
                <option v-for="(event, i) in events" :key="i" :value="event.title" v-html="event.title"></option>
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
    </div>
</template>

<script>
    import helpers from '../mixins/helpers.js'

    export default {
        mixins: [helpers],

        props: {
            events: {
                type: Array,
                default: null
            }
        },

        data () {
            return {
                filters: {
                    dateFrom: '',
                    dateTo: '',
                    selectedEvent: ''
                }
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
            }
        },

        methods: {
            update () {
                this.$emit('on-change', this.filters);
            }
        }
    }
</script>