<template id="admin-user-list-item">
  <tr v-if="user.account">
    <td class="nav-user"><img :src="'/storage/uploads/' + user.account.profile_photo" alt="user" class="rounded-circle"></td>
    <td v-text="user.email"></td>
    <td v-text="user.account.first_name"></td>
    <td v-text="user.account.last_name"></td>
    <td v-text="user.account.contact_number"></td>
    <td>{{ user.account.created_at | formatDate }}</td>
    <td>{{ user.account.pro ? 'P' : '' }}{{ user.account.stripe_customer_id ? '' : 'C' }} <select class="form-control" v-model="user.account.role_id">
        <option v-if='user.account.pro' value="0">{{ __('Pro Starter') }}</option>
        <option v-else value="0"></option>
        <option v-for="role in roles" :value="role.role_id" v-text="role.name"></option></select></td>
    <td><div class="checkbox checkbox-primary"><input :id="'checkbox-ad-' + i" type="checkbox" v-model="user.admin"><label :for="'checkbox-ad-' + i"></label></div></td>
    <td><div class="checkbox checkbox-primary"><input :id="'checkbox-a-' + i" type="checkbox" v-model="user.account.pro"><label :for="'checkbox-a-' + i"></label></div></td>
    <td><div class="checkbox checkbox-primary"><input :id="'checkbox-v-' + i" type="checkbox" v-model="user.verified"><label :for="'checkbox-v-' + i"></label></div></td>
    <td>
      <a href="#" data-bs-toggle="tooltip" :title="user.tnc_agree_timestamp +' '+ user.tnc_agree_ip" class="label label-primary"><i class="fa fa-info" v-if="user.agreed_affiliate_tnc"></i></a>
    </td>
    <td>
      <a :href="'/profile/edit/' + user.user_id" target="_blank" class="table-action-btn"><i class="md md-edit"></i></a>
      <a href="#" class="table-action-btn" @click.prevent="deleteUser(user)"><i class="md md-close"></i></a>
    </td>
  </tr>
</template>

<script>
  import axios from 'axios'
  import helpers from '../../mixins/helpers'

  export default {
    props: ['user', 'i', 'roles'],
    template: '#admin-user-list-item',

    mixins: [helpers],

    data() {
      return {
        errors: []
      }
    },

    watch: {
      user: {
        handler: function(oval, val) {
          axios.post('/api/tspadmin/update-user', this.user).then((response) => {
          }).catch((e) => {
            this.errors.push(e)
          }).finally(() => (this.is_loading = false));
        },
        deep: true
      }
    },

    methods: {
      deleteUser: function(user) {
        this.emitter.emit('deleteUser', user)
      }
    },
    mounted(){
      $('[data-bs-toggle="tooltip"]').tooltip();
    }
  };
</script>
