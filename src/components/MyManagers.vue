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
        <p>{{ __("Invite other pro-plus and pro-business time slot pro users to manage your pro account. Enter the manager's email to send the request") }}.</p>
        <div class="form-inline justify-content-center">
            <label class="mr-2 my-auto">{{ __('Invite admin') }}</label>
            <input tabindex="0" type="text" class="form-control mr-2 col-5 col-md-8" v-model="inviteEmail" @keyup.enter.prevent="inviteManager">
            <button class="btn btn-primary btn-small" style="display: table; cursor: pointer;" @click="inviteManager" :disabled=isInviting>{{ __('Invite') }}</button>
        </div>
        <div class="row justify-content-center">
            <div class="form-control-feedback text-danger" v-if="errors.email" v-text="errors.email ? errors.email.join(' ') : ''"></div>
        </div>
        <hr>
        <div class="row">
            <div class="col-12">
                <div class="border" v-if="incomingRequests.length">
                    <div class="justify-content-between row">
                        <h4 class="col-6">{{ __('Pending Requests') }}</h4><div class="btn btn-secondary toggle" @click="toggleIncomingRequests()">{{ incomingRequestsVisible ? 'Hide' : 'Show' }}</div>
                    </div>
                    <div class="row" v-if="incomingRequestsVisible">
                        <div v-for="manager in incomingRequests" :key="manager.id" class="col-lg-3 col-md-3 col-sm-12">
                            <div :class="{card: true, declined: manager.status == 'declined'}">
                                <div v-if="manager.status == 'declined'" class="declined-label">
                                    {{ __('Declined') }}
                                </div>
                                <img class="img-fluid card-img-top" :src="manager.manager.account.profile_photo ? '/storage/uploads/' + manager.manager.account.profile_photo : '/images/default-profile-time-slot-manager.png'" alt="user">
                                <h6 v-text="manager.manager.account.first_name + ' ' + manager.manager.account.last_name"></h6>
                                <div class="card-text">
                                    <i class="fa fa-envelope" aria-hidden="true"></i> <a :href="'mailto:' + manager.manager.email">{{ manager.manager.email }}</a><br />
                                    <i class="fa fa-phone" v-if="manager.manager.account.contact_number" aria-hidden="true"></i><a :href="'tel:'+ manager.manager.account.contact_number" v-text="manager.manager.account.contact_number"></a><br />
                                </div>
                                <a class="btn btn-success btn-block mt-2" @click="approve(manager.id)"><span class="button-icon"><i class="fa fa-user"></i></span>{{ __('Approve') }}</a>
                                <a class="btn btn-danger btn-block mt-2" @click="decline(manager.id)"><span class="button-icon"><i class="fa fa-remove"></i></span>{{ __('Decline') }}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="border" v-if="outgoingInvites.length">
                    <div class="justify-content-between row">
                        <h4 class="col-6">{{ __('Pending Invites') }}</h4><div class="btn btn-secondary toggle" @click="toggleOutgoingInvites()">{{ outgoingInvitesVisible ? 'Hide' : 'Show' }}</div>
                    </div>
                    <div class="row" v-if="outgoingInvitesVisible">
                        <div v-for="manager in outgoingInvites" :key="manager.id" class="col-lg-3 col-md-3 col-sm-12">
                            <div :class="{card: true, declined: manager.status == 'declined'}">
                                <div v-if="manager.status == 'declined'" class="declined-label">
                                    {{ __('Declined') }}
                                </div>
                                <img class="img-fluid card-img-top" :src="manager.manager.account.profile_photo ? '/storage/uploads/' + manager.manager.account.profile_photo : '/images/default-profile-time-slot-manager.png'" alt="user">
                                <h6 v-text="manager.manager.account.first_name + ' ' + manager.manager.account.last_name"></h6>
                                <div class="card-text">
                                    <i class="fa fa-envelope" aria-hidden="true"></i> <a :href="'mailto:' + manager.manager.email">{{ manager.manager.email }}</a><br />
                                    <i class="fa fa-phone" v-if="manager.manager.account.contact_number" aria-hidden="true"></i><a :href="'tel:'+ manager.manager.account.contact_number" v-text="manager.manager.account.contact_number"></a><br />
                                </div>
                                <confirm @confirm="remove(manager.id)">
                                    <a class="btn btn-danger btn-block mt-2"><span class="button-icon"><i class="fa fa-remove"></i></span>{{ __('Remove') }}</a>
                                </confirm>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div v-for="manager in approved" :key="manager.id" class="col-lg-3 col-md-3 col-sm-12">
                        <div class="card">
                            <img class="img-fluid card-img-top" :src="manager.manager.account.profile_photo ? '/storage/uploads/' + manager.manager.account.profile_photo : '/images/default-profile-time-slot-manager.png'" alt="user">
                            <h6 v-text="manager.manager.account.first_name + ' ' + manager.manager.account.last_name"></h6>
                            <div class="card-text">
                                <i class="fa fa-envelope" aria-hidden="true"></i> <a :href="'mailto:' + manager.manager.email">{{ manager.manager.email }}</a><br />
                                <i class="fa fa-phone" v-if="manager.manager.account.contact_number" aria-hidden="true"></i><a :href="'tel:'+ manager.manager.account.contact_number" v-text="manager.manager.account.contact_number"></a><br />
                            </div>
                            <confirm @confirm="remove(manager.id)">
                                <a class="btn btn-danger btn-block mt-2"><span class="button-icon"><i class="fa fa-remove"></i></span>{{ __('Remove') }}</a>
                            </confirm>
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
                inviteEmail: null,
                isInviting: false,
                outgoingInvitesVisible: true,
                incomingRequestsVisible: true,
                outgoingInvites: [],
                incomingRequests: [],
                approved: [],
                errors: []
            }
        },
        created() {
            this.getManagers();
        },
        methods: {
            toggleOutgoingInvites() {
                this.outgoingInvitesVisible = !this.outgoingInvitesVisible
            },
            toggleIncomingRequests() {
                this.incomingRequestsVisible = !this.incomingRequestsVisible
            },
            inviteManager() {
                const _this = this
                this.errors = []
                this.isInviting = true
                axios.put('/api/manager/invite', {email: this.inviteEmail})
                    .then(response => {
                        this.getManagers();
                    }).catch(e => {
                        if (e.response.data.errors)
                            _this.errors = e.response.data.errors
                    }).finally(() => {
                        this.isInviting = false
                    })
            },
            getManagers() {
                axios.get('/api/managers')
                .then(response => {
                        this.incomingRequests = response.data.incoming_requests
                        this.outgoingInvites = response.data.outgoing_invites
                        this.approved = response.data.approved
                    }).catch(e => {

                    })
            },
            approve(managerId) {
                axios.get(`/api/manager/${managerId}/approve`)
                .then(response => {
                    this.getManagers()
                }).catch(e => {
                    alert(e.response.data.message)
                })
            },
            decline(managerId) {
                axios.get(`/api/manager/${managerId}/decline`)
                .then(response => {
                    this.getManagers()
                }).catch(e => {
                    alert(e.response.data.message)
                })
            },
            remove(managerId) {
                axios.delete(`/api/manager/${managerId}`)
                .then(response => {
                    this.getManagers()
                }).catch(e => {
                    alert(e.response.data.message)
                })
            }
        }
    }
</script>