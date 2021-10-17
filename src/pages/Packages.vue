<template>
    <div class="container">
        <div v-if="packages" id="ts-content">
            <div class="row">
                <div class="col-md-12 text-start">
                    <p>
                        <a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false"
                           aria-controls="collapseExample">
                            <i class="fa fa-play-circle-o" aria-hidden="true"></i>
                            {{__('Tutorial') }}
                        </a>
                        |
                        <a @click.prevent="sharePackageLink">
                            <i class="fa fa-share-square-o"></i> {{ __('Share') }}
                        </a>
                        |
                        <ClipboardButton class="like-link" style="border: none" :clipboard-text="packagePageLink">
                            <i class="fa fa-clipboard" aria-hidden="true"></i>
                            <span class="button-text">{{ __('Copy') }}</span>
                        </ClipboardButton>
                        |
                        <a href="/time-slots-package">
                            <i class="fa fa-list-ul" aria-hidden="true"></i>
                            <span class="button-text">{{ __('Manage') }}</span>
                        </a>
                    </p>
                    <div class="collapse" id="collapseExample">
                        <p>{{ __('Create packages and set the amount of credits customers can use to book your time or video slots. Pros can event set limints on how many credits can be used on certain events within the package, making it easier to diversify the offer') }}.</p>
                        <div class="row">
                            <div class="col-md-6 col-sm-12">
                                <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                                    <iframe src="https://www.youtube.com/embed/3Q0oD5UfPpg?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
                                    <iframe src="https://www.youtube.com/embed/0-lkh4Pe3Xw?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
                                </div>
                            </div>
                        </div>
                        <p>{{ __('To get started click the "add a new package" button below. Create a package name, select the qualifying events, enter the max amount of each event that can be booked, enter the cost, enter how many credits are included, set an expiration date and set if the package automatically renews.') }} <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link"><i class="fa fa-support" aria-hidden="true"></i><span class="button-text"> {{ __('Contact Support') }}</span></a></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12 text-center pb-2">
                <router-link :to="{ name: 'addPackage' }"
                    class="btn btn-success btn-block w-100"
                    data-animation="fadein" data-plugin="custommodal"
                    data-overlaySpeed="200" data-overlayColor="#36404a">
                    <i class="md md-add"></i> Add a New Package
                </router-link>
            </div>
        </div>
        <div class="row">
            <div class="col-12 pt-2">
                <h4>Packages for Sale</h4>
            </div>
            <div class="col-12 package-card-wrapper">
                <ts-package-list :packages="packages.timeSlotsPackages"/>
            </div>
        </div>
        <div class="row">
            <div class="col-12 pt-2">
                <h4>Active Packages</h4>
            </div>
        </div>
        <package-orders-pro packagetype="active" :packages="packages.timeSlotsPackages"></package-orders-pro>
        <div class="row">
            <div class="col-12 pt-2">
                <h4>Completed, Expired or Canceled Pkgs</h4>
            </div>
        </div>
        <package-orders-pro packagetype="expired" :packages="packages.timeSlotsPackages"></package-orders-pro>
        <div v-if="ajaxLoading" class="ajaxLoading">
            <h1 class="text-center"><i class="fa fa-spinner fa-spin"></i></h1>
        </div>
        <div>
            <book-for-customer/>
        </div>
        <div>
            <invite-customer/>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import helpers from '../mixins/helpers.js'
    import ClipboardButton from '../components/Controls/ClipboardButton.vue'

    export default {
        mixins: [helpers],

        data() {
            return {
                ajaxLoading: false
            }
        },

        components: { ClipboardButton },

        mounted () {
            this.emitter.on('loadingStart', () => this.ajaxLoading = true);
            this.emitter.on('loadingStop', () => this.ajaxLoading = false);
        },

        computed: {
            user() {
                return this.$store.state.user
            },
            packages() {
                return this.$store.state.packages ? this.$store.state.packages : {
                    timeSlotsPackages:[]
                }
            },
            packagePageLink() {
                const link = this.$router.resolve({
                    name: 'availablePackages',
                    params: {
                        publicId: this.user.account.public_id
                    }
                })
                return window.location.origin + link.href
            }
        },

        methods: {
            sharePackageLink(){
                this.emitter.emit('inviteCustomer', {item: {}, _type: "all", item_type: "packageList"});
            },
        }
    }
</script>

<style>

</style>
