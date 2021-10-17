<template>
    <multiselect
        placeholder="Choose users"
        v-model="selectedUsers"
        track-by="user_id"
        :options="users"
        :custom-label="label"
        :multiple="true"
    >
        <template slot="option" slot-scope="props">
            <img
                style="width: 30px; height: 30px; object-fit: cover;"
                class="rounded-circle"
                v-if="props.option.account.profile_photo"
                :src="props.option.account.profile_photo.startsWith('http') === false ? '/storage/uploads/' + props.option.account.profile_photo : props.option.account.profile_photo" >
            <img v-else src="/images/default-profile-time-slot-pro.png" alt="user"
                style="width: 30px; height: 30px; object-fit: cover;"
                class="rounded-circle">
            <span class="option__desc"><span class="option__small">{{ label(props.option) }}</span></span>
        </template>
    </multiselect>
</template>

<script>
import helpers from '../mixins/helpers'

export default {
    mixins: [helpers],
    props: {
        users: {
            type: Array,
            default: () => []
        },

        showEmails: {
            type: Boolean,
            default: false
        },

        value: Array
    },

    data () {
        return {
            selectedUsers: this.value
        }
    },

    watch: {
        value () {
            this.selectedUsers = this.value;
        },

        selectedUsers (val) {
            this.$emit('input', val)
        }
    },

    methods: {
        label (user) {
            return this.showEmails ? `${user.email} ${user.account.full_name}` : user.account.full_name
        }
    }
}
</script>

<style>

</style>