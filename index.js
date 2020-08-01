const postcss = require('postcss')
const np = require('number-precision')

module.exports = postcss.plugin('postcss-aspect-ratio-polyfill', options => css => {
  css.walkDecls('aspect-ratio', decl => {
    const rule = decl.parent
    const selector = rule.selector
    const beforeRule = postcss.rule({selector: `${selector}::before`})
    const afterRule = postcss.rule({selector: `${selector}::after`})
    const ratio = decl.value.replace(/['"]?((?:\d*\.?\d*)?)(?:\s*[\:\|\/]\s*)(\d*\.?\d*)['"]?/g, (match, width, height) => np.times(np.divide(height, width), 100) + '%')

    beforeRule.append([
      postcss.decl({prop: 'float', value: 'left', raws: decl.raws}),
      postcss.decl({prop: 'padding-top', value: ratio}),
      postcss.decl({prop: 'content', value: "''"}),
    ])
    afterRule.append([
      postcss.decl({prop: 'display', value: 'block'}),
      postcss.decl({prop: 'content', value: "''"}),
      postcss.decl({prop: 'clear', value: 'both'}),
    ])

    rule.after(afterRule)
    rule.after(beforeRule)

    rule.nodes.length === 1 ? rule.remove() : decl.remove()
  })
})