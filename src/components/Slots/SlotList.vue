<template>
    <div class="col-12">
        <div v-if="ajaxLoading" class="col-12 ajaxLoading h-100 text-center">
          <h2><i class="fa fa-spinner fa-spin"></i> {{ __('Loading') }}...</h2>
        </div>
        <slot-item
            v-for="slot,index in slots"
            :key="'slotitem'+index"
            :slotitem="slot"
            :inactive="inactive"
            :type="type"
            :managed="managed"
        />
        <div class="row py-4">
            <div class="col-auto">
                <select class="form-control input-sm" v-model="perPage" @change="changePerpage"  v-if="slots && slots.length>0">
                    <option
                        v-for="pagelimit,k in pagelimits"
                        :key="k"
                        :value="pagelimit"
                        v-text="pagelimit">
                    </option>
                </select>
            </div>
            <ul class="pagination pagination-sm my-0 col justify-content-end" v-if="totalPages>1">

                <li class="page-item" >
                    <a :class="{'page-link':true, 'disabled':currentPageNumber==1}" v-on:click="changePage(currentPageNumber-1)"><i class="fa fa-angle-double-left"></i></a>
                </li>

                <li
                    v-for="page,k in pagintationPages"
                    :key="k"
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
    import $ from 'jquery'
    import helpers from '../../mixins/helpers'

    export default {
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
                default:'all'
            },
            pageSize:{
                default:9,
            },
            managed: {
                type: Boolean,
                default: false
            },
            filters: {
                users: {
                    type: Array,
                    default: []
                },
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
                slots: [],
                currentPageNumber:1,
                totalPages:1,
                ajaxLoading:false,
                doNotLoad:false
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
            stateSlots () {
                return this.$store ? this.$store.state.slots : []
            }
        },
        watch: {
            filters: {
                handler: function () {
                    this.getData()
                },
                deep: true
            },
            stateSlots: function(val) {
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
                const type = this.inactive ? 'inactive' : this.type
                if (this.stateSlots && this.stateSlots[type]) {
                    this.slots = this.stateSlots[type]
                    this.totalPages = this.stateSlots[type + '-totalPages']
                    this.ajaxLoading = false;
                    return true;
                } else {
                    return false;
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
                    formData.users = this.filters.users
                    formData.events = this.filters.events
                    formData.date_from = this.filters.dateFrom
                    formData.date_to = this.filters.dateTo
                }

                axios.post('/api/slot/get',formData)
                    .then(response => {
                        this.ajaxLoading = false;
                        this.slots = response.data.slots,
                        this.totalPages = response.data.total_page
                    })
                    .catch( error => {
                        this.ajaxLoading = false;
                        console.log(error)
                    });
            }
        },
        mounted() {
            if (this.type == 'all' && this.inactive) {
                this.doNotLoad = true;
            }

            this.perPage = this.perpagex

            if (!this.stateSlots.length)
                this.ajaxLoading = true;

            if (!this.getDataFromStore() && !this.doNotLoad)
                this.getData()
        }
    };
</script>
