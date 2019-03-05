var path = require('path')
var webpack = require('webpack')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var vuxLoader = require('vux-loader')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

var webpackConfig = {
  // entry: {
  //   app: './src/main.js',
  //   'babel-polyfill': 'babel-polyfill'
  // },
  entry: utils.entries(),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'root': resolve('./'),
      '@': resolve('src'),
      'config': resolve('config'),
      'src': resolve('src'),
      'components': resolve('src/components'),
      'js': resolve('src/js'),
      'css': resolve('src/css'),
      'images': resolve('src/images'),
      'services': resolve('src/services'),
      'filter': resolve('src/filter'),
      'multipage': resolve('src/multipage'),
      'pageName': resolve('src/multipage/zzzPageTemplate'),
      'page1': resolve('src/multipage/page1'),
      'page2': resolve('src/multipage/page2'),
    }
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        include: [
          /src/, //表示在src目录下的css需要编译
          '/node_modules/element-ui/lib/' //增加此项
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'axios': 'axios',
  },
}

module.exports = vuxLoader.merge(webpackConfig, {
  plugins: ['vux-ui']
})
