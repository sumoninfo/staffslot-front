<template>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="page-title-area">
                <h3 class="">{{ __('CREATE OR EDIT A PACKAGE') }}</h3>
            </div>
            <div class="location-box">

                <div class="form-group row">
                    <label class="col-4 col-sm-2 col-form-label">{{ __('Package name') }}</label>
                    <div class="col-8 col-sm-10">
                        <input tabindex="0" @blur="validatePackageName" type="text" class="form-control"
                               v-model="package.name">
                        <div class="form-control-feedback text-danger" v-if="errorFlags.packageName">
                            {{ __('package name can not be empty') }}
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-4 col-sm-2 col-form-label">{{ __('Package Description') }}</label>
                    <div class="col-8 col-sm-10">
                        <textarea tabindex="1" type="text" class="form-control"
                                  v-model="package.description"></textarea>
                        <div class="form-control-feedback text-danger" v-if="errorFlags.packageDescription">
                            {{ __('provide package description') }}
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-8 col-sm-2 col-form-label">{{ __('Has unlimited credits?') }}</label>
                    <div class="col-4 col-sm-10 text-right">
                        <input type="checkbox" class="form-control js-switch" v-model="package.unlimited">
                    </div>
                </div>
                <div class="form-group row" v-if="!package.unlimited">
                    <label class="col-4 col-sm-2 col-form-label">{{ __('How many credits are included?') }}</label>
                    <div class="col-8 col-sm-10 text-right">
                        <input v-on:change="validateEventLimit" v-on:blur="validateSlotsCount" class="form-control"
                               type="number" v-model="package.slotsCount">
                        <div class="form-control-feedback text-danger" v-if="errorFlags.slotsCount">{{ __('enter valid number of slots')  }}
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-8 col-sm-2 col-form-label">{{ __('Is this a free package?') }}</label>
                    <div class=" col-4 col-sm-10 text-right">
                        <input type="checkbox" class="form-control js-switch" v-model="package.isFree">
                    </div>
                </div>

                <template v-show="!package.isFree">

                    <div class="row">
                        <label class="col-4 col-sm-2 col-form-label">{{ __('Package cost') }}</label>
                        <div class="col-8 col-sm-10 text-right">
                            <input class="form-control" @blur="validateCost" type="number" v-model="package.cost">
                            <div class="form-control-feedback text-danger" v-if="errorFlags.cost">
                                {{ __('enter valid package cost') }}
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <label class="col-3 col-sm-2 col-form-label">{{ __('Payment Option') }}</label>

                        <div v-if="credit_payment_enabled" class="col-3 text-end">
                            <input v-on:change="validatePaymentOption" type="checkbox" id="credi-card-enabled-checkbox"
                                   class="form-control js-switch" v-model="package.creditCardEnabled">
                            <label for="credi-card-enabled-checkbox">{{ __('Credit Card') }}</label>
                        </div>

                        <div class="col-3 text-end">
                            <input v-on:change="validatePaymentOption" type="checkbox" id="cash-enabled-checkbox"
                                   class="form-control js-switch" v-model="package.cashEnabled">
                            <label for="cash-enabled-checkbox">{{ __('Cash') }}</label>
                        </div>

                        <div class="col-3 text-end">
                            <input v-on:change="validatePaymentOption" type="checkbox" id="club-credit-enabled-checkbox"
                                   class="form-control js-switch" v-model="package.clubCreditEnabled">
                            <label for="club-credit-enabled-checkbox">{{ __('Club Credit') }}</label>
                        </div>

                        <div class="col-8" v-if="errorFlags.paymentOption">
                            <p class="text-danger">
                                {{ __('Select at least one payment option') }}
                            </p>
                        </div>

                        <div class="col-8" v-if="!credit_payment_enabled">
                            <small class='text-danger'>({{ __('to activate credit card payments set up your') }} <a
                                    href="{{ route('paymentSettings.setting') }}">{{ __('TSP Connect account') }}</a>)
                            </small>
                        </div>
                    </div>

                </template>

                <div class="form-group row">
                    <label class="col-4 col-sm-4 col-form-label">{{ __('Select Included Event types') }}</label>
                    <div class="col-8 col-sm-8 text-right">
                        <multiselect v-model="package.events" :options="events" :multiple="true" :close-on-select="true"
                                     :clear-on-select="true" :hide-selected="true" :preserve-search="true"
                                     placeholder="Pick some event" label="title" track-by="event_id"
                                     v-on:select="validateEventLimit">
                            <template slot="tag" slot-scope="props">
                            <span class="custom__tag" :class="{'video-event': props.option.event_type == 'video'}">
                                <span><i v-if="props.option.event_type == 'video'" class="fa fa-video-camera"></i> @{{ props.option.title }}</span><span
                                    class="custom__remove" v-on:click="props.remove(props.option)">&times;</span>
                            </span>
                            </template>
                            <template slot="option" slot-scope="props">
                                <span class="option__title"><i v-if="props.option.event_type == 'video'"
                                                               class="fa fa-video-camera"></i> @{{ props.option.title }}</span>
                            </template>
                        </multiselect>
                    </div>
                    <div class="col-12 mt-1">
                        <div class="row">
                            <div class="col-8">
                                <p v-if="validateEvents" class="col text-danger">{{ __('select at least one event type') }}</p>
                            </div>
                            <div class="col-4 text-right">
                                <button @click="selectAllEvent" class="btn btn-primary btn-small mr-1">
                                    {{ __('select all') }}
                                </button>
                                <button @click="clearAllEvent" class="btn btn-secondary btn-small mt-1 mr-1">
                                    {{ __('clear all') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-4">{{ __('Booking Limits') }} <br/>
                        <small>(0 {{ __('is no limit') }})</small>
                    </label><br/>{{ __('Set a max number or credits a customer can use per event type') }}.
                    <div class="col-8">
                        <div v-for="(selectedEvent,key) in package.events" class="row mt-1">
                            <div class="col-6" v-text="selectedEvent.title"></div>
                            <div class="col">
                                <input v-on:change="validateEventLimit" v-model="selectedEvent.limit"
                                       :max="package.slotsCount" type="number" class="form-control">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-12 col-sm-2 col-form-label">{{ __('Select expiration') }}:</label>
                    <div class="row ">
                        <div class="col-4">
                            <div class="col-12">
                                <input id='checkbox-anchorWise' v-on:change="switchExpiryType('anchorWise')"
                                       type="checkbox" class="form-control js-switch"
                                       v-model="package.anchorWise"><label for="checkbox-anchorWise">{{ __('Set # of days/month/year') }}</label>
                            </div>
                            <div class="col-12" v-if="package.anchorWise">
                                <input class="form-control" min="1" type="number" name="anchor_time"
                                       v-model='package.anchorTime'>
                            </div>
                            <div class="col-12" v-if="package.anchorWise">
                                <select v-model='package.anchorType' class="form-control">
                                    <option v-for="anchor in anchorTypes" :value="anchor" v-text="anchor"></option>
                                </select>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="">
                                <input id='checkbox-dateWise' v-on:change="switchExpiryType('dateWise')" type="checkbox"
                                       class="form-control js-switch" v-model="package.dateWise"><label
                                    for="checkbox-dateWise">{{ __('Specific Date') }}</label>
                            </div>
                            <div class="" :class="{'hide':!package.dateWise}">
                                <input type="text" id="expiryDate" class="form-control" name="ExpirationDate"
                                       v-model="package.expiryDate">
                            </div>
                        </div>

                        <div class="col-4">
                            <div class="col-12">
                                <input id='checkbox-noExpiry' v-on:change="switchExpiryType('noExpiry')" type="checkbox"
                                       class="form-control js-switch" v-model="package.noExpiry"><label
                                    for="checkbox-noExpiry">{{ __('No Expiration') }}</label>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-6 col-sm-2">{{ __('How many packages are available for sale?') }}</label>
                    <div class="col-6 text-right">
                        <input type="checkbox" class="form-control js-switch" v-model="package.unlimitedStock"><label
                            class="col-12">{{ __('Unlimited') }}</label>
                        <div :class="{'hide':package.unlimitedStock, 'col-12':true}">
                            <input type="number" min="1" class="form-control" v-model="package.quantity">
                        </div>
                    </div>
                </div>

                <div class="form-group row" :class="{'hide':!package.anchorWise}">
                    <label class="col-8 col-sm-2 col-form-label">{{ __('Does this package renew when expired?') }}</label>
                    <div class="col-4 col-sm-10 text-right">
                        <input type="checkbox" class="form-control js-switch" v-model="package.repeat">
                    </div>
                </div>

                <div class="form-group row" v-if="package.repeat">
                    <label class="col-8 col-sm-2 col-form-label">{{ __('How many times does the package renew?') }} (0 : {{ __('always renew') }})</label>
                    <div class="col-4 col-sm-10 text-right">
                        <input type="number" min="0" class="form-control" v-model="package.repeatRate">
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-8 col-sm-2 col-form-label">{{ __('Hide this package from the public list?') }}</label>
                    <div class="col-4 col-sm-10 text-right">
                        <input type="checkbox" class="form-control js-switch" v-model="package.isHidden">
                    </div>
                </div>

                <div class="form-group row">
                    <button v-on:click="savePackage" type="button" class="btn btn-success" :disabled="ajaxLoading">
                        @{{saveButtonText}} <i v-if="ajaxLoading" class="fa fa-spinner fa-spin"></i></button>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "PackageForm",
        data() {
            return {
                package: {},
                events: {},
                validationFlag: false,
                errorFlags: {},
                anchorTypes: ["days", "weeks", "months", "years"],
                errorMessage: '',
                successMessage: '',
                ajaxLoading: false
            }
        },
    }
</script>

<style type="text/css">
    .hide {
        display: none !important;
    }

    .custom__tag {
        display: inline-block;
        padding: 3px 12px;
        background: #efefef;
        margin-right: 8px;
        margin-bottom: 8px;
        border-radius: 10px;
        cursor: pointer;
    }

    .custom__remove {
        padding: 0;
        font-size: 15px;
        margin-left: 5px;
        color: #aa0000;
    }

    .datepicker > div {
        display: block;
    }

    .form-group.row {
        border: 1px solid #f7f7f7;
        border-radius: 5px;
        padding: 10px;
        background: #fff;
    }
</style>