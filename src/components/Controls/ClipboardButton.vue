<template>
  <button @click="copy">
    <slot />
  </button>
</template>

<script>
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      clipboardText: {
        type: String
      }
    },
    methods: {
      fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        let success = false
        textArea.value = text;
        textArea.style.position = 'absolute';
        textArea.style.opacity = 0;
        document.body.appendChild(textArea);
        textArea.select();

        try {
          success = document.execCommand('copy')
        } catch (err) {}

        if (success) {
          this.$store.commit('setFlashMessage', 'Successfully copied to clipboard')
        } else {
          this.$store.commit('pushError', 'Unable to copy to clipboard')
        }

        document.body.removeChild(textArea);
      },
      async copyToClipboard(text) {
        if (!navigator.clipboard) {
          this.fallbackCopyTextToClipboard(text);
          return;
        }
        try {
          await navigator.clipboard.writeText(text);
          this.$store.commit('setFlashMessage', 'Successfully copied to clipboard')
        } catch (err) {
          this.$store.commit('pushError', 'Unable to copy to clipboard')
        }
      },
      copy() {
        this.copyToClipboard(this.clipboardText)
      }
    }
  })
</script>
