import axios from 'axios';

const cookieName = 'auth';
const message = 'Session outdated'

export function init(store, router) {
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  axios.interceptors.request.use(
    config => {
      const token = getToken();
      const user = store.state.user

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      } else {
        if (user) {
          store.commit('setLoginMessage', message)
          router.push({name: 'login'});
          store.dispatch('clearUser')
        } else {
          return config
        }
      }
    },
  )
  axios.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if (error.response.status == 401) {
      if (store.state.user) // It's outdated old session if there is already user in store
        store.commit('setLoginMessage', message)

      // Otherwise it's a new session
      router.push({name: 'login'});
      store.dispatch('clearUser')
    }

    return Promise.reject(error);
  })
}

export function setNavGuard(store, router) {
  router.beforeEach((to, from, next) => {
    const token = getToken()
    const user = store.state.user

    if (!token || !user) {
      if (to.meta.public) {
        next()
      } else {
        router.push({ name: 'login' })
      }
    } else if (user && to.path === '/' && store.state.uiState.viewMode !== 'PRO') {
        next({ name: 'bookingList' })
        return
    } else if (to.meta.protected == 'pro' && store.state.uiState.viewMode !== 'PRO') {
      router.push({ name: 'pageNotFound' })
    } else {
      next()
    }
  })

}

export function setToken(token) {
  const date = new Date();
  date.setTime(date.getTime() + (7*24*60*60*1000)); // 7 days
  document.cookie = `${cookieName}=${token}; expires=${date.toUTCString()}; path=/`;
}

export function getToken() {
  let token;
  document.cookie.split(';').map(async cookie => {
    const sp = cookie.split('=');
    if (sp[0].trim() === cookieName)
      token = sp[1];
  });
  return token;
}

export function clearToken() {
  delete axios.defaults.headers.common['Authorization'];
  document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}