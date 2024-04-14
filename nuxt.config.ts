// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-mongoose', '@nuxt/image', 'nuxt-font-loader'],
  fontLoader: {
    local: [
      {
        src: '/cs_regular.ttf',
        family: 'Counter-Strike',
        class: 'cs',
      }
    ]
  },
  mongoose: {
    uri: 'mongodb://127.0.0.1:27017/csgoban',
    options: {},
    modelsDir: 'models',
  },
  image: {
    provider: 'ipx',
    dir: 'assets/maps'
  },
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})