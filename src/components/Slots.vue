<template>
    <div>
        <!-- <label for="">columns:&nbsp;<input type="number" v-model.number="columns"></label> -->
        <ul class="solts-visualizer">
            <li v-if="loading">{{ __('Loading') }}...</li>
            <li v-for="(slot, i) in slots" :style="{width: 100/columns + '%'}" v-bind:class="{booked: slot.booked, br: (i && (i % columns) == 0)}" ></li>
        </ul>
        <div style="clear: both;"></div>
    </div>
</template>

<script>
import helpers from '../mixins/helpers'
    export default {
        mixins: [helpers],
        props: {
            source: { // Can be 'today' or 'all'
                type: String,
                required: false,
                default: 'all'
            },
            slotsCount: [String, Number],
            bookedCount: [String, Number]
        },

        data() {
            return {
                loading: false,
                slots: null,
                todaySlots: null,
                columns: 12,
                columnConditions: [
                    {greaterThan: 0, lessThan: 10, columns: 3},
                    {greaterThan: 10, lessThan: 20, columns: 4},
                     {greaterThan: 20, lessThan: 30, columns: 5},
                     {greaterThan: 20, lessThan: 30, columns: 6},
                     {greaterThan: 30, lessThan: 40, columns: 7},
                     {greaterThan: 40, lessThan: 50, columns: 8},
                     {greaterThan: 50, lessThan: 60, columns: 10},
                     {greaterThan: 60, lessThan: 130, columns: 12}
                ]
            }
        },

        created() {
            for (const prop in this.$props) {
                    this.$watch(prop, this.update)
            }
            // axios.get('/api/slot/list/json')
            // .then(response => {
            //     switch(this.source) {
            //         case 'today':
            //             var booked = response.data.todays_booked_slots
            //             for(var s in booked) {
            //                 booked[s].booked = true
            //             }
            //             this.slots = booked.concat(response.data.todays_available_slots)
            //         break;

            //         case 'all':
            //             var booked = response.data.booked_slots
            //             for(var s in booked) {
            //                 booked[s].booked = true
            //             }
            //             this.slots = booked.concat(response.data.open_slots)
            //         break;
            //     }

            //     var _slots = [];

            //     for(var s in this.slots) {
            //         var count = 1;
            //         for (var _b=0; _b < this.slots[s].bookings.length; _b++) {
            //             var _s = Object.assign({}, this.slots[s])
            //             _s.booked = this.slots[s].bookings[_b].cancelled ? false : true
            //             _s.count = count++
            //             _slots.push(_s)
            //         }

            //         for(var i=0; i<this.slots[s].slots - this.slots[s].bookings.length; i++) {
            //             var _s = Object.assign({}, this.slots[s])
            //             _s.booked = false
            //             _s.count = count++
            //             _slots.push(_s)
            //         }
            //     }
            //     this.slots = _slots;

            this.update()

                // this.loading = false
            // })
        },
        methods: {
            update () {
                this.slots = [];
                for(var i=0; i<this.slotsCount; i++)
                    this.slots.push({
                        booked: i<this.bookedCount ? true : false
                    })

                for (var c in this.columnConditions) {

                    if (this.slots.length > this.columnConditions[c].greaterThan
                                && this.slots.length <= this.columnConditions[c].lessThan) {
                        this.columns = this.columnConditions[c].columns
                        break
                    }
                }
            }
        }
    }
</script>