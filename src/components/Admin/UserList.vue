<template id="admin-user-list">
  <div class="table-container card-box">
    <div class="row">
        <div class="col-md-4 col-sm-12 mb-2">
            <select class="form-control" v-model="role_id">
                <option value="">{{ __('Filter By Role') }}</option>
                <option value="customer">{{ __('Customer') }}</option>
                <option value="0">{{ __('Pro Starter') }}</option>
                <option v-for="(role) in roles" :value="role.role_id">{{role.display_name}}</option>
            </select>
        </div>
        <div class="col-md-5 col-sm-12 mb-2">
          <input type="text"
            class="form-control"
            placeholder="Start typing user name or email"
            v-model="search_text"
          />
        </div>
        <div class="col-md-2 col-sm-12 mb-2">
          <a href="#" class="btn btn-success btn-md waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#add-user-modal"><i class="md md-add"></i>{{ __('Add User') }}</a>
        </div>
    </div>

    <table class="table table-responsive table-striped">
      <thead>
        <tr>
          <th></th>
          <th>{{ __('Email') }}</th>
          <th>{{ __('First') }}</th>
          <th>{{ __('Last') }}</th>
          <th>{{ __('Number') }}</th>
          <th>{{ __('Registered') }}</th>
          <th>{{ __('Type') }}</th>
          <th>{{ __('Admin') }}</th>
          <th>{{ __('Active') }}</th>
          <th>{{ __('Verified') }}</th>
          <th>{{ __('Aproved Affiliate') }}</th>
          <th>{{ __('Actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="is_loading">
          <td colspan="10">{{ __('Loading') }}</td>
        </tr>
        <tr is="admin-user-list-item" v-for="(user, i) in users" v-bind:key="user.id" :user="user" :roles="roles" :i="i"></tr>
        <tr v-if="pagination.last_page" class="tfooter">
          <td colspan="3">
            <div v-if="!is_loading" class="dataTables_info" role="status" aria-live="polite">{{ __('Showing') }} {{ pagination.from }} {{ __('to') }} {{ pagination.to }} {{ __('of') }} {{ pagination.total }} {{ __('entries') }}</div>
          </td>
          <td colspan="7">
            <div class="dataTables_paginate paging_simple_numbers pull-right">
              <div class="form-inline">
                <ul class="pagination">
                  <label for="select-1" class="control-label pr-2">
                    {{ __('Per page') }}
                  </label>
                    <select class="form-control me-2" v-model="pagination.per_page" id="select1">
                      <option value="10">10</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                </ul>
                <ul class="pagination" v-if="pagination.last_page != 1">
                    <li :class="{ 'paginate_button page-item previous': true, disabled: pagination.current_page == 1 }"><a href="#" aria-controls="datatable-buttons" data-dt-idx="0" tabindex="0" class="page-link" @click.prevent="prevPage()">{{ __('Previous') }}</a></li>

                    <li :class="{ active: p == pagination.current_page, 'paginate_button page-item': true }" v-for="p in getPages()" :key="p"><a href="#" aria-controls="datatable-buttons" data-dt-idx="2" tabindex="0" class="page-link" v-text="p" @click.prevent="setPage(p)"></a></li>

                    <li :class="{ 'paginate_button page-item next': true, disabled: pagination.current_page == pagination.last_page  }"><a href="#" aria-controls="datatable-buttons" data-dt-idx="7" tabindex="0" class="page-link" @click.prevent="nextPage()">{{ __('Next') }}</a></li>
                </ul>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import axios from 'axios'
  import helpers from '../../mixins/helpers'

  export default {
    template: '#admin-user-list',

    mixins: [helpers],

    data() {
      return {
        errors: [],
        users: [],
        roles: [],
        pagination: {
          break: '...',
          per_page: 10,
          current_page: 1,
          total: null
        },
        search_text: '',
        is_loading: false,
        show_results: false,
        throttle: null,
        role_id:'',
      }
    },

    created: function () {
        this.getUsers()
        var _this = this

        this.emitter.on('userAdded', function() {
          _this.getUsers()
        })
    },

    watch: {
      search_text: function (val) {
        this.pagination.current_page = 1

        this.search_text = val.replace(/^\s+|\s+$/g, '')

        const _this = this

        this.show_results = true

        if (this.throttle) { clearTimeout(this.throttle) }

        this.throttle = setTimeout(function () {
          _this.getUsers()
        }, 500);

      },

      'pagination.per_page': function(val) {
        this.getUsers()
      },

      role_id(){
        this.pagination.current_page = 1;
        this.getUsers();
      },

    },

    methods: {
      getUsers: function () {
        this.users = []
        this.is_loading = true

        axios.get('/api/tspadmin/get-users?q='
            + this.search_text
            + '&per_page=' + this.pagination.per_page
            + '&role=' + this.role_id
            + '&page=' + this.pagination.current_page).then((response) => {

          this.users = response.data.users.data
          this.roles = response.data.roles
          var pagination = this.pagination;
          pagination.current_page = response.data.users.current_page
          pagination.last_page = response.data.users.last_page
          pagination.total = response.data.users.total
          pagination.from = response.data.users.from
          pagination.to = response.data.users.to

        }).catch((e) => {
          this.errors.push(e)
        }).finally(() => (this.is_loading = false))
      },

      nextPage: function() {
        this.pagination.current_page++
        this.getUsers()
      },

      prevPage: function() {
        this.pagination.current_page--
        this.getUsers()
      },

      setPage: function(page_num) {
        if (page_num != this.pagination.break) {
          this.pagination.current_page = page_num
          this.getUsers()
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
