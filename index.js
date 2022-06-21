const np = require('number-precision')
np.enableBoundaryChecking(false)

module.exports = () => {
  return {
    postcssPlugin: 'postcss-aspect-ratio-polyfill',
    Declaration: {
      'aspect-ratio': (decl, {Rule, Declaration, AtRule}) => {
        const rule = decl.parent
        const selector = rule.selector
        const supportsRule = new AtRule({name: 'supports', params: 'not (aspect-ratio: 1 / 1)'})
        const beforeRule = new Rule({selector: `${selector}::before`, raws: {semicolon: rule.raws.semicolon}})
        const afterRule = new Rule({selector: `${selector}::after`, raws: {semicolon: rule.raws.semicolon}})
        const ratio = decl.value.replace(/['"]?((?:\d*\.?\d*)?)(?:\s*[\:\|\/]\s*)(\d*\.?\d*)['"]?/g, (match, width, height) => np.times(np.divide(height, width), 100) + '%')

        beforeRule.append([
          new Declaration({prop: 'float', value: 'left'}),
          new Declaration({prop: 'padding-top', value: ratio}),
          new Declaration({prop: 'content', value: "''"}),
        ])
        afterRule.append([
          new Declaration({prop: 'display', value: 'block'}),
          new Declaration({prop: 'content', value: "''"}),
          new Declaration({prop: 'clear', value: 'both'}),
        ])

        supportsRule.append([
          beforeRule,
          afterRule,
        ])

        rule.after(supportsRule)
      },
    },
  }
}

module.exports.postcss = true
