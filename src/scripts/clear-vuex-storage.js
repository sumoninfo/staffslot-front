// No local storage if in iframe
if (window == window.top) {
    const vuexLocalVersion = 5;
    const clientVuexLocalVersion = localStorage.getItem('vuex_v');

    if (!clientVuexLocalVersion || clientVuexLocalVersion < vuexLocalVersion) {
        localStorage.removeItem('vuex');
        localStorage.setItem('vuex_v', vuexLocalVersion);
    }
}
