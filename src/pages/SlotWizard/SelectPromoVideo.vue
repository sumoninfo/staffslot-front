<template>
    <div class="location-box">
        <h5>{{ __('Promo video (optional):') }}</h5>
        <div class="text-right">
            <button type="button" class="btn btn-warning" @click="$router.go(-1)"><i class="fa fa-chevron-left"></i> {{ __('Back') }}</button>
            <button type="submit" class="btn btn-success" @click="goNext"><span>{{ __('Next') }} <i class="fa fa-chevron-right"></i></span></button>
        </div>
        <hr>
        <h6>{{ __('Include a promo video about this slot.') }}</h6>
        <video-list @loaded="loading = false" v-model="promoVideo" :multiple="true" />
        <hr v-if="!loading" >
        <div v-if="!loading" class="text-right">
            <button type="button" class="btn btn-warning" @click="$router.go(-1)"><i class="fa fa-chevron-left"></i> {{ __('Back') }}</button>
            <button type="submit" class="btn btn-success" @click="goNext"><span>{{ __('Next') }}<i class="fa fa-chevron-right"></i></span></button>
        </div>
    </div>
</template>

<script>
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [helpers],
        data () {
            return {
                promoVideo: null,
                loading: true
            }
        },

        mounted () {
            this.promoVideo = this.slot.promoVideo;
        },

        computed: {
            slot () {
                // TODO: redirect to first wizard page if there is no selected event
                if (this.$route.meta.videoSlot) {
                    return this.$store.state.wizard.videoSlot;
                } else if (this.$route.meta.isProduct) {
                    return this.$store.state.wizard.product;
                } else {
                    return this.$store.state.wizard.slot;
                }
            },
        },

        methods: {
            goNext () {
                if (this.$route.meta.videoSlot) {
                    this.$store.dispatch('wizard/setVideoSlot', {...this.slot, promoVideo: this.promoVideo});
                    this.$router.push('/wizard/video/confirm-slot');
                } else if (this.$route.meta.isProduct) {
                    this.$store.dispatch('wizard/setProduct', { ...this.slot, promoVideo: this.promoVideo });
                    this.$router.push('/wizard/product/confirm-product');
                } else {
                    this.$store.dispatch('wizard/setSlot', {...this.slot, promoVideo: this.promoVideo});
                    this.$router.push('/wizard/confirm-slot');
                }
            },
        }
    }
</script>
