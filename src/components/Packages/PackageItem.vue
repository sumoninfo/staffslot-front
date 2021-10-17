<template>
    <div class="card package-box">
        <div class="row">
            <div class="col-md-10 col-sm-12">
                <h4 class="pro-title">{{ __('Pro') }}:<a v-text="pkg.account.first_name +' ' + pkg.account.last_name"></a>
                </h4>
                <h2 class="package-title"><router-link :to="{ name: 'packageDetails', params: { packageId: pkg.id }}" v-text="pkg.package_name"></router-link></h2>
                <p>{{ __('Event included') }}:</p>
                <div class="row d-flex">
                    <template v-for="(event, index) in events" :key="index">
                        <div class="col-auto px-0 pb-1 mb-2">
                            <span class="label label-primary mt-1">
                                <i v-if="event.type == 'video'" class="fa fa-video-camera"></i>
                                <span v-text="event.title"></span>
                            </span>
                        </div>
                    </template>
                </div>
                <p>#{{ __('of slot credits') }}: <span class="" v-text="packageCredits"></span></p>
                <p>{{ __('Expiration terms') }}: <span v-text="packageExpiry"></span></p>
                <p>{{ __('Recurring') }}: <span v-text='packageRenewInfo'></span></p>
                <p>{{ __('cost') }}: <strong v-text="packageCost"></strong> <span v-if="pkg.renewal_message" class="text-primary">({{ pkg.renewal_message }})</span></p>
            </div>
            <div class="col-md-2 col-sm-12">
                <router-link class="btn btn-success mt-2" :to="{ name: 'packageDetails', params: { packageId: pkg.id }}">{{ __('Details') }}</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import helpers from '../../mixins/helpers'

    export default {
        name: "PackageItem",
        mixins: [helpers],
        props: ['pkg'],
        data: function () {
            return {};
        },
        computed: {

            packageCost: function packageCost() {
                if (this.pkg.cost) {
                    return '$' + this.pkg.cost_pretty;
                } else {
                    return 'Free';
                }
            },
            packageLink: function packageLink() {
                return '/package/view/' + this.pkg.id;
            },
            packageCredits: function packageCredits() {
                if (this.pkg.slots_count) {
                    return " includes " + this.pkg.slots_count + " total slots";
                } else {
                    return " Has unlimited credits";
                }
            },
            packageExpiry: function packageExpiry() {
                var str = "";
                if (this.pkg.expiry_type == "interval") {
                    str = this.pkg.expiry + " after purchase";
                } else if (this.pkg.expiry_type == "date") {
                    str = "on " + this.pkg.expiry;
                } else {
                    str = "never";
                }
                return str;
            },
            packageRenewInfo: function packageRenewInfo() {
                if (this.pkg.recurring !== 0) {
                    return "Yes";
                } else {
                    return "No";
                }
            },
            events() {
                return this.pkg.events;
            },
        },
    }
</script>