<template>
    <modal
        :is-visible="visible"
        @close="close"
    >
        <template v-slot:header>
            {{ __('Choose or upload video') }}
        </template>
        <video-choose-upload v-model="value" :multiple="multiple" />
        <template v-slot:footer>
            <button class="btn btn-primary" @click="close">{{ __('Close') }}</button>
        </template>
    </modal>
</template>

<script>
import helpers from '../../mixins/helpers'

export default {
    mixins: [helpers],
    props: {
        multiple: {
            type: Boolean,
            default: false
        }
    },

    data () {
        return {
            visible: true,
            value: null
        }
    },

    methods: {
        close () {
            this.visible = false;
            this.$emit('input', this.value);
            this.$emit('close');
        }
    }
}
</script>

<style>

</style>