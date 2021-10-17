<template>
    <div id='ts-content' class="container" v-if="packageOrders">
    <div class="row">
            <div class="col-12 col-md-12 col-lg-12 text-start">
                <p>
                    <a data-bs-toggle="collapse" href="#collapseExample"
                        aria-expanded="false" aria-controls="collapseExample"><i class="fa fa-play-circle-o" aria-hidden="true"></i> {{ __('Packages Tutorial') }}</a> | <router-link :to="{ name: 'packageList' }"><i class="fa fa-search"></i> {{ __('Buy a Package') }}</router-link>
                </p>
                <div class="collapse" id="collapseExample">
                    <!-- <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                        <iframe src="https://www.youtube.com/embed/DbcjxO91viU?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
                            allowfullscreen allowtransparency allow="autoplay"></iframe>
                    </div> -->
                    <p>{{ __('Buy packages to save money, find special offers or sign up for a recurring subscription package with your pro.') }}</p>
                    <p>{{ __('With a package you receive credits to use for specified time slot events with the pro') }}.</p>
                    <p><router-link :to="{ name: 'packageList' }" class=""><i class="fa fa-search"></i> {{ __('Browse Pro Packages') }}</router-link></p>
                </div>
            </div>
            <!-- <div class="col-12 col-md-12 col-lg-12 text-center">
            <a href="{{ route('package.list') }}" class="btn btn-success pull-right"><i class="fa fa-plus"></i> Buy New Package</a>
        </div> -->
        </div>        
        <div class="row">

            <div class="col-12 text-center">
                <h5>
                    {{ __('My Active Packages') }}
                </h5>
            </div>

        </div>
        <package-orders :orders="activePackageOrders" :active="true"></package-orders>

        <div class="col-12 expired-package-headline">
            <h5 class=" col-12">{{ __('My Expired/Used Packages') }}</h5>
        </div>
        <package-orders :orders="inActivePackageOrders"></package-orders>

    </div>
</template>

<script>
    import helpers from '../mixins/helpers.js'

    export default {
        mixins: [helpers],

        data () {
            return {
            }
        },

        methods:{
            isActive(packageOrder){

                var flag=true;
                if(packageOrder.renew_count === 0 && packageOrder.allocated_slots>0 && packageOrder.allocated_slots<=packageOrder.used_slots){
                    flag=false;
                }

                if (packageOrder.is_expired){
                    flag=false;
                }
                if (packageOrder.is_canceled) {
                    flag=false;
                }
                return flag;
            },
        },

        computed: {
            packageOrders () {
                return this.$store.state.packageOrders
            },
            activePackageOrders(){
                return this.packageOrders ? this.packageOrders.filter(order => this.isActive(order)) : null;
            },
            inActivePackageOrders(){
                return this.packageOrders ? this.packageOrders.filter(order => ! this.isActive(order)) : null;
            },
        }
    }
</script>

<style>

</style>
