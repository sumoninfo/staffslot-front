<template>
  <div class="row justify-content-center" v-if="pkg">
    <div class="col-md-8">
      <div class="page-title-area">
        <h3 class="">{{ __('CREATE OR EDIT A PACKAGE') }}</h3>
      </div>
      <div class="location-box">
        <div>
          <div class="form-group row">
            <label class="col-4 col-sm-2 col-form-label">{{ __('Package name') }}</label>
            <div class="col-8 col-sm-10">
              <input
                tabindex="0"
                v-on:blur="validatePackageName"
                type="text"
                class="form-control"
                v-model="pkg.name"
              />
              <div
                class="form-control-feedback text-danger"
                v-if="errorFlags.packageName"
              >
                {{ __('package name can not be empty') }}
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-4 col-sm-2 col-form-label"
              >{{ __('Package Description') }}</label
            >
            <div class="col-8 col-sm-10">
              <textarea
                tabindex="1"
                type="text"
                class="form-control"
                v-model="pkg.description"
              ></textarea>
              <div
                class="form-control-feedback text-danger"
                v-if="errorFlags.packageName"
              >
                {{ __('provide package description') }}
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-8 col-sm-2 col-form-label">
              {{ __('Has unlimited credits?') }}
            </label>
            <div class="col-4 col-sm-10">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="pkg.unlimited">
              </div>
            </div>
          </div>
          <div class="form-group row" v-if="!pkg.unlimited">
            <label class="col-4 col-sm-2 col-form-label">
             {{ __('How many credits are included?') }}
            </label>
            <div class="col-8 col-sm-10">
              <input
                v-on:change="validateEventLimit"
                v-on:blur="validateSlotsCount"
                class="form-control"
                type="number"
                v-model="pkg.slotsCount"
              />
              <div
                class="form-control-feedback text-danger"
                v-if="errorFlags.slotsCount"
              >
                {{ __('enter valid number of slots') }}
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-8 col-sm-2 col-form-label"
              >{{ __('Is this a free package?') }}</label
            >
            <div class="col-4 col-sm-10 text-end">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="pkg.isFree">
              </div>
            </div>
          </div>
          <template v-if="!pkg.isFree">
            <div class="row">
              <label class="col-4 col-sm-2 col-form-label">{{ __('Package cost') }}</label>
              <div class="col-8 col-sm-10 text-right">
                <input
                  class="form-control"
                  @blur="validateCost"
                  type="number"
                  v-model="pkg.cost"
                  step=".01"
                />
                <div
                  class="form-control-feedback text-danger"
                  v-if="errorFlags.cost"
                >
                  {{ __('enter valid package cost') }}
                </div>
              </div>
            </div>
            <div class="row">
              <label class="col-3 col-sm-2 col-form-label">
                {{ __('Payment Option') }}
              </label>
              <div v-if="credit_payment_enabled" class="col-3 text-end">
                <div class="form-check form-switch">
                  <input
                    id="credi-card-enabled-checkbox"
                    @change="validatePaymentOption"
                    class="form-check-input"
                    type="checkbox"
                    v-model="pkg.creditCardEnabled"
                    true-value="1" false-value="0"
                    style="float: right"
                  >
                </div>
                <label for="credi-card-enabled-checkbox">{{ __('Credit Card') }}</label>
              </div>
              <div class="col-3 text-end">
                <div class="form-check form-switch">
                  <input
                    @change="validatePaymentOption"
                    type="checkbox"
                    id="cash-enabled-checkbox"
                    class="form-check-input"
                    v-model="pkg.cashEnabled"
                    true-value="1" false-value="0"
                    style="float: right"
                  />
                </div>
                <label for="cash-enabled-checkbox">{{ __('Cash') }}</label>
              </div>
              <div class="col-3 text-end">
                <div class="form-check form-switch">
                  <input
                    @change="validatePaymentOption"
                    type="checkbox"
                    id="club-credit-enabled-checkbox"
                    class="form-check-input"
                    v-model="pkg.clubCreditEnabled"
                    true-value="1" false-value="0"
                    style="float: right"
                  />
                </div>
                <label for="club-credit-enabled-checkbox">{{ __('Club Credit') }}</label>
              </div>
              <div class="col-8" v-if="errorFlags.paymentOption">
                <p class="text-danger">{{ __('Select at least one payment option') }}</p>
              </div>
              <div class="col-8" v-if="!credit_payment_enabled">
                <small class="text-danger"
                  >({{ __('to activate credit card payments set up your <a href=\":url\">TSP Connect account<\/a>') }})
                </small>
              </div>
            </div>
          </template>
          <div class="form-group row">
            <label class="col-4 col-sm-4 col-form-label">
              {{ __('Select Included Event types') }}
            </label>
            <div class="col-8 col-sm-8 text-end">
              <multiselect
                v-model="pkg.events"
                :options="events"
                :multiple="true"
                :close-on-select="true"
                :clear-on-select="true"
                :hide-selected="true"
                :preserve-search="true"
                placeholder="Pick some event"
                label="title"
                track-by="event_id"
                v-on:select="validateEventLimit"
              >
                <template v-slot:tag="props">
                  <span
                    class="custom__tag"
                    :class="{
                      'video-event': props.option.event_type == 'video',
                    }"
                  >
                    <span>
                      <i
                        v-if="props.option.event_type == 'video'"
                        class="fa fa-video-camera"
                      ></i>
                      <i
                        v-if="props.option.event_type == 'product'"
                        class="fa fa-truck"
                      ></i>
                      {{ props.option.title }}
                    </span>
                    <span
                      class="custom__remove"
                      v-on:click="props.remove(props.option)"
                      >&times;</span
                    >
                  </span>
                </template>
                <template v-slot:option="props">
                  <span class="option__title">
                    <i
                      v-if="props.option.event_type == 'video'"
                      class="fa fa-video-camera"
                    ></i>
                    <i
                      v-if="props.option.event_type == 'product'"
                      class="fa fa-truck"
                    ></i>
                    {{ props.option.title }}
                  </span>
                </template>
              </multiselect>
            </div>
            <div class="col-12 mt-1">
              <div class="row">
                <div class="col-8">
                  <p v-if="validateEvents" class="col text-danger">
                    {{ __('select at least one event type') }}
                  </p>
                </div>
                <div class="col-4 text-end">
                  <button
                    v-on:click="selectAllEvent"
                    class="btn btn-primary btn-small mt-1 me-1"
                  >
                    {{ __('select all') }}
                  </button>
                  <button
                    v-on:click="clearAllEvent"
                    class="btn btn-secondary btn-small mt-1 me-1"
                  >
                    {{ __('clear all') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-4">
              {{ __('Booking Limits') }}
              <br />
              <small>(0 {{ __('is no limit') }})</small>
            </label>
            <br />
            {{ __('Set a max number or credits a customer can use per event type') }}.
            <div class="col-8">
              <div
                v-for="(selectedEvent, key) in pkg.events"
                :key="key"
                class="row mt-1"
              >
                <div class="col-6" v-text="selectedEvent.title"></div>
                <div class="col">
                  <input
                    v-on:change="validateEventLimit"
                    v-model="selectedEvent.limit"
                    :max="pkg.slotsCount"
                    type="number"
                    class="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-12 col-sm-2 col-form-label">
              {{ __('Select expiration') }}:
            </label>
            <div class="row">
              <div class="col-4">
                <div class="col-12">
                  <div class="form-check form-switch">
                    <input
                      id="checkbox-anchorWise"
                      v-on:change="switchExpiryType('anchorWise')"
                      type="checkbox"
                      class="form-check-input"
                      v-model="pkg.anchorWise"
                    />
                  </div>
                  <label class="ps-0" for="checkbox-anchorWise">
                    {{ __('Set # of days/month/year') }}
                  </label>
                </div>
                <div class="col-12" v-if="pkg.anchorWise">
                  <input
                    class="form-control"
                    min="1"
                    type="number"
                    name="anchor_time"
                    v-model="pkg.anchorTime"
                  />
                </div>
                <div class="col-12" v-if="pkg.anchorWise">
                  <select v-model="pkg.anchorType" class="form-control">
                    <option
                      v-for="(anchor, key) in anchorTypes"
                      :key="key"
                      :value="anchor"
                      v-text="anchor"
                    ></option>
                  </select>
                </div>
              </div>
              <div class="col-4">
                <div class="form-check form-switch">
                  <input
                    id="checkbox-dateWise"
                    v-on:change="switchExpiryType('dateWise')"
                    type="checkbox"
                    class="form-check-input"
                    v-model="pkg.dateWise"
                  />
                </div>
                <label class="ps-0" for="checkbox-dateWise">{{ __('Specific Date') }}</label>
                <div class="" v-if="pkg.dateWise">
                  <input
                    type="text"
                    id="expiryDate"
                    class="form-control"
                    name="ExpirationDate"
                    v-model="pkg.expiryDate"
                  />
                </div>
              </div>
              <div class="col-4">
                <div class="col-12">
                  <div class="form-check form-switch">
                    <input
                      id="checkbox-noExpiry"
                      v-on:change="switchExpiryType('noExpiry')"
                      type="checkbox"
                      class="form-check-input"
                      v-model="pkg.noExpiry"
                    />
                  </div>
                  <label class="ps-0" for="checkbox-noExpiry">{{ __('No Expiration') }}</label>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-6 col-sm-2"
              >{{ __('How many packages are available for sale?') }}</label
            >
            <div class="col-6 text-start">
              <div class="form-check form-switch">
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="pkg.unlimitedStock"
                />
                <label v-if="!pkg.unlimitedStock" class="col-12 m-0 ps-3">{{ __('Unlimited') }}</label>
                <input
                  v-else
                  type="number"
                  min="1"
                  class="form-control ps-2"
                  style="display: inline-table;margin-left: 20px;width: 100px;"
                  v-model="pkg.quantity"
                />
              </div>
            </div>
          </div>
          <div class="form-group row" v-if="pkg.anchorWise">
            <label class="col-6 col-sm-2"
              >{{ __('Does this package renew when expired?') }}</label
            >
            <div class="col-6 text-start">
              <div class="form-check form-switch" style="float: left">
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="pkg.repeat"
                />
              </div>
            </div>
          </div>
          <div class="form-group row" v-show="pkg.repeat">
            <label class="col-md-2 col-sm-12 col-form-label">
              {{ __('How many times does the package renew?') }}
            </label>
            <div class="col-md-10 col-sm-12">
              <div class="row">
                <div class="col-4">
                  <div class="form-check form-switch">
                    <input
                      type="checkbox"
                      id="always-renew-checkbox"
                      class="form-check-input"
                      v-model="alwaysRenew"
                    />
                    <label for="always-renew-checkbox" class="col-12 m-0 ps-3" v-if="alwaysRenew">{{ __('Always') }}</label>
                    <input
                      v-else
                      type="number"
                      min="0"
                      class="form-control"
                      style="display: inline-table;margin-left: 20px;width: 100px;"
                      v-model="pkg.repeatRate"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-8 col-sm-2 col-form-label">
              {{ __('Hide this package from the public list?') }}
            </label>
            <div class="col-4 col-sm-10 text-end">
              <div class="form-check form-switch">
                <input
                  type="checkbox"
                  class="form-check-input"
                   style="float: left"
                  v-model="pkg.isHidden"
                />
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-4 col-sm-2 col-form-label">{{
              __("Waiver")
            }}</label>
            <div class="col-8 col-sm-10">
              <input
                class="form-control"
                placeholder="Enter url for your waiver form..."
                v-model="pkg.waiver_url"
              />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-4 col-sm-2 col-form-label">{{
              __("Other doc")
            }}</label>
            <div class="col-8 col-sm-10">
              <input
                class="form-control"
                placeholder="Enter url for a document you want customers to view..."
                v-model="pkg.doc_url"
              />
            </div>
          </div>
          <div class="form-group row">
            <button
              v-on:click="savePackage"
              type="button"
              class="btn btn-success"
              :disabled="ajaxLoading"
            >
              {{ saveButtonText }}
              <i v-if="ajaxLoading" class="fa fa-spinner fa-spin"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
