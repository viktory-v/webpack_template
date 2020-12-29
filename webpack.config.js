const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const chokidar = require('chokidar')

const devMode = process.argv.includes('development')

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    publicPath: './'
  },

  devServer: {
    before(app, server) {
      chokidar.watch([
        './src/*.html',
        './src/scss/*.scss'
      ]).on('all', function() {
        server.sockWrite(server.sockets, 'content-changed');
      })
    },
    contentBase: path.resolve(__dirname, './dist'),
    open: true,
    compress: true,
    hot: true,
    port: 8080
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false 
            }

          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    'autoprefixer'
                  ]
                ]
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        use: [
          {
              loader: 'file-loader',
              options: {

                outputPath: 'fonts/'
              }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new CleanWebpackPlugin(),
	  new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/images', to: 'images'
        },
        {
          from: 'src/fonts', to: 'fonts'
        }
      ]
    })
  ]
}
