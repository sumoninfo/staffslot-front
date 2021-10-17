<template id="admin-add-user-form">
  <div>
    <div class="modal-body">
      <div class="alert alert-danger" v-if="errors.length">
        <ul class="list-unstyled">
          <li v-for="error in errors" :key="error" v-text="error"></li>
        </ul>
      </div>

      <div class="form-group">
        <label for="inputEmail1">{{ __('Email address') }}</label>
        <input autocomplete="off" v-model="new_user.email" type="text" class="form-control" id="inputEmail1" aria-describedby="emailHelp" placeholder="Enter user email">
      </div>
      <div class="form-group">
        <label for="inputPassword1">{{ __('Password') }}</label>
        <input autocomplete="new-password" v-model="new_user.password" type="password" class="form-control" id="inputPassword1" placeholder="Password">
      </div>
    </div>

    <div class="modal-footer">
      <a :class="{'btn btn-primary': true, disabled: is_loading}" @click.prevent="addUser()">
        <span v-if="!is_loading">{{ __('add') }}</span>
        <div class="la-ball-spin-clockwise la-sm" v-if="is_loading">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import helpers from '../../mixins/helpers'

  export default {
    template: '#admin-add-user-form',

    mixins: [helpers],

    data() {
      return {
        new_user: {
          email: null,
          password: null
        },
        is_loading: false,
        errors: []
      }
    },

    methods: {
      addUser: function() {
        var _this = this
        this.is_loading = true
        this.errors = []

        axios.post('/api/tspadmin/add-user', this.new_user).then((response) => {
          if (response.data.errors.length) {
            for (var key in response.data.errors) {
              for (var i in response.data.errors[key]) {
                this.errors.push(response.data.errors[key][i])
              }
            }
          } else {
            this.new_user.email = ''
            this.new_user.password = ''
            this.emitter.emit('userAdded')
            $('#add-user-modal').modal('hide')
          }
        }).catch((e) => {
          this.errors.push(e)
        }).finally(function() {
          _this.is_loading = false;
        })
      }
    }
  }
</script>