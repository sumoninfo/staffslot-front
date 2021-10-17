<template>
<div>
    <div class="card-box">
        <div class="col-md-12 search-blocks">
            <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                        <label>{{ __('Type') }}:</label>
                        <multiselect
                            v-model="filters.events"
                            :options="events"
                            :multiple="true"
                            placeholder="Choose an Event..."
                            track-by="title"
                            :custom-label="x => x.title"
                        />
                  </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label>{{ __('Set Date Range') }}:</label>
                        <div class="row">
                            <div class="col-6">
                                <date-picker
                                    class="form-control"
                                    placeholder="Select from date"
                                    v-model="filters.dateFrom"
                                />
                            </div>
                            <div class="col-6">
                                <date-picker
                                    class="form-control"
                                    placeholder="Select to date"
                                    v-model="filters.dateTo"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-4">
        <div class="text-center">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        </div>
        <div v-for="product in products" :key="product.type + product.id" class="list-collapsable event-list-section">
            <div class="row">
                <div class="col-md-8">
                    <p class="col-collapsable event-title item-title-sm">
                        <strong v-if="product.type === 'slot'">{{ __('Event') }}:</strong>
                        <strong v-if="product.type === 'package'">{{ __('Package') }}:</strong>
                        <strong v-if="product.type === 'video_slot'">{{ __('Video Slot') }}:</strong>
                        <strong v-if="product.type === 'video_subscription'">{{ __('Video Subscription') }}:</strong>
                        <a :href="product.url" target="_blank">
                            {{ product.title }}
                        </a>
                    </p>
                    <p class="col-collapsable event-location-name item-title-sm"><strong>{{ product.location_place }}</strong></p>
                    <p class="col-collapsable event-minutes item-title-sm" style="width: 100%;"> {{ product.description }}</p>
                    <p v-if="product.type === 'slot'" class="col-collapsable event-minutes item-title-sm"><strong>{{ __('when') }}:</strong> {{ product.event_day }}<br> {{ product.start_time }} - {{ product.end_time }}</p>
                    <p class="col-collapsable event-cost item-title-sm"><strong>{{ __('Cost') }}:</strong> ${{ product.type == 'slot' ? product.cost / 100 : product.cost }}</p>
                </div>
                <div class="col-md-4">
                    <div class="row row-three-buttons">
                        <div class="btn-navigation button-nav">
                            <a class="btn btn-success slot-button" :href="product.url" target="_blank">
                                {{ __('Select slot') }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center" id="bottom">
            <span v-if="loadingMore" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import helpers from '../mixins/helpers';

export default {
    mixins: [helpers],

    data () {
        return {
            products: [],
            events: [],
            filters: {
                dateFrom: null,
                dateTo: null,
                events: null
            },
            loading: true,
            loadingMore: false,
            offset: 0
        }
    },

    async mounted () {
        this.initBottomObserver();
        await this.fetchProducts();
        this.loading = false;
    },

    watch: {
        filters: {
            deep: true,
            async handler () {
                this.loading = true;
                this.products = [];
                this.offset = 0;
                await this.fetchProducts();
                this.loading = false;
            }
        }
    },

    methods: {
        buildParams () {
            let params = {};
            const selectedEvents = this.filters.events;
            const queryEvents = Object.keys(this.$route.query);
            const selectedTypes = selectedEvents &&
                [ ...new Set(selectedEvents.map(x => x.type)) ];

            if(selectedTypes) {
                selectedTypes.map(x =>
                    params[x + 's'] = selectedEvents.filter(y =>
                        y.type === x).map(x => x.id));
            } else {
                queryEvents && queryEvents.map(x => {
                    params[x] = this.$route.query[x];
                });
            }

            params.offset = this.offset;

            if (this.filters.dateFrom || this.filters.dateTo) {
                params.date_from = this.filters.dateFrom;
                params.date_to = this.filters.dateTo;
            }

            return params;
        },

        async fetchProducts () {
            const response = await axios.get(`/api/${this.$route.params.publicId}/all-products`, { params: this.buildParams() });

            if (response.data.success) {
                this.offset += response.data.products.length;
                if (response.data.events && !this.filters.events) this.events = response.data.events;

                this.products = this.products.concat(response.data.products.map(product => {
                    switch (product.type) {
                        case 'slot':
                            product.url = `/booking/confirm-slot/${product.id}`
                            break;

                        case 'package':
                            product.url = `/package/view/${product.id}`
                            break;

                        case 'video_slot':
                            product.url = `/video/confirm-slot/${product.id}`
                            break;

                        case 'video_subscription':
                            product.url = `/video/subscriptions/${product.id}`
                            break;

                        default:
                            break;
                    }

                    return product;
                }));
            }
        },

        async initBottomObserver () {
            const observer = new IntersectionObserver(async (entries) => {
                if (!this.loading && !this.loadingMore && entries[0].intersectionRatio === 1) {
                    this.loadingMore = true;
                    await this.fetchProducts();
                    this.loadingMore = false;
                }
            }).observe(document.getElementById('bottom'));
        }
    }
}
</script>

<style>

</style>
