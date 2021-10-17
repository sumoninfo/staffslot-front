<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card-box">

        <div class="row">
          <div class="col-sm-12">
            <div class="text-center">
              <h4 class="font-600">{{ __('Pro Frequently Asked Questions') }}</h4>
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
                <p class="answer">{{ __('An easy way for Pros to schedule their time slots and a quick way for clients to book and pay for your time.') }}</p>
              </div>

              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('How does it work?') }}</h4>
                <p class="answer">{{ __('Pros create events and add them to their calendar. Clients then visit the calendar, select an event time slot, book the slot and pay online.') }}</p>
              </div>

              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('Do I have to the United States?') }}</h4>
                <p class="answer">{{ __('TSP is a global web app that can be used anywhere. However, to use the credit card payment option, you must use a bank account in the United States of America.') }}</p>
              </div>

              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('Do clients have to use their credit card?') }}</h4>
                <p class="answer">{{ __('Clients do not have to use credit card. The Pro selects their accepted payment options per event type, includeing: cash, credit card and free.') }}</p>
              </div>

              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('Do clients have to pay for the app?') }}</h4>
                <p class="answer">{{ __('There is no cost for your clients to use Time Slot Pro. They can book unlimited slots, only paying the Pro.') }}</p>
              </div>

              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('How much does Time Slot Pro cost?') }}</h4>
                <p class="answer">{{ __('TSP is a software as a service with low monthly and annual subscription options. The Monthly subscription is $20/month and the Annual subscription is $15/month.') }}</p>
              </div>

              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('How much are the credit card fees?') }}</h4>
                <p class="answer">{{ __('TSP charges a low 2% credit card convenience fee in addition to the standard rate of 2.75% + $0.30 per transaction. Total fee (TSP+Standard) is 4.75% + $0.30 per transaction. The standard rate is paid directly to the credit card company and what the Pro would be paying with online credit cards if used. TSP only adds the very low rate of 2% to help cover the expense of maintaining secured online transactions.') }}</p>
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
                              <h4 class="question">{{ __('Does TSP sync with my existing calendar?') }}</h4>
                              <p class="answer">{{ __('Yes, Time Slot Pro syncs with major calendar applications and instantly sends the time slot events to your calendar. Calendar Sync works with Office 365, Outlook, iCloud, Google and Exhange.') }}</p>
                          </div> -->

              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('Subscription Refunds') }}</h4>
                <p class="answer">{{ __('Please contact us to request a refund for your Pro Subscription. To request a refund with your Pro, please contact them directly.') }}</p>
              </div>

              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('How does a client book me?') }}</h4>
                <p class="answer">{{ __('First you create the event, add a location to it if relevant, then add a time slot on your calendar for that event. 3 quick steps is all it takes. Next, your client will select that event and pay you with a credit card online or select the "pay with cash" option if you have activated that option. That\'s all! You client can book you in 2 easy steps.') }}</p>
              </div>

              <!-- Question/Answer -->
              <div class="faq-box">
                <h4 class="question">{{ __('Does Time Slot Pro also work for facilities and parks?') }}</h4>
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
