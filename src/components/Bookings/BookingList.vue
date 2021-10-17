<template>
    <div class="col-12">
        <booking-item
            v-for="(booking,index) in bookings"
            :key="'bookingitem'+index"
            :bookingitem="booking"
            :inactive="inactive"
            :type="type"
        />
        <div class="text-center" v-if="ajaxLoading">
            <div class="spinner-border" role="status" ></div>
        </div>
        <p v-if="bookings.length<1 && !ajaxLoading">{{ __('You have no upcoming bookings') + '. ' + __('Please') }} <router-link :to="{ name: 'searchPro' }">{{ __('click here to search for a pro') }}</router-link> {{ __('and book Time Slots') + '.' }}</p>
        <div class="row py-4">
            <div class="col-auto">
                <select class="form-control input-sm" v-model="perPage" @change="changePerpage"  v-if="bookings.length>0">
                    <option
                        v-for="pagelimit,i in pagelimits"
                        :key="i"
                        :value="pagelimit"
                        v-text="pagelimit"
                    ></option>
                </select>
            </div>
            <ul class="pagination pagination-sm my-0 col justify-content-end" v-if="totalPages>1">

                <li class="page-item" >
                    <a :class="{'page-link':true, 'disabled':currentPageNumber==1}" v-on:click="changePage(currentPageNumber-1)"><i class="fa fa-angle-double-left"></i></a>
                </li>

                <li
                    v-for="page,i in pagintationPages"
                    :key="i"
                    :class="{'page-item':true, 'active':page.number==currentPageNumber}"
                >
                    <a class="page-link" v-text="page.text" v-on:click="changePage(page.number)"></a>
                </li>

                <li class="page-item" >
                    <a :class="{'page-link':true, 'disabled':currentPageNumber==totalPages}" v-on:click="changePage(currentPageNumber+1)"><i class="fa fa-angle-double-right"></i></a>
                </li>

            </ul>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Preloader from '../Preloader.vue'
    import helpers from '../../mixins/helpers'

    export default {
        components: { Preloader },
        mixins: [helpers],
        props:{
            pagelimits:{
                type: Array,
                default:function(){return [15,30,50,100]}
            },
            perpagex: {
                default:15
            },
            inactive: {
                default:false,
            },
            type:{
                default:'past'
            },
            pageSize:{
                default:9,
            },
            managed: {
                type: Boolean,
                default: false
            },
            filters: {
                events: {
                    type: Array,
                    default: []
                },
                dateFrom: {
                    type: String,
                    default: null
                },
                dateTo: {
                    type: String,
                    default: null
                }
            }
        },
        data: function () {
            return {
                bookings:[],
                currentPageNumber:1,
                totalPages:1,
                ajaxLoading:false,
            }
        },
        computed:{
            pagintationPages: function () {
                var pagintationPages = [];

                for (var i = 0; i < this.totalPages; i++) {
                    pagintationPages[i] ={ number: i+1, text:i+1};
                }

                if (this.totalPages>this.pageSize) {

                    var sectionSize = Math.floor(this.pageSize/2);

                    var startNumber = this.currentPageNumber - sectionSize;
                    startNumber = startNumber > 0 ? startNumber : 0;

                    var paginationStart = pagintationPages.slice(startNumber,this.currentPageNumber - 1);

                    var paginationEnd = pagintationPages.slice(this.currentPageNumber -1, this.currentPageNumber + this.pageSize - paginationStart.length );

                    pagintationPages = paginationStart.concat(paginationEnd);
                }

                return pagintationPages;
            },
            stateBookings () {
                return this.$store ? this.$store.state.bookings : null
            }
        },
        watch: {
            filters: {
                handler: function () {
                    this.getData()
                },
                deep: true
            },
            stateBookings: function(val) {
                this.getDataFromStore()
            }
        },
        methods:{
            changePerpage(){
                this.changePage(1);
            },
            changePage:function (_page) {
                if ( _page > 0 && _page<=this.totalPages ) {
                    this.currentPageNumber = _page;
                    this.getData();
                }
            },
            getDataFromStore () {
                if (this.stateBookings && this.stateBookings[this.type]) {
                    this.bookings = this.stateBookings[this.type]
                    this.totalPages = this.stateBookings[this.type + '-totalPages']
                    this.ajaxLoading = false;
                }
            },
            getData:function () {
                this.ajaxLoading = true;

                var formData = {
                    type:this.type,
                    inactive:this.inactive,
                    per_page:this.perPage,
                    current_page:this.currentPageNumber,

                    event_title:$('[name="event_title"]').val(),
                    date_from:$('[name="date_from"]').val(),
                    date_to:$('[name="date_to"]').val(),

                };

                if (this.managed) {
                    formData.managed = this.managed
                    formData.events = this.filters.events
                    formData.date_from = this.filters.dateFrom
                    formData.date_to = this.filters.dateTo
                }

                axios.post('/api/booking/get',formData)
                    .then(response => {
                        this.ajaxLoading = false;
                        this.bookings = response.data.bookings,
                        this.totalPages = response.data.total_page
                    })
                    .catch( error => {
                        this.ajaxLoading = false;
                        console.log(error)
                    });
            }
        },
        mounted() {
            this.perPage = this.perpagex;

            if (!this.stateBookings)
                this.ajaxLoading = true;

            if (!this.$store)
                this.getData()
            else
                this.getDataFromStore()
        }
    };
</script>
