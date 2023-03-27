// import { fileURLToPath } from 'url';
import { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// import { WebpackPluginServe } from 'webpack-plugin-serve';
import autoprefixer from 'autoprefixer';
import { AddDependencyPlugin } from 'webpack-add-dependency-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  entry: ['./src', 'webpack-plugin-serve/client'],
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
