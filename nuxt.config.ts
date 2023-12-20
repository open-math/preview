import { isDevelopment } from "std-env";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: false },
    app: {
        baseURL: '/preview/',
    },
    modules: [
        '@nuxtjs/tailwindcss',
    ],
    css: ['~/assets/style/global.scss'],
    ignore: [
        !isDevelopment ? "public/test/**/*" : '',
    ],
    vite: {
        server: {
            fs: {
                allow: ['../..']
            }
        }
    },
    runtimeConfig: {
        public: {
            isDev: isDevelopment
        }
    }
})
