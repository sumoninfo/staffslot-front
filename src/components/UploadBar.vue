<template>
    <div class="upload-bar ps-2 pe-2" v-if="Object.keys(uploads).length">
        <div v-for="(file, key) in uploads" :key="key">
            <div class="row">
                <div class="col-md-3">{{ file.name }}</div>
                <div class="col-md-8 mt-1" style="display: flex;">
                    <div class="progress" style="width: 90%;">
                        <div :class="{
                            'progress-bar': true,
                            'progress-bar-striped': true,
                            'bg-danger': file.error,
                            'bg-success': file.success,
                            'progress-bar-animated': file.active
                        }" role="progressbar" :style="{width: file.progress + '%'}"></div>
                    </div>
                    <i v-if="file.error" class="fa fa-remove ms-2" @click="remove(key)" style="line-height: 0.71; cursor: pointer;"></i>
                </div>
            </div>
            <div class="row" style="margin-top: -10px;" v-if="file.error === 'denied'">
                <div class="col-md-3"></div>
                <div class="col-md-8 mt-1">
                    <span class="error" v-for="(error, key) in file.response.errors" :key="key" v-text="error.join(' ')"></span>
                </div>
            </div>
        </div>
        <modal modalId="monthly-limit-message" verticalCenter>
            <p>{{ __('Maximum video upload limit reached for this month. Please contact <a href=\"mailto:support@timeslot.pro\">support@timeslot.pro<\/a> for more information.') }}</p>
        </modal>
    </div>
</template>

<script>
    import helpers from '../mixins/helpers'
    
    export default {
        mixins: [helpers],
        data () {
            return  {
                uploads: {}
            }
        },

        mounted () {
            this.emitter.on('upload-start', file => {
                this.uploads[file.id] = file;
                this.update();
                this.$forceUpdate();
            });

            this.emitter.on('upload-progress', file => {
                this.uploads[file.id] = file;
                this.$forceUpdate();
            });

            this.emitter.on('upload-success', file => {
                delete this.uploads[file.id];
                this.update();
                this.$forceUpdate();
            });

            this.emitter.on('upload-error', file => {
                const keys = Object.keys(file.response.errors);

                mainloop:
                for (let i = 0; i < keys.length; i++) {
                    const errors = file.response.errors[keys[i]]
                    for (let j = 0; j < errors.length; j++) {
                        if (errors[j].startsWith('Reached limit')) {
                            this.emitter.emit('show-modal', { modalId: 'monthly-limit-message' });
                            break mainloop;
                        }
                    }
                }

                this.update();
                this.$forceUpdate();
            });
        },

        methods: {
            update () {
                const wrapper = document.getElementsByClassName('wrapper')[0];

                if (Object.keys(this.uploads).length) {
                    wrapper.style.marginTop = '100px';
                    window.onbeforeunload = e => {
                        e.preventDefault();
                        e.returnValue = '';
                    };
                } else {
                    wrapper.style.marginTop = '';
                    window.onbeforeunload = null;
                }
            },

            remove(key) {
                delete this.uploads[key];
                this.update();
                this.$forceUpdate();
            }
        }
    }
</script>

<style scoped>
    .upload-bar {
        background-color: #fff;
    }
</style>