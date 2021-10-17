<template>
    <div class="location-box">
        <h5>{{ __('Image upload (s)') }}</h5>
        <h6> <span v-text="event_title"></span></h6>
        <div class="alert alert-danger" v-show="hasErrors">
            <ul class="list-unstyled">
                <li v-for="(error, key) in errors" :key="key" v-text="error"></li>
            </ul>
        </div>
        <form @submit.prevent>
            <image-upload @fileUploaded="saveFile"></image-upload>
            <div class="wizard-buttons">
                <button class="btn btn-warning m-r-5" type="button" v-on:click="back()">{{ __('Back') }}</button>
                <button class="btn btn-success select-date" @click="next">
                    <span v-if="!is_loading"><i class="fa fa-check"></i> {{ __('Select Images') }}</span>
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
                </button>
                <button class="btn btn-link select-date" @click="next">
                    <span v-if="!is_loading"><i class="fa fa-check"></i> {{ __('Skip this step') }}</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
import helpers from '../../mixins/helpers.js'
import { mapState } from 'vuex'
import dropArea from '../../mixins/drop-area';

export default {
    mixins: [helpers, dropArea],

    components: {
    },

    data() {
        return {
            is_loading: false,
            errors: [],
            dates: [],
            date_from: "",
            date_to: "",
            date_from_picker: null,
            date_to_picker: null,
            loading_dates: false,
            images: []
        }
    },

    created() {
        this.slot.images = []
    },

    computed: {
        ...mapState({ slot: s => s.wizard.slot }),
        hasErrors: {
            cache: false,
            get: function () {
                return (this.errors.length > 0);
            }
        },
        event_title () {
            return this.$store.state.wizard.slot.title
        },
    },
    methods: {
        back: function(){
            this.$router.go(-1);
        },

        next() {
          this.$store.dispatch('wizard/setSlot', {...this.slot, images: this.images})
          this.$router.push('/wizard/select-promo-video')
        },

        saveFile(image) {
          if (!this.images.includes(image)) {
            this.images.push(image)
          }
        }
    }
}
</script>