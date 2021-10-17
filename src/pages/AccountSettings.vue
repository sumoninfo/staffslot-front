<template>
    <div class="card">
        <h2>{{__('Settings')}}</h2>

        <form @submit.prevent="submit" class="form">
            <label class="form-field">
                {{__('Turn on video slots')}}
                <input type="checkbox" v-model="has_video_slots" />
            </label>
            <label class="form-field">
                {{__('Turn on video subscriptions')}}
                <input type="checkbox" v-model="has_video_subscriptions" />
            </label>
            <label class="form-field">
                {{__('Turn on packages')}}
                <input type="checkbox" v-model="has_packages" />
            </label>
            <label class="form-field">
                {{__('Turn on products')}}
                <input type="checkbox" v-model="has_products" />
            </label>

            <button class="btn btn-success">{{__('Save')}}</button>
        </form>
    </div>
</template>

<script>
// import axios from 'axios'

export default {
    data() {
        return {
            has_video_slots: null,
            has_video_subscriptions: null,
            has_packages: null,
            has_products: null
        }
    },

    computed: {
        hasVideoSlots() {
            return this.$store.state.user.has_video_slots
        },
        hasVideoSubscriptions() {
            return this.$store.state.user.has_video_subscriptions
        },
        hasPackages() {
            return this.$store.state.user.has_packages
        },
    },

    created() {
        this.has_video_slots = this.hasVideoSlots
        this.has_video_subscriptions = this.hasVideoSubscriptions
        this.has_packages = this.hasPackages
        this.has_products = true
    },

    methods: {
        submit() {
            const config = {
                has_video_slots: this.has_video_slots,
                has_video_subscriptions: this.has_video_subscriptions,
                has_packages: this.has_packages,
                has_products: this.has_products
            }

            this.$store.commit('setUserConfig', config)
            this.$store.commit('setFlashMessage', 'Saved')
            // todo post user config
        }
    },
    unmounted() {
        this.$store.commit('setFlashMessage', null)
    }
}
</script>

<style scoped lang="scss">
.form {
    display: flex;
    flex-direction: column;

    &-field {
        display: flex;
        align-items: center;

        cursor: pointer;

        input {
            width: 15px;
            height: 15px;
            margin-left: 10px;

            cursor: pointer;
        }
     }
}
</style>