import { defineComponent } from 'vue'
import helpers from '../../mixins/helpers'

export default defineComponent({
  name: 'AddPackage',
  mixins: [ helpers ],
  data () {
    return {
      pkg: null,
      events: null,
      credit_payment_enabled: null,
      validationFlag: false,
      errorFlags: {
        packageName: false,
        slotsCount: false,
        cost: false,
        events: true,
        paymentOption: false,
      },
      anchorTypes: null,
      errorMessage: '',
      successMessage: '',
      ajaxLoading: false,
      previousRecurring: false,
      alwaysRenew: false,
    }
  },

  watch: {
    alwaysRenew(newVal) {
      if (newVal) {
        this.pkg.repeatRate = -1;
      } else {
        this.pkg.repeatRate = 1;
      }
    }
  },

  computed: {
    packageId() {
      return this.$route.params.packageId
    },
    validateEvents: function validateEvents() {
      return this.validateEventsCall();
    },

    saveButtonText: function saveButtonText() {
      if (typeof this.pkg.id != 'undefined' && this.pkg.id > 0) {
        return "Save Package";
      } else {
        return "Create Package";
      }
    },
  },

  methods: {
    validateEventLimit: function validateEventLimit() {
      this.pkg.events = this.pkg.events.map((event) => {
        let limit = parseInt(event.limit);

        if (limit > this.pkg.slotsCount) {
          event.limit = this.pkg.slotsCount;
        }

        if (limit <= 0) {
          event.limit = 0;
        }

        if (typeof limit == 'undefined') {
          event.limit = 0;
        }
        return event;
      });
    },

    switchExpiryType: function switchExpiryType(_type) {
      if (_type == "anchorWise") {
        if (this.pkg.anchorWise) {
          if (this.pkg.dateWise) {
            $("#checkbox-dateWise").trigger("click");
          }
          if (this.pkg.noExpiry) {
            $("#checkbox-noExpiry").trigger("click");
          }
        }
      } else if (_type == "dateWise") {
        if (this.pkg.dateWise) {
          if (this.pkg.anchorWise) {
            $("#checkbox-anchorWise").trigger("click");
          }
          if (this.pkg.noExpiry) {
            $("#checkbox-noExpiry").trigger("click");
          }
        }
      } else {
        if (this.pkg.noExpiry) {
          if (this.pkg.dateWise) {
            $("#checkbox-dateWise").trigger("click");
          }
          if (this.pkg.anchorWise) {
            $("#checkbox-anchorWise").trigger("click");
          }
        }
      }

      if (!this.pkg.anchorWise && !this.pkg.dateWise && !this.pkg.noExpiry) {
        $("#checkbox-noExpiry").trigger("click");
      }
    },

    selectAllEvent: function selectAllEvent() {
      this.pkg.events = this.events;
    },

    clearAllEvent: function clearAllEvent() {
      this.pkg.events = [];
    },

    validateEventsCall: function validateEventsCall() {
      if (this.pkg.events.length < 1) {
        this.errorFlags.events = true;
      } else {
        this.errorFlags.events = false;
      }
      return this.errorFlags.events;
    },

    validatePackageName: function validatePackageName() {
      if (typeof this.pkg.name == 'undefined' || this.pkg.name == "") {
        this.errorFlags.packageName = true;
      } else {
        this.errorFlags.packageName = false;
      }
    },

    validateSlotsCount: function validateSlotsCount() {
      if (this.pkg.unlimited) {
        this.errorFlags.slotsCount = false;
      } else if (typeof this.pkg.slotsCount == 'undefined' || this.pkg.slotsCount < 1) {
        this.errorFlags.slotsCount = true;
      } else {
        this.errorFlags.slotsCount = false;
      }
    },

    validateCost: function validateCost() {
      if (this.pkg.isFree) {
        this.errorFlags.cost = false;
      } else if (typeof this.pkg.cost == 'undefined' || this.pkg.cost < 1) {
        this.errorFlags.cost = true;
      } else {
        this.errorFlags.cost = false;
      }
    },

    validatePaymentOption: function validatePaymentOption() {
      if (!this.pkg.cashEnabled && !this.pkg.creditCardEnabled && !this.pkg.clubCreditEnabled) {
        this.errorFlags.paymentOption = true;
      } else {
        this.errorFlags.paymentOption = false;
      }
    },

    async savePackage() {
      if (this.ajaxLoading) {
        return;
      }

      this.successMessage = "";
      this.errorMessage = "";
      if (this.validateForm()) {
        window.scrollTo(0, 0);
        return false;
      }

      this.ajaxLoading = true;

      const response = await axios.post("/api/package/save", { package: this.pkg })
      if (response.data.result) {
        if (!this.packageId) {
          this.$store.commit('setFlashMessage', this.__('Package added successfully'))
        } else {
          this.$store.commit('setFlashMessage', this.__('The package was successfully updated'))
        }
        this.$router.push({ name: 'packageDashboard' })
        this.$store.dispatch('fetchPackages')
      } else {
        this.ajaxLoading = false;
        this.$store.commit('pushError', response.data.message)
        window.scrollTo(0, 0);
      }
    },

    validateForm: function validateForm() {
      this.validatePackageName();
      this.validateSlotsCount();
      this.validateCost();
      this.validatePaymentOption();
      return this.errorFlags.packageName || this.errorFlags.slotsCount || this.errorFlags.cost || this.errorFlags.events || this.errorFlags.paymentOption;
    }
  },

  async mounted() {
    const fill = (response) => {
      this.pkg = response.data.package
      this.events = response.data.events
      this.credit_payment_enabled = response.data.credit_payment_enabled
      this.anchorTypes = response.data.anchorTypes
      this.previousRecurring = this.pkg.repeat;
      this.alwaysRenew = this.pkg.repeatRate < 0;
      this.events.map(x => { x.limit = x.limit || 0 });
    }
    if (!this.packageId) {
      const response = await axios('/api/package/create');
      fill(response)
    } else {
      const response = await this.$store.dispatch('callApi', {
        method: 'get',
        url: `/api/package/edit/${this.packageId}`,
      });

      if (response.data.success) {
        fill(response)
      }
    }

    // var currentDate = new Date();

    // $("#expiryDate").datepicker({
    //   timepicker: false,
    //   format: 'mm/dd/yyyy',
    //   startDate: currentDate,
    // }).on("changeDate", () => {
    //   this.pkg.expiryDate = $('#expiryDate').val()
    // });

    // if (!this.pkg.expiryDate) {
    //   $("#expiryDate").datepicker("setDate", currentDate);
    // }
  }
});
</script>
