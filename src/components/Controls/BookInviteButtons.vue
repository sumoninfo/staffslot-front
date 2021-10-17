<template>
    <div>
        <button
            class="btn btn-sm btn-link btn-book-customer mb-1 me-1"
            @click="bookForCustomer"
        >
            <span class="button-icon"><i class="fa fa-plus-square"></i></span>{{ __('Book Customers') }}
        </button>
        <button
            class="btn-invite-customer btn  btn-sm btn-secondary mb-1 me-1"
            @click="inviteCustomer('email')"
        >
            <span class="button-icon"><i class="fa fa-envelope"></i></span>{{ __('Email Invite') }}
        </button>
        <button
            v-if="entity.user.account.role!=null && entity.user.account.role.name!='pro-free'"
            class="btn-invite-customer btn btn-sm  btn-secondary mb-1"
            @click="inviteCustomer('sms')"
        >
            <span class="button-icon"><i class="fa fa-commenting-o"></i></span>{{ __('SMS Invite') }}
        </button>
    </div>
</template>

<script>
import $ from 'jquery';
import helpers from '../../mixins/helpers'

export default {
    mixins: [helpers],
    props: {
        entity: {
            type: Object
        },

        entityType: {
            type: String
        },

        cash: {
            type: Boolean,
            default: false
        },

        credits: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        bookForCustomer () {
            this.emitter.emit('bookForCustomer', this.entity, this.entityType);

            if (this.cash) {
                $('#btn-book-customer-cash').show();
                $('#btn-book-customer-free').hide();
            }else{
                $('#btn-book-customer-cash').hide();
                $('#btn-book-customer-free').show();
            }

            if (this.credits) {
                $('#btn-book-customer-club').show();
            }else{
                $('#btn-book-customer-club').hide();
            }
        },

        inviteCustomer (_type) {
            this.emitter.emit('inviteCustomer', {item: this.entity, _type, item_type: this.entityType})
        },
    }
}
</script>

<style>

</style>