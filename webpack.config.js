const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: {
    main: './src/scripts/main.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: './scripts/[name].bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    watchContentBase: true,
    publicPath: '/'
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: './styles/[name].css'
    })
  ],
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        sourceMap: true
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false
          }
        }
      })
    ]
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, './src/scripts')],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  corejs: { version: 3, shippedProposals: true }
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        include: [path.resolve(__dirname, './src/styles')],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              // publicPath: path.resolve(__dirname, 'dist/styles'),
              hmr: process.env.NODE_ENV === 'development'
              // sourceMap: true // no longer worked with minimizers
            }
          },
          {
            loader: 'css-loader',
            options: {
              url: (url, resourcePath) => {
                // resourcePath - path to css file

                // Don't handle these urls
                if (url.includes('../img')) {
                  return false;
                }

                return true;
              }
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  }
};
