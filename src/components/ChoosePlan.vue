<template>
  <div class="row">
    <loading-overlay></loading-overlay>
    <div class="col-lg-12">
      <ul class="nav nav-tabs navtab-bg nav-justified">
        <li class="nav-item">
          <a href="#yrpricing" data-bs-toggle="tab" aria-expanded="true" class="nav-link active active-pricing-tab">
            {{ __('Annual Pricing') }}
          </a>
        </li>
        <li class="nav-item">
          <a href="#mopricing" data-bs-toggle="tab" aria-expanded="false" class="nav-link  active-pricing-tab">
            {{ __('Monthly Pricing') }}
          </a>
        </li>
      </ul>
    </div>
    <div class="col-lg-12"><br></div>
    <div class="tab-content">
      <div class="tab-pane active" id="yrpricing">
        <div class="row">
          <div class="col-md-3 pro-starter">
            <div class="price_card text-center">
              <a href="/subscription/select/">
                <div class="pricing-header bg-pro-plus">
                  <span class="name">{{ __('Pro Starter') }}</span>
                  <span class="price">$15<span class="term">/{{__('mo')}}</span></span>
                  <span class="subname">{{ __('paid annually at ') }}$180/{{__('yr')}}</span><br>
                  <stripe-plan-button title="Pro Starter" :amount="18000" plan-id="14">
                    <span class="btn btn-sub w-md waves-effect waves-light">{{ __('Get Started') }}</span>
                  </stripe-plan-button>
                </div>
              </a>
              <ul class="price-features">
                <li>{{ __('Unlimited Event Types') }}</li>
                <li>{{ __('Unlimited Locations') }}</li>
                <li>{{ __('Unlimited Time Slots') }}</li>
                <li>{{ __('Video Slots feature') }}</li>
                <li>{{ __('Multi-Day Events') }}</li>
                <li>{{ __('SMS Text & Email Alerts') }}</li>
                <li>{{ __('SMS Text & Email Invites') }}</li>
                <li>{{ __('Custom Packages & Credits') }}</li>
                <li>{{ __('Custom Calendar URL') }}</li>
                <li>{{ __('Directory Listing') }}</li>
                <li>2 {{ __('hours video converting per month') }}</li>
                <li>200 {{ __('SMS Credits per month') }}</li>
                <li>{{ __('and much more') }}...</li>
                <li>{{ __('Save when your pay for the year') }}</li>
              </ul>
              <stripe-plan-button title="Pro Starter" :amount="18000" plan-id="14">
                <a href="/subscription/select/" class="btn btn-pink w-md waves-effect waves-light">{{ __('Get Started') }}</a>
              </stripe-plan-button>
            </div>
          </div>
          <div class="col-md-3 pro-plus">
            <div class="price_card text-center">
              <a href="/subscription/select/#pro-plus">
                <div class="pricing-header bg-purple">
                  <span class="name">{{ __('Pro Plus') }}</span>
                  <span class="price">$25<span class="term">/{{ __('mo') }}</span></span>
                  <span class="subname">{{ __('paid annually at') }}$300/{{ __('yr') }}</span><br>
                  <stripe-plan-button title="Pro Plus" :amount="30000" plan-id="16">
                    <span class="btn btn-sub w-md waves-effect waves-light">{{ __('Get Started') }}</span>
                  </stripe-plan-button>
                </div>
              </a>
              <ul class="price-features">
                <li><strong>{{ __("Manage your Team's Slots!") }}</strong></li>
                <li><strong>{{ __('Manage up to') }} 3 {{ __('Pro Accounts') }}</strong></li>
                <li><strong>{{ __('Video Slots Feature!') }}</strong></li>
                <li><strong>{{ __('Video Subscriptions Feature!') }}</strong></li>
                <li>{{ __('Add/Edit/Delete')}} {{ __('Locations') }}</li>
                <li>{{ __('Add/Edit/Delete') }} {{ __('Events') }}</li>
                <li>{{ __('Add/Edit/Delete') }} {{ __('Slots') }}</li>
                <li>{{ __('View Time Slot History') }}</li>
                <li>{{ __('All Pro Plus features') }}</li>
                <li>{{ __('Account Support Rep') }}</li>
                <li>500 {{ __('SMS Credits per month') }}</li>
                <li>{{ __('Save when your pay for the year') }}</li>
                <li>5 {{ __('hours of video converting per month') }}</li>
              </ul>
              <stripe-plan-button title="Pro Plus" :amount="30000" plan-id="16">
                <a href="/subscription/select/#pro-plus" class="btn btn-pink w-md waves-effect waves-light ">{{ __('Get Started') }}</a>
              </stripe-plan-button>
            </div>
          </div>
          <div class="col-md-3 pro-business">
            <div class="price_card text-center">
              <a href="/subscription/select/#pro-business">
                <div class="pricing-header bg-dark">
                  <span class="name">{{ __('Pro Business') }}</span>
                  <span class="price">$55<span class="term">/{{ __('mo') }}</span></span>
                  <span class="subname">{{ __('paid annually at') }} $660/{{ __('yr') }}</span><br>
                  <stripe-plan-button title="Pro Business" :amount="66000" plan-id="18">
                    <span class="btn btn-sub w-md waves-effect waves-light">{{ __('Get Started') }}</span>
                  </stripe-plan-button>
                </div>
              </a>
              <ul class="price-features">
                <li><strong>{{ __("Manage your Team's Slots!") }}</strong></li>
                <li><strong>{{ __('Manage up to') }} 25 {{ __('Pro Accounts') }}</strong></li>
                <li><strong>{{ __('Video Slots Feature!') }}</strong></li>
                <li><strong>{{ __('Video Subscriptions Feature!') }}</strong></li>
                <li>{{ __('Add/Edit/Delete ') }} {{ __('Locations') }}</li>
                <li>{{ __('Add/Edit/Delete ') }}  {{ __('Events') }}</li>
                <li>{{ __('Add/Edit/Delete ') }} {{ __('Slots') }}</li>
                <li>{{ __('View Time Slot History') }}</li>
                <li>{{ __('All Pro Plus features') }}</li>
                <li>{{ __('Account Support Rep') }}</li>
                <li>1000 {{ __('SMS Credits per month') }}</li>
                <li>{{ __('Save when your pay for the year') }}</li>
                <li>10 {{ __('hours of video converting per month') }}</li>
              </ul>
              <stripe-plan-button title="Pro Business" :amount="66000" plan-id="18">
                <a href="/subscription/select/#pro-business" class="btn btn-pink w-md waves-effect waves-light">{{ __('Get Started') }}</a>
              </stripe-plan-button>
            </div>
          </div>
          <div class="col-md-3 pro-private">
            <div class="price_card text-center">
              <a href="/subscription/select/#pro-private">
                <div class="pricing-header bg-free">
                  <span class="name">{{ __('Pro Private') }}</span>
                  <span class="price">$125<span class="term">/{{ __('mo') }}</span></span>
                  <span class="subname">{{ __('paid annually at') }} $1,500/{{ __('yr') }}</span><br>
                  <stripe-plan-button title="Pro Private" :amount="150000" plan-id="20">
                    <span class="btn btn-sub w-md waves-effect waves-light">{{ __('Get Started') }}</span>
                  </stripe-plan-button> 
                </div>
              </a>
              <ul class="price-features">
                <li><strong>{{ __('Private label branding') }}</strong></li>
                <li><strong>{{ __('All Pro features') }}</strong></li>
                <li><strong>{{ __('Your') }} {{ __('logo') }}</strong></li>
                <li><strong>{{ __('Your') }} {{ __('color') }}</strong></li>
                <li><strong>{{ __('Your') }} {{ __('font') }}</strong></li>
                <li><strong>{{ __('Customized content') }}</strong></li>
                <li><strong>{{ __('Private Label hosting on your domain name') }}</strong></li>
                <li><strong>{{ __('Video Time Slots') }}</strong></li>
                <li><strong>{{ __('Video Subscription Feature') }}</strong></li>
                <li>{{ __('All Time Slot Features') }}</li>
                <li>{{ __('All Pro Business features') }}</li>
                 <li>{{ __('Account Support Rep') }}</li>
                <li>1000 {{ __('SMS Credits per month') }}</li>
                <li>{{ __('Save when your pay for the year') }}</li>
                <li>40 {{ __('hours of video converting per month') }}</li>
              </ul>
              <stripe-plan-button title="Pro Private" :amount="150000" plan-id="20">
                <a href="/subscription/select/#pro-private" class="btn btn-pink w-md waves-effect waves-light">{{ __('Get Started') }}</a>
              </stripe-plan-button>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-pane" id="mopricing">
        <div class="row">
          <div class="col-md-3 pro-starter">
            <div class="price_card text-center">
              <a href="/subscription/select/">
                <div class="pricing-header bg-pro-plus">
                  <span class="name">{{ __('Pro Starter') }}</span>
                  <span class="price">$20<span class="term">/{{ __('mo') }}</span></span>
                  <span class="subname">{{ __('monthly subscription') }}</span><br>
                  <stripe-plan-button title="Pro Starter" :amount="2000" plan-id="13">
                    <span class="btn btn-sub w-md waves-effect waves-light">{{ __('Get Started') }}</span>
                  </stripe-plan-button>
                </div>
              </a>
              <ul class="price-features">
                <li><strong>{{ __('Get more with Pro Starter!') }}</strong></li>
                <li>{{ __('Unlimited Event Types') }}</li>
                <li>{{ __('Unlimited Locations') }}</li>
                <li>{{ __('Unlimited Time Slots') }}</li>
                <li>{{ __('Multi-day events') }}</li>
                <li>{{ __('SMS Text & Email Alerts') }}</li>
                <li>{{ __('SMS Text & Email Invites') }}</li>
                <li>{{ __('Custom packages & credits') }}</li>
                <li>{{ __('Custom Calendar Url') }}</li>
                <li>{{ __('Directory Listing') }}</li>
                <li>{{ __('200 SMS Credits per month') }}</li>
                <li>{{ __('and such more...') }}</li>
                <li>{{ __('Save when your pay for the year') }}</li>
              </ul>
              <stripe-plan-button title="Pro Starter" :amount="2000" plan-id="13">
                <a href="/subscription/select/" class="btn btn-pink w-md waves-effect waves-light">{{ __('Get Started') }}</a>
              </stripe-plan-button>
            </div>
          </div>
          <div class="col-md-3">
            <div class="price_card text-center">
              <a href="/subscription/select/#pro-business">
                <div class="pricing-header bg-purple">
                  <span class="name">{{ __('Pro Plus') }}</span>
                  <span class="price">$35<span class="term">/{{ __('mo') }}</span></span>
                  <span class="subname">{{ __('monthly subscription') }}</span><br>
                  <stripe-plan-button title="Pro Plus" :amount="3500" plan-id="15">
                    <span class="btn btn-sub w-md waves-effect waves-light">{{ __('Get Started') }}</span>
                  </stripe-plan-button>
                </div>
              </a>
              <ul class="price-features">
                <li><strong>{{ __('Get more with Pro Plus!') }}</strong></li>
                <li><strong>{{ __('NEW Video Time Slots!') }}</strong></li>
                <li><strong>{{ __('Manage your Team Slots!') }}</strong></li>
                <li><strong>{{ __('Manage up to 3 Pro Accounts') }}</strong></li>
                <li>{{ __('Add/Edit/Delete') }}</li>
                <li>{{ __('Add/Edit/Delete') }} {{ __('Events') }}</li>
                <li>{{ __('Add/Edit/Delete') }} {{ __('Slots') }}</li>
                <li>{{ __('View Time Slot History') }}</li>
                <li>{{ __('All Pro Plus Features') }}</li>
                <li>{{ __('Account Support Rep') }}</li>    
                <li>500 {{ __('SMS Credits per month') }}</li>
                <li>{{ __('Save when your pay for the year') }}</li>
                <li>5 {{ __('hours of video converting per month') }}</li>
              </ul>
              <stripe-plan-button title="Pro Plus" :amount="3500" plan-id="15">
                <a href="/subscription/select/#pro-business" class="btn btn-pink w-md waves-effect waves-light">{{ __('Get Started') }}</a>
              </stripe-plan-button>
            </div>
          </div>
          <div class="col-md-3">
            <div class="price_card text-center">
              <a href="/subscription/select/#pro-business">
                <div class="pricing-header bg-dark">
                  <span class="name">{{ __('Pro Business') }}</span>
                  <span class="price">$70<span class="term">/{{ __('mo') }}</span></span>
                  <span class="subname">{{ __('monthly subscription') }}</span><br>
                  <stripe-plan-button title="Pro Business" :amount="7000" plan-id="17">
                    <span class="btn btn-sub w-md waves-effect waves-light">{{ __('Get Stated') }}</span>
                  </stripe-plan-button>
                </div>
              </a>
              <ul class="price-features">
                <li><strong>{{ __('Get more with Pro Buseness!') }}</strong></li>
                <li><strong>{{ __('NEW Video Time Slots!') }}</strong></li>
                <li><strong>{{ __('Manage your Team Slots!') }}</strong></li>
                <li><strong>{{ __('Manage up to') }} 25 {{ __('Pro Accounts') }}</strong></li>
                <li>{{ __('Add/Edit/Delete') }} {{ __('Locations') }}</li>
                <li>{{ __('Add/Edit/Delete') }} {{ __('Events') }}</li>
                <li>{{ __('Add/Edit/Delete') }} {{ __('Slots') }}</li>
                <li>{{ __('View Time Slot History') }}</li>
                <li>{{ __('All Pro Plus Features') }}</li>
                <li>{{ __('Account Support Rep') }}</li>    
                <li>1000 {{ __('SMS Credits per month') }}</li>
                <li>{{ __('Save when your pay for the year') }}</li>
                <li>10 {{ __('hours of video converting per month') }}</li>
              </ul>
              <stripe-plan-button title="Pro Business" :amount="7000" plan-id="17">
                <a href="/subscription/select/#pro-business" class="btn btn-pink w-md waves-effect waves-light">{{ __('Get Stated') }}</a>
              </stripe-plan-button>
            </div>
          </div>
          <div class="col-md-3 pro-private">
            <div class="price_card text-center">
              <a href="/subscription/select/#pro-private">
                <div class="pricing-header bg-free">
                  <span class="name">{{ __('Pro Private') }}</span>
                  <span class="price">$125<span class="term">/{{ __('mo') }}</span></span>
                  <span class="subname">{{ __('monthly subscription') }}</span><br>
                  <stripe-plan-button title="Pro Private" :amount="150000" plan-id="20">
                    <span class="btn btn-sub w-md waves-effect waves-light">{{ __('Get Stated') }}</span>
                  </stripe-plan-button>
                </div>
              </a>
              <ul class="price-features">
                <li><strong>{{ __('ONLY AVAILABLE AS AN ANNUAL SUBSCRIPTION') }}</strong></li>
                <li><strong>{{ __('Private label branding') }}</strong></li>
                <li><strong>{{ __('All Pro features') }}</strong></li>
                <li><strong>{{ __('Your') }} {{ __('logo') }}</strong></li>
                <li><strong>{{ __('Your') }} {{ __('color') }}</strong></li>
                <li><strong>{{ __('Your') }} {{ __('font') }}</strong></li>
                <li><strong>{{ __('Customized content') }}</strong></li>
                <li><strong>{{ __('Private Label hosting on your domain name') }}</strong></li>
                <li><strong>{{ __('Video Time Slots') }}</strong></li>
                <li><strong>{{ __('Video Subscription Feature') }}</strong></li>
                <li>{{ __('All Time Slot Features') }}</li>
                <li>{{ __('All Pro Business features') }}</li>
                <li>{{ __('All Pro Plus Features') }}</li>
                <li>{{ __('Account Support Rep') }}</li>    
                <li>1000 {{ __('SMS Credits per month') }}</li>
                <li>{{ __('Save when your pay for the year') }}</li>
                <li>40 {{ __('hours of video converting per month') }}</li>
              </ul>
              <stripe-plan-button title="Pro Private" :amount="150000" plan-id="20">
                <a href="/subscription/select/#pro-private" class="btn btn-pink w-md waves-effect waves-light">{{ __('Get Stated') }}</a>
              </stripe-plan-button>
            </div>
          </div>
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
