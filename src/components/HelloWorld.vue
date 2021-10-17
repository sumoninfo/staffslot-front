<template>
  <h1>{{ msg }}</h1>

  <p>
    {{ __('Recommended IDE setup') }}:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a
      href="https://marketplace.visualstudio.com/items?itemName=octref.vetur"
      target="_blank"
    >
      Vetur
    </a>
    {{ __('or') }}
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    (if using
    <code>&lt;{{ __('script setup') }}&gt;</code>)
  </p>

  <p>{{ __('See') }} <code>README.md</code> {{ __('for more information') }}.</p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Docs
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">{{ __('Vue 3 Docs') }}</a>
  </p>

  <button type="button" @click="count++">{{ __('count is') }}: {{ count }}</button>
  <p>
    {{ __('Edit') }}
    <code>components/HelloWorld.vue</code> {{ __('to test hot module replacement') }}.
  </p>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import helpers from '../mixins/helpers'

export default defineComponent({
  mixins: [helpers],
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  setup: () => {
    const count = ref(0)
    return { count }
  }
})
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
