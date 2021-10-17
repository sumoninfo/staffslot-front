<template id="admin-delete-user-form">
  <div>
    <div class="modal-header">
        <h4 class="modal-title font-18 mt-0"><strong>{{ __('Are you sure want to delete the user') }} {{ user ? user.email : '' }}?</strong></h4>
        <button type="button" class="close" data-bs-dismiss="modal" aria-hidden="true">&times;</button>
    </div>

    <div class="modal-body">
      <div class="alert alert-danger" v-if="errors.length">
        <ul class="list-unstyled">
          <li v-for="error in errors" :key="error" v-text="error"></li>
        </ul>
      </div>
    </div>

    <div class="modal-footer">
      <a class="btn btn-default" @click.prevent="cancel()">{{ __('No') }}</a>
      <a :class="{'btn btn-primary': true, disabled: is_loading}" @click.prevent="deleteUser()">
        <span v-if="!is_loading">{{ __('Yes') }}</span>
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
    template: '#admin-delete-user-form',

    mixins: [helpers],

    data() {
      return {
        user: null,
        is_loading: false,
        errors: []
      }
    },

    created: function () {
        var _this = this

        this.emitter.on('deleteUser', function(user) {
          _this.user = user
          _this.is_loading = false
          $('#delete-user-modal').modal('show')
        })
    },

    methods: {
      deleteUser: function() {
        var _this = this
        this.is_loading = true
        this.errors = []

        axios.post('/api/tspadmin/delete-user', {email: this.user.email}).then((response) => {
          if (response.data.errors.length) {
            for (var key in response.data.errors) {
              for (var i in response.data.errors[key]) {
                this.errors.push(response.data.errors[key][i])
              }
            }
          } else {
            this.user = null
            this.emitter.emit('userAdded')
            $('#delete-user-modal').modal('hide')
          }
        }).catch((e) => {
          this.errors.push(e)
        }).finally(function() {
          _this.is_loading = false;
        })
      },

      cancel: function() {
        $('#delete-user-modal').modal('hide')
      }
    }
  }
</script>