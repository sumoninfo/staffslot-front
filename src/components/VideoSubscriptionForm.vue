<template>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="page-title-area">
                <h3 class="">{{ __('CREATE OR EDIT A VIDEO SUBSCRIPTION') }}</h3>
            </div>
            <div class="location-box">
                <div v-if="errorMessage" class="row alert alert-danger form-error-message">
                    {{ errorMessage }}
                </div>
                <div v-if="successMessage" class="row alert alert-success form-success-message">
                    {{ successMessage }}
                </div>
                <div>
                    <div class="form-group row">
                        <label class="col-4 col-sm-2 col-form-label">{{ __('Subscription name') }}</label>
                        <div class="col-8 col-sm-10">
                            <input v-model="videoSubscription.name" tabindex="0" type="text" class="form-control">
                            <div class="form-control-feedback text-danger" v-if="formErrors.name">{{ formErrors.name[0] }}</div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-4 col-sm-2 col-form-label">{{ __('Subscription description') }}</label>
                        <div class="col-8 col-sm-10">
                            <textarea v-model="videoSubscription.description" tabindex="0" type="text" class="form-control"></textarea>
                            <div class="form-control-feedback text-danger" v-if="formErrors.description">{{ formErrors.description[0] }}</div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="text-end w-100" :class="{ 'with-video': promoVideos.length }">
                            <video-thumb
                                v-for="promoVideo in promoVideos"
                                :key="promoVideo.id"
                                :video="promoVideo"
                                style="width: 80px; height: 80px;"
                            />
                            <button class="btn btn-primary" @click="showModal({ component: 'modal-video-choose-or-upload', close: promoVideoChoosed, props: { multiple: true } })"><i class="fa fa-video-camera"></i> {{ __('Attach promo video') }}</button>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-8 col-sm-2 col-form-label">{{ __('Is this a free subscription?') }}</label>
                        <div class=" col-4 col-sm-10 text-end">
                            <v-switches v-model="videoSubscription.isFree" color='success' type-bold="true" theme='bootstrap' />
                        </div>
                    </div>
                    <div v-if="!videoSubscription.isFree" class="row">
                        <label class="col-4 col-sm-2 col-form-label">{{ __('Subscription cost') }}</label>
                        <div class="col-8 col-sm-10 text-end">
                            <input class="form-control" type="number" v-model="videoSubscription.cost">
                            <div class="form-control-feedback text-danger" v-if="formErrors.cost">{{ formErrors.cost[0] }}</div>
                        </div>
                    </div>
                    <div v-if="!videoSubscription.isFree" class="row">
                        <label class="col-3 col-sm-2 col-form-label">{{ __('Payment Option') }}</label>
                        <div v-if="true" class="col-3 text-right">
                            <v-switches v-model="videoSubscription.credit_card_enabled" color='success' type-bold="true" theme='bootstrap' />
                            <label>{{ __('Credit Card') }}</label>
                        </div>
                        <div v-if="true" class="col-3 text-end">
                            <v-switches v-model="videoSubscription.cash_enabled" color='success' type-bold="true" theme='bootstrap' />
                            <label>{{ __('Cash') }}</label>
                        </div>
                        <div v-if="true" class="col-3 text-end">
                            <v-switches v-model="videoSubscription.club_credit_enabled" color='success' type-bold="true" theme='bootstrap' />
                            <label>{{ __('Club Credit') }}</label>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-4 col-sm-4 col-form-label">{{ __('Select the included video tags') }}</label>
                        <div class="col-8 col-sm-8 text-right">
                            <tag-editor v-model="videoSubscription.tagsObj" ref="tagEditor" />
                        </div>
                        <div class="col-12 mt-1">
                            <div class="row">
                                <div class="col-8">
                                    <p v-if="formErrors.tags" class="col form-control-feedback text-danger">{{ formErrors.tags[0] }}</p>
                                </div>
                                <div class="col-4 text-right">
                                    <button @click="selectAllTags" class="btn btn-primary btn-small mr-1">{{ __('select all') }}</button>
                                    <button @click="clearAllTags" class="btn btn-secondary btn-small mt-1 mr-1">{{ __('clear all') }}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-12 col-sm-2 col-form-label">{{ __('Select expiration') }}:</label>
                        <div class="row">
                            <div class="col-4">
                                <div class="col-12">
                                    <v-switches v-model="switches.expirationPeriodOn" color='success' type-bold="true" theme='bootstrap' />
                                    <label>{{ __('Set # of days/month/year') }}</label>
                                </div>
                                <div class="col-12" v-if="switches.expirationPeriodOn">
                                    <input class="form-control" min="1" type="number" v-model="expirationPeriod" />
                                </div>
                                <div class="col-12" v-if="switches.expirationPeriodOn">
                                    <select v-model="timePeriod" class="form-control">
                                        <option v-for="(period, i) in timePeriods" :key="i" :value="period" v-text="period"></option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-4">
                                <v-switches v-model="switches.expirationDateOn" color='success' type-bold="true" theme='bootstrap' />
                                <label>{{ __('Specific Date') }}</label>
                                <div v-if="switches.expirationDateOn">
                                    <date-picker v-model="expirationDate" class="form-control" />
                                </div>
                            </div>
                            <div class="col-4">
                                <v-switches v-model="switches.noExpirationOn" color='success' type-bold="true" theme='bootstrap' />
                                <label>{{ __('No Expiration') }}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group row">
                    <label class="col-6 col-sm-2">{{ __('How many subscriptions are available for sale?') }}</label>
                    <div class="col-6 text-right">
                        <v-switches v-model="unlimitedOn" color='success' type-bold="true" theme='bootstrap' />
                        <label class="col-12">{{ __('Unlimited') }}</label>
                        <div v-if="!unlimitedOn" class="col-12">
                            <input v-model="videoSubscription.slots" type="number" min="1" class="form-control">
                        </div>
                    </div>
                </div>
                <div v-if="switches.expirationPeriodOn" class="form-group row">
                    <label class="col-8 col-sm-2 col-form-label">{{ __('Does this subscription renew when expired?') }}</label>
                    <div class="col-4 col-sm-10 text-right">
                        <v-switches v-model="videoSubscription.renewal" color='success' type-bold="true" theme='bootstrap' />
                    </div>
                </div>
                <div class="form-group row" v-if="switches.expirationPeriodOn && videoSubscription.renewal">
                    <label class="col-md-2 col-sm-12 col-form-label">{{ __('How many times does the subscription renew?') }}</label>
                    <div class="col-md-10 col-sm-12">
                        <div class="row">
                            <div class="col-4">
                                <v-switches v-model="alwaysRenewOn" color='success' type-bold="true" theme='bootstrap' />
                                <label for="always-renew-checkbox">{{ __('Always') }}</label>
                            </div>
                            <div v-show="!alwaysRenewOn" class="col-8 text-end">
                                <input type="number" min="0" class="form-control" v-model="videoSubscription.renewal_limit">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group row">
                    <label class="col-8 col-sm-2 col-form-label">{{ __('Hide this subscription from the public list?') }}</label>
                    <div class="col-4 col-sm-10 text-right">
                        <v-switches v-model="videoSubscription.isHidden" color='success' type-bold="true" theme='bootstrap' />
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-4 col-sm-2 col-form-label">{{ __('Waiver') }}</label>
                    <div class="col-8 col-sm-10">
                        <input class="form-control" placeholder="Enter url for your waiver form..." v-model="videoSubscription.waiver_url">
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-4 col-sm-2 col-form-label">{{ __('Other doc') }}</label>
                    <div class="col-8 col-sm-10">
                        <input class="form-control" placeholder="Enter url for a document you want customers to view..." v-model="videoSubscription.doc_url">
                    </div>
                </div>

                <div class="row">
                    <button @click="submit" type="button" class="btn btn-success ms-auto me-auto" :disabled="busy">
                        <span v-if="busy" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        {{ __('Save subscription') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import helpers from '../mixins/helpers';
import { mapActions } from 'vuex';
import axios from 'axios'

export default {
    mixins: [ helpers ],

    data () {
        return {
            edit: false,
            busy: false,
            formErrors: [],
            errorMessage: null,
            successMessage: null,
            videoSubscription: {},
            expirationPeriod: 1,
            expirationDate: null,
            timePeriod: null,
            timePeriods: ['days', 'weeks', 'months', 'years'],
            switches: {
                expirationPeriodOn: false,
                expirationDateOn: false,
                noExpirationOn: true,
            },
            unlimitedOn: false,
            alwaysRenewOn: false,
            promoVideos: []
        }
    },

    async mounted () {
        if (this.$route.params.videoSubscriptionId) {
            this.edit = true;
            if (this.$route.params.videoSubscription) {
                this.videoSubscription = JSON.parse(this.$route.params.videoSubscription);
            } else {
                const response = await axios(`/api/video/subscriptions/${this.$route.params.videoSubscriptionId}`);
                if (response.data.video_subscription.user_id !== this.$store.state.user.user_id) {
                    this.$router.push({
                        name: 'videoSubscriptionDetails',
                        params: {
                            videoSubscriptionId: this.$route.params.videoSubscriptionId
                        }
                    });
                }
                this.videoSubscription = response.data.video_subscription;
            }
            this.videoSubscription.tagsObj = this.videoSubscription.tags;
            this.setSwitches();
        }

        // Watch for object properties and if some property
        // did set to true, set others to false
        const unsetOthers = obj => {
            for (let watchingKey in this[obj]) {
                this.$watch(`${obj}.${watchingKey}`, (nval, oval) => {
                    for (let key in this[obj]) {
                        if (key !== watchingKey && nval)
                            this[obj][key] = false;
                    }
                });
            }
        }
        unsetOthers('switches');

        this.promoVideos = this.videoSubscription.videos || [];
        this.timePeriod = this.timePeriods[1];
        if (this.videoSubscription.expiration) this.switches.expirationDateOn = true;
        if (this.videoSubscription.validity){
            this.switches.expirationPeriodOn = true;
            this.expirationPeriod = this.videoSubscription.validity;
            this.timePeriod = this.videoSubscription.validity_period;
        };
    },

    methods: {
        ...mapActions({showModal: 'modals/show'}),

        async submit () {
            this.busy = true;
            this.formErrors = [];

            this.buildExpiration();
            this.videoSubscription.tags  = this.videoSubscription.tagsObj ?
                this.videoSubscription.tagsObj.map(x => x.name) : null;

            this.setSwitches();

            this.videoSubscription.promoVideos = this.promoVideos.map(x => x.id);

            try {
                let response;
                if (this.edit) response = await axios.put(`/api/video/subscriptions/${this.videoSubscription.id}/edit`, this.videoSubscription);
                else response = await axios.post('/api/video/subscriptions/create', this.videoSubscription);
                this.successMessage = this.edit ? this.__('Subscription successfully updated') : this.__('Subscription successfully created');
                this.edit = true;
                if (response.data.video_subscription)
                    this.videoSubscription.id = response.data.video_subscription.id;

                this.$router.push({ name: 'videoSubscriptions' }, () => setTimeout(() => {
                    this.emitter.emit('flashMessage', this.successMessage);
                }, 0));
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    this.formErrors = error.response.data.errors;
                    this.errorMessage = error.response.data.message;
                } else {
                    this.errorMessage = error.message;
                }

                setTimeout(() => {
                    window.scrollTo(0, this.$el.getElementsByClassName('form-error-message')[0].offsetTop);
                }, 0);
            }

            this.busy = false;
        },

        setSwitches () {
            this.unlimitedOn = this.videoSubscription.slots ? false : true;
            this.alwaysRenewOn = this.videoSubscription.renewal_limit ? false : true;
        },

        buildExpiration () {
            if (this.switches.expirationDateOn) {
                this.videoSubscription.expiration = moment(this.expirationDate);
                this.videoSubscription.validity = null;
                this.videoSubscription.renewal = null;
            }

            if (this.switches.expirationPeriodOn) {
                this.videoSubscription.validity = this.expirationPeriod;
                this.videoSubscription.validity_period = this.timePeriod;
                this.videoSubscription.expiration = null;
            }

            if (this.switches.noExpirationOn) {
                this.videoSubscription.expiration = null;
                this.videoSubscription.validity = null;
                this.videoSubscription.renewal = null;
            }
        },

        selectAllTags () {
            this.$refs.tagEditor.selectAll();
        },

        clearAllTags () {
            this.$refs.tagEditor.clearAll();
        },

        promoVideoChoosed (value) {
            this.promoVideos = value || [];
        }
    }
}
</script>

<style scoped>
    .form-group.row {
        border: 1px solid #f7f7f7;
        border-radius: 5px;
        padding: 10px;
        background: #fff;
    }

    .with-video {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }
</style>