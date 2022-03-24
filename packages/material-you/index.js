const plugin = require('tailwindcss/plugin')
const colors = require('./theme')

function mixColors(one, two, opacity) {
    function torgb(hex) {
        const [_, one, two, three, four, five, six] = hex.split('')
        return [`${one}${two}`, `${three}${four}`, `${five}${six}`].map((hex) => parseInt(hex, 16))
    }

    function tohex(rgb) {
        return `#${rgb.map((value) => value.toString(16).split('.')[0].padStart(2, '0')).join('')}`
    }

    one = torgb(one)
    two = torgb(two)
    const both = [
        [one[0], two[0]],
        [one[1], two[1]],
        [one[2], two[2]],
    ]

    return tohex(both.map(([one, two]) => one * (1 - opacity) + two * opacity))
}

function maketints(surface, tint) {
    return [0.05, 0.08, 0.11, 0.12, 0.14].map((opacity) => mixColors(surface, tint, opacity))
}

const colortokens = [
    ...new Set(Object.keys(colors).map((key) => key.replace('-light', '').replace('-dark', ''))),
    'surface-1',
    'surface-2',
    'surface-3',
    'surface-4',
    'surface-5',
]

module.exports.colors = {
    ...colortokens.reduce((colors, token) => ({ ...colors, [token]: `var(--${token})` }), {}),
    ...maketints(colors['surface-light'], colors['primary-light']).reduce(
        (colors, tint, index) => ({ ...colors, [`surface-${index + 1}-light`]: tint }),
        {}
    ),
    ...maketints(colors['surface-dark'], colors['primary-dark']).reduce(
        (colors, tint, index) => ({ ...colors, [`surface-${index + 1}-dark`]: tint }),
        {}
    ),
    ...colors,
}
