<template>
    <div class="location-box">
        <event-form :custom=true></event-form>
    </div>
</template>

<script>
import axios from 'axios'
import helpers from '../../mixins/helpers.js'

export default {
    mixins: [helpers],

    data() {
        return {
            is_loading: false,
            errors: [],
            event: {
                title: "",
                description: "",
                notes: "",
                duration: "",
                slots: "",
                cost: "",
                payment_cash: 0,
                payment_credit_card: 0,
            },
        }
    },
    created: function() {
        window.scrollTo(0, 0);
    },
    mounted:function(){
      this.emitter.on("eventSaved", _event => {
        this.event = _event;
        this.onSubmit();
      });
    },
    computed: {
        hasErrors: {
            cache: false,
            get: function () {
                return (this.errors.length > 0);
            }
        }
    },
    methods: {
        back: function(){
            this.$router.go(-1);
        },
        onSubmit: function(){
            this.is_loading = true;
            const data = this.event;
            axios.post('/api/wizard/custom-event', data)
            .then((response) => {
                if(response.data.errors.length > 0){
                    this.is_loading = false;
                    this.errors = response.data.errors;
                } else {
                    this.errors = [];
                    this.$store.dispatch('wizard/setSlot', response.data.slot);
                    this.$router.push('/wizard/select-location');
                }
            })
            .catch((e) => {
              this.errors.push(e)
            });
        }
    }
}
</script>
