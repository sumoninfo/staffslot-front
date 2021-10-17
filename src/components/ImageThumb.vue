<template>
    <div>
        <img
            :key="image.id"
            @click="showImage(image)"
            :src="src"
            :style="{ cursor: 'pointer', width, height, 'object-fit': objectFit }"
        />
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import ImageView from './ImageView.vue';
    import helpers from '../mixins/helpers'

    export default {
        mixins: [helpers],
        props: {
            image: Object,
            width: {
                type: String,
                default: '275px'
            },
            height: {
                type: String,
                default: '155px'
            },
            objectFit: {
                type: String,
                default: 'contain'
            }
        },

        computed: {
            src () {
                return this.image.preview || this.image.url || this.image.blob;
            }
        },

        methods: {
            ...mapActions({ showModal: 'modals/show' }),

            showImage (image) {
                this.showModal({ component: ImageView, props: { href: image.blob } });
            }
        }
    }
</script>

<style>

</style>
