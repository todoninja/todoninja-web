/** @type {import("snowpack").SnowpackUserConfig } */
export default {
    mount: {
        public: '/',
        src: '/dist',
    },
    plugins: [
        ['@snowpack/plugin-vue', { compilerOptions: { isCustomElement: (tag) => tag.startsWith('lit-') } }],
        '@snowpack/plugin-postcss',
    ],
    routes: [
        /* Enable an SPA Fallback in development: */
        // {"match": "routes", "src": ".*", "dest": "/index.html"},
    ],
    optimize: {
        /* Example: Bundle your final build: */
        // "bundle": true,
    },
    packageOptions: {
        /* ... */
    },
    devOptions: {
        open: 'none',
        tailwindConfig: './tailwind.config.js',
    },
    buildOptions: {
        /* ... */
    },
}
