import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      lang: s => s.uiState.lang,
      translations: s => s.uiState.translations,
    })
  },
  methods: {
    route: (name, params) => '/not-implemented',
    async setLang(lang) {
      if (lang == 'es') {
        this.$store.commit('uiState/set', { lang })
        await this.fetchTranslations()
      } else {
        this.$store.commit('uiState/set', { lang: null, translations: null })
      }
    },
    async fetchTranslations() {
      this.$store.commit('setLoading', true)
      const response = await this.$store.dispatch('callApi', {
        method: 'get',
        url: `/api/translation/${this.lang}`
      })
      this.$store.commit('setLoading', false)

      if (response.data.success) {
        this.$store.commit('uiState/set', { translations: response.data.translation })
      }
    },
    __(string) {
      if (this.translations) {
        return this.translations[string] || string
      } else {
        return string
      }
    }
  }
}
