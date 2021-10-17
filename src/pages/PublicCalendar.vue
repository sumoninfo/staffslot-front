<template>
  <div class="row">
    <div class="col-md-1"></div>
    <div class="col-md-10">
      <div class="page-title-area" v-if="account">
        <h1>{{ account.full_name }} {{ __('Time Slot Calendar') }}</h1>
        <p>{{ __('Browse and book time slots.') }}
          <a
            data-bs-toggle="collapse"
            href="#collapseExample"
            aria-expanded="false"
            aria-controls="collapseExample">{{ __('Click to learn more about the calendar') }}
          </a>.
        </p>
        <div class="collapse" id="collapseExample">
          <p>{{ __('The blue blocks and the white blocks with "+" signs represent times slots you can book with the pro. Click on the block to view a summary of the time slot. Click the "Book this slot" button for the complete details and to book.') }}</p>
        </div>
      </div>
      <div class="card-box" style="position: relative;">
        <Preloader v-if="loading" style="position: absolute;right: 10px;display: block;width: auto;top: 10px;"/>
        <FullCalendar
          ref="fullCalendar"
          :options="calendarOptions"
        />
        <Modal
          :isVisible="showModal"
          @close="showModal = !showModal"
        >
          <template v-slot:header>
              <strong>{{ __('Event details') }}</strong>
          </template>
          <div class="col-12">
              <label>{{ __('Event') }}</label>
              <p>{{ activeEventTitle }}</p>
              <label>{{ __('Description') }}</label>
              <p>{{ activeEvent?.description }}</p>
              <label>{{ __('Location') }}</label>
              <p>{{ activeEvent?.location_place }} ({{ activeEvent?.location_address }})</p>
              <label>{{ __('Date') }}</label>
              <p>{{ activeEvent?.description }}</p>
              <label>{{ __('Time') }}</label>
              <p>{{ activeEvent?.time }}</p>
              <label>{{ __('Cost') }}</label>
              <p>{{ activeEvent?.cost }}</p>
              <label>{{ __('Bookings') }}</label>
              <p>{{ activeEvent?.used_slots }} / {{ activeEvent?.slots }}</p>
              <hr>
              <br>
              <div v-if="activeEvent?.bookings.length" class="row">
                  <div
                      v-for="(book, index) in activeEvent?.bookings"
                      :key="book.booking_id"
                      class="col-12 p-0"
                  >
                      <div class="card">
                          <div class="row h6 pt-1">
                              <div class="col-2">
                                  <span class="label label-success px-2">
                                      {{ index + 1}}
                                  </span>
                              </div>
                              <div class="col-auto text-primary">
                                  <span>{{ book.user.account.full_name }}</span>
                              </div>
                              <div class="col text-end">
                                  <span class="payment-type payment-status-link label label-danger">
                                      {{ book.payment_status.type }} - {{ book.payment_status.paid }}
                                  </span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <template v-slot:footer>
              <button @click="$router.push({ name: 'bookSlot', params: { id: activeEvent.slot_id }})" class="btn-primary btn">{{ __('View details') }}</button>
              <button @click="showModal = !showModal" class="btn-white btn">{{ __('Close') }}</button>
          </template>
        </Modal>
      </div>
    </div>
    <div class="col-md-1"></div>
  </div>
</template>

<script>
  import moment from 'moment-timezone'
  import axios from 'axios'
  import helpers from '../mixins/helpers.js'
  import '@fullcalendar/core/vdom'
  import FullCalendar from '../../node_modules/@fullcalendar/vue3'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import interactionPlugin from '@fullcalendar/interaction'
  import Modal from '../components/Modal.vue'
  import Preloader from '../components/Preloader.vue'

  export default ({
    name: 'PublicCalendar',
    mixins: [ helpers ],
    components: {
      FullCalendar,
      Modal,
      Preloader
    },
      data () {
      return {
        showModal: false,
        loading: false,
        updating: false,
        activeEventTitle: null,
        activeEvent: null,
        prevQuery: null,
        account: null,
        calendarOptions: {
          customButtons: {
              prev: {
                  click: () => {
                      this.$refs.fullCalendar.getApi().prev();
                      this.getSlots(this.public_id, ...this.makeDates())
                  }
              },
              next: {
                  click: () => {
                      this.$refs.fullCalendar.getApi().next();
                      this.getSlots(this.public_id, ...this.makeDates())
                  }
              }
          },
          headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: ''
          },
          plugins: [ dayGridPlugin, interactionPlugin ],
          initialView: 'dayGridMonth',
          eventClick: this.handlerEventClick,
          events: [],
          dayMaxEventRows: true,
        }
      }
    },
    computed: {
      public_id () {
          return this.$route.params.publicId
      },
      user () {
          return this.$store.state.user
      },
      prosName() {
          return this.$route.query.prosName
      },
    },
    mounted () {
      this.$nextTick(() => {
          const dates = this.makeDates()
          this.getSlots(this.public_id, ...dates)
      })
    },
    methods: {
      handlerEventClick (arg) {
        this.activeEvent = arg.event._def.extendedProps
        this.activeEventTitle = arg.event._def.title
        this.showModal = true
      },
      makeDates() {
          const activeRange = this.$refs.fullCalendar.getApi().getCurrentData().dateProfile.activeRange
          return [
              moment(activeRange.start).format("YYYY-MM-DD"),
              moment(activeRange.end).format("YYYY-MM-DD")
          ]
      },
      async getSlots (publickId, fromDate, toDate) {
        this.loading = true

        if (this.prevQuery)
            clearTimeout(this.prevQuery)

        this.prevQuery = setTimeout(async () => {
            const response = await axios.get('/api/calendar/public-slots', {
                params: {
                    public_id: publickId,
                    from_date: fromDate,
                    to_date: toDate,
                }
            })
            this.account = response.data.account
            this.calendarOptions.events = response.data.slots
            this.calendarOptions.events.forEach(item => {
                Object.assign(item, {
                    display: 'block',
                    className: item.bookings && item.bookings !== item.slots ? 'bg-orange'
                    : item.bookings < item.slots
                        ? 'bg-primary'
                        : 'bg-danger',
                })
            })
            this.loading = false
        }, 500)
      }
    }
  })
</script>