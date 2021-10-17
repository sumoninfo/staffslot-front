<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card-box">

        <div class="row">
          <div class="col-sm-12">
            <div class="text-center">
              <h4 class="font-600">{{ __('Customer Frequently Asked Questions') }}</h4>
              <p class="text-muted">{{ __('Here are answers to the most frequently asked questions. To contact us') }} <a href="https://www.timeslot.pro/contact/" target="_blank" rel="nofollow">{{ __('click here') }}</a>.</p>

              <a href="https://www.staffslot.com/contact/" target="_blank" rel="nofollow"><button type="button" class="btn btn-success waves-effect waves-light me-2 mt-2">{{ __('Send us your question') }}</button></a>
              <a href="https://twitter.com/staffslotcom" target="_blank" rel="nofollow"><button type="button" class="btn btn-primary waves-effect waves-light mt-2">{{ __('Send us a tweet') }}</button></a>

            </div>
          </div><!-- end col -->
        </div><!-- end row -->

        <div class="row m-t-40">
          <div class="col-md-6">
            <div class="p-20 p-t-0">
              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question" data-wow-delay=".1s">{{ __('What is Time Slot Pro?') }}</h4>
                <p class="answer">{{ __("An easy way to book and pay a Pro's time slots. View their schedule, pic the slot and add it to your calendar.") }}</p>
              </div>

              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('How does it work?') }}</h4>
                <p class="answer">{{ __('Customers search for Pros or select a previously booked pro (My Pros). The customer picks the desired time slot and confirms the booking. The event is emailed to you to add to your calendar and you can view all of your bookings from your Time Slot Pro "My Bookings" dashboard.') }}</p>
              </div>

              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('Do clients have to use their credit card?') }}</h4>
                <p class="answer">{{ __('The Pro sets the accepted payment options per event type. The payments options include cash, credit card and free. If the pro only selects the credit card option, then the customer has to use their credit card to book the time slot.') }}</p>
              </div>

              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('Do clients have to pay for the app?') }}</h4>
                <p class="answer">{{ __('There is no cost for clients to use Time Slot Pro. Clients can book unlimited slots, only paying the Pro.') }}</p>
              </div>

              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('How much does Time Slot Pro cost?') }}</h4>
                <p class="answer">{{ __('The TSP web application is available at low monthly and annual subscription prices. The Monthly subscription is $20/month and the Annual subscription is $180/year.') }}</p>
              </div>

            </div>
          </div>
          <!--/col-md-5 -->

          <div class="col-md-6">
            <div class="p-20 p-t-0">
              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('Who can use Time Slot Pro?') }}</h4>
                <p class="answer">{{ __('TSP is for anyone that sells their time to clients or just wants an easy way for people to schedule time with them.') }}</p>
              </div>

              <!-- Question/Answer -->
              <!-- <div class="faq-box">
                              <h4 class="question">{{ __('Does TSP sync with my calendar?') }}</h4>
                              <p class="answer">{{ __("Time Slot Pro syncs with major calendar applications and instantly sends time slot events to the Pro's calendar. Calendar Sync works with Office 365, Outlook, iCloud, Google and Exhange. For Customers, TSP sends an email invitation that can be added to their personal calendar with one click.") }}</p>
                          </div> -->

              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('Subscription Refunds') }}</h4>
                <p class="answer">{{ __('Please contact us to request a refund for your Pro Subscription. To request a refund with your Pro, please contact them directly.') }}</p>
              </div>

              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('How do I book a Pro?') }}</h4>
                <p class="answer">{{ __('First search for a Pro of select from a list of your previously booked Pros under the "My Pros" tab. View the Pro\'s available time slot list or calendar, select the slot, pay you with a credit card online or select the "pay with cash" option if you have activated that option. That\'s all! You client can book you in 2 easy steps.') }}</p>
              </div>

              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('Can I use Time Slot Pro to book time at a facility and parks?') }}</h4>
                <p class="answer">{{ __('Yes, Time Slot Pro can be used for pretty much anything, including facilities and parks. The park manager would create a calendar for each field, pavailion, batting cage or other type of feature at the park that is book-able. Then park visitors can pick the field at the park, view the available slots for the field and book it online. No more accidental double bookings!') }}</p>
              </div>
            </div>
          </div>
          <!--/col-md-5-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import helpers from '../mixins/helpers'

  export default defineComponent({
    mixins: [ helpers ],
  })
</script>
