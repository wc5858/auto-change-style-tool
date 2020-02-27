'use strict';
const path = require('path');
const resolve = (filepath) => path.resolve(__dirname, filepath);
module.exports = {
  devtool: 'eval',
  entry: {
    app: 'app/web/page/app/index.js',
    login: 'app/web/page/login/index.js',
    register: 'app/web/page/register/index.js'
  },
  lib: ['react', 'react-dom'],
  loaders: {
    babel: {
      include: [resolve('app/web'), resolve('node_modules')]
    },
    less: {
      include: [resolve('app/web'), resolve('node_modules')],
      options: {
        javascriptEnabled: true,
        modifyVars: { // AntD Theme Customize
          // 'primary-color': 'red',
          // 'link-color': '#1DA57A',
          // 'border-radius-base': '2px'
        }
      }
    }
  },
  plugins: {},
  done() {
    console.log('---webpack compile finish---');
  }
};
