export default {
    data () {
        return {
            subscribedToChatMessages: false
        }
    },

    created () {
        this.$store.watch( (state)=> { return this.$store.state.user }, (newValue, oldValue)=>{
            if (!this.subscribedToChatMessages) {
                this.Echo.private(`notification-${this.user.user_id}`)
                    .listen('ChatMessageSent', this.onChatMessage);
                this.subscribedToChatMessages = true;
            }
        });
    },

    methods: {
        onChatMessage (e) {
            this.$store.dispatch('notifications/unshift', e.chatMessage);
        }
    }
}