<template>
    <input
        type="text"
        :value="_value"
        placeholder="Select a date"
    >
</template>

<script>
import pickadate from 'pickadate'
import helpers from '../../mixins/helpers'

export default {
    mixins: [helpers],
    props: {
        value: {
            type: String,
            default: ''
        },
        format: {
            type: String,
            default: 'MM/DD/YYYY'
        }
    },
    data () {
        return {
            picker: null,
            _value: this.value
        }
    },
    mounted () {
        this.picker = pickadate.create()
        pickadate.render(this.$el, this.picker)
        this.$el.addEventListener('pickadate:change', this.onDateSelected)
    },
    methods: {
        onDateSelected (e) {
            const value = this.picker.getValue(this.format)
            const event = new CustomEvent('pickadate:input-close')
            this._value = value
            this.$emit('update:modelValue', value)
            this.$el.dispatchEvent(event)
            this.$el.blur()
        },
        open() {
            var EVENT_NAME = {
                CHANGE: 'pickadate:change',
                MOUNT: 'pickadate:mount',
                UNMOUNT: 'pickadate:unmount',
                INPUT_ACTIVE: 'pickadate:input-active',
                INPUT_INACTIVE: 'pickadate:input-inactive',
                INPUT_OPEN: 'pickadate:input-open',
                INPUT_CLOSE: 'pickadate:input-close'
            };

            var KEY_CODE = {
                BACKSPACE: 8,
                ENTER: 13,
                SPACE: 32,
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                DOWN: 40
            };

            var ARROW_KEY_CODES = Object.values(KEY_CODE);
            var dispatchEvent = function dispatchEvent(element, eventName) {
                var customEvent = new CustomEvent(eventName);
                element.dispatchEvent(customEvent);
            };

            var createOnKeyDownCalendar = function createOnKeyDownCalendar(picker) {
                return function onKeyDownCalendar(event) {
                if (event.keyCode === KEY_CODE.BACKSPACE) {
                    event.preventDefault();
                    picker.clear();
                } else if (event.keyCode === KEY_CODE.ENTER || event.keyCode === KEY_CODE.SPACE) {
                    event.preventDefault();
                    picker.setSelected({
                    value: picker.store.getState().highlighted
                    });
                } else if (ARROW_KEY_CODES.includes(event.keyCode)) {
                    event.preventDefault();
                    picker.setHighlighted({
                    keyCode: event.keyCode
                    });
                }
                };
            };

            function initializeInput(inputElement, picker) {
                inputElement.readOnly = true;
                inputElement.value = picker.getValue();
                inputElement.addEventListener('focus', function () {
                dispatchEvent(inputElement, EVENT_NAME.INPUT_OPEN);
                dispatchEvent(inputElement, EVENT_NAME.INPUT_ACTIVE);
                });
                inputElement.addEventListener('blur', function () {
                dispatchEvent(inputElement, EVENT_NAME.INPUT_INACTIVE);
                });
                inputElement.addEventListener('keydown', createOnKeyDownCalendar(picker));

                var onDocumentEvent = function onDocumentEvent(event) {
                if (event.target !== inputElement && // $FlowFixMe: In Chrome 62+, password auto-fill simulates focusin
                !event.isSimulated && // In Firefox, a click on an `option` element bubbles up directly
                // to the document.
                event.target !== document && // In Firefox stopPropagation() doesn’t prevent right-click events
                // from bubbling. So make sure the event wasn’t a right-click.
                // $FlowFixMe
                event.which !== 3) {
                    dispatchEvent(inputElement, EVENT_NAME.INPUT_CLOSE);
                }
                };

                document.addEventListener('focusin', onDocumentEvent);
                document.addEventListener('click', onDocumentEvent);
                inputElement.addEventListener(EVENT_NAME.UNMOUNT, function () {
                document.removeEventListener('focusin', onDocumentEvent);
                document.removeEventListener('click', onDocumentEvent);
                });
                // dispatchEvent(inputElement, EVENT_NAME.INPUT_CLOSE);
                picker.subscribeToSelection(function (_ref4) {
                var value = _ref4.value;

                if (value === inputElement.value) {
                    return;
                }

                inputElement.value = value;
                var event = new CustomEvent('change');
                inputElement.dispatchEvent(event);
                });
            };

            dispatchEvent(this.$el, EVENT_NAME.INPUT_OPEN)
            dispatchEvent(this.$el, EVENT_NAME.UNMOUNT)

            setTimeout(() => {
                initializeInput(this.$el, this.picker)
            }, 1000);
        }
    }
}
</script>

<style>

</style>
