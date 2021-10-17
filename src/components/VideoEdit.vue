<template>
    <div v-if="video" class="video-edit text-center">
        <div class="form-group text-left">
            <label>{{ __('Title') }}</label>
            <input v-model="video.title" type="text" class="form-control">
        </div>
        <div class="form-group text-left">
            <label>{{ __('Description') }}</label>
            <textarea v-model="video.description" class="form-control" rows="3"></textarea>
        </div>
        <div class="form-group text-left">
            <label>{{ __('Tags') }}</label>
            <tag-editor v-model="video.tags" :allowNew="true"/>
        </div>
        <button class="btn btn-primary" :class="{disabled: busy}" @click="updateVideo">
            <span v-if="busy" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ __('Save') }}
        </button>
    </div>
</template>

<script>
    import axios from 'axios'
    import helpers from '../mixins/helpers'

    export default {
        mixins: [helpers],
        props: {
            video: Object
        },

        data () {
            return {
                busy: false,
            }
        },

        methods: {
            async updateVideo () {
                if (this.$parent.isModal) this.$parent.lock();
                this.busy = true;

                const response = await axios.put(`/api/video/${this.video.id}`, this.video);

                this.busy = false;
                if (this.$parent.isModal) {
                    this.$parent.unlock();
                    this.$parent.hide();
                }
            }
        }
    }
</script>