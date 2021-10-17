<template id="packageOrders1">
    <div class="col-12 package-card-wrapper">
        <div class="card package-order-card" v-if="orders.length==0">
            <div colspan="6" class="text-center">{{ __('No orders found') }}</div>
        </div>
        <package-order-pro class="card package-order-card" :packagetype='packagetype' v-for="(order,index) in orders" :key="'tr'+index" :order='order' :package="packages[order.package_id]" />
        <div class="row py-4">
            <div class="col-auto">
                <select class="form-control input-sm" v-model="perPage" @change="changePerpage"  v-if="orders.length>0">
                    <option
                        v-for="pagelimit,i, in pagelimits"
                        :key="i"
                        :value="pagelimit"
                        v-text="pagelimit"></option>
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
    import helpers from '../mixins/helpers'

    export default {
        mixins: [helpers],
        props:{
            packages:{},
            packagetype:{
                default:'all'
            },
            pagelimits:{
                type: Array,
                default:function(){return [15,30,50,100]}
            },
            perpagex: {
                default:15
            },
            pageSize:{
                default:9,
            }
        },
        template: '#packageOrders1',
        data:function(){
            return{
                orders:[],
                currentPageNumber:1,
                totalPages:1,
                ajaxLoading:false,
                perPage:15,
            };
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
            getData(){
                this.ajaxLoading = true;

                var formData = {
                    order_type:this.packagetype,
                    per_page:this.perPage,
                    current_page:this.currentPageNumber,

                };

                axios.post('/api/package/pro-orders',formData)
                    .then(response => {
                        this.ajaxLoading = false;
                        this.orders = response.data.orders,
                        this.totalPages = response.data.total_page
                    })
                    .catch( error => {
                        this.ajaxLoading = false;
                        console.log(error)
                    });
            },
        },
        mounted(){
            this.perPage = this.perpagex;
            this.getData();
            this.emitter.on("reloadPackageOrderData",()=>this.getData());
        },
    };
</script>
