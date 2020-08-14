const fs = require('fs')
const path = require('path')
const glob = require('glob')
const tape = require('tape')
const postcss = require('postcss')
const plugin = require('../index')

glob('tests/fixtures/*.input.css', (_, files) => {
  for (const file of files) {
    const name = path.basename(file).replace(/\.input\.css$/, '')
    const actual = postcss().use(plugin).process(fs.readFileSync(path.resolve(__dirname, '../', file), 'utf-8')).css

    fs.writeFileSync(path.resolve(__dirname, `./fixtures/${name}.compiled.css`), actual)
    
    tape(name, test => {
      const expected = fs.readFileSync(path.resolve(__dirname, `./fixtures/${name}.output.css`), 'utf-8')
      
      test.equal(actual, expected)
      test.end()
    })
  }
})