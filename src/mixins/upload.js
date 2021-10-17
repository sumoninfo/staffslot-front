export default {
    data () {
        return {
            uploadVisible: false
        }
    },

    mounted () {
        this.emitter.on('close-modal', p => { if (p.modalId === 'video-upload') this.hideUpload() });
    },

    methods: {
        hideUpload () {
            this.uploadVisible = false;
        },

        onStartUpload () {
            this.$emit('close-modal', { modalId: 'video-upload' });
        }
    }
}