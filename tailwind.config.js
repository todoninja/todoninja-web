const { tailwindPlugin: mdTailwindPlugin, colors: mdColors } = require('./packages/material-you')

module.exports = {
    content: ['./index.html', './src/**/*.vue'],
    theme: {
        extend: {
            colors: {
                ...mdColors,
            },
        },
    },
    plugins: [mdTailwindPlugin()],
}
