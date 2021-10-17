<template>
  <form class="event-form" @submit.prevent="save">
    <div class="errors">
      <div v-for="(error, i) in errors" :key="i">
        <div class="alert alert-danger" v-for="(errorMsg, i) in error" :key="i" v-text="errorMsg"></div>
      </div>
    </div>
    <div class="form-group">
        <label class="event-label">{{ __('Title') }}</label>
        <input class="form-control" placeholder="Enter the event title here" type="text" name="title"  v-model="eventItem.title">
        <small class="text-red">{{ __('Title cannot be empty') }}</small>
    </div>
    <div class="form-group">
        <label class="event-label">{{ __('Description') }}</label>
        <textarea class="form-control" name="description" placeholder="Enter a description about the event here that tells the customer what they can expect with this time slot." v-model="eventItem.description"></textarea>
    </div>
    <div class="form-group">
        <label class="event-label">{{ __('Notes') }}</label>
        <textarea class="form-control" name="notes" placeholder="Include any extra notes about this event, for example: where to meet, where to park, what equipment to bring and for video slots, what angles to include." v-model="eventItem.notes"></textarea>
    </div>
    <div class="form-group" v-if="isVideo">
        <label class="event-label">{{ __('Default Chat Message') }}</label>
        <textarea class="form-control" name="default_chat_message" placeholder="Enter the first message you want customers to see when the book a video slot. This is usually some instruction on the preferred video format and angles for analysis." v-model="eventItem.default_chat_message"></textarea>
    </div>
    <div class="form-group">
        <label class="event-label">{{ __('Cancellation Policy') }}</label>
        <textarea class="form-control" name="cancellation_policy" placeholder="Enter cancellation policy. Example: customer must cancel 24 hours before time slot or you will be charged for this slot." v-model="eventItem.cancellation_policy"></textarea>
    </div>
    <hr/>
    <div v-if="!isVideo" class="form-group">
        <label class="event-label">{{ __('Edit Slots Quantity Deadline') }}</label>
        <div class="checkbox">
            <div class="radio radio-info form-check-inline">
                <input type="radio" id="deadline-radio-yes" value="yes" name="has_deadline" v-model="eventItem.has_deadline">
                <label for="deadline-radio-yes"> {{ __('Yes') }} </label>
            </div>
            <div class="radio radio-info form-check-inline">
                <input type="radio" id="deadline-radio-no" value="no" name="has_deadline" v-model="eventItem.has_deadline">
                <label for="deadline-radio-no"> {{ __('No') }} </label>
            </div>
        </div>
    </div>
    <!-- deadline options-->
    <div class="container" v-if="eventItem.has_deadline=='yes'">
        <div class="form-group form-group mb-1">
            <div class="checkbox">
                <div class="radio radio-info form-check-inline">
                    <input type="radio" id="deadlineType-radio-date" value="datetime" name="deadlineType" v-model="eventItem.deadline_type">
                    <label for="deadlineType-radio-date"> {{ __('Set the date') }} &amp; {{ __('time before event') }} </label>
                </div>
            </div>
        </div>
        <div class="col-12" v-if="eventItem.deadline_type=='datetime'">
            <div class="row">
                <div class="col-5">
                    <select name="deadlineDay" class="form-control" v-model="eventItem.deadline_day">
                        <option value="0">0 {{ __('day before') }}</option>
                        <option value="1">1 {{ __('day before') }}</option>
                        <option value="2">2 {{ __('day before') }}</option>
                        <option value="3">3 {{ __('day before') }}</option>
                    </select>
                </div>
                <h6 class="col-1 text-center">{{ __('at') }}</h6>
                <div class="col-2">
                    <hour-select name="deadlineHour" v-model="eventItem.deadline_hour" :defaultval="eventItem.deadline_hour" start="1" end="12"></hour-select>
                </div>
                <div class="col-2">
                    <minute-select name="deadlineMinute" v-model="eventItem.deadline_minute" :defaultval="eventItem.deadline_minute"></minute-select>
                </div>
                <div class="col-2">
                    <select v-model="eventItem.deadline_section" name="deadlineSection" class="form-control">
                        <option value="am">{{ __('AM') }}</option>
                        <option value="pm">{{ __('PM') }}</option>
                    </select>
                </div>
            </div>
        </div>
        <br />
        <div class="form-group mb-1">
            <div class="checkbox">
                <div class="radio radio-info form-check-inline">
                    <input type="radio" id="deadlineType-radio-time" value="minutes" name="deadlineType" v-model="eventItem.deadline_type">
                    <label for="deadlineType-radio-time"> {{ __('Set amount of time before event') }} </label>
                </div>
            </div>
        </div>
        <div class="col-12" v-if="eventItem.deadline_type=='minutes'">
            <div class="row pb-4">
                <div class="col-4">
                    <input type="number" name="deadlineMinutes" v-model="eventItem.deadline_minutes" class="form-control" />
                </div>
                <div class="col"><h6>{{ __('Minutes before the event') }}</h6></div>
            </div>
        </div>
    </div>
    <!-- deadline options-->
    <hr v-if="!isVideo"/>
    <div class="form-group">
        <label class="event-label">{{ __('Duration (Minutes)') }}</label>
        <input class="form-control" type="text" name="minutes" placeholder="Enter the amount in minutes, using the number only. Example: 45 or 120" v-model="eventItem.minutes">
    </div>
    <hr/>
    <div v-if="!isVideo" class="form-group">
        <label class="event-label">{{ __('Is this a multiple day event?') }} <small class="form-text">({{ __('example: Summer camps, conferences, festivals') }})</small></label>
        <div class="checkbox">
            <div class="radio radio-info form-check-inline">
                <input type="radio" id="multiday-radio-yes" :value="1" name="is_multiday" v-model="eventItem.is_multiday">
                <label for="multiday-radio-yes"> {{ __('Yes') }} </label>
            </div>
            <div class="radio radio-info form-check-inline">
                <input type="radio" id="multiday-radio-no" :value="0" name="is_multiday" v-model="eventItem.is_multiday">
                <label for="multiday-radio-no"> {{ __('No') }} </label>
            </div>
        </div>
    </div>
    <div class="container" v-if="eventItem.is_multiday">
      <div class="form-group form-group mb-1">
        <div class="checkbox">
          <div class="radio radio-info form-check-inline">
            <input type="radio" id="per_day_diff" value="per_day_diff" v-model="eventItem.multiday_type">
            <label for="per_day_diff">{{ __('Per day') }} <small class="form-text" style="display: inline;">({{
                __('each day of the event has a start and end time')
              }})</small></label>
          </div>
        </div>
      </div>
      <div v-if="false" class="form-group form-group mb-1">
        <div class="checkbox">
          <div class="radio radio-info form-check-inline">
            <input type="radio" id="per_day_same" value="per_day_same" v-model="eventItem.multiday_type">
            <label for="per_day_same">{{ __('Per day') }} <small class="form-text" style="display: inline;">({{
                __('same start and end time each day of the event')
              }})</small></label>
          </div>
        </div>
      </div>
      <div class="form-group form-group mb-1">
        <div class="checkbox">
          <div class="radio radio-info form-check-inline">
            <input type="radio" id="ongoing" value="ongoing" v-model="eventItem.multiday_type">
            <label for="ongoing">{{ __('Ongoing') }} <small class="form-text" style="display: inline;">({{
                __('a continuous event over the days selected')
              }})</small></label>
          </div>
        </div>
      </div>
    </div>
    <hr v-if="!isVideo"/>
    <div v-if="!isVideo" class="form-group">
        <label class="event-label">{{ __('Event Slots Quantity') }}</label>
        <input class="form-control" placeholder="How many slots are available for this event?" type="text" name="slots" v-model="eventItem.slots">
        <small class="form-text">({{ __('example: By entering 5, this event will be available for up to 5 people to book') }})</small>
    </div>
    <div class="form-group">
        <label class="event-label">{{ __('Avg Hourly Bill Rate') }}</label>
        <input class="form-control" type="number" name="cost" placeholder="e.g. 15.00 or 5.99" v-model="eventItem.cost">
        <!-- <small class="form-text">{{ __('If the event is free enter 0.') }}</small> -->
    </div>

     <div class="form-group">
        <label class="event-label">{{ __('Avg Hourly Pay Rate') }}</label>
        <input class="form-control" type="number" name="pay_rate" placeholder="e.g. 15.00 or 5.99" v-model="eventItem.pay_rate">
        <!-- <small class="form-text">{{ __('If the event is free enter 0.') }}</small> -->
    </div>

    <div class="form-group">
        <label class="event-label">{{ __('Max slots for person') }}</label> 
        <input class="form-control" type="number" name="cost" v-model.number="eventItem.bookings_per_person">
    </div>
    <hr v-if="!isVideo" />
    <div v-if="!isVideo" class="form-group row">
        <label class="col-8 col-form-label">{{ __('Hide this Event from public and make private.') }}</label>
        <div class="col-4 text-right pr-4">
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="eventItem.is_private" true-value="1" false-value="0">
            </div>
        </div>
    </div>
    <div v-if="!isVideo" class="form-group row">
        <label class="col-8 col-form-label">{{ __('Allow this event to be booked by guest users.') }}</label>
        <div class="col-4 text-right pr-4">
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="eventItem.guest_bookings" true-value="1" false-value="0">
            </div>
        </div>
    </div>
    <hr/>
    <div class="form-group">
      <label class="event-label">{{ __('Slot waiver') }}</label>
      <input class="form-control" placeholder="Enter url for your waiver form..." v-model="eventItem.waiver_url">
      <small class="form-text">({{ __('optional') }})</small>
    </div>
    <div class="form-group">
      <label class="event-label">{{ __('Other doc') }}</label>
      <input class="form-control" placeholder="Enter url for a document you want customers to view..."
             v-model="eventItem.doc_url">
      <small class="form-text">({{ __('optional') }})</small>
    </div>
    <hr/>
    <div v-if="eventItem.cost && eventItem.cost > 0" class="form-group" id="payment_types">
        <label class="event-label">{{ __('Select payment options for this event') }}</label>
        <div class="checkbox">
          <small class="form-text ms-0 mt-0 mb-2" style="display: block;">{{ __('Select "package credits only" if customers are not able to book with cash or credit card for this event type.') }}</small>
        </div>
        <div class="checkbox">
          <input type="checkbox" id="package-only" name="package_only" value="1" v-model="e_package_only" true-value="1" false-value="0">
          <label for="package-only">
              {{ __('Package credits only') }}
          </label>
        </div>
        <div class="checkbox">
          <input type="checkbox" id="checkbox0" name="payment_cash" value="1" v-model="e_payment_cash" true-value="1" false-value="0">
          <label for="checkbox0">
              {{ __('Cash') }}
          </label>
        </div>
        <div class="checkbox">
          <input type="checkbox" id="checkbox1" name="payment_credit_card" value="1" v-model="e_payment_credit_card" :disabled="!enableCreditCard" true-value="1" false-value="0">
          <label for="checkbox1">
              {{ __('Credit card') }}
          </label>
          <small v-show="!enableCreditCard" class='text-danger'>{{ __('to activate credit card payments set up your <a href=\":url\">TSP Connect account<\/a>') }}</small>
        </div>
        <div class="checkbox">
          <input type="checkbox" id="checkbox2" name="payment_club_credit" value="1" v-model="e_payment_club_credit" true-value="1" false-value="0">
          <label for="checkbox2">
              {{ __('Club Credit') }}
          </label>
        </div>
        <small>{{ __('Leave unselected if the event is free') }}</small>
    </div>
    <div class="col-auto">
      <loading-button :loading="loading" type="button" class="btn btn-success" @click="save">{{ __('Save') }}</loading-button>
    </div>
  </form>
