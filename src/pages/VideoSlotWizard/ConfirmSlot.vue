<template>
    <div class="location-box">
        <table class="table">
            <thead>
                <tr>
                    <th colspan="2" class="confirm-area">
                        <h5 class="confirm-time-text">{{ __('Confirm Video Slot Details') }}</h5>
                    </th>
                </tr>
            </thead>
            <tbody class="wizard-body confirm-body mt-2">
                <tr>
                    <td colspan="2">
                        <div class="text-center mb-2">
                            <div v-for="video in slot.promoVideo" :key="video.id" style="display: inline-table; margin: 1px;">
                                <video-thumb v-if="video" :video="video" style="width: 275px; height: 155px;" />
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="confirm-slot-field"><strong>{{ __('Title') }}</strong></td>
                    <td v-text="slot.title"></td>
                </tr>
                <tr>
                    <td class="confirm-slot-field"><strong>{{ __('Description') }}</strong></td>
                    <td v-text="slot.description"></td>
                </tr>
                <tr>
                    <td class="confirm-slot-field"><strong>{{ __('Notes') }}</strong></td>
                    <td v-text="slot.notes"></td>
                </tr>
                <tr>
                    <td class="confirm-slot-field"><strong>{{ __('Duration') }}</strong></td>
                    <td v-text="slot.duration"></td>
                </tr>
                <tr>
                    <td class="confirm-slot-field"><strong>{{ __('Cost per slot') }}</strong></td>
                    <td><span>{{ formatCurrency(slot.cost) }}</span></td>
                </tr>
                <tr>
                    <td class="confirm-slot-field"><strong>{{ __('Potential earnings') }}</strong></td>
                    <td><span>{{ formatCurrency(slot.slotsCountForSale * slot.cost) }}</span></td>
                </tr>
                <tr>
                    <td class="confirm-slot-field"><strong>{{ __('Video slots available for sale') }}</strong></td>
                    <td v-text="slot.slotsCountForSale"></td>
                </tr>
            </tbody>
        </table>

        <div class="text-right">
            <button type="button" class="btn btn-warning" @click="$router.go(-1)"><i class="fa fa-chevron-left"></i> {{ __('Back') }}</button>
            <button type="submit" class="btn btn-success" @click="goNext"><span>{{ __('Confirm and Add') }} <i class="fa fa-chevron-right"></i></span></button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import filters from '../../mixins/filters'
    import helpers from '../../mixins/helpers'

    export default {
        mixins: [filters,helpers],

        computed: {
            slot () {
                return this.$store.state.wizard.videoSlot;
            }
        },

        methods: {
            async goNext () {
                await axios.put('/api/video/slot', this.slot);
                this.$store.dispatch('wizard/setVideoSlot', null);
                this.$router.push('/video/slots', () => setTimeout(()=> this.emitter.emit('flashMessage', 'Video Slot Successfully Created'), 200));
            }
        }
    }
</script>