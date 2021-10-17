<template id="t-search">

<div class="template-container">

  <div class="row pro-search-area">
      <div class="col-md-12">
          <form role="form" class="form-inline m-b-15 search-box">
              <div class="form-group contact-search">
                  <input type="text" id="search" class="form-control" placeholder="Search for pros by name, state, city or zip" v-model="search_query" @keydown.enter.prevent="" @keyup.enter.prevent="">
              </div> <!-- form-group -->
          </form>
          <!-- <form role="form" class="form-inline m-b-15">
            <div class="col-12"><h6>Filter by Category (optional)</h6></div>
              <div class="form-group dropdown-selector col-6">
                <select class="form-control category-selector" v-model="selected_category" v-on:change="getSubcategories">
                    <option value="">Category...</option>
                    <option v-for="category in categories" v-text="category.title" :value="category.category_id"></option>
                </select>
              </div>
              <div class="form-group dropdown-selector col-6">
                  <select class="form-control category-selector" v-model="selected_subcategory" v-on:change="search">
                      <option value="">Subcategory...</option>
                      <option v-for="subcategory in subcategories" v-text="subcategory.title" :value="subcategory.category_id"></option>
                  </select>
              </div>
          </form> -->
          <!-- sample modal content -->
          <div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                  <div class="modal-content">
                      <div class="modal-header">
                          <h4 class="modal-title mt-0" id="myModalLabel">{{ __('Categories') }}</h4>
                          <button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">×</button>
                      </div>
                      <div class="modal-body">
                          <form role="form" class="form-inline m-b-15">
                              <div
                                  class="checkbox"
                                  v-for="category,i in categories"
                                  :key="i"
                              >
                                  <input id="checkbox0" type="checkbox" v-model="category.category_id" :value="category.category_id">
                                  <label for="checkbox0" v-text="category.title"></label>
                              </div>
                          </form>
                      </div>
                      <div class="modal-footer">
                          <button type="button" class="btn btn-secondary waves-effect" data-bs-dismiss="modal">{{ __('Close') }}</button>
                          <button type="button" class="btn btn-primary waves-effect waves-light">{{ __('Filter') }}</button>
                      </div>
                  </div><!-- /.modal-content -->
              </div><!-- /.modal-dialog -->
          </div><!-- /.modal -->
      </div>
  </div>

  <div class="row pro-search-results">
    <div class="col-md-12 no-results" v-show="noResults">
        <p>{{ __('Sorry, no results are available for this search. Please contact your Pro for a direct link to their calendar and time slots, or perform another search') }}.</p>
    </div>
    <div
        class="col-sm-6 col-lg-6"
        v-for="pro,i in pros"
        :key="i"
    >
        <div class="card-box">
            <div class="contact-card">
                <div class="card-photo">
                    <a class="pull-left" v-bind:href="'/search/details/'+pro.user_id">
                        <div class="img-circle profile-image mt-2" v-bind:style="{ backgroundImage: 'url(http://app.timeslot.pro/storage/uploads/' + pro.account.profile_photo + ')' }" v-show="hasProfilePhoto(pro)"></div>

                        <div class="img-circle profile-image mt-2" style="background-image:url('/images/default-profile-time-slot-pro.png')" alt="" v-show="!hasProfilePhoto(pro)"></div>
                    </a>
                </div>
                <div class="member-info">
                    <h4 class="m-t-0 pt-2 m-b-5 header-title">
                        <b><a v-bind:href="'/search/details/'+pro.user_id"><span v-text="pro.account.first_name"></span> <span v-text="pro.account.last_name"></span></a></b><br>
                    </h4>
                    <h5>
                        <small v-if="pro.account.nickname !== null">(<span v-text="pro.account.nickname"></span>)</small>
                    </h5>
                    <p class="text-dark" v-show="addressAvailable(pro)"><i class="fa fa-map-marker"></i> <span v-text="pro.account.city"></span>, <span v-text="pro.account.state"></span></p>
                    <!-- <p class="text-dark m-b-1"><a v-bind:href="'/search/details/'+pro.user_id"><i class="fa fa-user"></i> Pro Details</a></p> -->
                    <p class="text-dark m-b-1"><router-link :to="{ name: 'availableSlots', params: { userId: pro.user_id }}"><i class="fa fa-check"></i> {{ __('Book a Time Slot') }}</router-link></p>
                    <p v-if="pro.hasVideoSlots" class="text-dark m-b-1"><router-link :to="{ name: 'availableVideoSlots', params: { userId: pro.user_id }}"><i class="fa  fa-play-circle-o"></i> {{ __('Book a Video Slot') }}</router-link></p>
                    <p v-if="pro.hasPackages" class="text-dark"><router-link :to="{ name: 'availablePackages', params: { publicId: pro.account.public_id } }"><i class="fa fa-ticket"></i> {{ __('Buy a Package') }}</router-link></p>
                    <p v-if="pro.hasVideoSubscriptions" class="text-dark m-b-1"><router-link :to="{ name: 'publicVideoSubscriptions', params: { publicId: pro.account.public_id } }"><i class="fa fa-film"></i> {{ __('Buy a Video Subscription') }}</router-link></p>
                    <p v-if="pro.hasProducts" class="text-dark m-b-1"><router-link :to="{ name: 'publicProducts', params: { publicId: pro.account.public_id } }"><i class="fa fa-film"></i> {{ __('Buy a Product') }}</router-link></p>
                    <!-- <p v-if="pro.hasPackages" class="text-dark"><a v-bind:href="'/book/' + pro.account.public_id"><i class="fa fa-calendar"></i> View Calendar</a></p> -->
                </div>
            </div>
            <!-- <div class="contact-card-btns">
                <div class="member-info">
                    <p class="text-dark m-b-0"><a class="btn btn-success btn-navigation col-md-10" v-bind:href="'/booking/available-slots/' + pro.user_id"><i class="fa fa-search"></i> View Time Slots</a></p>
                    <p class="text-dark m-b-0"><a class="btn btn-primary btn-navigation col-md-10" v-bind:href="'/search/details/'+pro.user_id"><i class="fa fa-user"></i> Pro Details</a></p>
                </div>
            </div> -->
      </div>
    </div> <!-- end col -->
  </div>
  <div class="row">
    <div class="col-sm-12 col-lg-12">
      <div class="dataTables_paginate paging_simple_numbers pull-right">
        <div class="form-inline">
          <ul class="pagination">
            <label for="select-1" class="control-label pr-2">
              {{ __('Per page') }}
            </label>
              <select class="form-control me-2" v-model="pagination.per_page" id="select1">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
          </ul>
          <ul class="pagination" v-if="pagination.last_page != 1">
              <li :class="{ 'paginate_button page-item previous': true, disabled: pagination.current_page == 1 }"><a href="#" aria-controls="datatable-buttons" data-dt-idx="0" tabindex="0" class="page-link" @click.prevent="prevPage()">{{ __('Previous') }}</a></li>

              <li :class="{ active: p == pagination.current_page, 'paginate_button page-item': true }" v-for="p,i in getPages()" :key="i"><a href="#" aria-controls="datatable-buttons" data-dt-idx="2" tabindex="0" class="page-link" v-text="p" @click.prevent="setPage(p)"></a></li>

              <li :class="{ 'paginate_button page-item next': true, disabled: pagination.current_page == pagination.last_page  }"><a href="#" aria-controls="datatable-buttons" data-dt-idx="7" tabindex="0" class="page-link" @click.prevent="nextPage()">{{ __('Next') }}</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>

