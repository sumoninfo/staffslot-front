import _ from 'lodash'

export default {
    props: {
        visible: {
            type: Boolean,
            default: true
        }
    },

    methods: {
        initDropArea () {
            _.each(document.getElementsByClassName('drop-active'), x => x.remove());
            const dropArea = document.createElement("div");
            const dropAreaText = document.createElement("h3");
            dropAreaText.innerText = 'Drop file to upload';
            dropArea.appendChild(dropAreaText);
            dropArea.id = 'drop-area';
            dropArea.classList.add('drop-active');
            dropArea.classList.add('d-none');
            document.getElementsByTagName('body')[0].appendChild(dropArea);

            this.$watch(() => {
                return this.$refs.upload.dropActive
            }, (val) => {
                if (!this.visible) return;
                if (!val) dropArea.classList.add('d-none');
                else dropArea.classList.remove('d-none');

                this.$emit('on-drop', val);
            });
        }
    }
}
