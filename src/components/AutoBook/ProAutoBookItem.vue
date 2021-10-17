<template>
    <div class="col-12">
        <div :class="{'card':true,'bg-light':item.pro_cancelled}">

            <div class="row">
                <div class="col-md-4">
                    <h5>{{ __('By:') }} {{customerName}}</h5>
                    <p>({{item.name}})</p>
                    {{ __('Created:') }} <span v-text="createDate"></span>
                </div>
                <div class="col-md-4 mt-2">
                    <div><p>{{ __('Week Days') }}: {{weekDays}}</p></div>
                    <div><p>{{ __('Time Range') }}: {{timeRange}}</p></div>
                </div>
                <div class="col-md-4 text-md-right">
                    <button v-if="!item.pro_cancelled" @click="cancelItem" class="btn btn-danger"><i class="fa fa-ban"></i> {{ __('Cancel') }}</button>
                    <span v-else class="label label-danger">
                        {{ __('Canceled') }}
                    </span>
                </div>
            </div>

        </div>
    </div>
</template>
<script type="text/javascript">
        import axios from 'axios'
        import moment from 'moment'
        import Swal from 'sweetalert2'
        import helpers from '../../mixins/helpers'

        export default{
            props:{
                item:Object,
            },
            mixins: [helpers],
            data(){
                return {
                }
            },
            computed:{
                eventLink(){
                    // return "//"+this.item.id;
                },
                createDate(){
                    return moment(this.item.created_at).format("MM/DD/YYYY");
                },
                customerName(){
                    return this.item.user.account.full_name;
                },
                weekDays(){
                    var weekDays = [];
                    for (var i = 0; i < this.item.week_days.length; i++) {
                        weekDays[i] = weekDay(this.item.week_days[i]);
                    }
                    return weekDays.join();
                },
                timeRange(){
                    return this.item.time_range.startTime +"-"+ this.item.time_range.endTime;
                },
            },
            methods:{
                async cancelItem(){
                    var autobook = this.item;
                    const result = await Swal.fire({
                        title:"Are you sure want to cancel the auto book?",
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                        showLoaderOnConfirm: true,
                        preConfirm: () => {
                            axios.post("/api/my-autobooks/cancel/"+ this.item.id).then(response =>{
                                if (response.data.result) {
                                    this.$store.commit('setFlashMessage', 'Auto Book was canceled')
                                    autobook.pro_cancelled= response.data.result;
                                }else{
                                    this.$store.commit('pushError', 'Unable to cancel Auto Book')
                                }
                            });
                        }
                    })
                },
            },
        };
</script>
