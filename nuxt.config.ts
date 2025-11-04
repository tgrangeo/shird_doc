export default defineNuxtConfig({
    extends: ['docus'],
    app: {
        baseURL: process.env.NUXT_APP_BASE_URL || '/',
        buildAssetsDir: '_nuxt/',
        head: {
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
            ]
        }
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