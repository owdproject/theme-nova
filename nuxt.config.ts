import pkg from './package.json'
import {createResolver} from "@nuxt/kit";
import Material from '@primeuix/themes/material';

const {resolve} = createResolver(import.meta.url);

export default defineNuxtConfig({
    ssr: false,

    alias: {
        "#": resolve(__dirname, "."),
    },

    primevue: {
        options: {
            theme: {
                preset: Material,
                options: {
                    prefix: 'owd',
                    cssLayer: false
                }
            }
        }
    },

    i18n: {
        langDir: './locales',
        locales: [{ code: 'en', file: 'en.json' }],
    },

    imports: {
        dirs: ['composables', 'consts', 'stores', 'utils', 'stores'],
    },

    runtimeConfig: {
        public: {
            themeVersion: pkg.version,
        }
    },

    future: {
        compatibilityVersion: 4,
    },

    compatibilityDate: '2024-11-28',
});