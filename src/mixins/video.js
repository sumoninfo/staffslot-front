export default {
    data () {
        return {
            subscribedToVideoProcessingStatus: false,
            playingVideo: null
        }
    },

    created () {
        this.$store.watch( (state)=> { return this.$store.state.user }, (newValue, oldValue)=>{
            if (!this.subscribedToVideoProcessingStatus && this.$store.state.user) {
                this.Echo.private(`video-processing-status-${this.$store.state.user.user_id}`)
                    .listen('VideoProcessingStatusUpdate', e => this.progressChanged(e));
                this.subscribedToVideoProcessingStatus = true;
            }
        });

        this.emitter.on('play-video', video => {
            this.playingVideo = video;
        });

        this.emitter.on('close-modal', data => {
            if (data.modalId == 'player') {
                this.playingVideo = null;
            }
        });
    },

    methods: {
        progressChanged (e) {
            this.emitter.emit('video-processing-status-change', e.video);
        }
    }
}