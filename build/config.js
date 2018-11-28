var pkg = require('../package.json')
var version = pkg.version

var banner =
  '/*!\n' +
  ' * ' + pkg.name + ' v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' ken.li\n' +
  ' * Released under the MIT License.\n' +
  ' */'

export default  {
  input: 'src/main.js',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    banner: banner,
    name: pkg.name,
    sourcemap: true
  }
}
