<style scoped>
    .border {
        margin: 0 30px;
        padding: 0 10px;
        background-color: #d6d6d6;
        position: relative;
        border-radius: 5px;
    }

    .border .toggle.btn {
        margin: auto 5px;
    }

    .border h4 {
        display: inline-block;
    }

    .card.declined {
        position: relative;
        background-color: #d6d6d6;
    }

    .declined-label {
        position: absolute;
        color: white;
        left: 15px;
        font-size: 2em;
        font-weight: bold;
        -moz-text-stroke-color: #424242;
        -webkit-text-stroke-color: #424242;
        -moz-text-stroke-width: 1px;
        -webkit-text-stroke-width: 1px;
    }
</style>

<template>
    <div id="ts-content">
        <div class="form-inline justify-content-center">
            <label class="mr-2 my-auto">{{ __('Request admin') }}</label>
            <input tabindex="0" type="text" class="form-control mr-2 col-5 col-md-8" v-model="requestEmail" @keyup.enter.prevent="requestManager">
            <button class="btn btn-primary btn-small" style="display: table; cursor: pointer;" @click="requestManager" :disabled=isRequesting>{{ __('Request') }}</button>
        </div>
        <div class="row justify-content-center">
            <div class="form-control-feedback text-danger" v-if="errors.email" v-text="errors.email ? errors.email.join(' ') : ''"></div>
        </div>
        <hr>
        <div class="row">
            <div class="col-12">
                <div class="border" v-if="outgoingRequests.length">
                    <div class="justify-content-between row">
                        <h4 class="col-6">{{ __('Pending Requests') }}</h4><div class="btn btn-secondary toggle" @click="toggleOutgoingRequests()">{{ outgoingRequestsVisible ? 'Hide' : 'Show' }}</div>
                    </div>
                    <div class="row" v-if="outgoingRequestsVisible">
                        <div v-for="manager in outgoingRequests" :key="manager.id" class="col-lg-3 col-md-3 col-sm-12">
                            <div :class="{card: true, declined: manager.status == 'declined'}">
                                <div v-if="manager.status == 'declined'" class="declined-label">
                                    {{ __('Declined') }}
                                </div>
                                <img class="img-fluid card-img-top" :src="manager.user.account.profile_photo ? '/storage/uploads/' + manager.user.account.profile_photo : '/images/default-profile-time-slot-pro.png'" alt="user">
                                <h6 v-text="manager.user.account.first_name + ' ' + manager.user.account.last_name"></h6>
                                <div class="card-text">
                                    <i class="fa fa-envelope" aria-hidden="true"></i> <a :href="'mailto:' + manager.user.email">{{ manager.user.email }}</a><br />
                                    <i class="fa fa-phone" v-if="manager.user.account.contact_number" aria-hidden="true"></i><a :href="'tel:'+ manager.user.account.contact_number" v-text="manager.user.account.contact_number"></a><br />
                                </div>
                                <confirm @confirm="remove(manager.id)">
                                    <a class="btn btn-danger btn-block mt-2"><span class="button-icon"><i class="fa fa-remove"></i></span>{{ __('Remove') }}</a>
                                </confirm>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="border" v-if="incomingInvites.length">
                    <div class="justify-content-between row">
                        <h4 class="col-6">{{ __('Pending Invites') }}</h4><div class="btn btn-secondary toggle" @click="toggleIncomingInvites()">{{ incomingInvitesVisible ? 'Hide' : 'Show' }}</div>
                    </div>
                    <div class="row" v-if="incomingInvitesVisible">
                        <div v-for="manager in incomingInvites" :key="manager.id" class="col-lg-3 col-md-3 col-sm-12">
                            <div class="card">
                                <img class="img-fluid card-img-top" :src="manager.user.account.profile_photo ? '/storage/uploads/' + manager.user.account.profile_photo : '/images/default-profile-time-slot-pro.png'" alt="user">
                                <h6 v-text="manager.user.account.first_name + ' ' + manager.user.account.last_name"></h6>
                                <div class="card-text">
                                    <i class="fa fa-envelope" aria-hidden="true"></i> <a :href="'mailto:' + manager.user.email">{{ manager.user.email }}</a><br />
                                    <i class="fa fa-phone" v-if="manager.user.account.contact_number" aria-hidden="true"></i><a :href="'tel:'+ manager.user.account.contact_number" v-text="manager.user.account.contact_number"></a><br />
                                </div>
                                <a class="btn btn-success btn-block mt-2" @click="approve(manager.id)"><span class="button-icon"><i class="fa fa-user"></i></span>{{ __('Approve') }}</a>
                                <a class="btn btn-danger btn-block mt-2" @click="decline(manager.id)"><span class="button-icon"><i class="fa fa-remove"></i></span>{{ __('Decline') }}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div v-for="manager in approved" :key="manager.id" class="col-lg-3 col-md-3 col-sm-12">
                        <div class="card">
                            <img class="img-fluid card-img-top" :src="manager.user.account.profile_photo ? '/storage/uploads/' + manager.user.account.profile_photo : '/images/default-profile-time-slot-pro.png'" alt="user">
                            <h6 v-text="manager.user.account.first_name + ' ' + manager.user.account.last_name"></h6>
                            <div class="card-text">
                                <i class="fa fa-envelope" aria-hidden="true"></i> <a :href="'mailto:' + manager.user.email">{{ manager.user.email }}</a><br />
                                <i class="fa fa-phone" v-if="manager.user.account.contact_number" aria-hidden="true"></i><a :href="'tel:'+ manager.user.account.contact_number" v-text="manager.user.account.contact_number"></a><br />
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    <a class="btn btn-success btn-block mt-2" @click="impersonate(manager)"><span class="button-icon"><i class="fa fa-user"></i></span>{{ __('Manage Pro') }}</a>
                                </div>
                                <div class="col-6">
                                    <confirm @confirm="remove(manager.id)">
                                        <a class="btn btn-danger btn-block mt-2"><span class="button-icon"><i class="fa fa-remove"></i></span>{{ __('Remove') }}</a>
                                    </confirm>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import helpers from '../mixins/helpers'

    export default {
        mixins: [helpers],
        data() {
            return {
                requestEmail: null,
                isRequesting: false,
                incomingInvites: [],
                outgoingRequests: [],
                approved: [],
                incomingInvitesVisible: true,
                outgoingRequestsVisible: true,
                errors: []
            }
        },
        created() {
            this.getPros()
        },
        methods: {
            toggleIncomingInvites() {
                this.incomingInvitesVisible = !this.incomingInvitesVisible
            },
            toggleOutgoingRequests() {
                this.outgoingRequestsVisible = !this.outgoingRequestsVisible
            },
            requestManager() {
                const _this = this
                this.errors = []
                this.isRequesting = true
                axios.put('/api/manager/request', {email: this.requestEmail})
                    .then(response => {
                        this.getPros();
                    }).catch(e => {
                        if (e.response.data.errors)
                            _this.errors = e.response.data.errors
                    }).finally(() => {
                        this.isRequesting = false
                    })
            },
            getPros() {
                axios.get('/api/manager/pros')
                .then(response => {
                    this.incomingInvites = response.data.incoming_invites
                    this.outgoingRequests = response.data.outgoing_requests
                    this.approved = response.data.approved
                }).catch(e => {

                })
            },
            impersonate(manager) {
                axios.get(`/api/manager/${manager.user_id}/impersonate`)
                .then(response => {
                    window.location = '/dashboard'
                }).catch(e => {
                    alert(e.response.data.message)
                })
            },
            approve(managerId) {
                axios.get(`/api/manager/${managerId}/approve`)
                .then(response => {
                    this.getPros()
                }).catch(e => {
                    alert(e.response.data.message)
                })
            },
            decline(managerId) {
                axios.get(`/api/manager/${managerId}/decline`)
                .then(response => {
                    this.getPros()
                }).catch(e => {
                    alert(e.response.data.message)
                })
            },
            remove(managerId) {
                axios.delete(`/api/manager/${managerId}`)
                .then(response => {
                    this.getPros()
                }).catch(e => {
                    alert(e.response.data.message)
                })
            }
        }
    }
</script>