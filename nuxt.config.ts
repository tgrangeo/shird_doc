export default defineNuxtConfig({
    extends: ['docus'],
    app: {
        baseURL: process.env.NUXT_APP_BASE_URL || '/',
        buildAssetsDir: '_nuxt/', 
    },

    nitro: {
        preset: 'static',
        output: {
            publicDir: '.output/public'
        }
    },

    experimental: {
        payloadExtraction: false
    },

    router: {
        options: {
            hashMode: false
        }
    }
})