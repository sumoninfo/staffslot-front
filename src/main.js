import axios from 'axios'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Echo from 'laravel-echo'
import io from 'socket.io-client'
import mitt from 'mitt'
import { init, setNavGuard } from './lib/auth'
import { createStore } from './store'
import routes from './routes'
import { register } from './global-components'
import App from './App.vue'
import 'bootstrap'
import { defineBootstrapPlugin } from './scripts/define-jq-plugin'
import './sass/app.scss'
import 'sweetalert2/src/sweetalert2.scss'

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
defineBootstrapPlugin('Modal');

const emitter = mitt()
const store = createStore();
const app = createApp(App)
register(app)

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior () {
    return { x: 0, y: 0 };
  },
  routes: routes(app)
})

init(store, router)

store.dispatch('fetchUser').then(() => {
  const echo = new Echo({
    broadcaster: 'socket.io',
    host: import.meta.env.VITE_ECHO_HOST,
    client: io
  });

  setNavGuard(store, router);
  app.use(router)
  app.use(store)
  app.config.globalProperties.Echo = echo;
  app.config.globalProperties.emitter = emitter;
  app.mount('#app')
})
