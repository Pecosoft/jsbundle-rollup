# Rollup Share

Rollup 分享

> [官方文档-英文][homepage]
> [官方文档-中文][homepage-cn]

## Features

- 使用ES6的模块标准，这意味着你可以直接使用import和export而不需要引入babel
- tree-shaking 将无用代码（即没有使用到的代码）从最终的生成文件中删去

## 为什么需要Rollup？

化繁为简：将复杂软件拆分成多个简单可复用的模块

## JS模块化方案

- [iife](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)
An IIFE (Immediately Invoked Function Expression) is a JavaScript function that runs as soon as it is defined.

``` js
(function (global) {
    global.moduleName = module
})(this);
```

- AMD
```js
define(['jquery'], function ($) {
  function myFunc(){};

  return myFunc;
});
```

- CommonJs
``` js
var $ = require('jquery');
function myFunc(){};

module.exports = myFunc;
```

- UMD

``` js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS之类的
    module.exports = factory(require('jquery'));
  } else {
    // 浏览器全局变量(root 即 window)
    root.returnExports = factory(root.jQuery);
  }
} (this, function ($) {
  function myFunc(){};

  return myFunc;
}));
```

## JQuery
``` js
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
  if ( !noGlobal ) {
    window.jQuery = window.$ = jQuery;
  }

  return jQuery;
} );
```

## VUE

``` js
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vue = factory());
}(this, (function () { 'use strict';
Vue.compile = compileToFunctions;

return Vue;

})));
```

