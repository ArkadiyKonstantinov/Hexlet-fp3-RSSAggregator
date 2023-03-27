// import { fileURLToPath } from 'url';
import { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// import { WebpackPluginServe } from 'webpack-plugin-serve';
import autoprefixer from 'autoprefixer';
import { AddDependencyPlugin } from 'webpack-add-dependency-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const setMode = process.env.NODE_ENV || 'development';

export default {
  mode: setMode,
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: resolve(process.cwd(), 'dist'),
    },
    // watchFiles: [resolve(process.cwd(), 'dist/index.html')],
    watchFiles: ['src/*.js', 'src/*.html'],
    client: {
      progress: true,
    },
    // devMiddleware: {
    //   publicPath: '/dist/',
    //   writeToDisk: true,
    // },
    // open: true,
    hot: true,
    // liveReload: true,
    compress: true,
    historyApiFallback: true,
  },
  // watch: setMode === 'development',
  watchOptions: {
    aggregateTimeout: 300, // Delay the first rebuild (in ms)
    poll: 1000, // Poll using interval (in ms or a boolean)
    ignored: /node_modules/, // Ignore to decrease CPU usage
  },
  entry: ['./src/index.js', './src/init.js', 'webpack-plugin-serve/client'],
  output: {
    clean: true,
    path: resolve(process.cwd(), './dist'),
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'RSS Aggregator',
      filename: 'index.html',
      template: 'src/template.html',
    }),

    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),

    new AddDependencyPlugin({ path: './src/template.html' }),

    // new WebpackPluginServe({
    //   port: 8080,
    //   static: './dist',
    //   liveReload: true,
    //   waitForBuild: true,
    // }),
  ],

  module: {
    rules: [
      {
        mimetype: 'image/svg+xml',
        scheme: 'data',
        type: 'asset/resource',
        generator: {
          filename: 'icons/[hash].svg',
        },
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          // {
          //   loader: 'style-loader',
          // },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => [
                  autoprefixer,
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
};
