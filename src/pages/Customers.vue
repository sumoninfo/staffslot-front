<template>
  <h3>{{ __('My Customers') }}</h3>
  <div class="row">
    <div class="col-12 text-left">
      <p><a data-bs-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"><i class="fa fa-play-circle-o" aria-hidden="true"></i> {{ __('"My Customers" Tutorial') }}</a> | <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link"><i class="fa fa-support" aria-hidden="true"></i> <span class="button-text">{{ __('Support') }}</span></a></p>
      <div class="collapse" id="collapseExample">
        <p>{{ __('Manage your customers payment status, review their booking history, see when customers last booked a slot and keep track of overall revenue per customer') }}.</p>
        <div class="row">
          <div class="col-md-6 col-sm-12">
            <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
              <iframe src="https://www.youtube.com/embed/4pRq9TkE0vs?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
            </div>
          </div>
          <div class="col-md-6 col-sm-12">
            <div class="plyr__video-embed" id="player" style="margin-bottom: 20px;">
              <iframe src="https://www.youtube.com/embed/Aqcx1NuSsGs?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
            </div>
          </div>
        </div>
        <p>{{ __('This is a great feature if you repeat the same types of events.  Events, location and time are 3 independent features.') }}</p>
        <p><strong>{{ __('Event example') }}:</strong> {{ __('Baseball Hitting lesson that is 1-hour, has 4 slots and costs $20 per slot.') }}</p>
        <p>{{ __('Click on the "Create a New Event" button to get started or select an existing event to add it to your calendar.') }} <a href="https://www.timeslot.pro/support/" target="_blank" class="support-link"><i class="fa fa-support" aria-hidden="true"></i><span class="button-text"> {{ __('Contact Support') }}</span></a></p>
      </div>
    </div>
  </div>
  <p>{{ __('Customers that have booked a Time Slot.') }}</p>
  <div id="app">
    <pro-customer-list></pro-customer-list>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import helpers from '../mixins/helpers.js';

export default defineComponent({
  name: 'Customers',
  mixins: [ helpers ]
});
</script>
