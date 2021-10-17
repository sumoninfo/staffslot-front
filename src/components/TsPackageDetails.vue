<template>
    <div id='package-content' class="row">
        <div class="col-12">
            <div class="event-detail-header">
            <h3>{{package.package_name}}</h3>
            <h4 style="text-align: center;">{{ __('Package Details') }}</h4>
            <br>
                <div class="col-12 px-2">
                    <hr>
                    <!-- <div class="row">
                        <div class="col-4 h6">Package Type:</div>
                        <div class="col-8">{{ packageType }}</div>
                    </div>
                    <hr> -->
                    <div class="row">
                        <div class="col h6">{{ __('Eligible Slot Types') }}:</div>
                        <div class="col-md-8">
                            <div class="row d-flex ps-4 ps-md-0">
                                <div class="col-12 px-0 pb-1 mb-2" v-for="(event,id) in package.events">
                                    <span class="label label-primary mt-1">
                                        <i v-if="event.type == 'video'" class="fa fa-video-camera"></i>
                                        <i v-if="event.type == 'product'" class="fa fa-truck"></i>
                                        {{ event.title }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-4 h6">{{ __('Package Expires') }}:</div>
                        <div class="col-8">{{packageEpiry}} </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-4 h6">{{ __('Package Cost') }}:</div>
                        <div class="col-8">{{packageCost}} <span v-if='package.recurring' class="text-primary" v-text="packageRenewInfo"></span></div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-4 h6">{{ __('Package Description') }}:</div>
                        <div class="col-8"><p class="package-description text-left" v-text="package.description"></p></div>
                    </div>
                    <hr>
                    <div v-if="package.waiver_url" class="row">
                        <div class="col-4 h6">{{ __('Waiver') }}:</div>
                        <div class="col-8"><a target="_blank" :href="package.waiver_url">{{ package.waiver_url }}</a></div>
                    </div>
                    <hr v-if="package.waiver_url">
                    <div v-if="package.doc_url" class="row">
                        <div class="col-4 h6">{{ __('Package form') }}:</div>
                        <div class="col-8"><a target="_blank" :href="package.doc_url">{{ package.doc_url }}</a></div>
                    </div>
                    <hr v-if="package.doc_url">
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import helpers from '../mixins/helpers'
    
    export default {
        mixins: [helpers],
        props: {
            package: {
                type: Object
            }
        },
        computed:{

            packageType: function packageType(){
                if (this.package.slots_count) {
                    return " includes " +this.package.slots_count + " total slots";
                } else {
                    return " Has unlimited credits";
                }
            },

            packageCost: function packageCost(){
                if (this.package.cost) {
                    return "$"+ this.package.cost_pretty;
                } else {
                    return "Free";
                }
            },

            packageEpiry: function packageEpiry(){
                var str="";
                if (this.package.expiry_type=="interval") {
                    str = this.package.expiry + " after purchase";
                } else if(this.package.expiry_type=="date") {
                    str="on "+ moment(this.package.expiry).format('MM/DD/YYYY');
                } else {
                    str = "never";
                }
                return str;
            },

            packageRenewInfo: function packageRenewInfo(){
                if(this.package.recurring>1){
                    return "(This package will renew after every "+ this.package.expiry +", for "+ this.package.recurring +" times)";
                } else if (this.package.recurring===-1) {
                    return "(This package will renew after every "+ this.package.expiry +")";
                } else{
                    return "(This package will renew once after"+ this.package.expiry +")";
                }
            },

        }
    }
</script>

<style type="text/css">
    .package-table th{
        width: 40%;
    }
    .stripe-button-el {
        display: none !important;
    }
    .payment-section{
        margin: 20px auto;
    }
    .payment-section form {
        display: inline-block;
    }
    .package-table {
        font-size: 1em;
    }
    .event-list li {
        margin: 2px auto;
        list-style:none;
    }
</style>
