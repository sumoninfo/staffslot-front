<template>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="row">
          <div class="col-7">
            <h4 class="fw-light">James Russell</h4>
            <div class="review-btn">
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star"></span>
              <span class="fa fa-star"></span>
            </div>
            <div class="email-btn d-flex">
              <button class="btn btn-secondary p-2 me-1 rounded-0" type="button">{{ __('SMS INVITE') }}</button>
              <button class="btn btn-secondary p-2 rounded-0" type="button">{{ __('EMAIL INVITE') }}</button>
            </div>
          </div>
          <div class="col-5 text-center">
            <p class="mb-1">Account status</p>
            <div class="d-flex justify-content-end">
              <div aria-label="Basic mixed styles example" class="btn-group my-auto border" role="group">
                <button :class="tabActive ? 'btn-success' : 'btn-light'" class="btn tab-btn" type="button"
                        @click="tabActive = true">{{
                    __('Active')
                  }}
                </button>
                <button :class="!tabActive ? 'btn-warning' : 'btn-light'" class="btn tab-btn" type="button"
                        @click="tabActive = false">
                  {{ __('Available') }}
                </button>
              </div>
            </div>
            <div v-if="showDiv" class="d-flex mt-2 justify-content-end">
              <a href=""><u><small>{{ __('Do not staff user') }}</small></u></a>
              <div class="ms-3 my-auto" @click="showDiv = false">
                <i class="fa fa-times-circle text-danger "></i>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div class="row">
          <p><i class="fa fa-envelope me-3"></i> <span class="text-primary">Joe@russconstruction.biz</span></p>
          <p><i class="fa fa-phone me-3"></i> <span class="text-primary">Phone: 305-555-1212</span></p>
          <div class="m-3 p-2 secondary-color w-92">
            <span>View details (expanding accordion open in this view - can only be
viewed by pro-admin, not a pro sub-admin.)</span>
            <p class="h6 font-bold">Address</p>
            <p class="h6 font-bold">DOB</p>
            <p class="h6 font-bold">SS#</p>
            <p class="h6 font-bold">Emergency Contact</p>
            <p class="h6 font-bold">Entered by</p>
            <p class="h6 font-bold">Locations</p>
            <p class="h6 font-bold">Date Hired</p>
          </div>

          <div class="row">
            <div class="col-3">
              <p>Last:</p>
              <p>Booked:</p>
            </div>
            <div class="col-9">
              <p><span class="text-primary">Group Lesson</span></p>
              <p>Sun 06/20/2021 <br>Today</p>
            </div>
          </div>
          <span class="text-black my-2">Trade Types (selected from staff slot types):</span>
        </div>
        <div class="row">
          <div class="col-12">
            <button v-for="staffSlotType in staffSlotTypes" class="btn btn-gray rounded-0 m-1 py-1 px-2">
              {{ staffSlotType }}
            </button>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-12 group-btn">
            <button class="btn btn-success">{{ __('STAFF TO JOB') }}</button>
            <button class="btn btn-primary">{{ __('add note (date&time)') }}</button>
            <!--            <button class="btn btn-gray">{{ __('View notes') }}</button>
                        <button class="btn btn-secondary">{{ __('job history') }}</button>
                        <button class="btn btn-secondary">{{ __('timesheets') }}</button>
                        <button class="btn btn-secondary">{{ __('manage skill types') }}</button>
                        <button class="btn btn-secondary">{{ __('customer reviews') }}</button>
                        <button class="btn btn-secondary">{{ __('do not staff') }}</button>
                        <button class="btn btn-secondary">{{ __('alert settings') }}</button>
                        <button class="btn btn-secondary">{{ __('edit user') }}</button>
                        <button class="btn btn-secondary">{{ __('add "top" badge') }}</button>
                        <button class="btn btn-secondary">{{ __('add injury') }}</button>
                        <button class="btn btn-secondary">{{ __('dns management - match my sub pro') }}</button>
                        <button class="btn btn-secondary">{{ __('customer rating & reviews') }}</button>
                        <button class="btn btn-secondary">{{ __('add to list') }}</button>
                        <button class="btn btn-danger">{{ __('Delete user') }}</button>-->
          </div>
          <div class="accordion col-12" id="accordionExample">
            <div class="accordion-item">
              <h2 class="accordion-header m-0" id="headingNotes">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNotes"
                        aria-expanded="true" aria-controls="collapseNotes">
                  {{ __('View notes') }}
                </button>
              </h2>
              <div id="collapseNotes" class="accordion-collapse collapse show" aria-labelledby="headingNotes"
                   data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  <div class="my-3" v-for="(item, index) in accordion_items_body" :key="index">
                    <h6 class="text-black"><strong>{{ item.date }} by {{ item.name }}</strong></h6>
                    <p class="text-black"> {{ item.text }} </p>
                  </div>
                  <button class="btn btn-secondary w-100">{{ __('Load more notes') }}</button>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingHistory">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseHistory" aria-expanded="false" aria-controls="collapseHistory">
                  {{ __('job history') }}
                </button>
              </h2>
              <div id="collapseHistory" class="accordion-collapse collapse" aria-labelledby="headingHistory"
                   data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  <div class="" v-for="index in 2" :key="index">
                    <h6 class="text-black">Date Staffed: 06/09/21 at 3:12pm</h6>
                    <h6 class="text-black">Event Start Date: 06/10/21 at 7:00am</h6>
                    <h6 class="text-black">Staff Type: Frame Carpenter</h6>
                    <h6 class="text-black">Customer: Turner Construction</h6>
                    <h6 class="text-black">Location: The Grand Flamingo</h6>
                    <h6 class="text-black">Hours Billed: 235</h6>
                    <h6 class="text-black">Pay Rate: $14.00</h6>
                    <a href="#" class="my-5 text-decoration-underline">View staff slot details</a>
                    <div class="d-flex justify-content-between my-2">
                      <button class="btn-sm btn-success px-4">Active</button>
                      <button class="btn-sm btn-secondary text-white px-4">View Timesheet</button>
                    </div>
                    <hr>
                  </div>
                  <button class="btn btn-secondary w-100">{{ __('Load more job History') }}</button>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingTimeSheet">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseTimeSheet" aria-expanded="false" aria-controls="collapseTimeSheet">
                  {{ __('TIMESHEETS') }}
                </button>
              </h2>
              <div id="collapseTimeSheet" class="accordion-collapse collapse" aria-labelledby="headingTimeSheet"
                   data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  <div v-for="index in 2" :key="index">
                    <h6 class="text-black"><strong>Name:</strong> <span class="text-success"> Ernesto Corcho</span></h6>
                    <h6 class="text-black"><strong>Type:</strong> Bifold Door {staff slot type}</h6>
                    <h6 class="text-black"><strong>Location:</strong> The Grand Flamingo {staff Location}</h6>
                    <h6 class="text-black"><strong>Dates:</strong> 6/21/2021, 6/22/2021, 6/23/2021</h6>
                    <h6 class="text-black"><strong>Total Time:</strong> 21 hours 50 minutes</h6>
                    <h6 class="text-black"><strong>Date Submitted:</strong> 6/24/2021</h6>
                    <div class="d-flex justify-content-between my-2">
                      <a href="#" class="my-3 text-lg-center h6 text-decoration-underline">VIEW TIMESHEET DETAILS</a>
                      <i class="fa fa-file-pdf-o fa-3x text-danger"></i>
                    </div>
                    <hr>
                  </div>
                  <button class="btn btn-secondary w-100">{{ __('Load more Timesheets') }}</button>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingSkillTypes">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseSkillTypes" aria-expanded="false" aria-controls="collapseSkillTypes">
                  {{ __('MANAGE SKILL TYPES') }}
                </button>
              </h2>
              <div id="collapseSkillTypes" class="accordion-collapse collapse" aria-labelledby="headingSkillTypes"
                   data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  <div class="input-group mb-3">
                    <input type="text" class="form-control input-lg" placeholder="Search for matching skill types"
                           aria-label="Recipient's username" aria-describedby="button-addon2">
                    <button class="" type="button" id="button-addon2">
                      <i class="fa fa-2x fa-plus"></i>
                    </button>
                  </div>
                  <div>
                    <button class="btn btn-primary rounded-pill m-1">Frame Carpenter <i class="fa fa-check"></i>
                    </button>
                    <button class="btn btn-primary rounded-pill m-1">Painter <i class="fa fa-check"></i></button>
                    <button class="btn btn-primary rounded-pill m-1">Drywall <i class="fa fa-check"></i></button>
                  </div>
                  <button class="btn btn-secondary w-100 my-3">{{ __('Edit Skill types') }}</button>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingCustomerReviews">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseCustomerReviews" aria-expanded="false"
                        aria-controls="collapseCustomerReviews">
                  {{ __('CUSTOMER REVIEWS') }}
                </button>
              </h2>
              <div id="collapseCustomerReviews" class="accordion-collapse collapse"
                   aria-labelledby="headingCustomerReviews"
                   data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  <h6 class="text-black"><strong>06/12/21 by {customer name} at
                    {location name}</strong></h6>
                  <div class="review-btn">
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star"></span>
                  </div>
                  <p>
                    Ernesto Corcho did a great job installing the
                    bifold doors during punch out of a large condo
                    project. You can send him back to my job when
                    needed.
                  </p>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingDoNotStaff">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseDoNotStaff" aria-expanded="false"
                        aria-controls="collapseDoNotStaff">
                  {{ __('DO NOT STAFF') }}
                </button>
              </h2>
              <div id="collapseDoNotStaff" class="accordion-collapse collapse"
                   aria-labelledby="headingDoNotStaff"
                   data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  <h6 class="text-black"><strong>06/12/21 by {customer name} at
                    {location name}</strong></h6>
                  <div class="d-flex justify-content-between">
                    <div class="review-btn">
                      <span class="fa fa-star checked"></span>
                      <span class="fa fa-star checked"></span>
                      <span class="fa fa-star checked"></span>
                      <span class="fa fa-star"></span>
                      <span class="fa fa-star"></span>
                    </div>
                    <div>
                      <i class="fa fa-2x fa-times-circle-o text-danger"></i>
                    </div>
                  </div>
                  <p>
                    Ernesto Corcho did a great job installing the
                    bifold doors during punch out of a large condo
                    project. You can send him back to my job when
                    needed.
                  </p>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingAlertSettings">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseAlertSettings" aria-expanded="false"
                        aria-controls="collapseAlertSettings">
                  {{ __('ALERT SETTINGS') }}
                </button>
              </h2>
              <div id="collapseAlertSettings" class="accordion-collapse collapse"
                   aria-labelledby="headingAlertSettings"
                   data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  <div class="d-flex justify-content-between">
                    <h6 class="text-black align-middle"><strong>SMS Alert</strong></h6>
                    <div class="form-check mt-0 form-switch">
                      <input class="form-check-input h3" type="checkbox" id="flexSwitchCheckChecked" checked>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button class="btn btn-secondary w-100 m-2 font-bold">{{ __('EDIT USER') }}</button>
            <button class="btn btn-danger w-100 m-2 font-bold">{{ __('Delete user') }}</button>
            <router-link :to="{name:'employeeUpdateProfile'}" class="btn btn-success w-100 m-2 font-bold">{{ __('Update the profile') }}</router-link>
            <router-link :to="{name:'appChangeLog'}" class="btn btn-dark w-100 m-2 font-bold">{{ __('APP CHANGE LOG') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from '../mixins/helpers.js'

export default {
  mixins: [helpers],
  name  : "EmployeeProfileDetails",
  data  : () => ({
    accordion_items_body: [
      {
        name: 'David',
        date: '06/12/21',
        text: 'Spoke to Ernesto Corcho. Said he wanted to only work on bifold doors and was not interested in installing hollow metal door frames. Will call back.'
      }, {
        name: 'Easen',
        date: '06/03/21',
        text: 'Ernesto Corcho finished work at JMA One Aragon. Said the superintendent told him he was the best bi-fold door installer in all the land.'
      }, {
        name: 'Nelly',
        date: '06/20/21',
        text: 'Staffed Ernesto at One Aragon with Mack Talley doing bifold door punch out. Corcho said he was the best and will do a great job for us.'
      }, {
        name: 'Easen',
        date: '03/23/21',
        text: 'Ernesto Corcho called about his timesheet and said that it was missing 12 hours for bi-fold door work from the Grand Flamingo job on Miami Beach.'
      }
    ],
    tabActive           : true,
    showDiv             : true,
    staffSlotTypes      : [
      'Form Carpenter', 'Rough Carpenter', 'Helper',
      'Cornorete Finisher', 'Trim Carpenter', 'General Labor', 'Bifold Door Installer'
    ]
  }),
}
</script>

<style lang="scss" scoped>
.review-btn {
  margin-bottom: 13px;

  .fa-star {
    font-size: 25px;
    margin-right: 10px;

    &.checked {
      color: orange;
    }
  }
}

button {
  font-size: 12px;

  &.tab-btn {
    height: 25px;
    padding: 5px 10px;
    border-radius: 0;
  }
}

.group-btn {
  .btn {
    font-size: 16px;
    border-radius: unset;
    width: 100%;
    margin-bottom: 10px;
    text-transform: uppercase;
  }
}

//------
.accordion-item {
  margin: 5px 0px;

  .accordion-header {
    margin: 0;

    button.accordion-button {
      display: inherit;
      color: #656565;
      background-color: #CCCCCC;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
  }

}

.secondary-color {
  background-color: #e5e5e5;
}

.w-92 {
  width: 92%;
}

.form-check-input:checked {
  background-color: #328412;
  border-color: #328412;
}
</style>