const plugin = require('tailwindcss/plugin')

module.exports.tailwindPlugin = () =>
    plugin(function ({ theme, addUtilities }) {
        const tint = (opacity) => `rgba(${theme('colors.surface-tint-color')} / ${opacity})`
        const tintGradient = (opacity) => `linear-gradient(to top, ${tint(opacity)}, ${tint(opacity)})`
        const tintedSurface = (opacity) => `${tintGradient(opacity)} ${theme('colors.surface')}`
        addUtilities(
            [0.05, 0.08, 0.11, 0.12, 0.14].reduce(
                (utilities, opacity, index) => ({
                    ...utilities,
                    [`.bg-surface-${index + 1}`]: { background: tintedSurface(opacity) },
                }),
                {}
            )
        )
    })

const colortokens = [
    'primary',
    'primary-container',
    'secondary',
    'secondary-container',
    'tertiary',
    'tertiary-container',
    'surface',
    'surface-variant',
    'background',
    'error',
    'error-container',
    'on-primary',
    'on-primary-container',
    'on-secondary',
    'on-secondary-container',
    'on-tertiary',
    'on-tertiary-container',
    'on-surface',
    'on-surface-variant',
    'on-error',
    'on-error-container',
    'on-background',
    'outline',
    'shadow',
    'surface-tint-color',
    'inverse-surface',
    'inverse-on-surface',
    'inverse-primary',
]

module.exports.colors = colortokens.reduce((colors, token) => ({ ...colors, [token]: `var(--${token})` }), {})
