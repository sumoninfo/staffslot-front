<template>

    <div class="col-12 px-0">

        <div v-if="is_loading" class="col-12 card text-center">
          {{ __('Loading') }}
        </div>

        <!--Pagination start-->
        <div class="row py-4">

            <div class="col-auto">
                <select class="form-control input-sm" v-model="perPage">
                    <option v-for="(pagelimit) in pagelimits" :value="pagelimit">{{pagelimit}}</option>
                </select>
            </div>

            <div class="col">
                <ul class="pagination pagination-sm my-0 px-0 justify-content-md-end justify-content-center flex-wrap">
                    <li class="page-item">
                        <a class="page-link"  @click="paginate(1)"><i class="fa fa-angle-double-left"></i></a>
                    </li>

                    <li v-for="pageNumber in totalPage" :class="{'page-item':true, 'active':currentPage==pageNumber}" @click="paginate(pageNumber)">
                        <a class="page-link">{{pageNumber}}</a>
                    </li>

                    <li class="page-item">
                        <a class="page-link"  @click="paginate(totalPage)"><i class="fa fa-angle-double-right"></i></a>
                    </li>
                </ul>
            </div>

        </div>
        <!--Pagination end-->

        <customer-booking-item v-for="(booking,index) in bookings" :key="'cbooking_'+index" :booking="booking"></customer-booking-item>

        <!--Pagination start-->
        <div class="row py-4">

            <div class="col-auto">
                <select class="form-control input-sm" v-model="perPage">
                    <option v-for="(pagelimit) in pagelimits" :value="pagelimit">{{pagelimit}}</option>
                </select>
            </div>

            <div class="col">
                <ul class="pagination pagination-sm my-0 px-0 justify-content-md-end justify-content-center flex-wrap">
                    <li class="page-item">
                        <a class="page-link"  @click="paginate(1)"><i class="fa fa-angle-double-left"></i></a>
                    </li>

                    <li v-for="pageNumber in totalPage" :class="{'page-item':true, 'active':currentPage==pageNumber}" @click="paginate(pageNumber)">
                        <a class="page-link">{{pageNumber}}</a>
                    </li>

                    <li class="page-item">
                        <a class="page-link"  @click="paginate(totalPage)"><i class="fa fa-angle-double-right"></i></a>
                    </li>
                </ul>
            </div>

        </div>
        <!--Pagination end-->

    </div>

</template>
<script>
    import axios from 'axios'
    import helpers from '../../mixins/helpers'

    export default{
        mixins: [helpers],
        props:{
            customerId:{
                type:Number,
            },
            pagelimits:{
                type: Array,
                default:function(){return [15,30,50,100]}
            },
            perpagex: {
                default:15
            },
            canceled: {
                default:false,
            },
        },
        data(){
            return{
                bookings:[],
                filters: {
                    events:'',
                    dateFrom:'',
                    dateTo:''
                },
                is_loading:false,
                currentPage:1,
                totalPage:1,
                perPage:15,
            };
        },
        watch:{
            perPage(newValue,oldValue){
                if (newValue!=oldValue) {
                    this.getBookings(1);
                }
            },
        },
        methods:{
            getBookings(_pageNum) {
              this.bookings = [];
              this.is_loading = true;

              var data = {
                  page:_pageNum,
                  perPage:this.perPage,
              };

              // axios.get(route('customers.bookings',this.customer.user_id),data).then((response) => {
              axios.post("/api/customers/"+this.customerId+"/bookings",data).then((response) => {
                this.bookings = response.data.data;
                this.totalPage = response.data.last_page;
                this.currentPage = response.data.current_page;
              }).catch((e) => {
                this.errors.push(e)
              }).finally(() => (this.is_loading = false))
            },
            paginate(pageNumber){
                if (pageNumber!=this.currentPage) {
                    this.getBookings(pageNumber);
                }
            }
        },
        created(){
            this.perPage = this.perpagex;
            this.getBookings(1);
        },
    }
</script>