</div>

</template>

<script>
    import helpers from '../mixins/helpers';
    import _ from 'lodash'
    import axios from 'axios'

    export default {
        mixins: [helpers],

        template: '#t-search',
            data() {
                return {
                    search_query: "",
                    pros: [],
                    errors: [],
                    no_results: null,
                    categories: [],
                    selected_category: "",
                    subcategories: [],
                    selected_subcategory: "",
                    pagination: {
                    break: '...',
                    per_page: 20,
                    current_page: 1,
                    total: null
                    }
                }
            },
            created: function () {
                this.getCategories();
            },
            watch: {
                search_query: function(){
                    this.search();
                },
                selected_category: function(val) {
                    this.search();
                },
                selected_subcategory: function(val) {
                    this.search();
                },
                'pagination.per_page': function(val) {
                    this.search();
                }
            },
        computed: {
            hasErrors: function () {
                return (this.errors.length > 0);
            },
            noResults: function () {
                return (this.no_results == true);
            }
        },
        methods: {
            search: _.debounce(function(e) {
                axios.get(`/api/search/pros?query=${this.search_query}&category=${this.selected_category}&subcategory=${this.selected_subcategory}&per_page=${this.pagination.per_page}&page=${this.pagination.current_page}`)
                .then((response) => {
                    this.pros = response.data.pros.data
                    var pagination = this.pagination;
                    pagination.current_page = response.data.pros.current_page
                    pagination.last_page = response.data.pros.last_page
                    pagination.total = response.data.pros.total
                    pagination.from = response.data.pros.from
                    pagination.to = response.data.pros.to
                    if(this.pros.length > 0){
                        this.no_results = false;
                    } else {
                        this.no_results = true;
                    }
                })
                .catch((e) => {
                  this.errors.push(e)
                })
            }, 500),
            getCategories: function() {
                axios.get(`/api/search/get-categories`)
                .then((response) => {
                    this.categories = response.data.categories;
                    this.search();
                })
                .catch((e) => {
                  this.errors.push(e)
                })
            },
            getSubcategories: function() {
                axios.get(`/api/search/get-subcategories?category=${this.selected_category}`)
                .then((response) => {
                    this.subcategories = response.data.subcategories;
                })
                .catch((e) => {
                  this.errors.push(e)
                })
            },
            addressAvailable: function (pro) {
                if(pro.account.city == null || pro.account.city.length == 0){
                    return false;
                }
                if(pro.account.state == null || pro.account.state.length == 0){
                    return false;
                }
                if(pro.account.zip_code == null || pro.account.zip_code.length == 0){
                    return false;
                }
                return true;
            },
            contactNumberAvailable: function (pro) {
                if(pro.account.contact_number == null || pro.account.contact_number.length == 0){
                    return false;
                }
                return true;
            },
            hasProfilePhoto: function (pro) {
                return (pro.account.profile_photo !== null);
            },
            nextPage: function() {
                this.pagination.current_page++
                this.search()
            },
            prevPage: function() {
                this.pagination.current_page--
                this.search()
            },
            setPage: function(page_num) {
                if (page_num != this.pagination.break) {
                    this.pagination.current_page = page_num
                    this.search()
                }
            },
            getPages: function() {
                var pages = []
                var left = this.pagination.current_page - 3
                var right = this.pagination.current_page + 3
                for (var i = 1; i <= this.pagination.last_page; i++) {
                    if(i == 1 || i == this.pagination.last_page || (i <= right && i >= left)) {
                      pages.push(i)
                    } else {
                      if (pages[pages.length-1] != this.pagination.break) {
                        pages.push(this.pagination.break)
                      }
                    }
                }
                return pages
            }
        }
    }
</script>
