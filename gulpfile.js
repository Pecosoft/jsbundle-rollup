const gulp = require('gulp');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');

gulp.task('build', async function () {
  const bundle = await rollup.rollup({
    input: './src/main.js',
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**' // 只编译我们的源代码
      })
    ]
  });

  await bundle.write({
    file: './dist/index.js',
    format: 'umd',
    name: 'rollupShare',
    sourcemap: true
  });
});