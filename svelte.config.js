import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/kit/vite'

const dontCheckOrigin = process.env.CSRF_CHECK_ORIGIN === 'false'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter({
            out: 'build',
            precompress: false,
            envPrefix: '',
            polyfill: false
        }),
        csrf: {
            checkOrigin: !dontCheckOrigin
        },
        // alias: {
        //     '@': './src',
        // }
    }
}

export default config
