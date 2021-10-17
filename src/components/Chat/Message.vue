<template>
    <div class="chat-message"
        :class="{ highlighted: highlightedClass, faded }"
        @mouseover="controlsVisible = true"
        @mouseleave="controlsVisible = false"
    >
        <span class="remove-message"
            v-if="controlsVisible && actions.remove"
            @click="remove"
        >
            <i class="fa fa-times-thin" aria-hidden="true"></i>
        </span>
        <span class="nick" v-text="`${message.user.account.first_name} ${message.user.account.last_name}`"></span><span v-text="message.message"></span>
        <div v-if="message.video" style="position: relative">
            <video-thumb :video="message.video" :show-video-icon="true" style="width: 275px; height: 155px;" />
        </div>
        <img
            v-for="(image, i) in message.images"
            :key="i"
            @click="showImage(image)"
            :src="image.url" style="width: 275px; height: 155px; object-fit: contain; display: block; cursor: pointer"
        />
        <div style="clear:both"></div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import ImageView from '../ImageView.vue';
import helpers from '../../mixins/helpers'

export default {
    mixins: [helpers],
        props: {
        message: Object,
        highlighted: {
            type: Boolean,
            default: false
        },
        actions: {
            type: Object,
            default: () => ({
                remove: false
            })
        }
    },

    data () {
        return {
            controlsVisible: false,
            faded: false,
            highlightedClass: false
        }
    },

    watch: {
        highlighted () {
            this.toggleHighlight();
        }
    },

    mounted () {
        this.toggleHighlight();
    },

    methods: {
        ...mapActions({showModal: 'modals/show'}),

        toggleHighlight () {
            if (this.highlighted) {
                window.scrollTo(0, this.$el.offsetParent.offsetTop + this.$el.offsetTop - 200);
                this.highlightedClass = true;
                setTimeout(() => this.faded = true, 100);
            } else {
                this.highlightedClass = this.faded = false;
            }
        },

        showImage (image) {
            this.showModal({ component: ImageView, props: { href: image.url } });
        },

        remove () {
            this.$emit('remove-message', this.message);
        }
    }
}
</script>

<style scoped>
    .chat-box .chat-message .nick {
        font-weight: bold;
        margin-right: 5px;
    }

    .chat-message {
        padding-top: 4px;
        padding-bottom: 4px;
        font-size: 16px;
        margin-bottom: 6px;
        color: #3e3e3e;
        font-size: 16px;
        line-height: 20px;
        margin-top: 8px;
        letter-spacing: .2px;
        border: #ecf0f2;
        border-style: solid;
        border-width: 1px;
        border-radius: 5px;
        padding: 12px;
        border-bottom-color: #f7f7f7;
        background-color: #f9f9f9;
    }

    .chat-message.highlighted {
        background-color: #c5e0ff;
    }

    .chat-message.chat-message.highlighted.faded {
        background-color: inherit;
        transition: background-color 1s linear;
    }

    .remove-message {
        float: right;
        cursor: pointer;
        opacity: 0.3;
        background-color: #000;
        border-radius: 5px;
        color: #fff;
        padding-left: 5px;
        padding-right: 5px;
    }

    .fa-times-thin:before {
        content: '\00d7';
    }
</style>