[homepage][https://www.rollupjs.com/guide/en]
[homepage-cn][https://www.rollupjs.com/guide/zh]

## 参考链接
[JS打包工具rollup——完全入门指南](https://segmentfault.com/a/1190000010628352)
[AMD、CMD、UMD 模块的写法](http://web.jobbole.com/82238/)
[js模块化编程之彻底弄懂CommonJS和AMD/CMD](http://www.cnblogs.com/chenguangliang/p/5856701.html)

## 命令行使用Rollup

全局安装rollup
``` sh
npm install rollup --global
# 显示帮助
rollup -h
```

创建项目
``` sh
mkdir -p my-rollup-project/src
cd my-rollup-project
```

``` js
// src/main.js
import foo from './foo.js';
export default function () {
  console.log(foo);
}

// src/foo.js
export default 'hello world!';
```

打包
``` sh
rollup src/main.js -f cjs
```

命令行选项
``` sh
# en
-c, --config                Use this config file (if argument is used but value
                            is unspecified, defaults to rollup.config.js)
-w, --watch                 Watch files in bundle and rebuild on changes
-i, --input                 Input (alternative to <entry file>)
-o, --file <output>         Output (if absent, prints to stdout)
-f, --format [es]           Type of output (amd, cjs, es, iife, umd)
-n, --name                  Name for UMD export
-m, --sourcemap             Generate sourcemap (`-m inline` for inline map)
--environment <values>      Settings passed to config file (see example)

# cn
-c, --config                指定配置文件(如果使用参数，但是没有赋值，默认使用rollup.config.js)
-w, --watch                 监听文件改动，重新打包
-i, --input                 指定入口文件
-o, --file <output>         指定输出文件
-f, --format [es]           输出文件类型(amd, cjs, es, iife, umd)
-n, --name                  UMD 导出对象命名
-m, --sourcemap             生成源码映射文件(`-m inline` 生成内联映射)
--environment <values>      传给配置文件的环境变量(process.env)
```

``` sh
格式(format -f/--output.format)
String 生成包的格式。 下列之一:

amd – 异步模块定义，用于像RequireJS这样的模块加载器
cjs – CommonJS，适用于 Node 和 Browserify/Webpack
es – 将软件包保存为ES模块文件
iife – 一个自动执行的功能，适合作为<script>标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
umd – 通用模块定义，以amd，cjs 和 iife 为一体
```

## 使用配置文件

配置文件是一个ES6模块，它对外暴露一个对象，这个对象包含了一些Rollup需要的一些选项。通常，我们把这个配置文件叫做rollup.config.js，它通常位于项目的根目录

``` js
// rollup.config.js
export default {
  // 核心选项
  input,     // 必须
  // danger zone
  context,

  output: {  // 必须 (如果要输出多个，可以是一个数组)
    // 核心选项
    file,    // 必须
    format,  // 必须
    name,
    globals,

    // 额外选项
    paths,
    banner,
    footer,
    intro,
    outro,
    sourcemap,
    sourcemapFile,

    // 高危选项
    exports,
    amd,
    indent
    strict
  },
};
```

## JavaScript API

Rollup 提供 JavaScript 接口那样可以通过 Node.js 来使用。你可以很少使用，而且很可能使用命令行接口，除非你想扩展 Rollup 本身，或者用于一些难懂的任务，例如用代码把文件束生成出来。

``` js
// The rollup.rollup 函数返回一个 Promise，它解析了一个 bundle 对象，此对象带有不同的属性及方法
const rollup = require('rollup');

// see below for details on the options
const inputOptions = {...};
const outputOptions = {...};

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions);

  console.log(bundle.imports); // an array of external dependencies
  console.log(bundle.exports); // an array of names exported by the entry point
  console.log(bundle.modules); // an array of module objects

  // generate code and a sourcemap
  const { code, map } = await bundle.generate(outputOptions);

  // or write the bundle to disk
  await bundle.write(outputOptions);
}

build();
```

## Babel

使用 Babel 和 Rollup 的最简单方法是使用 [rollup-plugin-babel]（https://github.com/rollup/rollup-plugin-babel）。 安装它：

``` sh
npm i -D rollup-plugin-babel
npm i -D babel-preset-latest babel-plugin-external-helpers
```

``` js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    })
  ]
};
```

src/.babelrc
``` json
{
  "presets": [
    ["latest", {
      "es2015": {
        "modules": false
      }
    }]
  ],
  "plugins": ["external-helpers"]
}
```

## 与Gulp集成

``` js
const gulp = require('gulp');
const rollup = require('rollup');
const rollupTypescript = require('rollup-plugin-typescript');

gulp.task('build', async function () {
  const bundle = await rollup.rollup({
    input: './src/main.ts',
    plugins: [
      rollupTypescript()
    ]
  });

  await bundle.write({
    file: './dist/library.js',
    format: 'umd',
    name: 'library',
    sourcemap: true
  });
});
```

## VUE构建脚本

``` js
// package.json
{
  "name": "vue",
  "version": "2.5.17-beta.0",
  "description": "Reactive, component-oriented view layer for modern web interfaces.",
  "main": "dist/vue.runtime.common.js",
  "scripts": {
    "dev": "rollup -w -c scripts/config.js --environment TARGET:web-full-dev",
    "dev:cjs": "rollup -w -c scripts/config.js --environment TARGET:web-runtime-cjs",
    "dev:esm": "rollup -w -c scripts/config.js --environment TARGET:web-runtime-esm",
    "dev:ssr": "rollup -w -c scripts/config.js --environment TARGET:web-server-renderer",
    "dev:compiler": "rollup -w -c scripts/config.js --environment TARGET:web-compiler ",
    "dev:weex": "rollup -w -c scripts/config.js --environment TARGET:weex-framework",
    "dev:weex:factory": "rollup -w -c scripts/config.js --environment TARGET:weex-factory",
    "dev:weex:compiler": "rollup -w -c scripts/config.js --environment TARGET:weex-compiler ",
    "build": "node scripts/build.js"
  }
}

// scripts/build.js
function buildEntry (config) {
  const output = config.output
  const { file, banner } = output
  const isProd = /min\.js$/.test(file)
  return rollup.rollup(config)
    .then(bundle => bundle.generate(output))
    .then(({ code }) => {
      if (isProd) {
        var minified = (banner ? banner + '\n' : '') + uglify.minify(code, {
          output: {
            ascii_only: true
          },
          compress: {
            pure_funcs: ['makeMap']
          }
        }).code
        return write(file, minified, true)
      } else {
        return write(file, code)
      }
    })
}

// scripts/config.js
const builds = {
  // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
  'web-runtime-cjs': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.common.js'),
    format: 'cjs',
    banner
  },
  ...
}
```

## 注意点
treeshake
是否应用tree-shaking。建议您省略此选项（默认为treeshake：true），除非您发现由tree-shaking算法引起的bug，在这种情况下，请使用“treeshake：false”，一旦您提交了问题！

context
默认情况下，模块的上下文 - 即顶级的this的值为undefined。在极少数情况下，您可能需要将其更改为其他内容，如 'window'。