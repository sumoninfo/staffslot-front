<template>
    <modal
        :is-visible="visible"
        @close="close"
    >
        <video-upload @on-start-upload="onStartUpload" :visible="visible"></video-upload>

        <template v-slot:footer>
            <button class="btn btn-primary" @click="onClose">{{ __('Close') }}</button>
        </template>
    </modal>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import helpers from '../../mixins/helpers'

export default {
    mixins: [helpers],
    props: {
        index: Number
    },

    computed: {
        ...mapState({ visible (s) { return s.modals[this.index].visible } })
    },

    methods: {
        ...mapActions({ close: 'modals/close', hide: 'modals/hide' }),

        onClose () {
            this.hide({ index: this.index });
        },

        onStartUpload () {
            this.hide({ index: this.index });
        }
    }
}
</script>
