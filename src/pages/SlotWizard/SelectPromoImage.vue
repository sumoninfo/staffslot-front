<template>
    <div class="location-box">
        <h5>{{ __('Promo image (optional):') }}</h5>
        <div class="text-right">
            <button type="button" class="btn btn-warning" @click="$router.go(-1)"><i class="fa fa-chevron-left"></i> {{ __('Back') }}</button>
            <button type="submit" class="btn btn-success" @click="goNext"><span>{{ __('Next') }} <i class="fa fa-chevron-right"></i></span></button>
        </div>
        <hr>
        <h6>{{ __('Include a promo image about this') }} {{ entityName }}.</h6>
        <hr v-if="selectedImages.length">
        <h5 v-if="selectedImages.length">{{ __('Choose default image') }}</h5>
        <image-list
            ref="selectedImageList"
            v-model="defaultImage"            :images="selectedImages"
        />
        <hr>
<!--        <image-upload @on-success="onUpload"/>-->
        <image-list
            ref="imageList"
            v-model="selectedImages"
            :multiple="true"
        />
        <hr v-if="!loading" >
        <div v-if="!loading" class="text-right">
            <button type="button" class="btn btn-warning" @click="$router.go(-1)"><i class="fa fa-chevron-left"></i> {{ __('Back') }}</button>
            <button type="submit" class="btn btn-success" @click="goNext"><span>{{ __('Next') }} <i class="fa fa-chevron-right"></i></span></button>
        </div>
    </div>
</template>

<script>
    import helpers from '../../mixins/helpers';
    import { mapActions } from 'vuex';
    import ImageList from '../../components/ImageList.vue';
    import ImageUpload from '../../components/ImageUpload.vue';

    export default {
        mixins: [ helpers ],

        components: {
            ImageUpload,
            ImageList
        },

        data () {
            return {
                entity: {},
                entityName: null,
                selectedImages: [],
                defaultImage: null,
                loading: false
            }
        },

        mounted () {
            if (this.$route.meta.videoSlot) {
                this.entity = this.$store.state.wizard.videoSlot;
                this.entityName = this.__('video');
            } else if (this.$route.meta.isProduct) {
                this.entity = this.$store.state.wizard.product;
                this.entityName = this.__('product');
            } else {
                this.entity = this.$store.state.wizard.slot;
                this.entityName = this.__('slot');
            }

                Array.isArray(this.entity.images) &&
                    this.entity.images.map(image => this.$refs.imageList.select(image));
                this.entity.defaultImage &&
                    this.$refs.selectedImageList.select(this.entity.defaultImage);
        },

        methods: {
            ...mapActions({ pushImage: 'images/push' }),

            onUpload ( { response } ) {
                if (response.success) {
                    this.pushImage(response.image);
                    this.$refs.imageList.select(response.image);
                }
            },

            save () {
                if (this.$route.meta.videoSlot) {
                  this.$store.dispatch('wizard/setVideoSlot', this.entity);
                } else if (this.$route.meta.isProduct) {
                    this.$store.dispatch('wizard/setProduct', this.entity);
                } else {
                    this.$store.dispatch('wizard/setSlot', this.entity);
                }

                this.entity.images = this.selectedImages;
                this.entity.defaultImage = this.defaultImage;
            },

            goNext () {
                const wizardType = this.entityName !== 'slot' ? this.entityName + '/' : '';

                this.save();
                this.$router.push(`/wizard/${wizardType}select-promo-video`);
            }
        }
    }
</script>

<style scoped>
    .card-img-top.processing {
        display: table;
        background-color: #333;
        height: 100%;
    }

    .card-img-top.processing .status {
        display: table-cell;
        vertical-align: middle;
    }

    .card-img-top {
        min-width: 105px;
        border-radius: calc(.25rem - 1px) !important;
    }

    .card-img-top.processing {
        min-height: 200px;
    }
</style>
