const np = require('number-precision')

module.exports = () => {
  return {
    postcssPlugin: 'postcss-aspect-ratio-polyfill',
    Declaration: {
      'aspect-ratio': (decl, {Rule, Declaration}) => {
        const rule = decl.parent
        const selector = rule.selector
        const beforeRule = new Rule({selector: `${selector}::before`, raws: {after: rule.raws.after, semicolon: rule.raws.semicolon}})
        const afterRule = new Rule({selector: `${selector}::after`, raws: {before: rule.raws.after, after: rule.raws.after, semicolon: rule.raws.semicolon}})
        const ratio = decl.value.replace(/['"]?((?:\d*\.?\d*)?)(?:\s*[\:\|\/]\s*)(\d*\.?\d*)['"]?/g, (match, width, height) => np.times(np.divide(height, width), 100) + '%')

        beforeRule.append([
          new Declaration({prop: 'float', value: 'left', raws: decl.raws}),
          new Declaration({prop: 'padding-top', value: ratio}),
          new Declaration({prop: 'content', value: "''"}),
        ])
        afterRule.append([
          new Declaration({prop: 'display', value: 'block'}),
          new Declaration({prop: 'content', value: "''"}),
          new Declaration({prop: 'clear', value: 'both'}),
        ])
    
        rule.after(afterRule)
        rule.after(beforeRule)
    
        rule.nodes.length === 1 ? rule.remove() : decl.remove()
      },
    },
  }
}

module.exports.postcss = true