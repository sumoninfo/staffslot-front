<template>
    <div class="row ps-0 pe-1">
        <div class="col-auto ms-auto ps-0 pe-1">
            <select class="form-control" v-model="time.hour">
                <option v-for="(hour, key) in times.hours" :key="key" :value="hour">{{ formatNumber(hour) }}</option>
            </select>
        </div>
        <div class="col-auto ps-0 pe-1">
            <select class="form-control" v-model="time.minute">
                <option v-for="(minute, key) in times.minutes" :key="key" :value="minute">{{ formatNumber(minute) }}</option>
            </select>
        </div>
        <div class="col-auto me-auto ps-0 pe-0">
            <select class="form-control" v-model="time.meridiem">
                <option v-for="(meridiem, key) in times.meridiems" :key="key" :value="meridiem">{{ meridiem }}</option>
            </select>
        </div>
    </div>
</template>

<script>
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        props: ['modelValue'],
        data() {
            return {
                initDone:false,
                time: {},
            }
        },
        methods:{
            formatNumber(num){
                if (num<10) {
                    return "0"+num;
                }
                return ""+num;
            },
        },
        computed:{
            times(){
                const hours = [1,2,3,4,5,6,7,8,9,10,11,12];
                const minutes = [...Array(60).keys()];
                const meridiems = ["AM","PM"];

                return {
                    hours,
                    minutes,
                    meridiems
                };

            }
        },
        watch: {
            time: {
                handler: function (time) {
                    if (this.initDone) {
                        this.$emit('update:modelValue', time);
                    }
                },
                deep: true
            }
        },
        created(){
            var time = {};
            time.hour = this.modelValue.hour;
            time.minute = this.modelValue.minute;
            time.meridiem = this.modelValue.meridiem;
            this.time = time;
            this.initDone=true;
        },
    }
</script>