</template>

<script>
import axios from 'axios'
import helpers from '../../mixins/helpers.js'

export default {
  mixins: [helpers],

  props: {
    createNew: {
      type: Boolean,
      default: false
    },
    custom: {
      default: false
    },
    isVideo: {
      default: false
    },
    eventdata: {
      default: function () {
        return {
          has_deadline: "no",
          deadline_type: "",
          deadline_minutes: 0,
          deadline_hour: 12,
          deadline_day: 0,
          deadline_minute: 0,
          deadline_section: "am",
          is_multiday: 0,
          multiday_type: 'per_day_diff',
          payment_cash: false,
          payment_club_credit: false,
          payment_credit_card: false,
          package_only: false,
          default_chat_message: '',
          bookings_per_person: null
        };
      }
    },
  },
  created() {
    this.eventItem = this.eventdata
  },
  data() {
    return {
      eventItem: {},
      errors: [],
      enableCreditCard: false,

      e_package_only: false,
      e_payment_cash: false,
      e_payment_club_credit: false,
      e_payment_credit_card: false,
      loading: false
    }
  },
  watch: {
    eventdata(newValue, oldValue) {
      newValue.has_deadline = newValue.has_deadline === 'yes' ||
      newValue.has_deadline === 1 ||
      newValue.has_deadline === true ? 'yes' : 'no';

      this.eventItem = newValue;

      this.e_payment_cash = this.eventItem.payment_cash;
      this.e_payment_club_credit = this.eventItem.payment_club_credit;
      this.e_payment_credit_card = this.eventItem.payment_credit_card;

      if (
        !this.e_package_only &&
        !this.e_payment_cash &&
        !this.e_payment_club_credit &&
        !this.e_payment_credit_card
      ) {
        this.e_package_only = true;
      }
    },

    e_package_only(newValue, oldValue) {
      this.eventItem.package_only = this.e_package_only;

      if (oldValue == false && newValue == true) {
        this.e_payment_cash = false;
        this.e_payment_club_credit = false;
        this.e_payment_credit_card = false;
      }
      this.checkPaymentSelection();
    },
    e_payment_cash(newValue, oldValue) {
      this.eventItem.payment_cash = this.e_payment_cash;

      if (newValue == true) {
        this.e_package_only = false;
      } else {
        this.checkPaymentSelection();
      }
    },
    e_payment_club_credit(newValue, oldValue) {
      this.eventItem.payment_club_credit = this.e_payment_club_credit;

      if (newValue == true) {
        this.e_package_only = false;
      } else {
        this.checkPaymentSelection();
      }
    },
    e_payment_credit_card(newValue, oldValue) {
      this.eventItem.payment_credit_card = this.e_payment_credit_card;

      if (newValue == true) {
        this.e_package_only = false;
      } else {
        this.checkPaymentSelection();
      }
    },
  },
  methods: {
    save() {
      this.errors = [];
      this.loading = true
      axios.post("/api/event/save", {...this.eventItem, is_video: this.isVideo}).then(async response => {
        if (response.data.success) {
          if (this.custom) {
            this.emitter.emit('eventSaved', response.data.event);
            this.loading = false
          } else {
            if (this.$store)
              await this.$store.dispatch('fetchEvents')
            this.loading = false
            if (this.$router) {
              const nextPage = this.isVideo ? '/video/events' : '/event/list'
              this.$store.commit('setFlashMessage', response.data.message)
              this.$router.push(nextPage)
            } else {
              let store = JSON.parse(window.localStorage.vuex)
              store.flashMessage.value = response.data.message
              window.localStorage.setItem('vuex', JSON.stringify(store))

              if (this.isVideo) window.location = '/video/events'
              else window.location = '/event/list'
            }
          }
        } else {
          this.loading = false
          this.errors = response.data.errors;

          //scroll to top
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        }
      });
    },
    checkPaymentSelection() {
      if (
        this.e_package_only == false &&
        this.e_payment_cash == false &&
        this.e_payment_club_credit == false &&
        this.e_payment_credit_card == false
      ) {
        this.e_package_only = true;
      }
    },
  },
  mounted() {
    axios.get("/api/payment-settings/is-connected").then(response => this.enableCreditCard = response.data.status ? true : false);
    this.eventItem = {...this.eventdata};
    this.eventItem.has_deadline = this.eventItem.has_deadline === 'yes' ||
    this.eventItem.has_deadline === 1 ||
    this.eventItem.has_deadline === true ? 'yes' : 'no';

    this.eventItem.custom = this.custom;

    this.e_payment_cash = this.eventItem.payment_cash;
    this.e_payment_club_credit = this.eventItem.payment_club_credit;
    this.e_payment_credit_card = this.eventItem.payment_credit_card;
  }
}
</script>
